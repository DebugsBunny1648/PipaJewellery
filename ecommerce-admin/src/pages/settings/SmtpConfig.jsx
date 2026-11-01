import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { smtpConfigApi } from '../../api/smtpConfigApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const BLANK = { host: '', port: 587, username: '', password: '', useTls: true, useSsl: false, fromEmail: '', fromName: '', default: false };

export default function SmtpConfig() {
  const dispatch = useDispatch();
  const [configs, setConfigs] = useState(null);
  const [editing, setEditing] = useState(null);
  const [testEmail, setTestEmail] = useState('');

  function refresh() { smtpConfigApi.getAll().then(setConfigs); }
  useEffect(refresh, []);

  async function handleDelete(c) {
    if (!confirm(`Delete SMTP config "${c.host}"?`)) return;
    await smtpConfigApi.remove(c.id);
    refresh();
  }
  async function handleTest(c) {
    if (!testEmail) { dispatch(showToast('Enter a test email address first', 'error')); return; }
    await smtpConfigApi.test(c.id, testEmail);
    dispatch(showToast('Test email dispatched', 'success'));
  }

  const columns = [
    { key: 'host', label: 'Host', render: (c) => <span className="mono">{c.host}:{c.port}</span> },
    { key: 'fromEmail', label: 'From' },
    { key: 'default', label: 'Default', render: (c) => c.default ? <span className="badge badge-emerald">Default</span> : '' },
    { key: 'actions', label: '', render: (c) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setEditing(c)}>Edit</button>
        <button className="btn-ghost btn-sm" onClick={() => handleTest(c)}>Send test</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(c)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>SMTP Configuration</h1><p>Outbound mail settings for order confirmations, password resets, etc.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Config</button>
      </div>
      <div className="toolbar">
        <input className="input" style={{ maxWidth: 260 }} placeholder="Test email address" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
      </div>
      <DataTable columns={columns} rows={configs} emptyMessage={configs ? 'No SMTP configs yet.' : 'Loading…'} />
      {editing !== null && (
        <SmtpFormModal config={editing.id ? editing : null} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('SMTP config saved', 'success')); refresh(); }} />
      )}
    </div>
  );
}

function SmtpFormModal({ config, onClose, onSaved }) {
  const isEdit = Boolean(config);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...config } : BLANK);
  const [saving, setSaving] = useState(false);
  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, port: Number(form.port) };
      if (isEdit) await smtpConfigApi.update(config.id, payload);
      else await smtpConfigApi.create(payload);
      onSaved();
    } finally { setSaving(false); }
  }

  return (
    <Modal title={isEdit ? 'Edit SMTP Config' : 'New SMTP Config'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field"><label>Host</label><input className="input" required value={form.host} onChange={(e) => update('host', e.target.value)} /></div>
          <div className="field"><label>Port</label><input className="input" type="number" required value={form.port} onChange={(e) => update('port', e.target.value)} /></div>
          <div className="field"><label>Username</label><input className="input" value={form.username} onChange={(e) => update('username', e.target.value)} /></div>
          <div className="field"><label>Password</label><input className="input" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /></div>
          <div className="field"><label>From Email</label><input className="input" value={form.fromEmail} onChange={(e) => update('fromEmail', e.target.value)} /></div>
          <div className="field"><label>From Name</label><input className="input" value={form.fromName} onChange={(e) => update('fromName', e.target.value)} /></div>
        </div>
        <div className="checkbox-field">
          <label><input type="checkbox" checked={form.useTls} onChange={(e) => update('useTls', e.target.checked)} /> Use TLS</label>
          <label><input type="checkbox" checked={form.useSsl} onChange={(e) => update('useSsl', e.target.checked)} /> Use SSL</label>
          <label><input type="checkbox" checked={form.default} onChange={(e) => update('default', e.target.checked)} /> Set as default</label>
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
