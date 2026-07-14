import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="modern-spinner"></div>
        <p className="loading-text">Verifying role permissions...</p>
      </div>
    );
  }

  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Fallback redirect to public home or basic dashboard home if role is mismatched
  return <Navigate to="/" replace />;
};

export default RoleRoute;
