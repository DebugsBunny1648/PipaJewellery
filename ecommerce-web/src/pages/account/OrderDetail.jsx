import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { showToast } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import { formatCurrency, formatDate } from '../../utils/format';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  useEffect(() => { orderApi.getById(id).then(setOrder); }, [id]);

  async function handleCancel() {
    try {
      const updated = await orderApi.cancel(id);
      setOrder(updated);
      dispatch(showToast('Order cancelled', 'success'));
    } catch (err) {
      dispatch(showToast(err.response?.data?.message || 'Could not cancel order', 'error'));
    }
  }

  if (!order) return <Loader label="Loading order…" />;
  const cancellable = !['SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status);

  return (
    <div>
      <h1>Order {order.orderNumber}</h1>
      <p>Placed on {formatDate(order.createdAt)} · Status: <span className="badge badge-emerald">{order.status}</span></p>

      <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--color-line)' }}>
            <span>{item.productName} × {item.quantity}</span>
            <span className="price">{formatCurrency(item.totalPrice)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', fontWeight: 700 }}>
          <span>Total</span><span className="price">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      {cancellable && <button className="btn btn-danger" style={{ marginTop: '1.5rem' }} onClick={handleCancel}>Cancel order</button>}
    </div>
  );
}
