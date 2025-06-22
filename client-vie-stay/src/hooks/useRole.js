import { useAuthStore } from '../store/authStore';

export const useRole = () => {
  const { user } = useAuthStore();

  const userRoles = user?.role ? (Array.isArray(user.role) ? user.role : [user.role]) : [];

  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  const hasAnyRole = (roles) => {
    return roles.some(role => userRoles.includes(role));
  };

  const hasAllRoles = (roles) => {
    return roles.every(role => userRoles.includes(role));
  };

  const isAdmin = () => hasRole('admin');
  const isLandlord = () => hasRole('landlord');
  const isTenant = () => hasRole('tenant');
  const isOwner = () => hasRole('landlord') || hasRole('admin'); // Alias for landlord

  return {
    userRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isLandlord,
    isTenant,
    isOwner,
  };
};