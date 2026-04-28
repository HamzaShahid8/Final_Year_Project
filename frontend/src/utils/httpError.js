export const getErrorMessage = (error, fallback = 'Request failed.') => {
  const data = error?.response?.data
  if (!data) return fallback

  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.error) return data.error

  const firstEntry = Object.entries(data)[0]
  if (!firstEntry) return fallback
  const [field, value] = firstEntry
  if (Array.isArray(value)) return `${field}: ${value.join(', ')}`
  if (typeof value === 'string') return `${field}: ${value}`
  return fallback
}
