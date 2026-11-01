import { Link } from 'react-router-dom';
import './cms.css';

export default function HeroBanner({ section }) {
  const style = {
    background: section.backgroundColor || 'var(--color-primary)',
    color: section.textColor || '#fff'
  };
  return (
    <section className="cms-hero" style={style}>
      <div className="container cms-hero__grid">
        <div className="cms-hero__copy">
          {section.subtitle && <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>{section.subtitle}</span>}
          <h1 className="cms-hero__title">{section.title}</h1>
          {section.description && <p className="cms-hero__desc">{section.description}</p>}
          {section.ctaText && section.ctaLink && (
            <Link to={section.ctaLink} className="btn btn-primary" style={{ background: 'var(--color-gold)' }}>
              {section.ctaText}
            </Link>
          )}
        </div>
        {section.imageUrl && (
          <div className="cms-hero__media">
            <img src={section.imageUrl} alt={section.title || ''} />
          </div>
        )}
      </div>
    </section>
  );
}
