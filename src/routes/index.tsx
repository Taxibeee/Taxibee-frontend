import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute, DriverRoute, PublicOnlyRoute } from "./ProtectedRoutes";

// Import pages
import Login from "../pages/auth/Login";
import HomePage from "../pages/common/HomePage";
import Profile from "../pages/common/Profile";
import Unauthorized from "../pages/common/Unauthorized";
import DriverDashboard from "../pages/driver/DriverDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

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
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* Add other admin routes as needed */}
                </Route>

                {/* Driver only routes */}
                <Route element={<DriverRoute />}>
                    <Route path="/driver/dashboard" element={<DriverDashboard />} />
                    <Route path="/driver/orders" element={<DriverDashboard />} />
                </Route>

                {/* Special Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Catch-all route for 404 Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;