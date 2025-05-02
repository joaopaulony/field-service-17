
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentTechnician } from '@/services/technician/technicianAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  routeType?: 'company' | 'technician';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  routeType = 'company' 
}) => {
  const { user, loading } = useAuth();
  const [isTechnician, setIsTechnician] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkUserType = async () => {
      if (user) {
        try {
          const technician = await getCurrentTechnician();
          setIsTechnician(!!technician);
        } catch (error) {
          console.error("Error checking technician status:", error);
          setIsTechnician(false);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };
    
    if (!loading) {
      checkUserType();
    }
  }, [user, loading]);
  
  // If still loading or checking user type, show loading state
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  // If user type check is complete
  if (isTechnician !== null) {
    // For technician routes, allow only technicians
    if (routeType === 'technician' && !isTechnician) {
      toast({
        title: "Acesso negado",
        description: "Esta área é restrita para técnicos.",
        variant: "destructive"
      });
      return <Navigate to="/dashboard" />;
    }
    
    // For company routes, allow only company users
    if (routeType === 'company' && isTechnician) {
      return <Navigate to="/technician" />;
    }
  }
  
  // If all checks pass, render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
