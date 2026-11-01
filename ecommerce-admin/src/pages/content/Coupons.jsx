import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { couponApi } from '../../api/couponApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

const BLANK = { code: '', description: '', discountType: 'PERCENTAGE', discountValue: '', maxDiscountAmount: '', minOrderValue: '', usageLimitTotal: '', usageLimitPerCustomer: '', startDate: '', endDate: '' };

export default function Coupons() {
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState(null);
  const [editing, setEditing] = useState(null);

  function refresh() { couponApi.getAll().then(setCoupons); }
  useEffect(refresh, []);

  async function handleDelete(c) {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    await couponApi.remove(c.id);
    dispatch(showToast('Coupon deleted', 'success'));
    refresh();
  }

  const columns = [
    { key: 'code', label: 'Code', render: (c) => <span className="mono" style={{ fontWeight: 700 }}>{c.code}</span> },
    { key: 'discountType', label: 'Type' },
    { key: 'discountValue', label: 'Value', render: (c) => c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}` },
    { key: 'usedCount', label: 'Used', render: (c) => `${c.usedCount}${c.usageLimitTotal ? ` / ${c.usageLimitTotal}` : ''}` },
    { key: 'endDate', label: 'Expires', render: (c) => c.endDate ? new Date(c.endDate).toLocaleDateString() : 'Never' },
    { key: 'actions', label: '', render: (c) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setEditing(c)}>Edit</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(c)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Coupons & Offers</h1><p>Discount codes customers can apply at cart.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Coupon</button>
      </div>
      <DataTable columns={columns} rows={coupons} emptyMessage={coupons ? 'No coupons yet.' : 'Loading…'} />
      {editing !== null && (
        <CouponFormModal coupon={editing.id ? editing : null} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Coupon saved', 'success')); refresh(); }} />
      )}
    </div>
  );
}

function CouponFormModal({ coupon, onClose, onSaved }) {
  const isEdit = Boolean(coupon);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...coupon } : BLANK);
  const [saving, setSaving] = useState(false);
  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
        usageLimitTotal: form.usageLimitTotal ? Number(form.usageLimitTotal) : null,
        usageLimitPerCustomer: form.usageLimitPerCustomer ? Number(form.usageLimitPerCustomer) : null
      };
      if (isEdit) await couponApi.update(coupon.id, payload);
      else await couponApi.create(payload);
      onSaved();
    } finally { setSaving(false); }
  }

  return (
    <Modal title={isEdit ? 'Edit Coupon' : 'New Coupon'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field"><label>Code</label><input className="input" required value={form.code} onChange={(e) => update('code', e.target.value.toUpperCase())} /></div>
          <div className="field"><label>Type</label>
            <select className="input" value={form.discountType} onChange={(e) => update('discountType', e.target.value)}>
              <option value="PERCENTAGE">Percentage</option><option value="FLAT">Flat Amount</option>
            </select>
          </div>
          <div className="field"><label>Value</label><input className="input" type="number" required value={form.discountValue} onChange={(e) => update('discountValue', e.target.value)} /></div>
          <div className="field"><label>Max Discount (for %)</label><input className="input" type="number" value={form.maxDiscountAmount} onChange={(e) => update('maxDiscountAmount', e.target.value)} /></div>
          <div className="field"><label>Min Order Value</label><input className="input" type="number" value={form.minOrderValue} onChange={(e) => update('minOrderValue', e.target.value)} /></div>
          <div className="field"><label>Usage Limit (total)</label><input className="input" type="number" value={form.usageLimitTotal} onChange={(e) => update('usageLimitTotal', e.target.value)} /></div>
          <div className="field"><label>Start Date</label><input className="input" type="date" value={form.startDate?.slice(0, 10) || ''} onChange={(e) => update('startDate', e.target.value)} /></div>
          <div className="field"><label>End Date</label><input className="input" type="date" value={form.endDate?.slice(0, 10) || ''} onChange={(e) => update('endDate', e.target.value)} /></div>
          <div className="field field--full"><label>Description</label><input className="input" value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
