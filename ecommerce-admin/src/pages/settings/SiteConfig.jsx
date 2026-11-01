import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { siteConfigApi } from '../../api/siteConfigApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';

export default function SiteConfig() {
  const dispatch = useDispatch();
  const [configs, setConfigs] = useState(null);
  const [form, setForm] = useState({ key: '', value: '', group: 'GENERAL', description: '' });

  function refresh() { siteConfigApi.getAll().then(setConfigs); }
  useEffect(refresh, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await siteConfigApi.upsert(form.key, form.value, form.group, form.description);
    dispatch(showToast('Config saved', 'success'));
    setForm({ key: '', value: '', group: 'GENERAL', description: '' });
    refresh();
  }

  async function handleDelete(key) {
    if (!confirm(`Remove config "${key}"?`)) return;
    await siteConfigApi.remove(key);
    refresh();
  }

  const columns = [
    { key: 'configKey', label: 'Key', render: (c) => <span className="mono">{c.configKey}</span> },
    { key: 'configValue', label: 'Value' },
    { key: 'configGroup', label: 'Group' },
    { key: 'actions', label: '', render: (c) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setForm({ key: c.configKey, value: c.configValue, group: c.configGroup || 'GENERAL', description: c.description || '' })}>Edit</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(c.configKey)}>Remove</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head"><div><h1>Site Configuration</h1><p>General key/value settings surfaced publicly via <span className="mono">/api/app-config/site</span>.</p></div></div>

      <form className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }} onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field"><label>Key</label><input className="input" required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="e.g. store_currency" /></div>
          <div className="field"><label>Group</label>
            <select className="input" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
              <option value="GENERAL">General</option><option value="SEO">SEO</option><option value="SOCIAL">Social</option><option value="FEATURE_FLAG">Feature Flag</option>
            </select>
          </div>
          <div className="field field--full"><label>Value</label><input className="input" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
          <div className="field field--full"><label>Description</label><input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary" type="submit">Save Config</button>
      </form>

      <DataTable columns={columns} rows={configs} emptyMessage={configs ? 'No config values set yet.' : 'Loading…'} />
    </div>
  );
}
