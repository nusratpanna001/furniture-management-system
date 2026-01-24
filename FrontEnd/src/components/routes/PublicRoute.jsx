import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to appropriate page if already authenticated
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />; // Regular users go to landing page
  }

  return children;
}

export default PublicRoute;
