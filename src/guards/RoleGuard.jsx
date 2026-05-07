import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard that checks authentication and role.
 *
 * Double-checks localStorage to handle cases where the axios interceptor
 * cleared the token but React state hasn't updated yet.
 */
const RoleGuard = ({
  allowedRoles,
  loginPath = '/auth/login',
  unauthorizedPath = '/auth/403',
  children
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Still loading auth state — show nothing to avoid flash
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Double-check: if localStorage token is gone, treat as unauthenticated
  // (handles the case where axios interceptor cleared localStorage but React state is stale)
  const hasToken = !!localStorage.getItem('auth_token');

  if (!isAuthenticated || !user || !hasToken) {
    return <Navigate to={loginPath} replace />;
  }

  // Check role if allowedRoles specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

export default RoleGuard;