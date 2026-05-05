'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  level: 'Standard' | 'Pro' | 'VIP';
  kycStatus: 'unverified' | 'pending' | 'verified';
  uid: string;
  joinDate: string;
  referralCode: string;
  portfolio: {
    totalUSD: number;
    change24h: number;
    change24hPct: number;
    assets: Asset[];
  };
}

export interface Asset {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  change24h: number;
  logoUrl: string;
  color: string;
}

const DEMO_USER: User = {
  id: 'u_demo001',
  email: 'demo@sumato.com',
  name: 'Alex Morgan',
  avatar: 'AM',
  level: 'Pro',
  kycStatus: 'verified',
  uid: '482910374',
  joinDate: '2022-03-15',
  referralCode: 'SUMATO-ALEXM',
  portfolio: {
    totalUSD: 84_291.54,
    change24h: 1_284.32,
    change24hPct: 1.55,
    assets: [
      { symbol: 'BTC', name: 'Bitcoin', amount: 0.8742, price: 67432.5, change24h: 2.34, logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', color: '#f7931a' },
      { symbol: 'ETH', name: 'Ethereum', amount: 4.231, price: 3521.8, change24h: -0.82, logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', color: '#627eea' },
      { symbol: 'BNB', name: 'BNB', amount: 12.5, price: 567.2, change24h: 1.12, logoUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', color: '#f3ba2f' },
      { symbol: 'SOL', name: 'Solana', amount: 22.8, price: 185.4, change24h: 4.21, logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', color: '#9945ff' },
      { symbol: 'USDT', name: 'Tether', amount: 3420.0, price: 1.0, change24h: 0.01, logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', color: '#26a17b' },
    ],
  },
};

interface AuthCtx {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isLoading: false,
  login: async () => ({ ok: false }),
  logout: () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const stored = localStorage.getItem('sumato_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate network

    // Demo: accept any email with password >= 6 chars, or specific demo credentials
    const validDemo =
      (email.toLowerCase() === 'demo@sumato.com' && password === 'demo123') ||
      (email.includes('@') && password.length >= 6);

    if (validDemo) {
      const loggedUser = { ...DEMO_USER, email };
      setUser(loggedUser);
      localStorage.setItem('sumato_user', JSON.stringify(loggedUser));
      setIsLoading(false);
      return { ok: true };
    }

    setIsLoading(false);
    return { ok: false, error: 'Invalid email or password. Try demo@sumato.com / demo123' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sumato_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
