import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../../api/categoryApi';
import './cms.css';

export default function CategoryGrid({ section }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getTree().then(setCategories).catch(() => setCategories([]));
  }, []);

  if (!categories.length) return null;

  return (
    <section className="cms-section container">
      <div className="cms-section__head">
        <h2>{section.title || 'Shop by Category'}</h2>
        {section.subtitle && <p>{section.subtitle}</p>}
      </div>
      <div className="cms-category-grid">
        {categories.slice(0, 6).map((cat) => (
          <Link key={cat.id} to={`/category/${cat.slug}`} className="cms-category-grid__item">
            <div className="cms-category-grid__media">
              {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} /> : <div className="cms-category-grid__placeholder" />}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
