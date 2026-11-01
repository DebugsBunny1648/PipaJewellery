import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cartItemCount } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import './Header.css';

const NAV_LINKS = [
  { label: 'Rings', to: '/category/rings' },
  { label: 'Necklaces', to: '/category/necklaces' },
  { label: 'Earrings', to: '/category/earrings' },
  { label: 'Bangles', to: '/category/bangles' },
  { label: 'All Jewellery', to: '/shop' }
];

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customer = useSelector((s) => s.auth.customer);
  const itemCount = useSelector(cartItemCount);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="site-header">
      <div className="site-header__bar container">
        <button className="site-header__menu-btn" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
          <span /><span /><span />
        </button>

        <Link to="/" className="site-header__logo">Aurelia</Link>

        <nav className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className="site-header__nav-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form className="site-header__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search jewellery…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="site-header__actions">
          <Link to="/wishlist" aria-label="Wishlist" className="site-header__icon-link">♡</Link>
          <Link to="/cart" aria-label="Cart" className="site-header__icon-link site-header__cart">
            🛍
            {itemCount > 0 && <span className="site-header__cart-badge">{itemCount}</span>}
          </Link>
          {customer ? (
            <div className="site-header__account">
              <Link to="/account/orders" className="site-header__icon-link">{customer.fullName?.split(' ')[0] || 'Account'}</Link>
              <button className="btn-ghost" onClick={() => dispatch(logout())}>Sign out</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
