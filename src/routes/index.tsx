import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute, DriverRoute, PublicOnlyRoute } from "./ProtectedRoutes";

// Import pages
import Login from "../pages/auth/Login";