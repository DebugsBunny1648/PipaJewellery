import { useState } from 'react';
import { Link } from 'react-router-dom';
import './cms.css';

export default function CarouselBanner({ section }) {
  // A single CMS section models one slide; the admin creates N sections of
  // this type with shared sortOrder grouping in a real deployment. Rendered
  // here as a single promotional strip to keep the contract simple.
  const [imgError, setImgError] = useState(false);
  return (
    <section className="cms-carousel container">
      <div className="cms-carousel__slide">
        {section.imageUrl && !imgError && (
          <img src={section.imageUrl} alt={section.title || ''} onError={() => setImgError(true)} />
        )}
        <div className="cms-carousel__caption">
          <h3>{section.title}</h3>
          {section.ctaLink && <Link to={section.ctaLink}>{section.ctaText || 'Explore'} →</Link>}
        </div>
      </div>
    </section>
  );
}
