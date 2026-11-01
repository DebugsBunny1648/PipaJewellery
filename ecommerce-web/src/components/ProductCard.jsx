import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { formatCurrency } from '../utils/format';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistIds = useSelector((s) => s.wishlist.items.map((p) => p.id));
  const isWishlisted = wishlistIds.includes(product.id);
  const customer = useSelector((s) => s.auth.customer);
  const image = product.images?.[0];
  const hasDiscount = product.discountPrice && Number(product.discountPrice) < Number(product.price);

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__media">
        {image ? <img src={image} alt={product.name} loading="lazy" /> : <div className="product-card__placeholder" />}
        <span className="product-card__sweep" aria-hidden="true" />
        {product.newArrival && <span className="badge product-card__tag">New</span>}
        {customer && (
          <button
            type="button"
            className={`product-card__wishlist ${isWishlisted ? 'is-active' : ''}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={(e) => { e.preventDefault(); dispatch(toggleWishlist(product.id)); }}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
        )}
      </Link>
      <div className="product-card__body">
        <div className="eyebrow">{product.categoryName}</div>
        <Link to={`/product/${product.slug}`} className="product-card__name">{product.name}</Link>
        <div className="product-card__price-row">
          <span className="price product-card__price">{formatCurrency(product.finalPrice)}</span>
          {hasDiscount && <span className="price product-card__price--was">{formatCurrency(product.price)}</span>}
        </div>
      </div>
    </article>
  );
}
