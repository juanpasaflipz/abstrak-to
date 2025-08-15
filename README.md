# Abstrak-to: ERC-4337 Account Abstraction Scaffold

A comprehensive, production-ready platform for Web3 applications featuring ERC-4337 Account Abstraction, gasless transactions, and a complete REST API for developers.

## ✨ Live Demo

🌐 **[Try the Demo](http://localhost:3000/demo)** - Experience gasless transactions in your browser  
📡 **[API Playground](http://localhost:3000/api-playground)** - Test API endpoints interactively

## 🚀 Key Features

### Core Account Abstraction
- **Smart Accounts (ERC-4337)**: Support for Safe{Core}, Alchemy AA, and Biconomy
- **Gasless UX**: Complete paymaster integration for sponsored transactions
- **Session Keys**: One-click actions with ephemeral, permission-limited keys
- **Spending Limits**: Configurable daily caps and transaction restrictions
- **Multi-Chain Support**: Base Sepolia, Ethereum Mainnet, Sepolia Testnet

### Developer Experience
- **REST API**: Complete API for account management, sessions, and transactions
- **SDK Ready**: TypeScript-first with full type safety
- **Testing Suite**: Comprehensive tests for all providers and API endpoints
- **Interactive Playground**: Test API endpoints directly in the browser
- **Dependency Locked**: Exact versions for reliable builds

### Production Features
- **Rate Limiting**: Built-in API rate limiting and authentication
- **Error Handling**: Comprehensive error responses with retry guidance
- **Monitoring Ready**: Structured logging and metrics collection
- **Security First**: Session encryption, spending limits, and audit trails

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main demo interface
│   └── actions/           # Server actions
├── components/             # React components
│   ├── ConnectCard.tsx    # Wallet connection & smart account creation
│   ├── SessionBadge.tsx   # Session status & management
│   └── TxButton.tsx       # One-click transaction buttons
├── lib/                    # Core libraries
│   ├── chains.ts          # Chain configuration
│   ├── wagmi.ts           # Wagmi configuration
│   ├── aa/                # Account Abstraction providers
│   │   ├── index.ts       # Provider router
│   │   ├── safe.ts        # Safe{Core} implementation
│   │   ├── alchemy.ts     # Alchemy AA implementation
│   └── └── biconomy.ts    # Biconomy implementation
│   ├── paymaster.ts       # Gas sponsorship wrapper
│   ├── sessionKeys.ts     # Session key management
│   └── spendingLimits.ts  # Spending limit policies
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Web3**: Wagmi v2, Viem v2, RainbowKit
- **AA Providers**: Safe{Core}, Alchemy AA, Biconomy
- **Auth**: Particle Network (configurable to Privy/Dynamic/Web3Auth)
- **Bundler/Paymaster**: Alchemy Gas Manager, Biconomy Paymaster

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Base Sepolia testnet ETH (for testing)
- API keys for chosen providers

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd abstrak-to
pnpm install
```

### 2. Environment Setup

Copy the environment file and configure your keys:

```bash
cp env.example .env.local
```

Fill in your API keys:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN=base-sepolia

# Account Abstraction Provider
AA_PROVIDER=safe  # Options: safe, alchemy, biconomy

# Provider-specific keys
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
ALCHEMY_GAS_POLICY_ID=your_policy_id_here
BICONOMY_API_KEY=your_key_here

# Auth Provider
NEXT_PUBLIC_AUTH_PROVIDER=particle  # Options: privy, particle, dynamic, web3auth
AUTH_PUBLIC_KEY=your_public_key_here
AUTH_SECRET=your_secret_key_here
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 🎯 Complete E2E Flow

### Step 1: Wallet Connection & Smart Account Creation

1. **Connect your EOA wallet** (MetaMask, Coinbase Wallet, etc.)
2. **Generate smart account address** - The system creates a deterministic address
3. **Deploy smart account** (optional) - Deploy to blockchain when needed

```typescript
// API: Create smart account
POST /api/aa/account/create
{
  "ownerAddress": "0x...",
  "chainId": 84532,
  "provider": "safe"
}

// Response
{
  "address": "0x...",
  "isDeployed": false,
  "provider": "safe"
}
```

### Step 2: Session Key Setup

1. **Create session key** with spending limits and expiration
2. **Set permissions** for allowed contracts and methods
3. **Encrypt and store** session data securely

```typescript
// API: Create session
POST /api/aa/session/create
{
  "userAddress": "0x...",
  "spendingLimit": "1000000000000000000", // 1 ETH in wei
  "duration": 3600000, // 1 hour
  "allowedTargets": ["0x742d35..."] // Contract addresses
}
```

### Step 3: Gasless Transaction Execution

1. **Select contract action** (increment counter, mint tokens, mint NFT)
2. **Execute transaction** using session key - no wallet popup!
3. **Gas is sponsored** by paymaster automatically
4. **Transaction confirmed** on Base Sepolia

```typescript
// API: Execute transaction
POST /api/aa/transaction/execute
{
  "userAddress": "0x...",
  "to": "0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7", // Counter contract
  "data": "0xd09de08a", // increment() function
  "value": "0"
}

// Response
{
  "hash": "0x...",
  "sponsored": true,
  "gasUsed": "21000",
  "status": "success"
}
```

### Step 4: Verify Results

1. **Check transaction** on [BaseScan](https://sepolia.basescan.org)
2. **View updated balances** (tokens/NFTs in wallet)
3. **Monitor session usage** and spending limits

## 📱 Demo Walkthrough

### Interactive Demo Page (`/demo`)

Experience the complete flow in your browser:

1. **🔗 Connect Wallet** - Use any Web3 wallet
2. **🔑 Create Session** - Set up gasless transactions  
3. **📄 Choose Contract** - Counter, ERC-20, or ERC-721
4. **⚡ Execute Gasless** - One-click transactions

### Available Demo Contracts

| Contract | Address | Function | Description |
|----------|---------|----------|-------------|
| **Counter** | `0x742d35...` | `increment()` | Simple counter increment |
| **Demo Token** | `0x8B3F3D...` | `mintToSelf()` | Mint 100 DEMO tokens |
| **Demo NFT** | `0x4A8B6C...` | `mintToSelf()` | Mint unique NFT |

### API Testing (`/api-playground`)

Test all endpoints interactively:

- **Account Management** - Create and query smart accounts
- **Session Management** - Create, list, and revoke sessions
- **Transaction Execution** - Execute and track transactions
- **Real-time Testing** - See live API responses

## 🔧 Configuration

### Switching AA Providers

Change `AA_PROVIDER` in your `.env.local`:

```env
# Safe{Core} with Sessions + Spending Limits
AA_PROVIDER=safe

# Alchemy Light Account + Gas Manager
AA_PROVIDER=alchemy

# Biconomy Smart Account + Paymaster
AA_PROVIDER=biconomy
```

### Switching Chains

Update `NEXT_PUBLIC_CHAIN`:

```env
# Base Sepolia (recommended for testing)
NEXT_PUBLIC_CHAIN=base-sepolia

# Ethereum Mainnet
NEXT_PUBLIC_CHAIN=mainnet

# Sepolia Testnet
NEXT_PUBLIC_CHAIN=sepolia
```

## 🧪 Testing & Quality Assurance

### Test Suite

Run the comprehensive test suite:

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test suites
pnpm test:providers    # Provider-specific tests
pnpm test:api         # API endpoint tests

# Open test UI
pnpm test:ui
```

### Test Coverage

- **Provider Tests**: Safe, Alchemy, and Biconomy implementations
- **API Tests**: All REST endpoints with authentication and validation
- **Integration Tests**: Complete E2E user flows
- **Unit Tests**: Core business logic and utilities

### Manual Testing

#### Demo Environment
1. **Visit `/demo`** - Interactive demo with real contracts
2. **Try `/api-playground`** - Test API endpoints directly
3. **Check `/`** - Main application flow

#### Testnet Testing

1. **Get Base Sepolia ETH**: [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. **Connect Wallet**: MetaMask, Coinbase Wallet, or any Web3 wallet
3. **Create Smart Account**: Generate deterministic address
4. **Create Session**: Set up gasless transaction permissions
5. **Execute Transactions**: Test all three demo contracts
6. **Monitor Results**: Check BaseScan for transaction confirmation

#### API Testing

```bash
# Test authentication
curl -H "Authorization: Bearer ak_test_1234567890abcdef" \
     http://localhost:3000/api/aa/account/0x1234567890123456789012345678901234567890

# Test account creation
curl -X POST \
     -H "Authorization: Bearer ak_test_1234567890abcdef" \
     -H "Content-Type: application/json" \
     -d '{"ownerAddress":"0x1234567890123456789012345678901234567890","chainId":84532}' \
     http://localhost:3000/api/aa/account/create
```

## 🔒 Security Checklist

### Session Key Security
- ✅ **Never persist raw private keys** - Session keys are stored encrypted
- ✅ **Short-lived sessions** - Default 30-minute expiration
- ✅ **Limited scope** - Restricted to specific contracts and methods
- ✅ **Spending caps** - Daily limits prevent excessive spending
- ✅ **Revocation support** - Users can revoke sessions anytime

### Transaction Security
- ✅ **Chain validation** - Transactions only execute on intended chains
- ✅ **Nonce management** - Prevents replay attacks
- ✅ **Contract validation** - Only whitelisted contracts allowed
- ✅ **Method restrictions** - Limited to specific function calls

### Provider Security
- ✅ **Fallback handling** - Graceful degradation if sponsorship fails
- ✅ **Rate limiting** - RPC usage optimized to prevent abuse
- ✅ **Error handling** - User-friendly error messages without exposing internals

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Environment Variables**:
   - Copy all variables from `.env.local` to Vercel
   - Ensure `NEXT_PUBLIC_` variables are public

### Production Considerations

- **RPC Endpoints**: Use dedicated RPC providers (Alchemy, Infura)
- **Gas Policies**: Configure appropriate spending limits for production
- **Monitoring**: Set up transaction monitoring and alerting
- **Backup**: Implement backup authentication methods

## 📚 REST API Documentation

### Authentication

All API endpoints require authentication using API keys:

```bash
curl -H "Authorization: Bearer ak_test_1234567890abcdef" \
     https://your-domain.com/api/aa/account/create
```

**Available API Keys:**
- `ak_test_1234567890abcdef` - Test user (100 req/min)
- `ak_demo_abcdef1234567890` - Demo user (10 req/min)

### Account Management

#### Create Smart Account
```http
POST /api/aa/account/create
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "ownerAddress": "0x1234567890123456789012345678901234567890",
  "chainId": 84532,
  "provider": "safe"
}
```

#### Get Account Details
```http
GET /api/aa/account/{address}
Authorization: Bearer {api_key}
```

#### Deploy Smart Account
```http
POST /api/aa/account/deploy
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "ownerAddress": "0x1234567890123456789012345678901234567890",
  "chainId": 84532,
  "provider": "safe"
}
```

### Session Management

#### Create Session Key
```http
POST /api/aa/session/create
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "spendingLimit": "1000000000000000000",
  "duration": 3600000,
  "allowedTargets": ["0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7"],
  "allowedMethods": ["increment", "mint"]
}
```

#### List User Sessions
```http
GET /api/aa/session/{address}?status=active&page=1&limit=10
Authorization: Bearer {api_key}
```

#### Revoke Session
```http
DELETE /api/aa/session/{sessionId}/revoke
Authorization: Bearer {api_key}
```

### Transaction Execution

#### Execute Single Transaction
```http
POST /api/aa/transaction/execute
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "to": "0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7",
  "data": "0xd09de08a",
  "value": "0",
  "sessionId": "session-123"
}
```

#### Execute Batch Transaction
```http
POST /api/aa/transaction/batch
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "transactions": [
    {
      "to": "0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7",
      "data": "0xd09de08a",
      "value": "0"
    }
  ],
  "sessionId": "session-123"
}
```

#### Get Transaction Status
```http
GET /api/aa/transaction/{hash}
Authorization: Bearer {api_key}
```

### Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data": any,           // Present on success
  "error": {             // Present on error
    "message": string,
    "code": string
  },
  "timestamp": string
}
```

### Error Codes

| Code | Description | Status |
|------|-------------|--------|
| `AUTH_ERROR` | Invalid or missing API key | 401 |
| `RATE_LIMIT_ERROR` | Too many requests | 429 |
| `VALIDATION_ERROR` | Invalid request parameters | 400 |
| `INTERNAL_ERROR` | Server error | 500 |

### Rate Limiting

- **Test User**: 100 requests per minute
- **Demo User**: 10 requests per minute
- **Headers**: `Retry-After` header included on 429 responses

## 🔨 SDK & Integration

### Frontend Integration

```typescript
// Create smart account
const account = await fetch('/api/aa/account/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ak_test_1234567890abcdef',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ownerAddress: address,
    chainId: 84532,
    provider: 'safe'
  })
});

// Execute gasless transaction
const tx = await fetch('/api/aa/transaction/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ak_test_1234567890abcdef',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userAddress: address,
    to: '0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7',
    data: '0xd09de08a' // increment()
  })
});
```

### React Hooks (Coming Soon)

```typescript
import { useSmartAccount, useSession, useGaslessTransaction } from '@abstrak-to/react';

function MyComponent() {
  const { account, createAccount } = useSmartAccount();
  const { session, createSession } = useSession();
  const { execute, loading } = useGaslessTransaction();

  return (
    <button onClick={() => execute('increment')}>
      {loading ? 'Executing...' : 'Increment Counter'}
    </button>
  );
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Smart Account Creation Fails**:
   - Check RPC endpoint connectivity
   - Verify API keys are correct
   - Ensure sufficient testnet ETH

2. **Session Key Issues**:
   - Clear localStorage and reconnect
   - Check session expiration
   - Verify spending limits

3. **Gas Sponsorship Fails**:
   - Check paymaster configuration
   - Verify gas policy settings
   - Ensure sufficient paymaster balance

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=abstrak:*
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discord**: [Community Server](link-to-discord)

## 🙏 Acknowledgments

- [Safe{Core}](https://safe.global/) for account abstraction infrastructure
- [Alchemy](https://www.alchemy.com/) for gas sponsorship
- [Biconomy](https://biconomy.io/) for paymaster services
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection
- [Wagmi](https://wagmi.sh/) for React hooks

---

**Built with ❤️ for the Web3 community**
