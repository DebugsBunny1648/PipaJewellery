import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const customer = useSelector((s) => s.auth.customer);
  const location = useLocation();
  if (!customer) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
