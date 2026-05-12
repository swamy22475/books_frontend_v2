import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    switch (user?.role) {
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'super_admin':
            return <Navigate to="/super/dashboard" replace />;
        default: {
            const tenantId = user?.tenant_id || sessionStorage.getItem('tenant_id') || localStorage.getItem('tenant_id');
            return tenantId ? <Navigate to={`/${tenantId}/books`} replace /> : <Navigate to="/books/login" replace />;
        }
    }
};

export default DashboardRedirect;
