import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_LABELS = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', PROCESSING: 'Processing', SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for delivery', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return requested', RETURNED: 'Returned', REFUNDED: 'Refunded'
};

export default function Orders() {
  const [result, setResult] = useState(null);

  useEffect(() => { orderApi.getMyOrders().then(setResult).catch(() => setResult({ content: [] })); }, []);

  if (!result) return <Loader label="Loading orders…" />;
  if (result.content.length === 0) {
    return <EmptyState title="No orders yet" message="Once you place an order it'll show up here." actionLabel="Start shopping" actionTo="/shop" />;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      <div className="order-list">
        {result.content.map((o) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="order-list__item card">
            <div>
              <strong>{o.orderNumber}</strong>
              <p>{formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
            </div>
            <span className="badge badge-emerald">{STATUS_LABELS[o.status] || o.status}</span>
            <span className="price">{formatCurrency(o.totalAmount)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
