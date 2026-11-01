import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' }
];

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [gender, setGender] = useState('');
  const [occasion, setOccasion] = useState('');

  useEffect(() => { categoryApi.getTree().then(setCategories).catch(() => setCategories([])); }, []);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  useEffect(() => {
    setResult(null);
    productApi.search({
      keyword: keyword || undefined,
      categoryId: activeCategory?.id,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      gender: gender || undefined,
      occasion: occasion || undefined,
      sortBy,
      page,
      size: 12
    }).then(setResult).catch(() => setResult({ content: [], totalPages: 0 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, activeCategory, keyword, sortBy, minPrice, maxPrice, gender, occasion, page]);

  const title = activeCategory?.name || (keyword ? `Results for "${keyword}"` : 'All Jewellery');

  return (
    <div className="container shop-page">
      <div className="shop-page__head">
        <h1>{title}</h1>
        {result && <span className="shop-page__count">{result.totalElements} pieces</span>}
      </div>

      <div className="shop-page__layout">
        <aside className="shop-filters">
          <div className="shop-filters__group">
            <h4>Categories</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <a href={`/category/${c.slug}`} className={c.slug === categorySlug ? 'is-active' : ''}>{c.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="shop-filters__group">
            <h4>Price</h4>
            <div className="shop-filters__price-row">
              <input className="input" type="number" placeholder="Min" value={minPrice} onChange={(e) => { setPage(0); setMinPrice(e.target.value); }} />
              <input className="input" type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setPage(0); setMaxPrice(e.target.value); }} />
            </div>
          </div>
          <div className="shop-filters__group">
            <h4>Gender</h4>
            <select className="input" value={gender} onChange={(e) => { setPage(0); setGender(e.target.value); }}>
              <option value="">Any</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div className="shop-filters__group">
            <h4>Occasion</h4>
            <select className="input" value={occasion} onChange={(e) => { setPage(0); setOccasion(e.target.value); }}>
              <option value="">Any</option>
              <option value="Bridal">Bridal</option>
              <option value="Festive">Festive</option>
              <option value="Daily Wear">Daily Wear</option>
              <option value="Gifting">Gifting</option>
            </select>
          </div>
        </aside>

        <div className="shop-results">
          <div className="shop-results__toolbar">
            <select className="input" value={sortBy} onChange={(e) => { setPage(0); setSortBy(e.target.value); }}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {!result ? (
            <ProductGridSkeleton />
          ) : result.content.length === 0 ? (
            <EmptyState title="No pieces match those filters" message="Try widening your price range or clearing a filter." />
          ) : (
            <>
              <div className="product-grid">
                {result.content.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {result.totalPages > 1 && (
                <div className="shop-pagination">
                  <button className="btn btn-outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <span>Page {page + 1} of {result.totalPages}</span>
                  <button className="btn btn-outline" disabled={page >= result.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
