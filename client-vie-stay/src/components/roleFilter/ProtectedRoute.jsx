import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const RoleBasedRedirect = ({ redirectToLogin = false }) => {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();

  // Debug logging
  useEffect(() => {
    console.log('🔄 RoleBasedRedirect Debug:', {
      isCheckingAuth,
      isAuthenticated,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      redirectToLogin
    });
  }, [isCheckingAuth, isAuthenticated, user, redirectToLogin]);

  // Add timeout for checking auth to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isCheckingAuth) {
        console.warn('⚠️ RoleBasedRedirect: Auth check timeout - forcing redirect to login');
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isCheckingAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
          <p className="mt-2 text-sm text-gray-400">
            Mode: {redirectToLogin ? 'Force Login' : 'Role Based'}
          </p>
        </div>
      </div>
    );
  }

  // If redirectToLogin is true or user is not authenticated, redirect to login
  if (redirectToLogin || !isAuthenticated) {
    console.log('🚫 Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role (only when user is authenticated and redirectToLogin is false)
  if (user && user.role) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    
    console.log('🎯 Redirecting based on roles:', userRoles);
    
    // Priority: admin > landlord > tenant
    if (userRoles.includes('admin')) {
      console.log('➡️ Redirecting to admin dashboard');
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRoles.includes('landlord')) {
      console.log('➡️ Redirecting to owner dashboard');
      return <Navigate to="/owner/dashboard" replace />;
    } else if (userRoles.includes('tenant')) {
      console.log('➡️ Redirecting to tenant dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Default fallback to login
  console.log('🚫 Fallback: Redirecting to login');
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;