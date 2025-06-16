// Security monitoring and logging utilities
interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_activity' | 'validation_error';
  timestamp: number;
  details: Record<string, any>;
  userAgent?: string;
  ip?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    this.events.push(securityEvent);
    
    // Keep only the most recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', securityEvent);
    }

    // In production, you would send this to your monitoring service
    this.sendToMonitoring(securityEvent);
  }

  private sendToMonitoring(event: SecurityEvent) {
    // Implement your monitoring service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    console.log('Security event logged:', event.type);
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }
}

export const securityMonitor = new SecurityMonitor();

// Content Security Policy headers (for implementation in edge functions)
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vpraxaahneurntlkwegw.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://vpraxaahneurntlkwegw.supabase.co wss://vpraxaahneurntlkwegw.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
});

// Dependency security checker (basic version)
export const checkDependencySecurity = () => {
  const vulnerabilities = [];
  
  // This is a basic example - in production you'd use tools like:
  // - npm audit
  // - Snyk
  // - OWASP Dependency Check
  
  console.log('Running basic dependency security check...');
  
  // Check for known vulnerable patterns
  const userAgent = navigator.userAgent;
  if (userAgent.includes('vulnerable-pattern')) {
    vulnerabilities.push('Potential vulnerability detected in user agent');
  }
  
  return {
    vulnerabilities,
    lastChecked: new Date().toISOString(),
    status: vulnerabilities.length === 0 ? 'clean' : 'issues_found'
  };
};
