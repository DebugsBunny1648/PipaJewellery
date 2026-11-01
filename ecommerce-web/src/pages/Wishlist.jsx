import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  if (status === 'loading') return <Loader label="Loading wishlist…" />;
  if (items.length === 0) {
    return <EmptyState title="Your wishlist is empty" message="Tap the heart on any piece to save it here." actionLabel="Browse Jewellery" actionTo="/shop" />;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-5) 0 var(--space-7)' }}>
      <h1 style={{ marginBottom: 'var(--space-4)' }}>Your Wishlist</h1>
      <div className="product-grid">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
