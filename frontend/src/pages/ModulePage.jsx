import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/http'
import { endpoints } from '../api/endpoints'

const endpointResolver = {
  doctors: endpoints.doctors,
  doctorSchedules: endpoints.doctorSchedules,
  patients: endpoints.patients,
  appointments: endpoints.appointments,
  medicalRecords: endpoints.medicalRecords,
  prescriptions: endpoints.prescriptions,
  medicines: endpoints.medicines,
  pharmacyOrders: endpoints.pharmacyOrders,
  labTests: endpoints.labTests,
  labOrders: endpoints.labOrders,
  labReports: endpoints.labReports,
  bills: endpoints.bills,
  reportDashboard: endpoints.reports.dashboard,
}

export const ModulePage = ({ title, endpointKey }) => {
  const endpoint = endpointResolver[endpointKey]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    const loadData = async () => {
      if (!endpoint) return
      try {
        setLoading(true)
        setError('')
        const response = await api.get(endpoint)
        const payload = response.data
        const list = Array.isArray(payload) ? payload : payload.results ?? [payload]
        setRows(list.filter(Boolean))
      } catch (requestError) {
        const message = requestError.response?.data?.detail || 'No permission or request failed.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [endpoint])

  const keys = useMemo(() => {
    const sample = rows[0]
    return sample ? Object.keys(sample).slice(0, 6) : []
  }, [rows])

  return (
    <div className="ui-card rounded-xl p-5 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="ui-soft ui-text-muted rounded px-2 py-1 text-xs">{endpoint}</span>
      </div>

      {loading && <p className="ui-text-muted">Loading {title.toLowerCase()}...</p>}
      {!loading && error && <p className="ui-alert-danger rounded p-3">{error}</p>}
      {!loading && !error && rows.length === 0 && <p className="ui-text-muted">No data returned.</p>}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {keys.map((key) => (
                  <th key={key} className="border-b px-3 py-2 text-left text-xs uppercase ui-text-muted" style={{ borderColor: 'var(--border)' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, index) => (
                <tr key={row.id ?? index} className="hover:opacity-90">
                  {keys.map((key) => (
                    <td key={key} className="border-b px-3 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                      {formatCell(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const formatCell = (value) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
