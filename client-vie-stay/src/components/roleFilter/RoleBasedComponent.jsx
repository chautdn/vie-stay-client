import React from "react";
import { useRole } from "../../hooks/useRole";

const RoleBasedComponent = ({
  allowedRoles = [],
  deniedRoles = [],
  fallback = null,
  children,
}) => {
  const { hasAnyRole, hasRole } = useRole();

  // If denied roles are specified and user has any of them, don't render
  if (deniedRoles.length > 0 && hasAnyRole(deniedRoles)) {
    return fallback;
  }

  // If allowed roles are specified and user doesn't have any of them, don't render
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return fallback;
  }

  return children;
};

// Convenience components for specific roles
export const AdminOnly = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={["admin"]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const LandlordOnly = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={["landlord", "admin"]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const TenantOnly = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={["tenant", "admin"]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export const OwnerOrAdmin = ({ children, fallback = null }) => (
  <RoleBasedComponent allowedRoles={["landlord", "admin"]} fallback={fallback}>
    {children}
  </RoleBasedComponent>
);

export default RoleBasedComponent;
