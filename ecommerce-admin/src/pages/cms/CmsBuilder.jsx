import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cmsApi } from '../../api/cmsApi';
import { showToast } from '../../store/slices/uiSlice';
import StatusBadge from '../../components/StatusBadge';
import CmsSectionFormModal from './CmsSectionFormModal';

export default function CmsBuilder() {
  const dispatch = useDispatch();
  const [sections, setSections] = useState(null);
  const [editing, setEditing] = useState(null);

  function refresh() { cmsApi.getAll().then(setSections); }
  useEffect(refresh, []);

  async function move(section, direction) {
    const ordered = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex((s) => s.id === section.id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= ordered.length) return;
    [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];
    await cmsApi.reorder(ordered.map((s) => s.id));
    refresh();
  }

  async function toggleStatus(section) {
    await cmsApi.updateStatus(section.id, !section.active);
    refresh();
  }

  async function handleDelete(section) {
    if (!confirm(`Delete section "${section.title || section.sectionName}"?`)) return;
    await cmsApi.remove(section.id);
    dispatch(showToast('Section deleted', 'success'));
    refresh();
  }

  const ordered = sections ? [...sections].sort((a, b) => a.sortOrder - b.sortOrder) : null;

  return (
    <div>
      <div className="page-head">
        <div><h1>Homepage CMS</h1><p>These sections render, in this order, on the customer website and mobile app homepage.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ New Section</button>
      </div>

      {!ordered ? <div className="empty-state">Loading…</div> : ordered.length === 0 ? (
        <div className="empty-state">No homepage sections yet. Create one to populate the homepage.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {ordered.map((s, i) => (
            <div key={s.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <button className="btn-ghost btn-sm" disabled={i === 0} onClick={() => move(s, -1)}>▲</button>
                <button className="btn-ghost btn-sm" disabled={i === ordered.length - 1} onClick={() => move(s, 1)}>▼</button>
              </div>
              <div style={{ flex: 1 }}>
                <span className="eyebrow">{s.sectionType.replaceAll('_', ' ')}</span>
                <div style={{ fontWeight: 600 }}>{s.title || s.sectionName || '(untitled)'}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>Visible on: {s.deviceVisibility}</div>
              </div>
              <StatusBadge active={s.active} />
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-ghost btn-sm" onClick={() => setEditing(s)}>Edit</button>
                <button className="btn-ghost btn-sm" onClick={() => toggleStatus(s)}>{s.active ? 'Hide' : 'Show'}</button>
                <button className="btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(s)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <CmsSectionFormModal
          section={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); dispatch(showToast('Section saved', 'success')); refresh(); }}
        />
      )}
    </div>
  );
}
