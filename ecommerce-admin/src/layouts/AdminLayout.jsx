import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, hasRole } from '../store/slices/authSlice';
import ToastContainer from '../components/ToastContainer';
import './AdminLayout.css';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: '◈', roles: null }]
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: '◆', roles: ['ADMIN', 'PRODUCT_MANAGER'] },
      { to: '/categories', label: 'Categories', icon: '▤', roles: ['ADMIN', 'PRODUCT_MANAGER'] }
    ]
  },
  {
    label: 'Sales',
    items: [
      { to: '/orders', label: 'Orders', icon: '⊞', roles: ['ADMIN', 'ORDER_MANAGER'] },
      { to: '/coupons', label: 'Coupons & Offers', icon: '%', roles: ['ADMIN'] },
      { to: '/tax', label: 'Tax Rules', icon: '§', roles: ['ADMIN'] }
    ]
  },
  {
    label: 'Content',
    items: [
      { to: '/cms', label: 'Homepage CMS', icon: '▦', roles: ['ADMIN', 'CONTENT_MANAGER'] },
      { to: '/pages', label: 'Static Pages', icon: '▥', roles: ['ADMIN', 'CONTENT_MANAGER'] },
      { to: '/reviews', label: 'Reviews', icon: '★', roles: ['ADMIN', 'CONTENT_MANAGER'] },
      { to: '/branding', label: 'Branding', icon: '◐', roles: ['ADMIN', 'CONTENT_MANAGER'] }
    ]
  },
  {
    label: 'Settings',
    items: [
      { to: '/config/site', label: 'Site Configuration', icon: '⚙', roles: ['SUPER_ADMIN'] },
      { to: '/config/smtp', label: 'SMTP', icon: '✉', roles: ['SUPER_ADMIN'] },
      { to: '/config/mobile', label: 'Mobile App', icon: '▭', roles: ['ADMIN'] },
      { to: '/users', label: 'Admin Users', icon: '⚉', roles: ['SUPER_ADMIN'] },
      { to: '/roles', label: 'Roles & Permissions', icon: '⚿', roles: ['SUPER_ADMIN'] },
      { to: '/audit-log', label: 'Audit Log', icon: '⌘', roles: ['SUPER_ADMIN'] }
    ]
  }
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">Aurelia <span>Admin</span></div>
        <nav className="admin-sidebar__nav">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter((item) => !item.roles || hasRole(user, ...item.roles));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.label} className="admin-sidebar__section">
                <div className="admin-sidebar__section-label">{section.label}</div>
                {visibleItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => isActive ? 'is-active' : ''}>
                    <span className="admin-sidebar__icon">{item.icon}</span>{item.label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar__user">
            <span>{user?.fullName || user?.email}</span>
            <button className="btn btn-outline btn-sm" onClick={() => dispatch(logout()).then(() => navigate('/login'))}>Sign out</button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
