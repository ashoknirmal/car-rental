import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from "./config";

export interface User {
  _id: string;
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone_number?: string;
  driving_license?: string;
  avatar_url?: string;
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          setSession({ access_token: userInfo.token, user: userInfo });
          setUser({ ...userInfo, id: userInfo._id });
          setIsAdmin(userInfo.role === 'admin');
        } catch (error) {
          console.error('Error parsing token:', error);
          localStorage.removeItem('userInfo');
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error signing up');
      }
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setSession({ access_token: data.token, user: data });
      setUser({ ...data, id: data._id });
      setIsAdmin(data.role === 'admin');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error logging in');
      }
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setSession({ access_token: data.token, user: data });
      setUser({ ...data, id: data._id });
      setIsAdmin(data.role === 'admin');
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

