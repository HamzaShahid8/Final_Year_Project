import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../api/http'
import { endpoints } from '../../api/endpoints'
import { getErrorMessage } from '../../utils/httpError'
import { metricsToChartRows, normalizeMetricObject } from '../../utils/reportAdapters'

export const ReportsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sections, setSections] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [revenue, appointments, lab, pharmacy] = await Promise.all([
          api.get(endpoints.reports.revenue),
          api.get(endpoints.reports.appointments),
          api.get(endpoints.reports.lab),
          api.get(endpoints.reports.pharmacy),
        ])
        setSections({
          revenue: normalizeMetricObject(revenue.data || {}, { 'doctor_fee _total': 'doctor_fee_total' }),
          appointments: normalizeMetricObject(appointments.data || {}, { total: 'total_appointments' }),
          lab: normalizeMetricObject(lab.data || {}),
          pharmacy: normalizeMetricObject(pharmacy.data || {}),
        })
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Unable to load report analytics.'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="ui-card rounded-xl p-6 shadow">Loading analytics...</div>
  if (error) return <div className="ui-alert-danger rounded-xl p-6">{error}</div>

  const tooltipStyle = {
    backgroundColor: 'var(--chart-tooltip-bg)',
    border: '1px solid var(--chart-tooltip-border)',
    color: 'var(--app-fg)',
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Object.entries(sections).map(([title, values]) => (
        <div key={title} className="ui-card rounded-xl p-5 shadow">
          <h3 className="mb-3 text-lg font-semibold capitalize">{title} Analytics</h3>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="ui-soft rounded p-2">
                <p className="ui-text-muted text-xs uppercase">{key.replaceAll('_', ' ')}</p>
                <p className="text-lg font-semibold">{String(value)}</p>
              </div>
            ))}
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsToChartRows(values)}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="var(--chart-bar)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={metricsToChartRows(values)} dataKey="value" nameKey="name" outerRadius={75} fill="var(--chart-pie)" />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}
