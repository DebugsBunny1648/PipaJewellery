import './cms.css';

export default function TestimonialSection({ section }) {
  let quotes = [];
  try { quotes = JSON.parse(section.metadataJson)?.quotes || []; } catch { /* fallback below */ }
  if (!quotes.length) quotes = [{ author: section.title, quote: section.description }];

  return (
    <section className="container cms-section">
      <div className="cms-testimonials">
        {quotes.filter((q) => q.quote).map((q, i) => (
          <blockquote key={i} className="cms-testimonials__item">
            <p>“{q.quote}”</p>
            <cite>{q.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
