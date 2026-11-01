export default function RatingStars({ value = 0, size = 14 }) {
  const rounded = Math.round(value);
  return (
    <span aria-label={`${value} out of 5 stars`} style={{ fontSize: size, color: 'var(--color-gold)', letterSpacing: '1px' }}>
      {'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}
    </span>
  );
}
