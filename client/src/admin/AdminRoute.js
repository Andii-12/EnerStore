import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f6f6f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-dark)', marginBottom: 16 }}>Checking Access...</div>
          <div style={{ fontSize: 16, color: '#666' }}>Please wait</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default AdminRoute;
