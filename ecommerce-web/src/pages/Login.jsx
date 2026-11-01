import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../store/slices/authSlice';
import './Auth.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(location.state?.from?.pathname || '/account/orders');
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="auth-card__subtitle">Sign in to track orders and your wishlist.</p>
        {error && <div className="auth-card__error">{error}</div>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="auth-card__footer">New to Aurelia? <Link to="/register">Create an account</Link></div>
      </form>
    </div>
  );
}
