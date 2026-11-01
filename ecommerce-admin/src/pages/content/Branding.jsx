import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { brandingApi } from '../../api/brandingApi';
import { showToast } from '../../store/slices/uiSlice';

const BLANK = { platform: 'BOTH', siteName: '', tagline: '', logoUrl: '', faviconUrl: '', darkModeLogoUrl: '', primaryColor: '', secondaryColor: '', accentColor: '', fontFamily: '' };

export default function Branding() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    brandingApi.getAll().then((list) => { if (list[0]) setForm({ ...BLANK, ...list[0] }); });
  }, []);

  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await brandingApi.upsert(form);
      dispatch(showToast('Branding saved', 'success'));
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="page-head"><div><h1>Branding & Logos</h1><p>Controls the logo, colors, and typography shown across web and mobile.</p></div></div>
      <form className="card" style={{ padding: '1.5rem', maxWidth: 640 }} onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field"><label>Platform</label>
            <select className="input" value={form.platform} onChange={(e) => update('platform', e.target.value)}>
              <option value="BOTH">Web & Mobile</option><option value="WEB">Web only</option><option value="MOBILE">Mobile only</option>
            </select>
          </div>
          <div className="field"><label>Site Name</label><input className="input" value={form.siteName} onChange={(e) => update('siteName', e.target.value)} /></div>
          <div className="field field--full"><label>Tagline</label><input className="input" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} /></div>
          <div className="field"><label>Logo URL</label><input className="input" value={form.logoUrl} onChange={(e) => update('logoUrl', e.target.value)} /></div>
          <div className="field"><label>Favicon URL</label><input className="input" value={form.faviconUrl} onChange={(e) => update('faviconUrl', e.target.value)} /></div>
          <div className="field"><label>Primary Color</label><input className="input" type="text" placeholder="#0F3D30" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} /></div>
          <div className="field"><label>Secondary Color</label><input className="input" placeholder="#AD8548" value={form.secondaryColor} onChange={(e) => update('secondaryColor', e.target.value)} /></div>
          <div className="field"><label>Accent Color</label><input className="input" value={form.accentColor} onChange={(e) => update('accentColor', e.target.value)} /></div>
          <div className="field"><label>Font Family</label><input className="input" value={form.fontFamily} onChange={(e) => update('fontFamily', e.target.value)} /></div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Branding'}</button>
      </form>
    </div>
  );
}
