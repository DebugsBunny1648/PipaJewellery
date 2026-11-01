import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { categoryApi } from '../../api/categoryApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const BLANK = { parentId: '', name: '', slug: '', description: '', imageUrl: '', bannerUrl: '', sortOrder: 0 };

export default function Categories() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState(null);
  const [editing, setEditing] = useState(null);

  function refresh() { categoryApi.getAll().then(setCategories); }
  useEffect(refresh, []);

  async function handleToggleStatus(cat) {
    await categoryApi.updateStatus(cat.id, !cat.active);
    dispatch(showToast(`Category ${cat.active ? 'deactivated' : 'activated'}`, 'success'));
    refresh();
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    await categoryApi.remove(cat.id);
    dispatch(showToast('Category deleted', 'success'));
    refresh();
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug', render: (c) => <span className="mono">{c.slug}</span> },
    { key: 'parentId', label: 'Parent', render: (c) => categories?.find((p) => p.id === c.parentId)?.name || '—' },
    { key: 'sortOrder', label: 'Sort' },
    { key: 'active', label: 'Status', render: (c) => <StatusBadge active={c.active} /> },
    {
      key: 'actions', label: '', render: (c) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn-ghost btn-sm" onClick={() => setEditing(c)}>Edit</button>
          <button className="btn-ghost btn-sm" onClick={() => handleToggleStatus(c)}>{c.active ? 'Deactivate' : 'Activate'}</button>
          <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(c)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Categories</h1><p>Hierarchical catalog structure — supports parent/child nesting.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Category</button>
      </div>
      <DataTable columns={columns} rows={categories} emptyMessage={categories ? 'No categories yet.' : 'Loading…'} />
      {editing !== null && (
        <CategoryFormModal
          category={editing.id ? editing : null}
          categories={categories || []}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Category saved', 'success')); refresh(); }}
        />
      )}
    </div>
  );
}

function CategoryFormModal({ category, categories, onClose, onSaved }) {
  const isEdit = Boolean(category);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...category, parentId: category.parentId || '' } : BLANK);
  const [saving, setSaving] = useState(false);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, parentId: form.parentId || null, sortOrder: Number(form.sortOrder) || 0 };
      if (isEdit) await categoryApi.update(category.id, payload);
      else await categoryApi.create(payload);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Category' : 'New Category'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Name</label><input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
        <div className="field"><label>Slug (optional)</label><input className="input" value={form.slug} onChange={(e) => update('slug', e.target.value)} /></div>
        <div className="field"><label>Parent Category</label>
          <select className="input" value={form.parentId} onChange={(e) => update('parentId', e.target.value)}>
            <option value="">None (top-level)</option>
            {categories.filter((c) => c.id !== category?.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field"><label>Description</label><textarea className="input" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
        <div className="field"><label>Image URL</label><input className="input" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} /></div>
        <div className="field"><label>Sort Order</label><input className="input" type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} /></div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
