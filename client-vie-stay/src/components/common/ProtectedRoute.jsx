// components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // Hiển thị loading khi đang check auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Redirect đến login nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ SỬA: Kiểm tra role cho array role
  if (requiredRole && !user?.role?.includes(requiredRole)) {
    // ✅ SỬA: Redirect dựa trên role thực tế
    const redirectPath = user?.role?.includes('landlord') ? '/owner' : '/home';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;