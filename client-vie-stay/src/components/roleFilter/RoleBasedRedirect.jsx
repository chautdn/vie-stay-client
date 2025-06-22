import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user && user.role) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    // Priority: admin > landlord > tenant
    if (userRoles.includes("admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRoles.includes("landlord")) {
      return <Navigate to="/owner/dashboard" replace />;
    } else if (userRoles.includes("tenant")) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Default fallback
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRedirect;
