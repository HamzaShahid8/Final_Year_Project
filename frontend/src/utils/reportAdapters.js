const asNumber = (value) => {
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export const normalizeMetricObject = (raw = {}, aliases = {}) => {
  const normalized = {}

  Object.entries(raw).forEach(([key, value]) => {
    const canonicalKey = aliases[key] || key
    normalized[canonicalKey] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value
  })

  return normalized
}

export const metricsToChartRows = (values = {}) =>
  Object.entries(values).map(([name, value]) => ({
    name,
    value: asNumber(value),
  }))
