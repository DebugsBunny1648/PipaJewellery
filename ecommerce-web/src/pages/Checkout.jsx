import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addressApi } from '../api/addressApi';
import { orderApi } from '../api/orderApi';
import { fetchCart } from '../store/slices/cartSlice';
import { showToast } from '../store/slices/uiSlice';
import { formatCurrency } from '../utils/format';
import Loader from '../components/Loader';
import './Checkout.css';

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NET_BANKING', label: 'Net Banking' }
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((s) => s.cart.cart);

  const [addresses, setAddresses] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState({
    recipientName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', country: 'India', pincode: '', default: true
  });

  useEffect(() => {
    dispatch(fetchCart());
    addressApi.getAll().then((list) => {
      setAddresses(list);
      const def = list.find((a) => a.default) || list[0];
      if (def) setSelectedAddressId(def.id);
      if (list.length === 0) setShowAddressForm(true);
    });
  }, [dispatch]);

  async function handleAddAddress(e) {
    e.preventDefault();
    const created = await addressApi.create(form);
    const updated = await addressApi.getAll();
    setAddresses(updated);
    setSelectedAddressId(created.id);
    setShowAddressForm(false);
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) { dispatch(showToast('Select a shipping address', 'error')); return; }
    setPlacing(true);
    try {
      const order = await orderApi.checkout({
        shippingAddressId: selectedAddressId,
        paymentMethod,
        customerNote: note
      });
      dispatch(showToast('Order placed successfully', 'success'));
      navigate(`/account/orders/${order.id}`);
    } catch (err) {
      dispatch(showToast(err.response?.data?.message || 'Could not place order', 'error'));
    } finally {
      setPlacing(false);
    }
  }

  if (!addresses) return <Loader label="Preparing checkout…" />;

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-page__layout">
        <div>
          <section className="card checkout-section">
            <h3>Shipping Address</h3>
            {addresses.map((a) => (
              <label key={a.id} className="checkout-address">
                <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} />
                <div>
                  <strong>{a.recipientName}</strong> <span className="checkout-address__label">{a.label}</span>
                  <p>{a.addressLine1}, {a.addressLine2 ? `${a.addressLine2}, ` : ''}{a.city}, {a.state} {a.pincode}</p>
                  <p>{a.phone}</p>
                </div>
              </label>
            ))}
            {!showAddressForm ? (
              <button className="btn btn-outline" onClick={() => setShowAddressForm(true)}>+ Add new address</button>
            ) : (
              <form className="checkout-address-form" onSubmit={handleAddAddress}>
                <div className="field"><label>Full name</label><input className="input" required value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} /></div>
                <div className="field"><label>Phone</label><input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="field"><label>Address line 1</label><input className="input" required value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} /></div>
                <div className="field"><label>Address line 2 (optional)</label><input className="input" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} /></div>
                <div className="checkout-address-form__row">
                  <div className="field"><label>City</label><input className="input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div className="field"><label>State</label><input className="input" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                  <div className="field"><label>Pincode</label><input className="input" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
                </div>
                <button className="btn btn-primary" type="submit">Save address</button>
              </form>
            )}
          </section>

          <section className="card checkout-section">
            <h3>Payment Method</h3>
            {PAYMENT_METHODS.map((m) => (
              <label key={m.value} className="checkout-payment-option">
                <input type="radio" name="payment" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                {m.label}
              </label>
            ))}
          </section>

          <section className="card checkout-section">
            <h3>Order Note (optional)</h3>
            <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift wrap, delivery instructions, etc." />
          </section>
        </div>

        <aside className="cart-summary card">
          <h3>Order Summary</h3>
          {cart.items.map((i) => (
            <div key={i.id} className="cart-summary__row"><span>{i.productName} × {i.quantity}</span><span className="price">{formatCurrency(i.lineTotal)}</span></div>
          ))}
          <hr className="divider" />
          <div className="cart-summary__row"><span>Subtotal</span><span className="price">{formatCurrency(cart.subtotal)}</span></div>
          {cart.discount > 0 && <div className="cart-summary__row cart-summary__row--discount"><span>Discount</span><span className="price">−{formatCurrency(cart.discount)}</span></div>}
          <div className="cart-summary__row cart-summary__row--total"><span>Total</span><span className="price">{formatCurrency(cart.total)}</span></div>
          <button className="btn btn-primary btn-block" disabled={placing} onClick={handlePlaceOrder} style={{ marginTop: '1rem' }}>
            {placing ? 'Placing order…' : 'Place Order'}
          </button>
        </aside>
      </div>
    </div>
  );
}
