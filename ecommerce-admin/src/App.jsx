import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/products/Products';
import Categories from './pages/categories/Categories';
import Orders from './pages/orders/Orders';
import OrderDetail from './pages/orders/OrderDetail';
import CmsBuilder from './pages/cms/CmsBuilder';
import StaticPages from './pages/content/StaticPages';
import Coupons from './pages/content/Coupons';
import Tax from './pages/content/Tax';
import Reviews from './pages/content/Reviews';
import Branding from './pages/content/Branding';
import SiteConfig from './pages/settings/SiteConfig';
import SmtpConfig from './pages/settings/SmtpConfig';
import MobileConfig from './pages/settings/MobileConfig';
import AdminUsers from './pages/settings/AdminUsers';
import Roles from './pages/settings/Roles';
import AuditLog from './pages/settings/AuditLog';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProtectedRoute roles={['ADMIN', 'PRODUCT_MANAGER']}><Products /></ProtectedRoute>} />
        <Route path="categories" element={<ProtectedRoute roles={['ADMIN', 'PRODUCT_MANAGER']}><Categories /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute roles={['ADMIN', 'ORDER_MANAGER']}><Orders /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute roles={['ADMIN', 'ORDER_MANAGER']}><OrderDetail /></ProtectedRoute>} />
        <Route path="cms" element={<ProtectedRoute roles={['ADMIN', 'CONTENT_MANAGER']}><CmsBuilder /></ProtectedRoute>} />
        <Route path="pages" element={<ProtectedRoute roles={['ADMIN', 'CONTENT_MANAGER']}><StaticPages /></ProtectedRoute>} />
        <Route path="coupons" element={<ProtectedRoute roles={['ADMIN']}><Coupons /></ProtectedRoute>} />
        <Route path="tax" element={<ProtectedRoute roles={['ADMIN']}><Tax /></ProtectedRoute>} />
        <Route path="reviews" element={<ProtectedRoute roles={['ADMIN', 'CONTENT_MANAGER']}><Reviews /></ProtectedRoute>} />
        <Route path="branding" element={<ProtectedRoute roles={['ADMIN', 'CONTENT_MANAGER']}><Branding /></ProtectedRoute>} />
        <Route path="config/site" element={<ProtectedRoute roles={['SUPER_ADMIN']}><SiteConfig /></ProtectedRoute>} />
        <Route path="config/smtp" element={<ProtectedRoute roles={['SUPER_ADMIN']}><SmtpConfig /></ProtectedRoute>} />
        <Route path="config/mobile" element={<ProtectedRoute roles={['ADMIN']}><MobileConfig /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="roles" element={<ProtectedRoute roles={['SUPER_ADMIN']}><Roles /></ProtectedRoute>} />
        <Route path="audit-log" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AuditLog /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
