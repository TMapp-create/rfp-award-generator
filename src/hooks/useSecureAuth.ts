
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { signInSchema, signUpSchema, authRateLimiter, sanitizeInput } from '@/utils/validation';
import { useSecurityLog } from './useSecurityLog';

interface AuthState {
  loading: boolean;
  rateLimited: boolean;
  remainingTime: number;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    loading: false,
    rateLimited: false,
    remainingTime: 0,
  });

  const { logSecurityEvent, logAuditEvent } = useSecurityLog();

  const checkRateLimit = useCallback((email: string): boolean => {
    const isAllowed = authRateLimiter.isAllowed(email);
    if (!isAllowed) {
      const remainingTime = authRateLimiter.getRemainingTime(email);
      setAuthState(prev => ({ ...prev, rateLimited: true, remainingTime }));
      
      // Log security event for rate limiting
      logSecurityEvent({
        event_type: 'auth_rate_limit_exceeded',
        severity: 'medium',
        details: { email, remainingTime }
      });
      
      toast({
        title: "Too many attempts",
        description: `Please wait ${Math.ceil(remainingTime / 60000)} minutes before trying again.`,
        variant: "destructive"
      });
      return false;
    }
    setAuthState(prev => ({ ...prev, rateLimited: false, remainingTime: 0 }));
    return true;
  }, [logSecurityEvent]);

  const secureSignIn = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);

      // Validate inputs
      const validation = signInSchema.safeParse({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (!validation.success) {
        const errorMessage = validation.error.errors[0]?.message || "Invalid input";
        
        // Log security event for invalid input
        logSecurityEvent({
          event_type: 'auth_invalid_input',
          severity: 'low',
          details: { email: sanitizedEmail, error: errorMessage }
        });
        
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive"
        });
        return { error: new Error(errorMessage) };
      }

      // Check rate limiting
      if (!checkRateLimit(sanitizedEmail)) {
        return { error: new Error("Rate limited") };
      }

      // Attempt sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (error) {
        // Log failed sign in attempt
        logSecurityEvent({
          event_type: 'auth_signin_failed',
          severity: 'medium',
          details: { email: sanitizedEmail, error: error.message }
        });
      } else {
        // Log successful sign in
        logAuditEvent({
          action: 'user_signin',
          details: { email: sanitizedEmail }
        });
      }

      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      
      // Log system error
      logSecurityEvent({
        event_type: 'auth_system_error',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [checkRateLimit, logSecurityEvent, logAuditEvent]);

  const secureSignUp = useCallback(async (email: string, password: string, confirmPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);
      const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

      // Validate inputs
      const validation = signUpSchema.safeParse({
        email: sanitizedEmail,
        password: sanitizedPassword,
        confirmPassword: sanitizedConfirmPassword,
      });

      if (!validation.success) {
        const errorMessage = validation.error.errors[0]?.message || "Invalid input";
        
        // Log security event for invalid input
        logSecurityEvent({
          event_type: 'auth_invalid_input',
          severity: 'low',
          details: { email: sanitizedEmail, error: errorMessage }
        });
        
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive"
        });
        return { error: new Error(errorMessage) };
      }

      // Check rate limiting
      if (!checkRateLimit(sanitizedEmail)) {
        return { error: new Error("Rate limited") };
      }

      // Attempt sign up
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        // Log failed sign up attempt
        logSecurityEvent({
          event_type: 'auth_signup_failed',
          severity: 'medium',
          details: { email: sanitizedEmail, error: error.message }
        });
      } else {
        // Log successful sign up
        logAuditEvent({
          action: 'user_signup',
          details: { email: sanitizedEmail }
        });
      }

      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      
      // Log system error
      logSecurityEvent({
        event_type: 'auth_system_error',
        severity: 'high',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [checkRateLimit, logSecurityEvent, logAuditEvent]);

  return {
    ...authState,
    secureSignIn,
    secureSignUp,
  };
};
