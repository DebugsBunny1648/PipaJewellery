import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { roleApi } from '../../api/roleApi';
import { showToast } from '../../store/slices/uiSlice';

export default function Roles() {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const [saving, setSaving] = useState(false);

  function refresh() { roleApi.getAll().then(setRoles); }
  useEffect(() => { refresh(); roleApi.getAllPermissions().then(setPermissions); }, []);

  function openRole(role) {
    setSelectedRole(role);
    setChecked(new Set(role.permissionIds || []));
  }

  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await roleApi.updatePermissions(selectedRole.id, Array.from(checked));
      dispatch(showToast('Permissions updated', 'success'));
      refresh();
    } finally { setSaving(false); }
  }

  const grouped = permissions.reduce((acc, p) => {
    (acc[p.module] = acc[p.module] || []).push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-head"><div><h1>Roles & Permissions</h1><p>SUPER_ADMIN always has full access regardless of assigned permissions.</p></div></div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {(roles || []).map((r) => (
            <button key={r.id} className="btn-ghost" style={{ textAlign: 'left', background: selectedRole?.id === r.id ? 'var(--color-primary-tint)' : 'none' }} onClick={() => openRole(r)}>
              {r.name}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          {!selectedRole ? (
            <div className="empty-state">Select a role to manage its permissions.</div>
          ) : permissions.length === 0 ? (
            <div className="empty-state">No permissions have been created yet. Seed some via the API or database to populate this list.</div>
          ) : (
            <>
              <h3 style={{ marginBottom: '1rem' }}>{selectedRole.name}</h3>
              {Object.entries(grouped).map(([module, perms]) => (
                <div key={module} style={{ marginBottom: '1rem' }}>
                  <div className="eyebrow" style={{ marginBottom: '0.4rem' }}>{module}</div>
                  {perms.map((p) => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0' }}>
                      <input type="checkbox" checked={checked.has(p.id)} onChange={() => toggle(p.id)} /> {p.code}
                    </label>
                  ))}
                </div>
              ))}
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Permissions'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
