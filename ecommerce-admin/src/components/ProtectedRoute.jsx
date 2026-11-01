import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasRole } from '../store/slices/authSlice';

export default function ProtectedRoute({ children, roles }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !hasRole(user, ...roles)) {
    return (
      <div className="empty-state">
        <h3>Not authorized</h3>
        <p>Your role doesn't have access to this section.</p>
      </div>
    );
  }
  return children;
}
