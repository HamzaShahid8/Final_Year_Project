import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler } from '../api/http'
import { endpoints } from '../api/endpoints'
import { tokenStorage } from '../lib/storage'

const AuthContext = createContext(null)

const normalizeProfile = (raw = {}) => ({
  username: raw.username ?? '',
  email: raw.email ?? '',
  role: raw.role ?? '',
  phone: raw['phn-no'] ?? raw.phn_no ?? raw.phone ?? '',
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearSession = () => {
    tokenStorage.clearTokens()
    setUser(null)
  }

  const loadProfile = async () => {
    try {
      const [profileResponse, dashboardResponse] = await Promise.all([
        api.get(endpoints.auth.profile),
        api.get(endpoints.auth.dashboards),
      ])
      setUser({
        ...normalizeProfile(profileResponse.data),
        dashboardInfo: dashboardResponse.data,
      })
    } catch {
      clearSession()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    if (!tokenStorage.getAccess()) {
      setLoading(false)
      return
    }
    loadProfile()
  }, [])

  const login = async (credentials) => {
    const response = await api.post(endpoints.auth.login, credentials)
    tokenStorage.setTokens(response.data)
    await loadProfile()
  }

  const register = async (payload) => api.post(endpoints.auth.register, payload)

  const logout = async () => {
    const refresh = tokenStorage.getRefresh()
    try {
      if (refresh) {
        await api.post(endpoints.auth.logout, { refresh })
      }
    } finally {
      clearSession()
    }
  }

  const changePassword = async (payload) => api.post(endpoints.auth.changePassword, payload)

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      loadProfile,
      changePassword,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }
  return context
}
