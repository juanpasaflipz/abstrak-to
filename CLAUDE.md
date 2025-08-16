# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Abstrak-to is an ERC-4337 Account Abstraction scaffold for Web3 applications, providing smart accounts, gasless transactions, and passkey/social authentication. The codebase is built with Next.js 14 (App Router), TypeScript, and integrates multiple Account Abstraction providers (Safe{Core}, Alchemy AA, Biconomy).

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check

# Run specific test
pnpm test tests/session.spec.ts
```

## Architecture & Key Patterns

### Provider Abstraction Pattern
The codebase uses a provider abstraction pattern for Account Abstraction implementations. All AA providers (Safe, Alchemy, Biconomy) implement the same interface through:
- Entry point: `src/lib/aa/index.ts` - Routes to specific provider based on `AA_PROVIDER` env variable
- Each provider module exports `getAccount()` functions that return standardized `SmartAccount` interfaces
- Provider selection is environment-driven, allowing runtime switching without code changes

### Chain Configuration
Multi-chain support is centralized in `src/lib/chains.ts`:
- Supported chains: Base Sepolia (default), Ethereum Mainnet, Sepolia Testnet
- Chain selection via `NEXT_PUBLIC_CHAIN` environment variable
- Each chain has dedicated RPC endpoints and configuration

### Session Key Architecture
Session keys enable one-click transactions through ephemeral signing keys:
- Session storage: Encrypted in localStorage with expiration tracking
- Security boundaries: Contract whitelist, method restrictions, spending limits
- Management functions: `createSessionKey()`, `getActiveSession()`, `revokeSession()`

### Component Structure
- **Page Components** (`src/app/`): Next.js App Router pages using server components
- **UI Components** (`src/components/`): Client-side interactive components
  - `ConnectCard`: Handles wallet connection and smart account creation
  - `SessionBadge`: Displays session status and management
  - `TxButton`: Executes one-click sponsored transactions
- **Server Actions** (`src/app/actions/`): Server-side transaction execution

### Type Safety Patterns
- Strict TypeScript configuration with `strict: true`
- Path aliases: `@/*` maps to `./src/*`
- Interface-first design for all AA provider implementations

## Environment Configuration

Required environment variables (copy from `env.example`):

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN=base-sepolia  # Options: base-sepolia, mainnet, sepolia

# AA Provider Selection
AA_PROVIDER=safe  # Options: safe, alchemy, biconomy

# Provider API Keys
NEXT_PUBLIC_ALCHEMY_API_KEY=
ALCHEMY_GAS_POLICY_ID=
BICONOMY_API_KEY=

# Auth Provider Configuration
NEXT_PUBLIC_AUTH_PROVIDER=particle
AUTH_PUBLIC_KEY=
AUTH_SECRET=
```

## Testing Approach

Tests use Vitest framework with:
- Mock implementations for browser APIs (localStorage)
- Test files in `tests/` directory
- Naming convention: `*.spec.ts`
- Run individual tests: `pnpm test [filename]`

## Smart Contract Integration

Counter contract example at `contracts/Counter.sol`:
- Used for demonstrating one-click actions
- Methods restricted through session key policies
- Gas sponsored through paymaster integration

## Common Development Tasks

### Adding a New AA Provider
1. Create provider module in `src/lib/aa/[provider].ts`
2. Implement `getAccount()` function returning `SmartAccount` interface
3. Add case in `src/lib/aa/index.ts` switch statement
4. Update environment types and validation

### Implementing New One-Click Actions
1. Define action in `src/app/actions/`
2. Create session key policy in `src/lib/sessionKeys.ts`
3. Add UI button in `src/components/TxButton.tsx`
4. Configure spending limits if needed

### Debugging Transaction Issues
- Check browser console for detailed error logs
- Verify environment variables are set correctly
- Ensure smart account is deployed (check `isDeployed` flag)
- Validate session key hasn't expired
- Confirm paymaster has sufficient balance

## Code Style Conventions

- **Imports**: Absolute imports using `@/` prefix for src directory
- **Async/Await**: Preferred over promise chains
- **Error Handling**: Wrap external calls in try-catch with descriptive error messages
- **Component Props**: Define interfaces for all component props
- **Constants**: Chain IDs and addresses should be environment-driven
- memory
- m
- m