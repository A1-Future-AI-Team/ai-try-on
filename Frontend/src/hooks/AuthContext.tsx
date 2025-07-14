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

  const BACKEND_API_URL = (import.meta as any).env?.VITE_MONGODB_API_URL || 'http://localhost:3002';

  // Validate user on app load
  useEffect(() => {
    const validateUser = async (user: User | null) => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          localStorage.removeItem('user');
          setUser(null);
          return;
        }
        
        const res = await fetch(`${BACKEND_API_URL}/api/auth/profile`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.status !== 'success' || !data.data?.user) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        // If validation fails, treat as not authenticated
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    };
    validateUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
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
        return { error: null, user };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Login failed', user: null };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username: name })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      if (data.status === 'success') {
        return { error: null };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    // Debug logging for every render
    console.log('AuthContext state:', { user, loading });
  }, [user, loading]);

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