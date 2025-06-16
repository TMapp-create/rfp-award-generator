
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { signInSchema, signUpSchema, authRateLimiter, sanitizeInput } from '@/utils/validation';
import { z } from 'zod';

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

  const checkRateLimit = useCallback((email: string): boolean => {
    const isAllowed = authRateLimiter.isAllowed(email);
    if (!isAllowed) {
      const remainingTime = authRateLimiter.getRemainingTime(email);
      setAuthState(prev => ({ ...prev, rateLimited: true, remainingTime }));
      toast({
        title: "Too many attempts",
        description: `Please wait ${Math.ceil(remainingTime / 60000)} minutes before trying again.`,
        variant: "destructive"
      });
      return false;
    }
    setAuthState(prev => ({ ...prev, rateLimited: false, remainingTime: 0 }));
    return true;
  }, []);

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

      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [checkRateLimit]);

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

      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [checkRateLimit]);

  return {
    ...authState,
    secureSignIn,
    secureSignUp,
  };
};
