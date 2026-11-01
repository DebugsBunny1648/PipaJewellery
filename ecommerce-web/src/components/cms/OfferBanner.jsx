import { Link } from 'react-router-dom';
import './cms.css';

export default function OfferBanner({ section }) {
  return (
    <section className="container">
      <div
        className="cms-offer"
        style={{ background: section.backgroundColor || 'var(--color-blush)', color: section.textColor || 'var(--color-ink)' }}
      >
        <div>
          {section.subtitle && <span className="eyebrow">{section.subtitle}</span>}
          <h3>{section.title}</h3>
          {section.description && <p>{section.description}</p>}
        </div>
        {section.ctaText && section.ctaLink && (
          <Link to={section.ctaLink} className="btn btn-primary">{section.ctaText}</Link>
        )}
      </div>
    </section>
  );
}
