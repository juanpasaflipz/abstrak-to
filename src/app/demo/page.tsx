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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience gasless transactions with smart accounts. No seed phrases, no gas fees.
          </p>
        </div>

        {/* Connection Section */}
        {!isConnected ? (
          <div className="max-w-md mx-auto">
            <ConnectCard />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Session Badge */}
            <div className="max-w-2xl mx-auto">
              <SessionBadge />
            </div>

            {/* Contract Selection */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Select Contract</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {contracts.map((contract) => (
                    <button
                      key={contract}
                      onClick={() => setSelectedContract(contract)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedContract === contract
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium">{contract}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {CONTRACT_INFO[contract]?.description || 'Demo contract'}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Contract Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Contract Details</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Address:</strong> {getContractAddress(selectedContract)}
                  </p>
                  <a
                    href={getExplorerUrl(selectedContract)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    View on BaseScan →
                  </a>
                </div>

                {/* Transaction Buttons */}
                <div className="space-y-4">
                  <h3 className="font-medium">Try Gasless Transactions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedContract === 'Counter' && (
                      <>
                        <TxButton
                          label="Increment Counter"
                          contract="Counter"
                          method="increment"
                          args={[]}
                          description="Increase the counter by 1"
                        />
                        <TxButton
                          label="Get Current Value"
                          contract="Counter"
                          method="number"
                          args={[]}
                          description="Read the current counter value"
                          isReadOnly
                        />
                      </>
                    )}
                    
                    {selectedContract === 'DemoToken' && (
                      <>
                        <TxButton
                          label="Mint 100 Tokens"
                          contract="DemoToken"
                          method="mint"
                          args={[address, "100000000000000000000"]}
                          description="Mint 100 demo tokens to your account"
                        />
                        <TxButton
                          label="Check Balance"
                          contract="DemoToken"
                          method="balanceOf"
                          args={[address]}
                          description="Check your token balance"
                          isReadOnly
                        />
                      </>
                    )}
                    
                    {selectedContract === 'DemoNFT' && (
                      <>
                        <TxButton
                          label="Mint NFT"
                          contract="DemoNFT"
                          method="mint"
                          args={[address]}
                          description="Mint a demo NFT to your account"
                        />
                        <TxButton
                          label="Check Balance"
                          contract="DemoNFT"
                          method="balanceOf"
                          args={[address]}
                          description="Check your NFT balance"
                          isReadOnly
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}