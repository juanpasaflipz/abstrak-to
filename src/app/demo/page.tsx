'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectCard } from '@/components/ConnectCard';
import { SessionBadge } from '@/components/SessionBadge';
import { TxButton } from '@/components/TxButton';
import { CONTRACT_INFO, getContractAddress, type ContractName } from '@/lib/contracts';

export default function DemoPage() {
  const { address, isConnected } = useAccount();
  const [selectedContract, setSelectedContract] = useState<ContractName>('Counter');

  const contracts: ContractName[] = ['Counter', 'DemoToken', 'DemoNFT'];

  const getExplorerUrl = (contractName: ContractName) => {
    try {
      const address = getContractAddress(contractName);
      return `https://sepolia.basescan.org/address/${address}`;
    } catch {
      return '#';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Account Abstraction Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience gasless transactions with ERC-4337 smart accounts. 
            Connect your wallet, create a session, and interact with contracts without paying gas fees.
          </p>
        </div>

        {/* Main Demo Area */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Account Setup */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1️⃣ Connect Wallet
                </h2>
                <ConnectCard />
              </div>

              {isConnected && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    2️⃣ Session Status
                  </h2>
                  <SessionBadge />
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>What are session keys?</strong><br />
                      Session keys enable one-click transactions without signing each one individually. 
                      They're temporary, secure, and have spending limits.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column - Contract Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                3️⃣ Choose Contract
              </h2>
              
              <div className="space-y-4">
                {contracts.map((contractName) => {
                  const info = CONTRACT_INFO[contractName];
                  const isSelected = selectedContract === contractName;
                  
                  return (
                    <div
                      key={contractName}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContract(contractName)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {info.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {info.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {info.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-4">
                          {isSelected && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <a
                          href={getExplorerUrl(contractName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {info.explorerName} →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                4️⃣ Execute Gasless Transaction
              </h2>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👆</div>
                  <p className="text-gray-500">
                    Connect your wallet to start testing gasless transactions
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Action Buttons based on selected contract */}
                  {selectedContract === 'Counter' && (
                    <TxButton
                      action="incrementCounter"
                      label="Increment Counter"
                      className="w-full"
                    />
                  )}
                  
                  {selectedContract === 'DemoToken' && (
                    <TxButton
                      action="mintTokens"
                      label="Mint 100 DEMO Tokens"
                      className="w-full"
                    />
                  )}
                  
                  {selectedContract === 'DemoNFT' && (
                    <TxButton
                      action="mintNFT"
                      label="Mint Demo NFT"
                      className="w-full"
                    />
                  )}

                  {/* Info Box */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      ✨ What happens when you click?
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Your smart account executes the transaction</li>
                      <li>• Gas fees are sponsored (free for you!)</li>
                      <li>• No wallet popup required with session keys</li>
                      <li>• Transaction appears on Base Sepolia</li>
                    </ul>
                  </div>

                  {/* Additional Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Try All Actions
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <TxButton
                        action="incrementCounter"
                        label="Counter +1"
                        className="w-full"
                      />
                      <TxButton
                        action="mintTokens"
                        label="Mint Tokens"
                        className="w-full"
                      />
                      <TxButton
                        action="mintNFT"
                        label="Mint NFT"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🔍 How It Works
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                This demo showcases ERC-4337 Account Abstraction with three different providers: 
                Safe{`{Core}`}, Alchemy, and Biconomy. All transactions are gasless and executed 
                through your smart contract wallet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Accounts
                </h3>
                <p className="text-gray-600 text-sm">
                  Contract wallets with advanced features like gasless transactions, 
                  session keys, and programmable logic.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⛽</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Gas Sponsorship
                </h3>
                <p className="text-gray-600 text-sm">
                  Paymasters cover gas costs, enabling free transactions for users 
                  while maintaining security and decentralization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔑</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Session Keys
                </h3>
                <p className="text-gray-600 text-sm">
                  Temporary signing keys with limited permissions enable 
                  one-click experiences without compromising security.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Built with Next.js, wagmi, viem, and ERC-4337 Account Abstraction on Base Sepolia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}