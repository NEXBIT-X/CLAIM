"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authMethod: 'metamask' | 'internet-identity' | null;
  metamaskAccount: string | null;
  internetIdentityPrincipal: string | null;
  login: (method: 'metamask' | 'internet-identity') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState<'metamask' | 'internet-identity' | null>(null);
  const [metamaskAccount, setMetamaskAccount] = useState<string | null>(null);
  const [internetIdentityPrincipal, setInternetIdentityPrincipal] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing authentication on component mount
    const savedAuth = localStorage.getItem('claim_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setAuthMethod(authData.authMethod);
        setMetamaskAccount(authData.metamaskAccount);
        setInternetIdentityPrincipal(authData.internetIdentityPrincipal);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
      }
    }
  }, []);

  const login = async (method: 'metamask' | 'internet-identity') => {
    try {
      if (method === 'metamask') {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          setMetamaskAccount(accounts[0]);
          setAuthMethod('metamask');
          setIsAuthenticated(true);
          
          // Save to localStorage
          localStorage.setItem('claim_auth', JSON.stringify({
            isAuthenticated: true,
            authMethod: 'metamask',
            metamaskAccount: accounts[0],
            internetIdentityPrincipal: null
          }));
        } else {
          throw new Error('MetaMask not installed');
        }
      } else if (method === 'internet-identity') {
        // Simulate Internet Identity login
        const principal = `ii_${Math.random().toString(36).substring(2, 15)}`;
        setInternetIdentityPrincipal(principal);
        setAuthMethod('internet-identity');
        setIsAuthenticated(true);
        
        // Save to localStorage
        localStorage.setItem('claim_auth', JSON.stringify({
          isAuthenticated: true,
          authMethod: 'internet-identity',
          metamaskAccount: null,
          internetIdentityPrincipal: principal
        }));
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthMethod(null);
    setMetamaskAccount(null);
    setInternetIdentityPrincipal(null);
    localStorage.removeItem('claim_auth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    authMethod,
    metamaskAccount,
    internetIdentityPrincipal,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
