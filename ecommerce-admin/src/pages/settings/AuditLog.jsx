import { useEffect, useState } from 'react';
import { auditLogApi } from '../../api/auditLogApi';
import DataTable from '../../components/DataTable';

function formatDate(v) { return v ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v)) : ''; }

export default function AuditLog() {
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => { auditLogApi.getAll(page, 50).then(setResult); }, [page]);

  const columns = [
    { key: 'createdAt', label: 'When', render: (l) => formatDate(l.createdAt) },
    { key: 'performedBy', label: 'By', render: (l) => `${l.performedBy || 'system'} (${l.performedByType})` },
    { key: 'action', label: 'Action' },
    { key: 'entityName', label: 'Entity', render: (l) => `${l.entityName} #${l.entityId ?? ''}` },
    { key: 'ipAddress', label: 'IP' }
  ];

  return (
    <div>
      <div className="page-head"><div><h1>Audit Log</h1><p>Every create/update/delete/status/login action across the platform.</p></div></div>
      <DataTable columns={columns} rows={result?.content} emptyMessage={result ? 'No audit entries yet.' : 'Loading…'} />
      {result?.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: 'var(--text-sm)' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {result.totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={page >= result.totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
