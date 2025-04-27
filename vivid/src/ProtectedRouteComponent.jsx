import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}