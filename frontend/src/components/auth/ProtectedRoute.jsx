import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Configurable flag to bypass authentication for development/testing
const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading indicator while checking authentication
    if (loading && !BYPASS_AUTH) {
        return <div className="loading-screen">Loading...</div>;
    }

    // If bypass is enabled, skip authentication check
    if (BYPASS_AUTH) {
        // For role-based routes, we'll use a fake "citizen" role
        if (allowedRoles.length > 0 && !allowedRoles.includes('citizen')) {
            return (
                <Navigate
                    to="/dashboard"
                    state={{ message: 'You do not have permission to access this page' }}
                    replace
                />
            );
        }
        return children;
    }

    // Regular authentication check (when not bypassed)
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname, message: 'Please login to access this page' }}
                replace
            />
        );
    }

    // Check for role restrictions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <Navigate
                to="/dashboard"
                state={{ message: 'You do not have permission to access this page' }}
                replace
            />
        );
    }

    // All checks passed, render the protected content
    return children;
};

export default ProtectedRoute;
