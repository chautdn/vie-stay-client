import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';

const TenantRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Không cho phép owner/landlord truy cập tenant dashboard
  const isOwner = user?.role?.includes("landlord") || user?.role === "owner";
  
  if (isOwner) {
    return <Navigate to="/owner" replace />;
  }

  return children;
};

export default TenantRoute;
