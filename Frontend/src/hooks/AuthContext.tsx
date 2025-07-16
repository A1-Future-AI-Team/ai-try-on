/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; user: User | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const BACKEND_API_URL = (import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002';

  // Improved token validation with retry logic and better error handling
  useEffect(() => {
    const validateUserSession = async () => {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      
      // Skip validation if no user or token
      if (!savedUser || !savedToken || validationAttempted) {
        setValidationAttempted(true);
        return;
      }

      console.log('🔍 Validating user session...');
      setLoading(true);

      let attempts = 0;
      const maxAttempts = 3;
      const retryDelay = 1000; // 1 second

      const attemptValidation = async (): Promise<boolean> => {
        attempts++;
        
        try {
          const res = await fetch(`${BACKEND_API_URL}/api/auth/profile`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${savedToken}`
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });

          // Handle different HTTP status codes
          if (res.status === 401 || res.status === 403) {
            // Actual authentication failure - log out
            console.log('❌ Authentication failed - logging out');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            return false;
          }

          if (!res.ok) {
            // Server error or other issues - don't log out, just retry
            console.log(`⚠️ Server error (${res.status}) - attempt ${attempts}/${maxAttempts}`);
            throw new Error(`Server returned ${res.status}`);
          }

          const data = await res.json();
          
          if (data.status === 'success' && data.data?.user) {
            // Validation successful - update user data if needed
            const currentUser = {
              id: data.data.user._id,
              email: data.data.user.email,
              name: data.data.user.username
            };
            
            // Update localStorage if user data has changed
            const savedUserData = JSON.parse(savedUser);
            if (JSON.stringify(currentUser) !== JSON.stringify(savedUserData)) {
              localStorage.setItem('user', JSON.stringify(currentUser));
              setUser(currentUser);
            }
            
            console.log('✅ Session validation successful');
            return true;
          } else {
            // Invalid response structure - log out
            console.log('❌ Invalid response structure - logging out');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            return false;
          }

        } catch (err) {
          console.log(`⚠️ Validation attempt ${attempts} failed:`, err);
          
          // If it's a network error and we have more attempts, retry
          if (attempts < maxAttempts) {
            console.log(`🔄 Retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return attemptValidation();
          }
          
          // After max attempts, keep the session but log the issue
          console.log('⚠️ Max validation attempts reached. Keeping session but validation failed.');
          console.log('💡 User will need to perform an action that requires auth to trigger re-validation');
          return true; // Don't log out on network errors
        }
      };

      await attemptValidation();
      setLoading(false);
      setValidationAttempted(true);
    };

    validateUserSession();
  }, [BACKEND_API_URL, validationAttempted]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting login...');
      
      const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid credentials');
      }
      
      const data = await res.json();
      if (data.status === 'success' && data.data?.user) {
        const user = {
          id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.username
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', data.data.token);
        console.log('✅ Login successful');
        return { error: null, user };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.log('❌ Login failed:', err);
      return { error: err instanceof Error ? err.message : 'Login failed', user: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('📝 Attempting registration...');
      
      const res = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username: name })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await res.json();
      if (data.status === 'success') {
        console.log('✅ Registration successful');
        return { error: null };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.log('❌ Registration failed:', err);
      return { error: err instanceof Error ? err.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setValidationAttempted(false); // Reset validation flag
  };

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 AuthContext state:', { 
        user: user ? `${user.name} (${user.email})` : 'null', 
        loading,
        hasToken: !!localStorage.getItem('token'),
        validationAttempted
      });
    }
  }, [user, loading, validationAttempted]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 