import { useEffect, useMemo, useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
import { api } from '../api/http'
import { getErrorMessage } from '../utils/httpError'
import { EntityTable } from '../components/common/EntityTable'
import { FormModal } from '../components/common/FormModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const normalizeList = (payload) => (Array.isArray(payload) ? payload : payload?.results || [])

const toLookupOptions = (rows, config) =>
  rows.map((row) => ({
    value: row.id,
    label: config?.labelBuilder ? config.labelBuilder(row) : `${config?.prefix || ''}${row.id}`,
  }))

export const ResourcePage = ({ config }) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 450)
  const [ordering, setOrdering] = useState(config.defaultOrdering || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [lookups, setLookups] = useState({})

  const fetchLookups = async () => {
    const lookupDefs = config.lookups || []
    if (!lookupDefs.length) return
    const results = await Promise.all(
      lookupDefs.map(async (lookup) => {
        const response = await api.get(lookup.endpoint)
        return [lookup.key, toLookupOptions(normalizeList(response.data), lookup)]
      }),
    )
    setLookups(Object.fromEntries(results))
  }

  const fetchRows = async () => {
    try {
      setLoading(true)
      setError('')
      const params = {}
      if (debouncedQuery) params.search = debouncedQuery
      if (ordering) params.ordering = ordering
      params.page = currentPage
      const response = await api.get(config.endpoint, { params })
      const payload = response.data
      setRows(normalizeList(payload))
      setTotalCount(payload?.count ?? normalizeList(payload).length)
      if (payload?.results && payload.results.length > 0 && payload.next !== undefined) {
        setPageSize(payload.results.length)
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load data.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, ordering, currentPage, config.endpoint])

  useEffect(() => {
    fetchLookups().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.endpoint])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedQuery, ordering, config.endpoint])

  const formFields = useMemo(() => config.formFields || [], [config.formFields])
  const userRole = user?.role
  const roleCan = (key, defaultAllowed = true) => {
    const allowedRoles = config.permissions?.[key]
    if (!allowedRoles) return defaultAllowed
    return Boolean(userRole && allowedRoles.includes(userRole))
  }
  const canCreate = config.allowCreate !== false && roleCan('create', true)
  const canEdit = config.allowEdit !== false && roleCan('edit', true)
  const canDelete = config.allowDelete !== false && roleCan('delete', true)

  const openCreate = () => {
    if (!canCreate) return
    setEditingRow(null)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    if (!canEdit) return
    setEditingRow(row)
    setModalOpen(true)
  }

  const handleDelete = async (row) => {
    if (!canDelete) return
    if (!window.confirm(`Delete ${config.title} record #${row.id}?`)) return
    try {
      await api.delete(`${config.endpoint}${row.id}/`)
      setApiMessage('Deleted successfully.')
      showToast(`${config.title} deleted successfully.`, 'success')
      fetchRows()
    } catch (requestError) {
      setApiMessage(getErrorMessage(requestError, 'Delete failed.'))
      showToast(getErrorMessage(requestError, 'Delete failed.'), 'error')
    }
  }

  const buildPayload = (values) => {
    if (config.payloadBuilder) return config.payloadBuilder(values)
    return values
  }

  const handleSubmit = async (values) => {
    if ((!editingRow && !canCreate) || (editingRow && !canEdit)) return
    setSubmitting(true)
    setApiMessage('')
    try {
      const payload = buildPayload(values)
      if (editingRow?.id) {
        await api.patch(`${config.endpoint}${editingRow.id}/`, payload)
        setApiMessage('Updated successfully.')
        showToast(`${config.title} updated successfully.`, 'success')
      } else {
        await api.post(config.endpoint, payload, config.multipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined)
        setApiMessage('Created successfully.')
        showToast(`${config.title} created successfully.`, 'success')
      }
      setModalOpen(false)
      fetchRows()
    } catch (requestError) {
      setApiMessage(getErrorMessage(requestError, 'Save failed.'))
      showToast(getErrorMessage(requestError, 'Save failed.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="space-y-4">
      <div className="ui-card rounded-xl p-5 shadow">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">{config.title}</h2>
            <p className="ui-text-muted text-sm">{config.description}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchRows} className="ui-btn-secondary inline-flex items-center gap-2 rounded px-3 py-2 text-sm">
              <RefreshCcw size={16} /> Refresh
            </button>
            {canCreate && (
              <button onClick={openCreate} className="ui-btn-primary inline-flex items-center gap-2 rounded px-3 py-2 text-sm">
                <Plus size={16} /> Add New
              </button>
            )}
          </div>
        </div>
        <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          <input
            placeholder={config.searchPlaceholder || 'Search'}
            className="ui-input rounded px-3 py-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {config.orderingOptions?.length ? (
            <select className="ui-input rounded px-3 py-2" value={ordering} onChange={(e) => setOrdering(e.target.value)}>
              <option value="">Sort</option>
              {config.orderingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        {apiMessage && <p className="ui-soft mb-2 rounded px-3 py-2 text-sm">{apiMessage}</p>}
        {loading && <p className="ui-text-muted">Loading...</p>}
        {!loading && error && <p className="ui-alert-danger rounded p-3">{error}</p>}
        {!loading && !error && rows.length === 0 && <p className="ui-text-muted">No records found.</p>}
        {!loading && !error && rows.length > 0 && (
          <>
            <EntityTable
              columns={config.columns}
              rows={rows}
              onEdit={openEdit}
              onDelete={handleDelete}
              canDelete={canDelete}
              canEdit={canEdit}
            />
            <div className="mt-3 flex items-center justify-between">
              <p className="ui-text-muted text-sm">
                Page {currentPage} of {totalPages} ({totalCount} records)
              </p>
              <div className="flex gap-2">
                <button
                  className="ui-btn-secondary rounded px-3 py-1 text-sm disabled:opacity-40"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <button
                  className="ui-btn-secondary rounded px-3 py-1 text-sm disabled:opacity-40"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {canCreate || (canEdit && editingRow) ? (
        <FormModal
          title={editingRow ? `Edit ${config.title}` : `Create ${config.title}`}
          fields={formFields}
          open={modalOpen}
          initialData={editingRow}
          lookups={lookups}
          submitting={submitting}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  )
}
