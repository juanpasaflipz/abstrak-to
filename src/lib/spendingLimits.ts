import { ethers } from 'ethers';
import { getSafeAccount } from './aa/safe';
import { getAlchemyAccount } from './aa/alchemy';
import { getBiconomyAccount } from './aa/biconomy';

export interface SpendingPolicy {
  dailyCap: string;
  maxTransactionValue: string;
  allowedTokens: string[];
  allowedContracts: string[];
  cooldownPeriod: number; // seconds
}

export interface SpendingLimit {
  currentDailySpent: string;
  dailyCap: string;
  lastTransaction: number;
  cooldownEnd: number;
}

export async function attachSpendingLimit(
  userAddress: string,
  policy: SpendingPolicy
): Promise<boolean> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  
  try {
    switch (aaProvider) {
      case 'safe':
        return await attachSafeSpendingLimit(userAddress, policy);
      case 'alchemy':
        return await attachAlchemySpendingLimit(userAddress, policy);
      case 'biconomy':
        return await attachBiconomySpendingLimit(userAddress, policy);
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }
  } catch (error) {
    console.error('Failed to attach spending limit:', error);
    return false;
  }
}

export async function checkSpendingLimit(
  userAddress: string,
  amount: string,
  targetContract?: string
): Promise<{ allowed: boolean; reason?: string; remaining?: string }> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  
  try {
    switch (aaProvider) {
      case 'safe':
        return await checkSafeSpendingLimit(userAddress, amount, targetContract);
      case 'alchemy':
        return await checkAlchemySpendingLimit(userAddress, amount, targetContract);
      case 'biconomy':
        return await checkBiconomySpendingLimit(userAddress, amount, targetContract);
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }
  } catch (error) {
    console.error('Failed to check spending limit:', error);
    return { allowed: false, reason: 'Failed to check spending limit' };
  }
}

export async function updateSpendingUsage(
  userAddress: string,
  amount: string
): Promise<boolean> {
  const aaProvider = process.env.AA_PROVIDER || 'safe';
  
  try {
    switch (aaProvider) {
      case 'safe':
        return await updateSafeSpendingUsage(userAddress, amount);
      case 'alchemy':
        return await updateAlchemySpendingUsage(userAddress, amount);
      case 'biconomy':
        return await updateBiconomySpendingUsage(userAddress, amount);
      default:
        throw new Error(`Unsupported AA provider: ${aaProvider}`);
    }
  } catch (error) {
    console.error('Failed to update spending usage:', error);
    return false;
  }
}

// Safe{Core} Spending Limit Module
async function attachSafeSpendingLimit(
  userAddress: string,
  policy: SpendingPolicy
): Promise<boolean> {
  try {
    const smartAccount = await getSafeAccount({
      ownerAddress: userAddress,
      chainId: 84532,
    });
    
    // In production, this would:
    // 1. Enable the Spending Limit module on the Safe
    // 2. Configure the daily cap and allowed tokens
    // 3. Set up the cooldown period
    
    console.log(`Attaching Safe spending limit for ${smartAccount.address}`);
    console.log(`Daily cap: ${policy.dailyCap} ETH`);
    console.log(`Max transaction: ${policy.maxTransactionValue} ETH`);
    
    // Simulate successful attachment
    return true;
  } catch (error) {
    console.error('Failed to attach Safe spending limit:', error);
    return false;
  }
}

async function checkSafeSpendingLimit(
  userAddress: string,
  amount: string,
  targetContract?: string
): Promise<{ allowed: boolean; reason?: string; remaining?: string }> {
  try {
    // In production, this would query the Safe's Spending Limit module
    // For demo purposes, we'll simulate the check
    
    const dailyCap = ethers.parseEther('0.01'); // 0.01 ETH daily cap
    const currentSpent = ethers.parseEther('0.005'); // Simulate current usage
    const transactionAmount = ethers.parseEther(amount);
    
    if (currentSpent + transactionAmount > dailyCap) {
      const remaining = dailyCap - currentSpent;
      return {
        allowed: false,
        reason: 'Daily spending limit exceeded',
        remaining: ethers.formatEther(remaining),
      };
    }
    
    return {
      allowed: true,
      remaining: ethers.formatEther(dailyCap - (currentSpent + transactionAmount)),
    };
  } catch (error) {
    console.error('Failed to check Safe spending limit:', error);
    return { allowed: false, reason: 'Failed to check spending limit' };
  }
}

async function updateSafeSpendingUsage(
  userAddress: string,
  amount: string
): Promise<boolean> {
  try {
    // In production, this would update the Safe's Spending Limit module
    console.log(`Updated Safe spending usage: ${amount} ETH`);
    return true;
  } catch (error) {
    console.error('Failed to update Safe spending usage:', error);
    return false;
  }
}

// Alchemy AA Spending Limits
async function attachAlchemySpendingLimit(
  userAddress: string,
  policy: SpendingPolicy
): Promise<boolean> {
  try {
    const smartAccount = await getAlchemyAccount({
      ownerAddress: userAddress,
      chainId: 84532,
    });
    
    // In production, this would:
    // 1. Configure the Gas Manager with spending policies
    // 2. Set up daily caps and transaction limits
    
    console.log(`Attaching Alchemy spending limit for ${smartAccount.address}`);
    console.log(`Daily cap: ${policy.dailyCap} ETH`);
    
    return true;
  } catch (error) {
    console.error('Failed to attach Alchemy spending limit:', error);
    return false;
  }
}

async function checkAlchemySpendingLimit(
  userAddress: string,
  amount: string,
  targetContract?: string
): Promise<{ allowed: boolean; reason?: string; remaining?: string }> {
  try {
    // Simulate Alchemy Gas Manager policy check
    const dailyCap = ethers.parseEther('0.01');
    const currentSpent = ethers.parseEther('0.003');
    const transactionAmount = ethers.parseEther(amount);
    
    if (currentSpent + transactionAmount > dailyCap) {
      const remaining = dailyCap - currentSpent;
      return {
        allowed: false,
        reason: 'Daily gas sponsorship limit exceeded',
        remaining: ethers.formatEther(remaining),
      };
    }
    
    return {
      allowed: true,
      remaining: ethers.formatEther(dailyCap - (currentSpent + transactionAmount)),
    };
  } catch (error) {
    console.error('Failed to check Alchemy spending limit:', error);
    return { allowed: false, reason: 'Failed to check spending limit' };
  }
}

async function updateAlchemySpendingUsage(
  userAddress: string,
  amount: string
): Promise<boolean> {
  try {
    console.log(`Updated Alchemy spending usage: ${amount} ETH`);
    return true;
  } catch (error) {
    console.error('Failed to update Alchemy spending usage:', error);
    return false;
  }
}

// Biconomy Spending Limits
async function attachBiconomySpendingLimit(
  userAddress: string,
  policy: SpendingPolicy
): Promise<boolean> {
  try {
    const smartAccount = await getBiconomyAccount({
      ownerAddress: userAddress,
      chainId: 84532,
    });
    
    // In production, this would:
    // 1. Configure the Paymaster with spending policies
    // 2. Set up daily caps and transaction limits
    
    console.log(`Attaching Biconomy spending limit for ${smartAccount.address}`);
    console.log(`Daily cap: ${policy.dailyCap} ETH`);
    
    return true;
  } catch (error) {
    console.error('Failed to attach Biconomy spending limit:', error);
    return false;
  }
}

async function checkBiconomySpendingLimit(
  userAddress: string,
  amount: string,
  targetContract?: string
): Promise<{ allowed: boolean; reason?: string; remaining?: string }> {
  try {
    // Simulate Biconomy Paymaster policy check
    const dailyCap = ethers.parseEther('0.01');
    const currentSpent = ethers.parseEther('0.007');
    const transactionAmount = ethers.parseEther(amount);
    
    if (currentSpent + transactionAmount > dailyCap) {
      const remaining = dailyCap - currentSpent;
      return {
        allowed: false,
        reason: 'Daily paymaster limit exceeded',
        remaining: ethers.formatEther(remaining),
      };
    }
    
    return {
      allowed: true,
      remaining: ethers.formatEther(dailyCap - (currentSpent + transactionAmount)),
    };
  } catch (error) {
    console.error('Failed to check Biconomy spending limit:', error);
    return { allowed: false, reason: 'Failed to check spending limit' };
  }
}

async function updateBiconomySpendingUsage(
  userAddress: string,
  amount: string
): Promise<boolean> {
  try {
    console.log(`Updated Biconomy spending usage: ${amount} ETH`);
    return true;
  } catch (error) {
    console.error('Failed to update Biconomy spending usage:', error);
    return false;
  }
}

// Default spending policy
export function getDefaultSpendingPolicy(): SpendingPolicy {
  return {
    dailyCap: '0.01', // 0.01 ETH
    maxTransactionValue: '0.005', // 0.005 ETH per transaction
    allowedTokens: ['0x0000000000000000000000000000000000000000'], // ETH only
    allowedContracts: [
      '0x1234567890123456789012345678901234567890', // Mock NFT contract
      '0x0987654321098765432109876543210987654321', // Mock counter contract
    ],
    cooldownPeriod: 60, // 1 minute between transactions
  };
}
