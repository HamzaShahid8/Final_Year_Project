const colorByStatus = {
  pending: 'ui-status-pending',
  confirmed: 'ui-status-confirmed',
  completed: 'ui-status-completed',
  active: 'ui-status-active',
  closed: 'ui-status-closed',
  paid: 'ui-status-paid',
}

export const StatusBadge = ({ value }) => {
  const normalized = String(value || '').toLowerCase()
  const color = colorByStatus[normalized] || 'ui-soft'

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${color}`}>{normalized || '-'}</span>
}
