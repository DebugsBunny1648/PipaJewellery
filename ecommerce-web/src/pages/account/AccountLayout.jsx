import { NavLink, Outlet } from 'react-router-dom';
import './account.css';

const LINKS = [
  { to: '/account/orders', label: 'Orders' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account/addresses', label: 'Addresses' }
];

export default function AccountLayout() {
  return (
    <div className="container account-layout">
      <aside className="account-nav">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'is-active' : ''}>{l.label}</NavLink>
        ))}
      </aside>
      <div className="account-content"><Outlet /></div>
    </div>
  );
}
