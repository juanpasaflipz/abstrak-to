# Dependencies Compatibility Matrix

This document outlines the exact versions of dependencies used in the Abstrak-to ERC-4337 Account Abstraction scaffold and their compatibility requirements.

## Core Dependencies

### Frontend Framework
| Package | Version | Notes |
|---------|---------|-------|
| `next` | `14.0.4` | Latest stable App Router with React 18 support |
| `react` | `18.2.0` | Required for Next.js 14 compatibility |
| `react-dom` | `18.2.0` | Must match React version exactly |
| `typescript` | `5.3.0` | Latest stable with Next.js 14 support |

### Web3 Core Stack
| Package | Version | Notes |
|---------|---------|-------|
| `wagmi` | `2.5.0` | **Critical**: Exact version required for RainbowKit compatibility |
| `viem` | `2.7.0` | **Critical**: Must match wagmi v2 requirements |
| `@rainbow-me/rainbowkit` | `2.0.0` | **Critical**: Only compatible with wagmi v2.x |
| `@tanstack/react-query` | `5.0.0` | Required for wagmi v2 data fetching |
| `ethers` | `6.8.0` | Latest stable v6 for AA provider compatibility |

### Account Abstraction Providers
| Package | Version | Compatibility | Notes |
|---------|---------|---------------|-------|
| `@alchemy/aa-alchemy` | `3.19.0` | Viem v2.x | Alchemy Light Account support |
| `@alchemy/aa-core` | `3.19.0` | Viem v2.x | Core AA abstractions |
| `@biconomy/account` | `3.1.4` | Ethers v6.x | Biconomy Smart Account v2 |
| `@biconomy/core-types` | `3.1.4` | Ethers v6.x | Type definitions |
| `@biconomy/paymaster` | `3.1.4` | Ethers v6.x | Paymaster integration |
| `@safe-global/protocol-kit` | `1.0.0` | Ethers v6.x | Safe{Core} Protocol Kit |

### Styling & UI
| Package | Version | Notes |
|---------|---------|-------|
| `tailwindcss` | `3.3.0` | Latest stable v3 with CSS-in-JS support |
| `tailwindcss-animate` | `1.0.7` | Animation utilities |
| `@tailwindcss/forms` | `0.5.7` | Form styling improvements |
| `tailwind-merge` | `2.0.0` | Conditional class merging |
| `clsx` | `2.0.0` | Conditional class utility |

### Testing Framework
| Package | Version | Notes |
|---------|---------|-------|
| `vitest` | `1.0.0` | Fast unit test runner with Vite |
| `@vitest/ui` | `1.0.0` | Web UI for test results |
| `jsdom` | `23.0.0` | DOM environment for testing |

## Known Compatibility Issues

### Wagmi v2 + RainbowKit v2
- **Issue**: RainbowKit v2 only works with wagmi v2.x
- **Solution**: Use exact versions specified above
- **Breaking Changes**: Migrating from wagmi v1 requires updating all hooks

### Ethers v6 + AA Providers
- **Issue**: Some AA providers still use ethers v5 patterns
- **Solution**: Use adapter patterns in `/lib/aa/` providers
- **Workaround**: Wrap ethers v6 calls for backwards compatibility

### Next.js 14 + App Router
- **Issue**: Server Components vs Client Components confusion
- **Solution**: Explicitly mark client components with `'use client'`
- **Best Practice**: Keep AA logic in client components only

## Environment Requirements

### Node.js
- **Minimum**: Node.js 18.17.0
- **Recommended**: Node.js 20.x LTS
- **Package Manager**: pnpm (recommended), npm, or yarn

### TypeScript
- **Configuration**: Strict mode enabled
- **Target**: ES2022
- **Module**: ESNext with module resolution bundler

## Testing Setup

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

### Mock Requirements
- **localStorage**: Mock for session key testing
- **ethereum**: Mock wallet provider
- **fetch**: Mock for API testing

## Deployment Compatibility

### Vercel
- **Node.js**: 20.x (set in vercel.json)
- **Build Command**: `pnpm build`
- **Output Directory**: `.next`

### Environment Variables
| Variable | Required | Development | Production |
|----------|----------|-------------|------------|
| `NEXT_PUBLIC_CHAIN` | Yes | base-sepolia | base-sepolia |
| `AA_PROVIDER` | Yes | safe | safe/alchemy/biconomy |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Yes | Test key | Production key |
| `ALCHEMY_GAS_POLICY_ID` | If using Alchemy | Test policy | Production policy |
| `BICONOMY_API_KEY` | If using Biconomy | Test key | Production key |

## Upgrade Path

### Safe Upgrades
1. **Patch versions**: Can be upgraded safely
2. **Minor versions**: Review changelog before upgrading
3. **Major versions**: Requires testing and potential code changes

### Breaking Changes Watch List
- **wagmi v3**: Will require RainbowKit v3 (not yet available)
- **Next.js 15**: May introduce App Router changes
- **ethers v7**: Will require AA provider updates

## Troubleshooting

### Common Issues
1. **Module Resolution**: Ensure path aliases are configured correctly
2. **SSR Hydration**: Web3 components must be client-side only
3. **Type Conflicts**: Use exact versions to avoid TypeScript conflicts

### Debugging Commands
```bash
# Check for dependency conflicts
pnpm ls --depth=0

# Verify TypeScript types
pnpm typecheck

# Run tests with coverage
pnpm test:coverage
```

---

**Last Updated**: January 2025  
**Next Review**: March 2025

For issues or questions about dependencies, please check the [GitHub Issues](https://github.com/your-repo/issues) or contact the development team.