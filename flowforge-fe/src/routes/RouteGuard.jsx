import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" />;
};