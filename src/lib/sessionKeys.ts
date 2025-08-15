import { ethers } from 'ethers';
import { getSafeAccount } from './aa/safe';
import { getAlchemyAccount } from './aa/alchemy';
import { getBiconomyAccount } from './aa/biconomy';

export interface SessionKey {
  privateKey: string;
  publicKey: string;
  address: string;
  expiration: number;
  spendingLimit: string;
  allowedContracts: string[];
  allowedMethods: string[];
  dailySpent: string;
  lastReset: number;
}

export interface SessionPolicy {
  maxValue: string;
  expiration: number;
  allowedContracts: string[];
  allowedMethods: string[];
  dailyCap: string;
}

const SESSION_STORAGE_KEY = 'abstrak_session_keys';
const DAILY_RESET_HOUR = 0; // Reset at midnight UTC

export async function createSessionKey(userAddress: string): Promise<string> {
  try {
    // Check if user already has an active session
    const existingSession = getActiveSession(userAddress);
    if (existingSession) {
      return existingSession.privateKey;
    }
    
    // Generate new session key
    const wallet = ethers.Wallet.createRandom();
    const sessionKey: SessionKey = {
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      address: wallet.address,
      expiration: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
      spendingLimit: '0.01', // 0.01 ETH
      allowedContracts: getDefaultAllowedContracts(),
      allowedMethods: getDefaultAllowedMethods(),
      dailySpent: '0',
      lastReset: getLastDailyReset(),
    };
    
    // Store session key (in production, encrypt this)
    storeSessionKey(userAddress, sessionKey);
    
    // Create session on the AA provider
    await createProviderSession(userAddress, sessionKey);
    
    return sessionKey.privateKey;
  } catch (error) {
    console.error('Failed to create session key:', error);
    throw new Error('Session key creation failed');
  }
}

export function getActiveSession(userAddress: string): SessionKey | null {
  try {
    const sessions = getStoredSessions();
    const userSession = sessions[userAddress];
    
    if (!userSession) return null;
    
    // Check if session is expired
    if (userSession.expiration < Math.floor(Date.now() / 1000)) {
      removeSessionKey(userAddress);
      return null;
    }
    
    // Check if daily reset is needed
    if (shouldResetDailySpent(userSession.lastReset)) {
      userSession.dailySpent = '0';
      userSession.lastReset = Math.floor(Date.now() / 1000);
      storeSessionKey(userAddress, userSession);
    }
    
    return userSession;
  } catch (error) {
    console.error('Failed to get active session:', error);
    return null;
  }
}

export function revokeSession(userAddress: string): boolean {
  try {
    removeSessionKey(userAddress);
    return true;
  } catch (error) {
    console.error('Failed to revoke session:', error);
    return false;
  }
}

export function validateSessionTransaction(
  sessionKey: SessionKey,
  targetContract: string,
  method: string,
  value: string
): { valid: boolean; reason?: string } {
  // Check expiration
  if (sessionKey.expiration < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: 'Session expired' };
  }
  
  // Check contract allowance
  if (!sessionKey.allowedContracts.includes(targetContract.toLowerCase())) {
    return { valid: false, reason: 'Contract not allowed' };
  }
  
  // Check method allowance
  if (!sessionKey.allowedMethods.includes(method.toLowerCase())) {
    return { valid: false, reason: 'Method not allowed' };
  }
  
      // Check spending limit
    const currentDailySpent = ethers.getBigInt(sessionKey.dailySpent);
    const transactionValue = ethers.getBigInt(value);
    const dailyCap = ethers.parseEther(sessionKey.spendingLimit);
    
    if (currentDailySpent + transactionValue > dailyCap) {
      return { valid: false, reason: 'Daily spending limit exceeded' };
    }
  
  return { valid: true };
}

export function updateSessionSpending(
  userAddress: string,
  amount: string
): boolean {
  try {
    const session = getActiveSession(userAddress);
    if (!session) return false;
    
    const currentSpent = ethers.getBigInt(session.dailySpent);
    const newAmount = ethers.getBigInt(amount);
    session.dailySpent = (currentSpent + newAmount).toString();
    
    storeSessionKey(userAddress, session);
    return true;
  } catch (error) {
    console.error('Failed to update session spending:', error);
    return false;
  }
}

// Private helper functions
async function createProviderSession(userAddress: string, sessionKey: SessionKey): Promise<boolean> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  
  try {
    switch (aaProvider) {
      case 'safe':
        return await createSafeSession(userAddress, sessionKey);
      case 'alchemy':
        return await createAlchemySession(userAddress, sessionKey);
      case 'biconomy':
        return await createBiconomySession(userAddress, sessionKey);
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }
  } catch (error) {
    console.error('Failed to create provider session:', error);
    return false;
  }
}

async function createSafeSession(userAddress: string, sessionKey: SessionKey): Promise<boolean> {
  const { createSafeSession } = await import('./aa/safe');
  const smartAccount = await getSafeAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  return createSafeSession(
    smartAccount.address,
    sessionKey.privateKey,
    sessionKey.spendingLimit,
    sessionKey.expiration
  );
}

async function createAlchemySession(userAddress: string, sessionKey: SessionKey): Promise<boolean> {
  const { createAlchemySession } = await import('./aa/alchemy');
  const smartAccount = await getAlchemyAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  return createAlchemySession(
    smartAccount.address,
    sessionKey.privateKey,
    sessionKey.spendingLimit,
    sessionKey.expiration
  );
}

async function createBiconomySession(userAddress: string, sessionKey: SessionKey): Promise<boolean> {
  const { createBiconomySession } = await import('./aa/biconomy');
  const smartAccount = await getBiconomyAccount({
    ownerAddress: userAddress,
    chainId: 84532,
  });
  
  return createBiconomySession(
    smartAccount.address,
    sessionKey.privateKey,
    sessionKey.spendingLimit,
    sessionKey.expiration
  );
}

function getDefaultAllowedContracts(): string[] {
  // Demo contract addresses on Base Sepolia
  return [
    '0x1234567890123456789012345678901234567890', // Mock NFT contract
    '0x0987654321098765432109876543210987654321', // Mock counter contract
  ].map(addr => addr.toLowerCase());
}

function getDefaultAllowedMethods(): string[] {
  return [
    '0x40c10f19', // mint()
    '0xd09de08a', // increment()
  ].map(method => method.toLowerCase());
}

function getLastDailyReset(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), DAILY_RESET_HOUR, 0, 0, 0);
  return Math.floor(today.getTime() / 1000);
}

function shouldResetDailySpent(lastReset: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const lastResetDate = new Date(lastReset * 1000);
  const nowDate = new Date(now * 1000);
  
  return lastResetDate.getDate() !== nowDate.getDate() ||
         lastResetDate.getMonth() !== nowDate.getMonth() ||
         lastResetDate.getFullYear() !== nowDate.getFullYear();
}

function storeSessionKey(userAddress: string, sessionKey: SessionKey): void {
  try {
    const sessions = getStoredSessions();
    sessions[userAddress] = sessionKey;
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to store session key:', error);
  }
}

function getStoredSessions(): Record<string, SessionKey> {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to get stored sessions:', error);
    return {};
  }
}

function removeSessionKey(userAddress: string): void {
  try {
    const sessions = getStoredSessions();
    delete sessions[userAddress];
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to remove session key:', error);
  }
}
