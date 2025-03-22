import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, DriverRoute, PublicOnlyRoute } from './ProtectedRoutes';

// Import pages
import Login from '../pages/auth/Login';
import HomePage from '../pages/common/HomePage';
import Profile from '../pages/common/Profile';
import Unauthorized from '../pages/common/Unauthorized';
import DriverDashboard from '../pages/driver/DriverDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Public routes that should not be accessible when logged in */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Shared protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<AdminRoute />}>
          {/* All admin routes use the same AdminDashboard component, which will handle rendering the appropriate content */}
          <Route path="/admin/dashboard" element={<AdminDashboard selectedPage="dashboard" />} />
          <Route path="/admin/orders" element={<AdminDashboard selectedPage="orders" />} />
          <Route
            path="/admin/live-status"
            element={<AdminDashboard selectedPage="live-status" />}
          />
          <Route path="/admin/drivers" element={<AdminDashboard selectedPage="drivers" />} />
          <Route
            path="/admin/transactions"
            element={<AdminDashboard selectedPage="transactions" />}
          />
          <Route path="/admin/exact-file" element={<AdminDashboard selectedPage="exact-file" />} />
          <Route path="/admin/contacts" element={<AdminDashboard selectedPage="contacts" />} />
        </Route>

        {/* Driver only routes */}
        <Route element={<DriverRoute />}>
          {/* All driver routes use the same DriverDashboard component, which will handle rendering the appropriate content */}
          <Route path="/driver/dashboard" element={<DriverDashboard selectedPage="dashboard" />} />
          <Route path="/driver/orders" element={<DriverDashboard selectedPage="orders" />} />
          <Route path="/driver/contacts" element={<DriverDashboard selectedPage="contacts" />} />
        </Route>

        {/* Special Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
