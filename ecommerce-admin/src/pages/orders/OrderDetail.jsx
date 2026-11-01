import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { orderApi } from '../../api/orderApi';
import { showToast } from '../../store/slices/uiSlice';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUNDED'];

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [shipping, setShipping] = useState(null);
  const [payment, setPayment] = useState(null);
  const [trackingForm, setTrackingForm] = useState({ carrierName: '', trackingNumber: '', trackingUrl: '', currentStatus: 'SHIPPED' });

  function refresh() {
    orderApi.getById(id).then((o) => { setOrder(o); setStatus(o.status); });
    orderApi.getShipping(id).then(setShipping).catch(() => setShipping(null));
    orderApi.getPayment(id).then(setPayment).catch(() => setPayment(null));
  }
  useEffect(refresh, [id]);

  async function handleMarkPaid() {
    const updated = await orderApi.updatePaymentStatus(id, 'PAID', payment?.transactionId);
    setPayment(updated);
    dispatch(showToast('Payment marked as paid', 'success'));
  }

  async function handleRefund() {
    if (!order) return;
    if (!confirm(`Refund ${formatCurrency(order.totalAmount)} for this order?`)) return;
    const updated = await orderApi.refundPayment(id, order.totalAmount);
    setPayment(updated);
    dispatch(showToast('Refund processed', 'success'));
  }

  async function handleUpdateStatus() {
    setSaving(true);
    try {
      const updated = await orderApi.updateStatus(id, status, remarks);
      setOrder(updated);
      dispatch(showToast('Order status updated', 'success'));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTracking(e) {
    e.preventDefault();
    const updated = await orderApi.updateShipping(id, trackingForm);
    setShipping(updated);
    dispatch(showToast('Shipping info updated', 'success'));
  }

  if (!order) return <div className="empty-state">Loading order…</div>;

  return (
    <div>
      <div className="page-head"><div><h1>Order {order.orderNumber}</h1><p>Status: <span className="badge badge-emerald">{order.status}</span></p></div></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Items</h3>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-line)' }}>
              <span>{item.productName} × {item.quantity}</span>
              <span className="mono">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', fontWeight: 700 }}>
            <span>Total</span><span className="mono">{formatCurrency(order.totalAmount)}</span>
          </div>

          <div className="divider" />
          <h3 style={{ marginBottom: '1rem' }}>Shipping / Tracking</h3>
          <form onSubmit={handleSaveTracking} className="form-grid">
            <div className="field"><label>Carrier</label><input className="input" value={trackingForm.carrierName} onChange={(e) => setTrackingForm({ ...trackingForm, carrierName: e.target.value })} /></div>
            <div className="field"><label>Tracking Number</label><input className="input" value={trackingForm.trackingNumber} onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })} /></div>
            <div className="field field--full"><label>Tracking URL</label><input className="input" value={trackingForm.trackingUrl} onChange={(e) => setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })} /></div>
            <div className="field"><label>Shipping Status</label>
              <select className="input" value={trackingForm.currentStatus} onChange={(e) => setTrackingForm({ ...trackingForm, currentStatus: e.target.value })}>
                <option value="SHIPPED">Shipped</option><option value="IN_TRANSIT">In Transit</option><option value="DELIVERED">Delivered</option>
              </select>
            </div>
            <div className="field--full"><button className="btn btn-outline" type="submit">Save tracking info</button></div>
          </form>
          {shipping && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)' }}>Currently: {shipping.carrierName} — {shipping.trackingNumber} ({shipping.currentStatus})</p>}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Update Status</h3>
          <div className="field">
            <label>New Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field"><label>Remarks (optional)</label><textarea className="input" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} /></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleUpdateStatus} disabled={saving}>
            {saving ? 'Updating…' : 'Update Status'}
          </button>

          <div className="divider" />
          <h4 style={{ marginBottom: '0.6rem' }}>Status History</h4>
          {order.statusHistory?.map((h, i) => (
            <div key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)', padding: '0.3rem 0' }}>
              <strong>{h.status}</strong> — {h.remarks}
            </div>
          )) || <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-faint)' }}>No history recorded.</p>}
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Payment</h3>
        {!payment ? (
          <p style={{ color: 'var(--color-ink-faint)', fontSize: 'var(--text-sm)' }}>No payment record found for this order.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-emerald">{payment.method}</span>
            <span className={`badge ${payment.status === 'PAID' ? 'badge-success' : payment.status === 'FAILED' ? 'badge-danger' : 'badge-warning'}`}>{payment.status}</span>
            <span className="mono">{formatCurrency(payment.amount)}</span>
            {payment.transactionId && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)' }}>Txn: {payment.transactionId}</span>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {payment.status !== 'PAID' && payment.status !== 'REFUNDED' && (
                <button className="btn btn-outline btn-sm" onClick={handleMarkPaid}>Mark as Paid</button>
              )}
              {payment.status === 'PAID' && (
                <button className="btn btn-outline btn-sm" style={{ color: 'var(--color-danger)' }} onClick={handleRefund}>Refund</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
