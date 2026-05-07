import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Simple authentication guard — checks if the user is logged in.
 * Does NOT check roles. Use RoleGuard for role-based access.
 *
 * Double-checks localStorage to handle cases where the axios interceptor
 * cleared the token but React state hasn't updated yet.
 */
const AuthGuard = ({ loginPath = '/auth/login', children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Still loading auth state — show spinner to avoid flash
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    // Double-check localStorage — handles forced logout by axios interceptor
    const hasToken = !!localStorage.getItem('auth_token');

    if (!isAuthenticated || !hasToken) {
        return <Navigate to={loginPath} replace />;
    }

    return <>{children ?? <Outlet />}</>;
};

export default AuthGuard;
