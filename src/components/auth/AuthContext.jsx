import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (u) => {
    setIsAuthenticated(true);
    setUser(u || { name: 'User' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(() => ({ isAuthenticated, user, login, logout }), [isAuthenticated, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
