import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productApi } from '../api/productApi';
import { reviewApi } from '../api/reviewApi';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { showToast } from '../store/slices/uiSlice';
import ProductCard from '../components/ProductCard';
import QuantityStepper from '../components/QuantityStepper';
import RatingStars from '../components/RatingStars';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const customer = useSelector((s) => s.auth.customer);
  const wishlistIds = useSelector((s) => s.wishlist.items.map((p) => p.id));

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setProduct(null);
    productApi.getBySlug(slug).then((p) => {
      setProduct(p);
      setActiveImage(0);
      productApi.getRelated(p.id).then(setRelated).catch(() => setRelated([]));
      reviewApi.getByProduct(p.id).then(setReviews).catch(() => setReviews([]));

      // Track for the "Recently Viewed Products" CMS section
      try {
        const seen = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter((id) => id !== p.id);
        localStorage.setItem('recentlyViewed', JSON.stringify([p.id, ...seen].slice(0, 12)));
      } catch { /* ignore */ }
    });
  }, [slug]);

  if (!product) return <Loader label="Loading piece…" />;

  const isWishlisted = wishlistIds.includes(product.id);
  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const outOfStock = product.stockQuantity <= 0;

  async function handleAddToCart() {
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      dispatch(showToast('Added to cart', 'success'));
    } catch {
      dispatch(showToast('Could not add to cart', 'error'));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="container product-detail">
      <div className="product-detail__grid">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} />
            ) : <div className="product-card__placeholder" style={{ height: '100%' }} />}
          </div>
          {product.images?.length > 1 && (
            <div className="product-detail__thumbs">
              {product.images.map((img, i) => (
                <button key={img} className={i === activeImage ? 'is-active' : ''} onClick={() => setActiveImage(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          <span className="eyebrow">{product.categoryName}</span>
          <h1>{product.name}</h1>
          {reviews.length > 0 && (
            <div className="product-detail__rating">
              <RatingStars value={avgRating} /> <span>{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="product-detail__price-row">
            <span className="price product-detail__price">{formatCurrency(product.finalPrice)}</span>
            {hasDiscount && <span className="price product-detail__price--was">{formatCurrency(product.price)}</span>}
          </div>

          {product.shortDescription && <p className="product-detail__short">{product.shortDescription}</p>}

          {Object.keys(product.attributes || {}).length > 0 && (
            <table className="product-detail__specs">
              <tbody>
                {Object.entries(product.attributes).map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="product-detail__stock">
            {outOfStock ? <span className="badge badge-danger">Out of stock</span> : <span className="badge badge-emerald">In stock</span>}
          </div>

          <div className="product-detail__actions">
            <QuantityStepper value={quantity} onChange={setQuantity} max={Math.max(1, product.stockQuantity)} />
            <button className="btn btn-primary" disabled={outOfStock || adding} onClick={handleAddToCart}>
              {adding ? 'Adding…' : 'Add to Cart'}
            </button>
            {customer && (
              <button
                className="btn btn-outline"
                onClick={() => dispatch(toggleWishlist(product.id))}
              >
                {isWishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
              </button>
            )}
          </div>

          {product.certificateInfo && (
            <p className="product-detail__certificate">🛡 {product.certificateInfo}</p>
          )}

          {product.longDescription && (
            <div className="product-detail__long">
              <h4>Details</h4>
              <p>{product.longDescription}</p>
            </div>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="product-detail__reviews">
          <h3>Customer Reviews</h3>
          {reviews.map((r) => (
            <div key={r.id} className="product-detail__review">
              <RatingStars value={r.rating} />
              {r.title && <strong>{r.title}</strong>}
              <p>{r.comment}</p>
              <span className="product-detail__review-date">{formatDate(r.createdAt)}</span>
            </div>
          ))}
        </section>
      )}

      {related.length > 0 && (
        <section className="cms-section">
          <div className="cms-section__head"><h2>You may also like</h2></div>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
