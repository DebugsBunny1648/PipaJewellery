/**
 * Minimal, dependency-free data table: pass `columns` as
 * [{ key, label, render? }] and `rows` as an array of objects.
 */
export default function DataTable({ columns, rows, emptyMessage = 'No records found.', rowKey = 'id' }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }
  return (
    <table className="data-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
