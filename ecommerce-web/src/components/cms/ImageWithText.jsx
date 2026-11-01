import './cms.css';

export default function ImageWithText({ section, video = false }) {
  return (
    <section className="container cms-section">
      <div className="cms-image-text">
        <div className="cms-image-text__media">
          {video && section.metadataJson ? (
            <video src={tryParseVideoUrl(section.metadataJson)} controls poster={section.imageUrl} />
          ) : (
            section.imageUrl && <img src={section.imageUrl} alt={section.title || ''} />
          )}
        </div>
        <div className="cms-image-text__copy">
          {section.subtitle && <span className="eyebrow">{section.subtitle}</span>}
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
      </div>
    </section>
  );
}

function tryParseVideoUrl(json) {
  try { return JSON.parse(json).videoUrl; } catch { return undefined; }
}
