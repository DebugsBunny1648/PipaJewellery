export default function Loader({ label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: 'var(--color-ink-soft)' }}>
      {label}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton" style={{ aspectRatio: '4 / 5', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 14, width: '70%', marginTop: 10 }} />
          <div className="skeleton" style={{ height: 14, width: '40%', marginTop: 6 }} />
        </div>
      ))}
    </div>
  );
}
