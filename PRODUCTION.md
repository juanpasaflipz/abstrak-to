# Production Deployment Guide

This guide covers deploying Abstrak-to to production with proper security, monitoring, and performance optimizations.

## 🚀 Pre-Deployment Checklist

### Environment Variables

Ensure all required environment variables are configured:

```env
# Core Configuration
NODE_ENV=production
NEXT_PUBLIC_CHAIN=base-sepolia  # or mainnet for production
AA_PROVIDER=safe                # safe, alchemy, or biconomy

# API Keys (Production)
NEXT_PUBLIC_ALCHEMY_API_KEY=alch_xxx
ALCHEMY_GAS_POLICY_ID=policy_xxx
BICONOMY_API_KEY=biconomy_xxx

# Authentication & Security
API_SECRET_KEY=your_32_char_secret_key_here
SESSION_ENCRYPTION_KEY=your_32_char_session_key

# Monitoring & Analytics
MONITORING_API_KEY=your_monitoring_key
NEXT_PUBLIC_ANALYTICS_ID=ga_xxx

# Database (if using persistent storage)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://user:pass@host:6379

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_key
```

### Security Configuration

1. **API Key Management**
   - Generate unique production API keys
   - Implement proper key rotation
   - Set up monitoring for key usage

2. **Rate Limiting**
   - Configure appropriate limits for production traffic
   - Set up Redis for distributed rate limiting
   - Monitor and alert on rate limit breaches

3. **Session Security**
   - Use strong encryption keys (32+ characters)
   - Implement proper session expiration
   - Set up session cleanup tasks

### Database Setup

If using persistent storage:

```sql
-- Create database tables
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    key_hash VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    rate_limit INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address VARCHAR(42) NOT NULL,
    session_key_hash VARCHAR(64) NOT NULL,
    spending_limit DECIMAL(78,0) NOT NULL,
    spent_amount DECIMAL(78,0) DEFAULT 0,
    allowed_targets JSONB,
    allowed_methods JSONB,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hash VARCHAR(66) UNIQUE,
    user_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    value DECIMAL(78,0) NOT NULL,
    data TEXT,
    gas_used DECIMAL(78,0),
    status VARCHAR(20) NOT NULL,
    sponsored BOOLEAN DEFAULT false,
    provider VARCHAR(20) NOT NULL,
    chain_id INTEGER NOT NULL,
    session_id UUID REFERENCES sessions(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sessions_user_address ON sessions(user_address);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_transactions_user_address ON transactions(user_address);
CREATE INDEX idx_transactions_hash ON transactions(hash);
```

## 🌐 Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   - Set all production environment variables in Vercel dashboard
   - Use Vercel's secret management for sensitive keys

3. **Vercel Configuration**
   ```json
   // vercel.json
   {
     "framework": "nextjs",
     "buildCommand": "pnpm build",
     "installCommand": "pnpm install",
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     },
     "env": {
       "NODE_OPTIONS": "--max_old_space_size=4096"
     }
   }
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Digital Ocean App Platform

```yaml
# .do/app.yaml
name: abstrak-to
services:
- name: web
  source_dir: /
  github:
    repo: your-username/abstrak-to
    branch: main
  run_command: pnpm start
  build_command: pnpm build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_CHAIN
    value: base-sepolia
    type: SECRET
  - key: ALCHEMY_API_KEY
    type: SECRET
```

## 📊 Monitoring & Observability

### Structured Logging

The monitoring system automatically logs:
- API requests and responses
- Account Abstraction events
- Transaction execution
- Error tracking
- Performance metrics

### Metrics Collection

Key metrics to monitor:

```typescript
// Example metrics setup
import { monitoring } from '@/lib/monitoring';

// API performance
monitoring.recordApiMetrics({
  endpoint: '/api/aa/transaction/execute',
  method: 'POST',
  statusCode: 200,
  duration: 250,
  userId: 'user_123',
  provider: 'safe'
});

// AA-specific metrics
monitoring.recordAAMetrics({
  type: 'transaction_executed',
  provider: 'safe',
  chainId: 84532,
  userId: 'user_123'
});
```

### Health Checks

Implement health check endpoints:

```typescript
// app/api/health/route.ts
import { monitoring } from '@/lib/monitoring';

export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    alchemy: await checkAlchemy(),
    biconomy: await checkBiconomy(),
  };

  monitoring.recordHealthCheck(checks);

  const isHealthy = Object.values(checks).every(c => c.status === 'healthy');

  return Response.json(checks, {
    status: isHealthy ? 200 : 503
  });
}
```

### Error Tracking

Configure error tracking service:

```typescript
// In production, integrate with Sentry, Bugsnag, etc.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## ⚡ Performance Optimization

### Next.js Optimizations

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    swcMinify: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static optimization
  output: 'standalone',
};
```

### Caching Strategy

1. **API Response Caching**
   ```typescript
   // Cache account data for 5 minutes
   export const GET = async (req: Request) => {
     return new Response(data, {
       headers: {
         'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
       }
     });
   };
   ```

2. **Redis Caching**
   ```typescript
   import Redis from 'ioredis';
   
   const redis = new Redis(process.env.REDIS_URL);
   
   // Cache session data
   await redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));
   ```

### Database Optimization

1. **Connection Pooling**
   ```typescript
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

2. **Query Optimization**
   - Use proper indexes
   - Implement query batching
   - Add query timeout limits

## 🔒 Security Hardening

### API Security

1. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP',
   });
   ```

2. **Input Validation**
   ```typescript
   import { z } from 'zod';
   
   const schema = z.object({
     userAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
     amount: z.string().regex(/^\d+$/),
   });
   ```

3. **CORS Configuration**
   ```typescript
   const corsOptions = {
     origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
     credentials: true,
   };
   ```

### Session Security

1. **Encryption**
   ```typescript
   import crypto from 'crypto';
   
   const encrypt = (text: string) => {
     const cipher = crypto.createCipher('aes-256-cbc', process.env.SESSION_KEY);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     return encrypted;
   };
   ```

2. **Session Cleanup**
   ```typescript
   // Scheduled job to clean up expired sessions
   setInterval(async () => {
     await database.query('DELETE FROM sessions WHERE expires_at < NOW()');
   }, 60 * 60 * 1000); // Run every hour
   ```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing**
   - Use reverse proxy (nginx, Cloudflare)
   - Implement sticky sessions if needed
   - Health check endpoints

2. **Database Scaling**
   - Read replicas for query scaling
   - Connection pooling
   - Query optimization

3. **Caching**
   - Redis for session storage
   - CDN for static assets
   - API response caching

### Monitoring at Scale

1. **Application Metrics**
   - Request/response times
   - Error rates
   - User activity patterns

2. **Infrastructure Metrics**
   - CPU/Memory usage
   - Database performance
   - Network latency

3. **Business Metrics**
   - Smart account creation rate
   - Transaction success rate
   - Gas cost optimization

## 🚨 Incident Response

### Alerting Rules

Configure alerts for:
- High error rates (>5%)
- Slow API responses (>2s)
- Database connection issues
- Rate limit breaches
- Smart account deployment failures

### Rollback Strategy

1. **Blue-Green Deployment**
2. **Database Migration Rollbacks**
3. **Feature Flag Controls**
4. **Emergency Shutdown Procedures**

## 📋 Maintenance Tasks

### Daily
- Monitor error rates and performance
- Check transaction success rates
- Verify gas sponsorship balance

### Weekly
- Clean up expired sessions
- Review security logs
- Update dependency versions

### Monthly
- Security audit
- Performance optimization review
- Cost analysis and optimization

---

This production guide ensures your Abstrak-to deployment is secure, scalable, and maintainable. Adjust configurations based on your specific requirements and traffic patterns.