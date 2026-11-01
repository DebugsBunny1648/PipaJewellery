import './cms.css';

export default function StaticContentBlock({ section, tone }) {
  return (
    <section className={`container cms-section cms-static ${tone ? `cms-static--${tone}` : ''}`}>
      {section.title && <h2>{section.title}</h2>}
      {section.description && <div dangerouslySetInnerHTML={{ __html: section.description }} />}
    </section>
  );
}
