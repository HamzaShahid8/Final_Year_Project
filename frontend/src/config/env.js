export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000)
export const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT || 1)
export const API_RETRY_DELAY_MS = Number(import.meta.env.VITE_API_RETRY_DELAY_MS || 500)

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_API_BASE_URL is missing. Add it in your .env file.')
}
