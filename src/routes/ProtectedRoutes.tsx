import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/hooks';
import { CircularProgress } from '@mui/joy';
import { Box } from '@mui/material';

/**
 * Protected Route - Base component for protected routes
 * Redirects to login if not authenticated
 */

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show laoding indicator
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="warning" variant="plain" />
      </Box>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticate, render the child routes
  return <Outlet />;
};

/**
 * AdminRoute - For routes that only admins should access
 */
export const AdminRoute: React.FC = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="warning" variant="plain" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole('admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

/**
 * Driver Route - For routes that only drivers should access
 */
export const DriverRoute: React.FC = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="warning" variant="plain" />
      </Box>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!hasRole('driver')) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

/**
 * PublicOnlyRoute - For routes like login that should only be accessible when not logged in
 */

export const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Get the intended destination from state, or default to role-based dashboard
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress color="warning" variant="plain" />
      </Box>
    );
  }

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/driver/dashboard" replace />;
    }

    // Default fallback
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the child routes (login, etc..)
  return <Outlet />;
};
