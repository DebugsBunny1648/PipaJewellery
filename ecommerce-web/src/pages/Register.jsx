import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../store/slices/authSlice';
import './Auth.css';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate('/account/orders');
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="auth-card__subtitle">Save addresses, track orders, build a wishlist.</p>
        {error && <div className="auth-card__error">{error}</div>}
        <div className="field"><label>First name</label><input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
        <div className="field"><label>Last name</label><input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
        <div className="field"><label>Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="field"><label>Password</label><input className="input" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <button className="btn btn-primary btn-block" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </button>
        <div className="auth-card__footer">Already have an account? <Link to="/login">Sign in</Link></div>
      </form>
    </div>
  );
}
