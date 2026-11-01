import { useSelector, useDispatch } from 'react-redux';
import { dismissToast } from '../store/slices/uiSlice';
import './ToastContainer.css';

export default function ToastContainer() {
  const toasts = useSelector((s) => s.ui.toasts);
  const dispatch = useDispatch();

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tone}`} onClick={() => dispatch(dismissToast(t.id))}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
