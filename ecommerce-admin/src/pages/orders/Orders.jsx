import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import DataTable from '../../components/DataTable';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
}
function formatDate(v) { return v ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(v)) : ''; }

const STATUS_TONES = {
  PENDING: 'badge-warning', CONFIRMED: 'badge-emerald', PROCESSING: 'badge-emerald',
  SHIPPED: 'badge-emerald', DELIVERED: 'badge-success', CANCELLED: 'badge-danger', REFUNDED: 'badge-danger'
};

export default function Orders() {
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => { orderApi.getAll(page, 20).then(setResult); }, [page]);

  const columns = [
    { key: 'orderNumber', label: 'Order #', render: (o) => <Link to={`/orders/${o.id}`} className="mono">{o.orderNumber}</Link> },
    { key: 'createdAt', label: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'items', label: 'Items', render: (o) => o.items.length },
    { key: 'totalAmount', label: 'Total', render: (o) => formatCurrency(o.totalAmount) },
    { key: 'status', label: 'Status', render: (o) => <span className={`badge ${STATUS_TONES[o.status] || ''}`}>{o.status}</span> }
  ];

  return (
    <div>
      <div className="page-head"><div><h1>Orders</h1><p>Every order placed on the storefront.</p></div></div>
      <DataTable columns={columns} rows={result?.content} emptyMessage={result ? 'No orders yet.' : 'Loading…'} />
      {result?.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: 'var(--text-sm)' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {result.totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={page >= result.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
