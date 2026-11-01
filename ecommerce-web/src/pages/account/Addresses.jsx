import { useEffect, useState } from 'react';
import { addressApi } from '../../api/addressApi';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';

const BLANK = { label: 'Home', recipientName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '', default: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);

  function refresh() { addressApi.getAll().then(setAddresses); }
  useEffect(refresh, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await addressApi.create(form);
    setForm(BLANK);
    setShowForm(false);
    refresh();
  }

  if (!addresses) return <Loader label="Loading addresses…" />;

  return (
    <div>
      <h1>Your Addresses</h1>
      {addresses.length === 0 && !showForm && (
        <EmptyState title="No saved addresses" message="Add one to speed up checkout." />
      )}
      <div className="order-list" style={{ marginBottom: 'var(--space-4)' }}>
        {addresses.map((a) => (
          <div key={a.id} className="card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{a.recipientName}</strong> <span className="badge">{a.label}</span>
              <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)', margin: '0.3rem 0 0' }}>
                {a.addressLine1}, {a.city}, {a.state} {a.pincode}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {a.default && <span className="badge badge-emerald">Default</span>}
              <button className="btn-ghost" onClick={() => addressApi.setDefault(a.id).then(refresh)}>Set default</button>
              <button className="btn-ghost" onClick={() => addressApi.remove(a.id).then(refresh)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button className="btn btn-outline" onClick={() => setShowForm(true)}>+ Add new address</button>
      ) : (
        <form className="card" style={{ padding: '1.5rem', maxWidth: 480 }} onSubmit={handleSubmit}>
          <div className="field"><label>Label</label><input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
          <div className="field"><label>Full name</label><input className="input" required value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} /></div>
          <div className="field"><label>Phone</label><input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field"><label>Address line 1</label><input className="input" required value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} /></div>
          <div className="field"><label>City</label><input className="input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="field"><label>State</label><input className="input" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div className="field"><label>Pincode</label><input className="input" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
          <button className="btn btn-primary" type="submit">Save address</button>
        </form>
      )}
    </div>
  );
}
