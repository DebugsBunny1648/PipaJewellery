import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { mobileConfigApi } from '../../api/mobileConfigApi';
import { showToast } from '../../store/slices/uiSlice';

export default function MobileConfig() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { mobileConfigApi.get().then(setForm); }, []);

  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await mobileConfigApi.update(form);
      dispatch(showToast('Mobile app config saved', 'success'));
    } finally { setSaving(false); }
  }

  if (!form) return <div className="empty-state">Loading…</div>;

  return (
    <div>
      <div className="page-head"><div><h1>Mobile App Configuration</h1><p>Force-update, maintenance mode, and app store links for the React Native app.</p></div></div>
      <form className="card" style={{ padding: '1.5rem', maxWidth: 640 }} onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field"><label>App Name</label><input className="input" value={form.appName || ''} onChange={(e) => update('appName', e.target.value)} /></div>
          <div className="field"></div>
          <div className="field"><label>Android Version</label><input className="input" value={form.appVersionAndroid || ''} onChange={(e) => update('appVersionAndroid', e.target.value)} /></div>
          <div className="field"><label>iOS Version</label><input className="input" value={form.appVersionIos || ''} onChange={(e) => update('appVersionIos', e.target.value)} /></div>
          <div className="field"><label>Android Store URL</label><input className="input" value={form.androidStoreUrl || ''} onChange={(e) => update('androidStoreUrl', e.target.value)} /></div>
          <div className="field"><label>iOS Store URL</label><input className="input" value={form.iosStoreUrl || ''} onChange={(e) => update('iosStoreUrl', e.target.value)} /></div>
          <div className="field field--full"><label>Maintenance Message</label><textarea className="input" rows={2} value={form.maintenanceMessage || ''} onChange={(e) => update('maintenanceMessage', e.target.value)} /></div>
        </div>
        <div className="checkbox-field">
          <label><input type="checkbox" checked={!!form.forceUpdateAndroid} onChange={(e) => update('forceUpdateAndroid', e.target.checked)} /> Force update (Android)</label>
          <label><input type="checkbox" checked={!!form.forceUpdateIos} onChange={(e) => update('forceUpdateIos', e.target.checked)} /> Force update (iOS)</label>
          <label><input type="checkbox" checked={!!form.maintenanceMode} onChange={(e) => update('maintenanceMode', e.target.checked)} /> Maintenance mode</label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </form>
    </div>
  );
}
