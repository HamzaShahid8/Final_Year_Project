import axios from 'axios'
import { API_BASE_URL, API_RETRY_COUNT, API_RETRY_DELAY_MS, API_TIMEOUT_MS } from '../config/env'
import { endpoints } from './endpoints'
import { tokenStorage } from '../lib/storage'

let onUnauthorized = null
let isRefreshing = false
let pendingRequests = []

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

const flushPending = (newToken) => {
  pendingRequests.forEach((cb) => cb(newToken))
  pendingRequests = []
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: API_TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccess()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const method = (originalRequest?.method || 'get').toLowerCase()
    const statusCode = error.response?.status
    const isNetworkError = !error.response
    const canRetryMethod = ['get', 'head', 'options'].includes(method)
    const isServerError = statusCode >= 500 && statusCode < 600
    const isRefreshRequest = originalRequest?.url?.includes(endpoints.auth.refresh)
    originalRequest._retryCount = originalRequest._retryCount || 0

    if (!isRefreshRequest && canRetryMethod && (isNetworkError || isServerError) && originalRequest._retryCount < API_RETRY_COUNT) {
      originalRequest._retryCount += 1
      await new Promise((resolve) => setTimeout(resolve, API_RETRY_DELAY_MS * originalRequest._retryCount))
      return api(originalRequest)
    }

    const isUnauthorized = error.response?.status === 401
    const hasRetried = originalRequest?._retry
    const refreshToken = tokenStorage.getRefresh()

    if (!isUnauthorized || hasRetried || !refreshToken) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoints.auth.refresh}`, {
        refresh: refreshToken,
      })
      const newAccess = response.data.access
      tokenStorage.setTokens({ access: newAccess })
      flushPending(newAccess)
      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return api(originalRequest)
    } catch (refreshError) {
      tokenStorage.clearTokens()
      if (onUnauthorized) onUnauthorized()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
