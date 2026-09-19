'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, createUser, updateUser as updateUserDB } from '@/lib/db';

const AuthContext = createContext(null);

// Simple SHA-256 hash for passwords (client-side, not production-grade)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('aura_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Session restore failed:', e);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const hash = await hashPassword(password);
    const dbUser = await getUser(email);
    if (!dbUser) throw new Error('User not found. Please sign up first.');
    if (dbUser.passwordHash !== hash) throw new Error('Invalid password.');
    const sessionUser = { email: dbUser.email, name: dbUser.name, xp: dbUser.xp, level: dbUser.level, theme: dbUser.theme };
    setUser(sessionUser);
    sessionStorage.setItem('aura_user', JSON.stringify(sessionUser));
    return sessionUser;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const hash = await hashPassword(password);
    const dbUser = await createUser(email, name, hash);
    const sessionUser = { email: dbUser.email, name: dbUser.name, xp: dbUser.xp, level: dbUser.level, theme: dbUser.theme };
    setUser(sessionUser);
    sessionStorage.setItem('aura_user', JSON.stringify(sessionUser));
    return sessionUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('aura_user');
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!user) return;
    const updated = await updateUserDB(user.email, updates);
    const sessionUser = { email: updated.email, name: updated.name, xp: updated.xp, level: updated.level, theme: updated.theme };
    setUser(sessionUser);
    sessionStorage.setItem('aura_user', JSON.stringify(sessionUser));
    return sessionUser;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
