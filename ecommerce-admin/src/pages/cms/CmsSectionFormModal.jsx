import { useState } from 'react';
import { cmsApi } from '../../api/cmsApi';
import Modal from '../../components/Modal';

const SECTION_TYPES = [
  'HERO_BANNER', 'CAROUSEL_BANNER', 'CATEGORY_GRID', 'FEATURED_PRODUCTS', 'NEW_ARRIVALS',
  'BEST_SELLERS', 'OFFER_BANNER', 'PROMOTIONAL_TILE', 'IMAGE_WITH_TEXT', 'VIDEO_SECTION',
  'COLLECTION_SHOWCASE', 'TESTIMONIAL_SECTION', 'BRAND_STORY_SECTION', 'SOCIAL_FEED_SECTION',
  'NEWSLETTER_SECTION', 'RECENTLY_VIEWED_PRODUCTS', 'CUSTOM_HTML_BLOCK', 'MOBILE_APP_BANNER',
  'PRODUCT_SLIDER', 'STATIC_CONTENT_BLOCK'
];

const BLANK = {
  sectionName: '', sectionType: 'HERO_BANNER', title: '', subtitle: '', description: '',
  imageUrl: '', mobileImageUrl: '', ctaText: '', ctaLink: '', linkedCategoryId: '', linkedProductId: '',
  linkedCollection: '', sortOrder: 0, deviceVisibility: 'BOTH', backgroundColor: '', textColor: '',
  layoutType: '', metadataJson: ''
};

// Only show the fields relevant to each section type, so admins aren't
// filling out 18 irrelevant inputs for a newsletter block.
const FIELD_GROUPS = {
  HERO_BANNER: ['title', 'subtitle', 'description', 'imageUrl', 'ctaText', 'ctaLink', 'backgroundColor', 'textColor'],
  CAROUSEL_BANNER: ['title', 'imageUrl', 'ctaText', 'ctaLink'],
  MOBILE_APP_BANNER: ['title', 'mobileImageUrl', 'ctaText', 'ctaLink'],
  CATEGORY_GRID: ['title', 'subtitle'],
  FEATURED_PRODUCTS: ['title', 'subtitle'],
  NEW_ARRIVALS: ['title', 'subtitle'],
  BEST_SELLERS: ['title', 'subtitle'],
  RECENTLY_VIEWED_PRODUCTS: ['title', 'subtitle'],
  PRODUCT_SLIDER: ['title', 'subtitle'],
  COLLECTION_SHOWCASE: ['title', 'subtitle', 'linkedCollection'],
  OFFER_BANNER: ['title', 'subtitle', 'description', 'ctaText', 'ctaLink', 'backgroundColor', 'textColor'],
  PROMOTIONAL_TILE: ['title', 'subtitle', 'description', 'ctaText', 'ctaLink', 'backgroundColor', 'textColor'],
  IMAGE_WITH_TEXT: ['title', 'subtitle', 'description', 'imageUrl'],
  BRAND_STORY_SECTION: ['title', 'subtitle', 'description', 'imageUrl'],
  VIDEO_SECTION: ['title', 'subtitle', 'description', 'imageUrl', 'metadataJson'],
  TESTIMONIAL_SECTION: ['title', 'description', 'metadataJson'],
  SOCIAL_FEED_SECTION: ['title', 'description'],
  NEWSLETTER_SECTION: ['title', 'description'],
  CUSTOM_HTML_BLOCK: ['title', 'description'],
  STATIC_CONTENT_BLOCK: ['title', 'description']
};

const FIELD_META = {
  title: { label: 'Title' }, subtitle: { label: 'Subtitle' },
  description: { label: 'Description', textarea: true },
  imageUrl: { label: 'Image URL' }, mobileImageUrl: { label: 'Mobile Image URL' },
  ctaText: { label: 'Button Text' }, ctaLink: { label: 'Button Link (e.g. /category/rings)' },
  linkedCollection: { label: 'Collection Name' },
  backgroundColor: { label: 'Background Color (hex)' }, textColor: { label: 'Text Color (hex)' },
  metadataJson: { label: 'Metadata JSON (e.g. testimonials quotes, video URL)', textarea: true }
};

export default function CmsSectionFormModal({ section, onClose, onSaved }) {
  const isEdit = Boolean(section);
  const [form, setForm] = useState(isEdit ? { ...BLANK, ...section } : BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      if (isEdit) await cmsApi.update(section.id, payload);
      else await cmsApi.create(payload);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save section');
    } finally {
      setSaving(false);
    }
  }

  const visibleFields = FIELD_GROUPS[form.sectionType] || ['title', 'description'];

  return (
    <Modal title={isEdit ? 'Edit Section' : 'New Section'} onClose={onClose} width={620}>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ background: 'var(--color-danger-tint)', color: 'var(--color-danger)', padding: '0.6rem 0.9rem', borderRadius: 6, fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>{error}</div>}

        <div className="field"><label>Section Type</label>
          <select className="input" value={form.sectionType} onChange={(e) => update('sectionType', e.target.value)}>
            {SECTION_TYPES.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
          </select>
        </div>
        <div className="field"><label>Internal Name (admin reference only)</label>
          <input className="input" value={form.sectionName} onChange={(e) => update('sectionName', e.target.value)} />
        </div>

        {visibleFields.map((fieldKey) => {
          const meta = FIELD_META[fieldKey];
          return (
            <div className="field" key={fieldKey}>
              <label>{meta.label}</label>
              {meta.textarea ? (
                <textarea className="input" rows={3} value={form[fieldKey]} onChange={(e) => update(fieldKey, e.target.value)} />
              ) : (
                <input className="input" value={form[fieldKey]} onChange={(e) => update(fieldKey, e.target.value)} />
              )}
            </div>
          );
        })}

        <div className="form-grid">
          <div className="field"><label>Device Visibility</label>
            <select className="input" value={form.deviceVisibility} onChange={(e) => update('deviceVisibility', e.target.value)}>
              <option value="BOTH">Web & Mobile</option><option value="WEB">Web only</option><option value="MOBILE">Mobile only</option>
            </select>
          </div>
          <div className="field"><label>Sort Order</label><input className="input" type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} /></div>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Section'}</button>
        </div>
      </form>
    </Modal>
  );
}
