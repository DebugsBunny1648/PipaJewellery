import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem, applyCoupon, removeCoupon, clearCouponError } from '../store/slices/cartSlice';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import { useState } from 'react';
import './Cart.css';

export default function Cart() {
  const dispatch = useDispatch();
  const { cart, status, couponError } = useSelector((s) => s.cart);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  if (status === 'loading' && !cart.items.length) return <Loader label="Loading your cart…" />;

  if (!cart.items.length) {
    return <EmptyState title="Your cart is empty" message="Explore the collection and find something worth keeping." actionLabel="Browse Jewellery" actionTo="/shop" />;
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      <div className="cart-page__layout">
        <div className="cart-page__items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              {item.productImage && <img src={item.productImage} alt={item.productName} />}
              <div className="cart-item__info">
                <span className="cart-item__name">{item.productName}</span>
                {item.variantLabel && <span className="cart-item__variant">{item.variantLabel}</span>}
                <span className="price">{formatCurrency(item.unitPrice)}</span>
              </div>
              <QuantityStepper value={item.quantity} onChange={(q) => dispatch(updateCartItem({ itemId: item.id, quantity: q }))} />
              <span className="price cart-item__total">{formatCurrency(item.lineTotal)}</span>
              <button className="btn-ghost" onClick={() => dispatch(removeCartItem(item.id))} aria-label="Remove item">✕</button>
            </div>
          ))}
        </div>

        <aside className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="cart-summary__row"><span>Subtotal</span><span className="price">{formatCurrency(cart.subtotal)}</span></div>
          {cart.discount > 0 && <div className="cart-summary__row cart-summary__row--discount"><span>Discount</span><span className="price">−{formatCurrency(cart.discount)}</span></div>}
          <hr className="divider" />
          <div className="cart-summary__row cart-summary__row--total"><span>Total</span><span className="price">{formatCurrency(cart.total)}</span></div>

          {cart.appliedCouponCode ? (
            <div className="cart-summary__coupon-applied">
              <span>Coupon "{cart.appliedCouponCode}" applied</span>
              <button className="btn-ghost" onClick={() => dispatch(removeCoupon())}>Remove</button>
            </div>
          ) : (
            <form className="cart-summary__coupon" onSubmit={(e) => { e.preventDefault(); dispatch(clearCouponError()); dispatch(applyCoupon(couponCode)); }}>
              <input className="input" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
              <button className="btn btn-outline" type="submit">Apply</button>
            </form>
          )}
          {couponError && <p className="field-error">{couponError}</p>}

          <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}
