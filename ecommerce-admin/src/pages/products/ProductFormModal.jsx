import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { productApi } from '../../api/productApi';
import { showToast } from '../../store/slices/uiSlice';
import Modal from '../../components/Modal';

const BLANK = {
  name: '', slug: '', sku: '', shortDescription: '', longDescription: '',
  categoryId: '', subcategoryId: '', brand: '', collectionName: '', productType: 'JEWELLERY',
  gender: '', occasion: '', price: '', discountPrice: '', makingCharges: '', taxPercentage: '',
  videoUrl: '', certificateInfo: '', featured: false, newArrival: false, bestSeller: false,
  seoTitle: '', seoDescription: '', seoKeywords: '', initialStockQuantity: 0, lowStockThreshold: 5
};

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(product);
  const [form, setForm] = useState(() => (isEdit
    ? { ...BLANK, ...product, categoryId: product.categoryId, subcategoryId: product.subcategoryId || '' }
    : BLANK));
  const [attributes, setAttributes] = useState(() =>
    Object.entries(product?.attributes || {}).map(([key, value]) => ({ key, value })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function updateAttribute(index, field, value) {
    setAttributes((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }
  function addAttributeRow() { setAttributes((rows) => [...rows, { key: '', value: '' }]); }
  function removeAttributeRow(index) { setAttributes((rows) => rows.filter((_, i) => i !== index)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || null,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        makingCharges: form.makingCharges ? Number(form.makingCharges) : null,
        taxPercentage: form.taxPercentage ? Number(form.taxPercentage) : null,
        initialStockQuantity: Number(form.initialStockQuantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        attributes: attributes.reduce((acc, row) => (row.key ? { ...acc, [row.key]: row.value } : acc), {})
      };
      if (isEdit) await productApi.update(product.id, payload);
      else await productApi.create(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Product' : 'New Product'} onClose={onClose} width={720}>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: 'var(--color-danger-tint)', color: 'var(--color-danger)', padding: '0.6rem 0.9rem', borderRadius: 6, fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>{error}</div>}

        <div className="form-grid">
          <div className="field field--full"><label>Name</label><input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
          <div className="field"><label>SKU</label><input className="input" required value={form.sku} onChange={(e) => update('sku', e.target.value)} /></div>
          <div className="field"><label>Slug (optional)</label><input className="input" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="auto-generated from name" /></div>

          <div className="field"><label>Category</label>
            <select className="input" required value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
              <option value="">Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Product Type</label>
            <select className="input" value={form.productType} onChange={(e) => update('productType', e.target.value)}>
              <option value="JEWELLERY">Jewellery</option>
              <option value="FASHION">Fashion</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="ACCESSORY">Accessory</option>
              <option value="HOME_DECOR">Home Decor</option>
              <option value="BEAUTY">Beauty</option>
              <option value="GENERIC">Generic</option>
            </select>
          </div>

          <div className="field"><label>Brand</label><input className="input" value={form.brand} onChange={(e) => update('brand', e.target.value)} /></div>
          <div className="field"><label>Collection</label><input className="input" value={form.collectionName} onChange={(e) => update('collectionName', e.target.value)} /></div>

          <div className="field"><label>Gender</label>
            <select className="input" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">—</option><option>Women</option><option>Men</option><option>Unisex</option>
            </select>
          </div>
          <div className="field"><label>Occasion</label>
            <select className="input" value={form.occasion} onChange={(e) => update('occasion', e.target.value)}>
              <option value="">—</option><option>Bridal</option><option>Festive</option><option>Daily Wear</option><option>Gifting</option>
            </select>
          </div>

          <div className="field"><label>Price</label><input className="input" type="number" step="0.01" required value={form.price} onChange={(e) => update('price', e.target.value)} /></div>
          <div className="field"><label>Discount Price</label><input className="input" type="number" step="0.01" value={form.discountPrice} onChange={(e) => update('discountPrice', e.target.value)} /></div>
          <div className="field"><label>Making Charges</label><input className="input" type="number" step="0.01" value={form.makingCharges} onChange={(e) => update('makingCharges', e.target.value)} /></div>
          <div className="field"><label>Tax %</label><input className="input" type="number" step="0.01" value={form.taxPercentage} onChange={(e) => update('taxPercentage', e.target.value)} /></div>

          {!isEdit && (
            <>
              <div className="field"><label>Initial Stock</label><input className="input" type="number" value={form.initialStockQuantity} onChange={(e) => update('initialStockQuantity', e.target.value)} /></div>
              <div className="field"><label>Low Stock Threshold</label><input className="input" type="number" value={form.lowStockThreshold} onChange={(e) => update('lowStockThreshold', e.target.value)} /></div>
            </>
          )}

          <div className="field field--full"><label>Short Description</label><textarea className="input" rows={2} value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} /></div>
          <div className="field field--full"><label>Long Description</label><textarea className="input" rows={3} value={form.longDescription} onChange={(e) => update('longDescription', e.target.value)} /></div>
          <div className="field field--full"><label>Certificate Info</label><input className="input" value={form.certificateInfo} onChange={(e) => update('certificateInfo', e.target.value)} /></div>

          <div className="checkbox-field field--full">
            <label><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured</label>
            <label><input type="checkbox" checked={form.newArrival} onChange={(e) => update('newArrival', e.target.checked)} /> New Arrival</label>
            <label><input type="checkbox" checked={form.bestSeller} onChange={(e) => update('bestSeller', e.target.checked)} /> Best Seller</label>
          </div>
        </div>

        <div className="divider" />
        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
          Dynamic Attributes <span style={{ fontWeight: 400, color: 'var(--color-ink-soft)' }}>(Material, Purity, Weight, RAM, Size — whatever fits the category)</span>
        </label>
        {attributes.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input className="input" placeholder="Attribute name" value={row.key} onChange={(e) => updateAttribute(i, 'key', e.target.value)} />
            <input className="input" placeholder="Value" value={row.value} onChange={(e) => updateAttribute(i, 'value', e.target.value)} />
            <button type="button" className="btn-ghost" onClick={() => removeAttributeRow(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addAttributeRow}>+ Add attribute</button>

        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</button>
        </div>
      </form>
    </Modal>
  );
}
