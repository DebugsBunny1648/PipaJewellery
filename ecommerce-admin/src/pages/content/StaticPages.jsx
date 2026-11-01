import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { staticPageApi } from '../../api/staticPageApi';
import { showToast } from '../../store/slices/uiSlice';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

const BLANK = { title: '', slug: '', content: '', bannerImageUrl: '', seoTitle: '', seoDescription: '', seoKeywords: '' };

export default function StaticPages() {
  const dispatch = useDispatch();
  const [pages, setPages] = useState(null);
  const [editing, setEditing] = useState(null);

  function refresh() { staticPageApi.getAll().then(setPages); }
  useEffect(refresh, []);

  async function toggleStatus(p) { await staticPageApi.updateStatus(p.id, !p.active); refresh(); }
  async function handleDelete(p) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await staticPageApi.remove(p.id);
    dispatch(showToast('Page deleted', 'success'));
    refresh();
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug', render: (p) => <span className="mono">/{p.slug}</span> },
    { key: 'active', label: 'Status', render: (p) => <StatusBadge active={p.active} /> },
    { key: 'actions', label: '', render: (p) => (
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="btn-ghost btn-sm" onClick={() => setEditing(p)}>Edit</button>
        <button className="btn-ghost btn-sm" onClick={() => toggleStatus(p)}>{p.active ? 'Unpublish' : 'Publish'}</button>
        <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(p)}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-head">
        <div><h1>Static Pages</h1><p>About, Privacy, Terms, FAQ, Shipping & Return policies, etc.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Page</button>
      </div>
      <DataTable columns={columns} rows={pages} emptyMessage={pages ? 'No pages yet.' : 'Loading…'} />
      {editing !== null && (
        <PageFormModal page={editing.id ? editing : null} onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Page saved', 'success')); refresh(); }} />
      )}
    </div>
  );
}

function PageFormModal({ page, onClose, onSaved }) {
  const isEdit = Boolean(page);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...page } : BLANK);
  const [saving, setSaving] = useState(false);
  function update(f, v) { setForm((s) => ({ ...s, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await staticPageApi.update(page.id, form);
      else await staticPageApi.create(form);
      onSaved();
    } finally { setSaving(false); }
  }

  return (
    <Modal title={isEdit ? 'Edit Page' : 'New Page'} onClose={onClose} width={640}>
      <form onSubmit={handleSubmit}>
        <div className="field"><label>Title</label><input className="input" required value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
        <div className="field"><label>Slug (optional)</label><input className="input" value={form.slug} onChange={(e) => update('slug', e.target.value)} /></div>
        <div className="field"><label>Content (HTML)</label><textarea className="input" rows={8} value={form.content} onChange={(e) => update('content', e.target.value)} /></div>
        <div className="field"><label>Banner Image URL</label><input className="input" value={form.bannerImageUrl} onChange={(e) => update('bannerImageUrl', e.target.value)} /></div>
        <div className="form-grid">
          <div className="field"><label>SEO Title</label><input className="input" value={form.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} /></div>
          <div className="field"><label>SEO Keywords</label><input className="input" value={form.seoKeywords} onChange={(e) => update('seoKeywords', e.target.value)} /></div>
        </div>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
