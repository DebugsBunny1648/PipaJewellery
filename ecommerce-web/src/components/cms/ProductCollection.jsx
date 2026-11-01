import { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import ProductCard from '../ProductCard';
import { ProductGridSkeleton } from '../Loader';
import './cms.css';

const FETCHERS = {
  featured: productApi.getFeatured,
  'new-arrivals': productApi.getNewArrivals,
  'best-sellers': productApi.getBestSellers
};

export default function ProductCollection({ section, source, horizontal = false }) {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    if (source === 'recently-viewed') {
      try {
        const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        Promise.all(ids.slice(0, 8).map((id) => productApi.getById(id).catch(() => null)))
          .then((results) => setProducts(results.filter(Boolean)));
      } catch { setProducts([]); }
      return;
    }
    const fetcher = FETCHERS[source] || productApi.getFeatured;
    fetcher().then(setProducts).catch(() => setProducts([]));
  }, [source]);

  if (products && products.length === 0) return null;

  return (
    <section className="cms-section container">
      <div className="cms-section__head">
        <h2>{section.title || defaultTitle(source)}</h2>
        {section.subtitle && <p>{section.subtitle}</p>}
      </div>
      {!products ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className={horizontal ? 'product-row' : 'product-grid'}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

function defaultTitle(source) {
  switch (source) {
    case 'new-arrivals': return 'New Arrivals';
    case 'best-sellers': return 'Best Sellers';
    case 'recently-viewed': return 'Recently Viewed';
    default: return 'Featured Pieces';
  }
}
