export default function StatusBadge({ active }) {
  return <span className={`badge ${active ? 'badge-emerald' : 'badge-danger'}`}>{active ? 'Active' : 'Inactive'}</span>;
}
