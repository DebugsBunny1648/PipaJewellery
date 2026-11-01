import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1.5rem' }}>{message}</p>
      {actionLabel && actionTo && <Link className="btn btn-primary" to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}
