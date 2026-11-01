import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login({ usernameOrEmail, password }));
    if (login.fulfilled.match(result)) navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)' }}>
      <form className="card" style={{ width: '100%', maxWidth: 400, padding: '2.5rem' }} onSubmit={handleSubmit}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.3rem' }}>Aurelia Admin</div>
        <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1.5rem' }}>Sign in to manage your store.</p>
        {error && <div style={{ background: 'var(--color-danger-tint)', color: 'var(--color-danger)', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>{error}</div>}
        <div className="field">
          <label>Username or email</label>
          <input className="input" required value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', marginTop: '1rem' }}>
          Default seeded login: <span className="mono">superadmin</span> / <span className="mono">ChangeMe123!</span>
        </p>
      </form>
    </div>
  );
}
