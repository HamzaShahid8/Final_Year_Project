import { StatusBadge } from './StatusBadge'

const renderValue = (value, type) => {
  if (value === null || value === undefined || value === '') return '-'
  if (type === 'status') return <StatusBadge value={value} />
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export const EntityTable = ({ columns, rows, onEdit, onDelete, canEdit = true, canDelete = true }) => (
  <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
    <table className="min-w-full" style={{ background: 'var(--surface)' }}>
      <thead>
        <tr style={{ background: 'var(--surface-muted)' }}>
          {columns.map((column) => (
            <th key={column.key} className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide ui-text-muted" style={{ borderColor: 'var(--border)' }}>
              {column.label}
            </th>
          ))}
          {(canEdit || canDelete) && <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase ui-text-muted" style={{ borderColor: 'var(--border)' }}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="hover:opacity-90">
            {columns.map((column) => {
              const raw = column.render ? column.render(row) : row[column.key]
              return (
                <td key={column.key} className="border-b px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                  {renderValue(raw, column.type)}
                </td>
              )
            })}
            {(canEdit || canDelete) && (
              <td className="border-b px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex gap-2">
                  {canEdit && (
                    <button onClick={() => onEdit(row)} className="ui-btn-secondary rounded px-2 py-1">
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => onDelete(row)} className="ui-alert-danger rounded px-2 py-1">
                      Delete
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
