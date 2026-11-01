import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';

function formatCurrency(v) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v || 0));
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => { dashboardApi.getSummary().then(setSummary).catch(() => setSummary({})); }, []);

  const cards = [
    { label: 'Total Revenue', value: summary ? formatCurrency(summary.totalRevenue) : '—' },
    { label: 'Total Orders', value: summary?.totalOrders ?? '—' },
    { label: 'Pending Orders', value: summary?.pendingOrders ?? '—' },
    { label: 'Total Products', value: summary?.totalProducts ?? '—' },
    { label: 'Total Customers', value: summary?.totalCustomers ?? '—' }
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p>A quick pulse on the store.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {cards.map((c) => (
          <div key={c.label} className="card stat-card">
            <span className="eyebrow">{c.label}</span>
            <div className="stat-card__value">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
