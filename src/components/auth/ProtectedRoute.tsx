
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  routeType?: 'company' | 'technician';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  routeType = 'company' 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If route type checking is needed, implement it here
  // For example, checking if user.role matches routeType
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
