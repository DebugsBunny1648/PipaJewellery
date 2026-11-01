import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { taxApi } from '../../api/taxApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const BLANK = { name: '', percentage: '', country: '', state: '' };

export default function Tax() {
  const dispatch = useDispatch();
  const [taxes, setTaxes] = useState(null);
  const [editing, setEditing] = useState(null);

  function refresh() { taxApi.getAll().then(setTaxes); }
  useEffect(refresh, []);

  async function handleDelete(t) {
    if (!confirm(`Delete tax rule "${t.name}"?`)) return;
    await taxApi.remove(t.id);
    dispatch(showToast('Tax rule deleted', 'success'));
    refresh();
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'percentage', label: 'Rate', render: (t) => `${t.percentage}%` },
    { key: 'country', label: 'Country' },
    { key: 'state', label: 'State' },
    { key: 'actions', label: '', render: (t) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setEditing(t)}>Edit</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(t)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Tax Rules</h1><p>Applied to products by category, country, or state.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Rule</button>
      </div>
      <DataTable columns={columns} rows={taxes} emptyMessage={taxes ? 'No tax rules yet.' : 'Loading…'} />
      {editing !== null && (
        <TaxFormModal tax={editing.id ? editing : null} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Tax rule saved', 'success')); refresh(); }} />
      )}
    </div>
  );
}

function TaxFormModal({ tax, onClose, onSaved }) {
  const isEdit = Boolean(tax);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...tax } : BLANK);
  const [saving, setSaving] = useState(false);
  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, percentage: Number(form.percentage) };
      if (isEdit) await taxApi.update(tax.id, payload);
      else await taxApi.create(payload);
      onSaved();
    } finally { setSaving(false); }
  }

  return (
    <Modal title={isEdit ? 'Edit Tax Rule' : 'New Tax Rule'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Name (e.g. GST, VAT)</label><input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
        <div className="field"><label>Percentage</label><input className="input" type="number" step="0.01" required value={form.percentage} onChange={(e) => update('percentage', e.target.value)} /></div>
        <div className="form-grid">
          <div className="field"><label>Country</label><input className="input" value={form.country} onChange={(e) => update('country', e.target.value)} /></div>
          <div className="field"><label>State</label><input className="input" value={form.state} onChange={(e) => update('state', e.target.value)} /></div>
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
