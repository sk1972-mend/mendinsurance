import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppRole = 'customer' | 'shop' | 'admin' | 'enterprise';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    switch (role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'shop':
        return <Navigate to="/shop" replace />;
      case 'enterprise':
        return <Navigate to="/enterprise" replace />;
      case 'customer':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
