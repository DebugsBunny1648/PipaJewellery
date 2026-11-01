import { useSelector, useDispatch } from 'react-redux';
import { dismissToast } from '../store/slices/uiSlice';

export default function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts);
  const dispatch = useDispatch();
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 200 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dispatch(dismissToast(t.id))}
          style={{
            background: t.tone === 'error' ? 'var(--color-danger)' : t.tone === 'success' ? 'var(--color-primary)' : 'var(--color-ink)',
            color: '#fff', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', cursor: 'pointer',
            boxShadow: '0 12px 24px -8px rgba(0,0,0,0.3)'
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
