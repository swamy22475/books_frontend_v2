import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

// ── Helper: decode JWT payload ──
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Provider ──
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      if (savedToken && savedUser) {
        const payload = decodeJwtPayload(savedToken);
        // Check token expiry
        if (payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()) {
          setUser(JSON.parse(savedUser));
        } else {
          // Token expired — clear
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Set mock user for simplified version
          setUser({ id: 1, name: 'Admin', role: 'school_admin' });
        }
      } else {
        // No saved user — set mock user for simplified version
        localStorage.setItem('auth_token', 'mock_token');
        setUser({ id: 1, name: 'Admin', role: 'school_admin' });
      }
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.setItem('auth_token', 'mock_token');
      setUser({ id: 1, name: 'Admin', role: 'school_admin' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('auth_token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getToken
      }}>
          {children}
        </AuthContext.Provider>);

};

// ── Hook ──
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;