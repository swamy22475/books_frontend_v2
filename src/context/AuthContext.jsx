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
      const routeTenantId = window.location.pathname.split('/').filter(Boolean)[0];
      const handoffKey = routeTenantId ? `tenant_session_${routeTenantId}` : null;
      const handoffSession = handoffKey ? localStorage.getItem(handoffKey) : null;
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      let savedToken = isAdminRoute
        ? localStorage.getItem('auth_token')
        : sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
      let savedUser = isAdminRoute
        ? localStorage.getItem('auth_user')
        : sessionStorage.getItem('auth_user') || localStorage.getItem('auth_user');

      if (handoffSession && handoffKey) {
        const parsedSession = JSON.parse(handoffSession);
        savedToken = parsedSession.token;
        savedUser = JSON.stringify(parsedSession.user);
        sessionStorage.setItem('auth_token', savedToken);
        sessionStorage.setItem('auth_user', savedUser);
        sessionStorage.setItem('tenant_id', parsedSession.user.tenant_id);
        localStorage.removeItem(handoffKey);
      }
      
      if (savedToken && savedUser) {
        // If it's a mock token, we might still want to allow it for now if we haven't implemented full JWT yet
        // but for a permanent system, we should ideally use real tokens.
        // For now, let's keep it simple: if there's a user and token, we trust it.
        if (savedToken.startsWith('mock-token-') || savedToken.startsWith('local_token_')) {
           setUser(JSON.parse(savedUser));
        } else {
          const payload = decodeJwtPayload(savedToken);
          // Check token expiry
          if (payload && typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token expired — clear
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_user');
            sessionStorage.removeItem('tenant_id');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('tenant_id');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth restoration failed:", e);
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('tenant_id');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('tenant_id');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('tenant_id', userData.tenant_id);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('tenant_id');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Clear legacy academics mock data from localStorage
    const tenantId = localStorage.getItem('tenant_id') || 'default';
    localStorage.removeItem(`academics_master_${tenantId}`);
    localStorage.removeItem('tenant_id');
    
    setUser(null);
  }, []);

  const getToken = useCallback(() => {
    return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
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
    </AuthContext.Provider>
  );
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
