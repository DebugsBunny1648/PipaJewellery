export function formatCurrency(value, currency = 'INR') {
  const amount = Number(value ?? 0);
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `₹${amount.toFixed(0)}`;
  }
}

export function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}
