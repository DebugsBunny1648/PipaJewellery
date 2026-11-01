import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { productApi } from '../../api/productApi';
import { reviewApi } from '../../api/reviewApi';
import { showToast } from '../../store/slices/uiSlice';

export default function Reviews() {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState('');
  const [reviews, setReviews] = useState(null);

  async function loadReviews(e) {
    e?.preventDefault();
    if (!productId) return;
    const list = await reviewApi.getByProduct(productId).catch(() => []);
    setReviews(list);
  }

  async function handleModerate(id, approved) {
    await reviewApi.approve(id, approved);
    dispatch(showToast(approved ? 'Review approved' : 'Review rejected', 'success'));
    loadReviews();
  }
  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    await reviewApi.remove(id);
    dispatch(showToast('Review deleted', 'success'));
    loadReviews();
  }

  return (
    <div>
      <div className="page-head"><div><h1>Reviews</h1><p>Look up a product by ID to moderate its reviews.</p></div></div>
      <form className="toolbar" onSubmit={loadReviews}>
        <input className="input" style={{ maxWidth: 220 }} placeholder="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} />
        <button className="btn btn-outline" type="submit">Load reviews</button>
      </form>

      {reviews && (reviews.length === 0 ? (
        <div className="empty-state">No approved reviews for this product yet (pending reviews still show here for moderation via the API, but note the public endpoint only returns approved ones — check the database directly for pending items in this scaffold).</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{r.title || 'Untitled'} — {r.rating}★</strong>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn-ghost btn-sm" onClick={() => handleModerate(r.id, true)}>Approve</button>
                  <button className="btn-ghost btn-sm" onClick={() => handleModerate(r.id, false)}>Reject</button>
                  <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
              <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--text-sm)' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
