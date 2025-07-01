// components/common/OwnerRoute.jsx
import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const OwnerRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="landlord">
      {children}
    </ProtectedRoute>
  );
};

export default OwnerRoute;