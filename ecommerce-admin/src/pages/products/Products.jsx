import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { inventoryApi } from '../../api/inventoryApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ProductFormModal from './ProductFormModal';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
}

export default function Products() {
  const dispatch = useDispatch();
  const [result, setResult] = useState(null);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [imageTarget, setImageTarget] = useState(null);
  const [stockTarget, setStockTarget] = useState(null);

  function refresh() {
    productApi.search({ keyword: keyword || undefined, page, size: 20, sortBy: 'newest' }).then(setResult);
  }

  useEffect(() => { categoryApi.getAll().then(setCategories); }, []);
  useEffect(refresh, [keyword, page]);

  async function handleToggleStatus(product) {
    await productApi.updateStatus(product.id, !product.active);
    dispatch(showToast(`Product ${product.active ? 'deactivated' : 'activated'}`, 'success'));
    refresh();
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    await productApi.remove(product.id);
    dispatch(showToast('Product deleted', 'success'));
    refresh();
  }

  async function handleSaved() {
    setEditing(null);
    dispatch(showToast('Product saved', 'success'));
    refresh();
  }

  const columns = [
    {
      key: 'name', label: 'Product', render: (p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} /> : <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--color-surface-sunken)' }} />}
          <div>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--color-ink-faint)' }}>{p.sku}</div>
          </div>
        </div>
      )
    },
    { key: 'categoryName', label: 'Category' },
    { key: 'finalPrice', label: 'Price', render: (p) => formatCurrency(p.finalPrice) },
    { key: 'stockQuantity', label: 'Stock', render: (p) => (
      <button type="button" className={`stock-pill ${p.stockQuantity <= 3 ? 'stock-pill--low' : ''}`} onClick={() => setStockTarget(p)}>
        {p.stockQuantity}
      </button>
    ) },
    { key: 'active', label: 'Status', render: (p) => <StatusBadge active={p.active} /> },
    {
      key: 'actions', label: '', render: (p) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn-ghost btn-sm" onClick={() => setEditing(p)}>Edit</button>
          <button className="btn-ghost btn-sm" onClick={() => setImageTarget(p)}>Images</button>
          <button className="btn-ghost btn-sm" onClick={() => handleToggleStatus(p)}>{p.active ? 'Deactivate' : 'Activate'}</button>
          <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(p)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Products</h1><p>Manage your catalog — jewellery today, any category tomorrow.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Product</button>
      </div>

      <div className="toolbar">
        <input className="input" style={{ maxWidth: 280 }} placeholder="Search products…" value={keyword} onChange={(e) => { setPage(0); setKeyword(e.target.value); }} />
      </div>

      <DataTable columns={columns} rows={result?.content} emptyMessage={result ? 'No products found.' : 'Loading…'} />

      {result?.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: 'var(--text-sm)' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {result.totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={page >= result.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {editing !== null && (
        <ProductFormModal
          product={editing.id ? editing : null}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      {imageTarget && (
        <ProductImagesModal product={imageTarget} onClose={() => { setImageTarget(null); refresh(); }} />
      )}

      {stockTarget && (
        <StockAdjustModal product={stockTarget} onClose={() => setStockTarget(null)} onSaved={() => { setStockTarget(null); refresh(); }} />
      )}
    </div>
  );
}

function StockAdjustModal({ product, onClose, onSaved }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.stockQuantity);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await inventoryApi.adjust(product.id, { stockQuantity: Number(quantity) });
      dispatch(showToast('Stock updated', 'success'));
      onSaved();
    } catch {
      dispatch(showToast('Could not update stock', 'error'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ width: 360 }}>
        <div className="modal__head"><h3>Adjust Stock — {product.name}</h3><button className="modal__close" onClick={onClose}>✕</button></div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Stock quantity</label>
            <input className="input" type="number" min={0} required value={quantity} onChange={(e) => setQuantity(e.target.value)} autoFocus />
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update Stock'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductImagesModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [images, setImages] = useState(product.images || []);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await productApi.addImage(product.id, file, images.length === 0);
      setImages(updated.images);
      dispatch(showToast('Image uploaded', 'success'));
    } catch {
      dispatch(showToast('Upload failed', 'error'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal__head"><h3>Images — {product.name}</h3><button className="modal__close" onClick={onClose}>✕</button></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
          {images.map((img) => (
            <img key={img} src={img} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }} />
          ))}
        </div>
        <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : '+ Upload image'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}
