import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminUserApi } from '../../api/adminUserApi';
import { roleApi } from '../../api/roleApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(null);

  function refresh() { adminUserApi.getAll().then(setUsers); }
  useEffect(() => { refresh(); roleApi.getAll().then(setRoles); }, []);

  async function toggleStatus(u) { await adminUserApi.updateStatus(u.id, !u.active); refresh(); }
  async function handleDelete(u) {
    if (!confirm(`Delete admin user "${u.username}"?`)) return;
    await adminUserApi.remove(u.id);
    dispatch(showToast('Admin user deleted', 'success'));
    refresh();
  }

  const columns = [
    { key: 'username', label: 'Username', render: (u) => <span className="mono">{u.username}</span> },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (u) => <span className="badge">{roles.find((r) => r.id === u.roleId)?.name || '—'}</span> },
    { key: 'active', label: 'Status', render: (u) => <StatusBadge active={u.active} /> },
    { key: 'actions', label: '', render: (u) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setEditing(u)}>Edit</button>
        <button className="btn-ghost btn-sm" onClick={() => toggleStatus(u)}>{u.active ? 'Deactivate' : 'Activate'}</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(u)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Admin Users</h1><p>Back-office accounts with role-based access.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Admin</button>
      </div>
      <DataTable columns={columns} rows={users} emptyMessage={users ? 'No admin users yet.' : 'Loading…'} />
      {editing !== null && (
        <AdminUserFormModal user={editing.id ? editing : null} roles={roles} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Admin user saved', 'success')); refresh(); }} />
      )}
    </div>
  );
}

function AdminUserFormModal({ user, roles, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '', fullName: user?.fullName || '', phone: user?.phone || '' });
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(user?.roleId || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) await adminUserApi.update(user.id, form, roleId || undefined);
      else await adminUserApi.create(form, password, roleId);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save admin user');
    } finally { setSaving(false); }
  }

  return (
    <Modal title={isEdit ? 'Edit Admin User' : 'New Admin User'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: 'var(--color-danger-tint)', color: 'var(--color-danger)', padding: '0.6rem 0.9rem', borderRadius: 6, fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>{error}</div>}
        {!isEdit && (
          <div className="form-grid">
            <div className="field"><label>Username</label><input className="input" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div className="field"><label>Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
        )}
        <div className="form-grid">
          <div className="field"><label>Full Name</label><input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        {!isEdit && (
          <div className="field"><label>Password</label><input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        )}
        <div className="field"><label>Role</label>
          <select className="input" required value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            <option value="">Select a role…</option>
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
