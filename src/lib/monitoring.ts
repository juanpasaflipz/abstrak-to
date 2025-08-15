// Monitoring and analytics utilities for production usage

export interface MetricEvent {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: number;
}

export interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
  timestamp?: number;
  requestId?: string;
  userId?: string;
}

export interface ApiMetrics {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  userId?: string;
  provider?: string;
  chainId?: number;
}

class MonitoringService {
  private isProduction = process.env.NODE_ENV === 'production';
  private apiKey = process.env.MONITORING_API_KEY;

  // Centralized logging
  log(event: LogEvent) {
    const logEntry = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Console logging for development
    if (!this.isProduction) {
      const { level, message, metadata } = logEntry;
      console[level](`[${level.toUpperCase()}] ${message}`, metadata || '');
      return;
    }

    // In production, send to monitoring service
    this.sendToMonitoringService('logs', logEntry);
  }

  // Metrics collection
  recordMetric(event: MetricEvent) {
    const metricEntry = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      environment: process.env.NODE_ENV || 'development',
    };

    if (!this.isProduction) {
      console.log(`[METRIC] ${event.name}: ${event.value}`, event.tags || '');
      return;
    }

    this.sendToMonitoringService('metrics', metricEntry);
  }

  // API performance tracking
  recordApiMetrics(metrics: ApiMetrics) {
    this.recordMetric({
      name: 'api.request.duration',
      value: metrics.duration,
      tags: {
        endpoint: metrics.endpoint,
        method: metrics.method,
        status: metrics.statusCode.toString(),
        provider: metrics.provider || 'unknown',
        chain: metrics.chainId?.toString() || 'unknown',
      },
    });

    this.recordMetric({
      name: 'api.request.count',
      value: 1,
      tags: {
        endpoint: metrics.endpoint,
        method: metrics.method,
        status: metrics.statusCode.toString(),
      },
    });

    // Log errors
    if (metrics.statusCode >= 400) {
      this.log({
        level: 'error',
        message: `API error: ${metrics.method} ${metrics.endpoint}`,
        metadata: {
          statusCode: metrics.statusCode,
          duration: metrics.duration,
          userId: metrics.userId,
        },
      });
    }
  }

  // Account Abstraction specific metrics
  recordAAMetrics(event: {
    type: 'account_created' | 'session_created' | 'transaction_executed' | 'transaction_failed';
    provider: string;
    chainId: number;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    this.recordMetric({
      name: `aa.${event.type}`,
      value: 1,
      tags: {
        provider: event.provider,
        chain: event.chainId.toString(),
      },
    });

    this.log({
      level: 'info',
      message: `AA Event: ${event.type}`,
      metadata: {
        provider: event.provider,
        chainId: event.chainId,
        userId: event.userId,
        ...event.metadata,
      },
    });
  }

  // Transaction monitoring
  recordTransaction(tx: {
    hash?: string;
    from: string;
    to: string;
    value: string;
    gasUsed?: string;
    sponsored: boolean;
    status: 'success' | 'failed' | 'pending';
    provider: string;
    chainId: number;
    sessionId?: string;
  }) {
    this.recordMetric({
      name: 'transaction.gas_used',
      value: parseInt(tx.gasUsed || '0'),
      tags: {
        provider: tx.provider,
        chain: tx.chainId.toString(),
        sponsored: tx.sponsored.toString(),
        status: tx.status,
      },
    });

    this.recordMetric({
      name: 'transaction.count',
      value: 1,
      tags: {
        provider: tx.provider,
        status: tx.status,
        sponsored: tx.sponsored.toString(),
      },
    });

    this.log({
      level: tx.status === 'failed' ? 'error' : 'info',
      message: `Transaction ${tx.status}: ${tx.hash}`,
      metadata: tx,
    });
  }

  // Session key monitoring
  recordSessionActivity(activity: {
    type: 'created' | 'used' | 'revoked' | 'expired';
    sessionId: string;
    userAddress: string;
    spendingLimit: string;
    remainingLimit: string;
    provider: string;
  }) {
    this.recordMetric({
      name: `session.${activity.type}`,
      value: 1,
      tags: {
        provider: activity.provider,
      },
    });

    // Track spending utilization
    if (activity.type === 'used') {
      const utilized = (
        (BigInt(activity.spendingLimit) - BigInt(activity.remainingLimit)) * BigInt(100)
      ) / BigInt(activity.spendingLimit);

      this.recordMetric({
        name: 'session.spending_utilization',
        value: Number(utilized),
        tags: {
          provider: activity.provider,
        },
      });
    }

    this.log({
      level: 'info',
      message: `Session ${activity.type}: ${activity.sessionId}`,
      metadata: activity,
    });
  }

  // Rate limiting monitoring
  recordRateLimit(event: {
    userId: string;
    endpoint: string;
    count: number;
    limit: number;
    resetTime: number;
  }) {
    this.recordMetric({
      name: 'rate_limit.usage',
      value: (event.count / event.limit) * 100,
      tags: {
        endpoint: event.endpoint,
        userId: event.userId,
      },
    });

    if (event.count >= event.limit) {
      this.log({
        level: 'warn',
        message: `Rate limit exceeded: ${event.endpoint}`,
        metadata: event,
      });
    }
  }

  // Error tracking with context
  recordError(error: Error, context?: Record<string, any>) {
    this.recordMetric({
      name: 'error.count',
      value: 1,
      tags: {
        error_type: error.name,
        endpoint: context?.endpoint || 'unknown',
      },
    });

    this.log({
      level: 'error',
      message: error.message,
      metadata: {
        stack: error.stack,
        name: error.name,
        ...context,
      },
    });
  }

  // Performance monitoring
  recordPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    this.recordMetric({
      name: 'performance.operation_duration',
      value: duration,
      tags: {
        operation,
        provider: metadata?.provider || 'unknown',
      },
    });

    if (duration > 5000) { // Log slow operations (>5s)
      this.log({
        level: 'warn',
        message: `Slow operation: ${operation} took ${duration}ms`,
        metadata,
      });
    }
  }

  // Health check monitoring
  recordHealthCheck(checks: Record<string, { status: 'healthy' | 'unhealthy'; latency?: number }>) {
    Object.entries(checks).forEach(([service, check]) => {
      this.recordMetric({
        name: 'health.status',
        value: check.status === 'healthy' ? 1 : 0,
        tags: { service },
      });

      if (check.latency) {
        this.recordMetric({
          name: 'health.latency',
          value: check.latency,
          tags: { service },
        });
      }
    });
  }

  private async sendToMonitoringService(type: 'logs' | 'metrics', data: any) {
    if (!this.apiKey) {
      console.warn('No monitoring API key configured');
      return;
    }

    try {
      // In a real implementation, you would send to your monitoring service
      // Examples: DataDog, New Relic, Grafana, Prometheus, etc.
      
      // For now, we'll just log structured data
      console.log(`[MONITORING:${type.toUpperCase()}]`, JSON.stringify(data));
      
      // Example implementation for DataDog
      /*
      await fetch('https://api.datadoghq.com/api/v1/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          series: [{
            metric: data.name,
            points: [[data.timestamp, data.value]],
            tags: Object.entries(data.tags || {}).map(([k, v]) => `${k}:${v}`),
          }]
        }),
      });
      */
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Convenience functions
export const logInfo = (message: string, metadata?: Record<string, any>) =>
  monitoring.log({ level: 'info', message, metadata });

export const logWarn = (message: string, metadata?: Record<string, any>) =>
  monitoring.log({ level: 'warn', message, metadata });

export const logError = (message: string, metadata?: Record<string, any>) =>
  monitoring.log({ level: 'error', message, metadata });

export const recordMetric = (name: string, value: number, tags?: Record<string, string>) =>
  monitoring.recordMetric({ name, value, tags });

// Performance timer utility
export function withPerformanceTracking<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const start = Date.now();
  
  return fn()
    .then((result) => {
      monitoring.recordPerformance(operation, Date.now() - start, metadata);
      return result;
    })
    .catch((error) => {
      monitoring.recordPerformance(operation, Date.now() - start, metadata);
      monitoring.recordError(error, { operation, ...metadata });
      throw error;
    });
}

// API middleware for automatic monitoring
export function withApiMonitoring(
  endpoint: string,
  method: string,
  handler: (req: any) => Promise<{ status: number; data?: any; error?: any }>
) {
  return async (req: any) => {
    const start = Date.now();
    const requestId = crypto.randomUUID();
    
    try {
      const result = await handler(req);
      const duration = Date.now() - start;
      
      monitoring.recordApiMetrics({
        endpoint,
        method,
        statusCode: result.status,
        duration,
        userId: req.user?.id,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      monitoring.recordApiMetrics({
        endpoint,
        method,
        statusCode: 500,
        duration,
        userId: req.user?.id,
      });
      
      monitoring.recordError(error as Error, {
        endpoint,
        method,
        requestId,
        userId: req.user?.id,
      });
      
      throw error;
    }
  };
}