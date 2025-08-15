# Abstrak-to: ERC-4337 Account Abstraction Scaffold

A production-ready MVP scaffold for Web3 applications featuring ERC-4337 Account Abstraction, gas sponsorship, and passkey/social authentication.

## 🚀 Features

- **Smart Accounts (ERC-4337)**: Support for Safe{Core}, Alchemy AA, and Biconomy
- **Gasless UX**: Paymaster integration for sponsored transactions
- **Passkey/Social Login**: No seed phrases required
- **Spending Limits**: Configurable daily caps and transaction limits
- **Session Keys**: One-click actions with ephemeral signing keys
- **Multi-Chain Support**: Base Sepolia, Ethereum Mainnet, Sepolia Testnet

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

## 🧪 Testing

### Local Development

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format checking
pnpm format:check
```

### Testnet Testing

1. **Get Base Sepolia ETH**: Use the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
2. **Deploy Smart Account**: Connect wallet and click "Create Smart Account"
3. **Test One-Click Actions**: Use session keys for gasless transactions
4. **Verify Spending Limits**: Try exceeding daily caps

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

## 📚 API Reference

### Core Functions

```typescript
// Smart Account Management
import { getSmartAccountAddress, deploySmartAccount } from '@/lib/aa';

// Session Management
import { createSessionKey, getActiveSession, revokeSession } from '@/lib/sessionKeys';

// Gas Sponsorship
import { executeSponsoredTransaction } from '@/lib/paymaster';

// Spending Limits
import { attachSpendingLimit, checkSpendingLimit } from '@/lib/spendingLimits';
```

### Provider-Specific APIs

```typescript
// Safe{Core}
import { createSafeSession, executeSafeTransaction } from '@/lib/aa/safe';

// Alchemy AA
import { createAlchemySession, executeAlchemyTransaction } from '@/lib/aa/alchemy';

// Biconomy
import { createBiconomySession, executeBiconomyTransaction } from '@/lib/aa/biconomy';
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
