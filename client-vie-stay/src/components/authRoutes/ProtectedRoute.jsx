import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore"; // Adjust path as needed
import { useEffect } from "react";
// import axios from "axios"; // Use whatever HTTP client you're using

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Effect to verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) return;

      try {
        // Optional: You can add a token verification API call here if needed
        // const response = await axios.get('/user/verify-token', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!response.data.valid) logout();
        
        console.log("Token exists, user authenticated");
      } catch (error) {
        console.error("Token verification failed", error);
        logout();
      }
    };

    verifyToken();
  }, [logout]);

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const hasPermission = userRoles.some(role => allowedRoles.includes(role));

  // If authenticated but wrong role, redirect based on role
  if (!hasPermission) {
    const primaryRole = Array.isArray(user.role) ? user.role[0] : user.role;
    
    switch (primaryRole) {
      case "landlord":
        return <Navigate to="/owner/dashboard" replace />;
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "tenant":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If authenticated and correct role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;