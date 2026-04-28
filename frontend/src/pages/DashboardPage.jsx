import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../api/http'
import { endpoints } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/httpError'
import { normalizeMetricObject } from '../utils/reportAdapters'
import { gallerySettings, hospitalGallery } from '../config/galleryConfig'

export const DashboardPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cards, setCards] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const response = await api.get(endpoints.reports.dashboard)
        const roleAliases = {
          total: 'total_appointments',
          'doctor_fee _total': 'doctor_fee_total',
        }
        const adapted = normalizeMetricObject(response.data || {}, roleAliases)
        const normalizedCards = Object.entries(adapted).map(([key, value]) => ({
          key,
          label: key.replaceAll('_', ' '),
          value,
        }))
        setCards(normalizedCards)
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Could not load dashboard data right now.'))
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  useEffect(() => {
    if (selectedIndex === null || !gallerySettings.autoRotate || hospitalGallery.length < 2) return undefined
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % hospitalGallery.length))
    }, gallerySettings.rotateIntervalMs)
    return () => clearInterval(timer)
  }, [selectedIndex])

  useEffect(() => {
    if (selectedIndex === null || !gallerySettings.keyboardNavigation) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowRight') showNextImage()
      if (event.key === 'ArrowLeft') showPreviousImage()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex])

  const selectedImage = selectedIndex === null ? null : hospitalGallery[selectedIndex]
  const showNextImage = () => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % hospitalGallery.length))
  }
  const showPreviousImage = () => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + hospitalGallery.length) % hospitalGallery.length))
  }

  if (loading) return <div className="ui-card rounded-lg p-6 shadow">Loading dashboard...</div>
  if (error) return <div className="ui-alert-danger rounded-lg p-6">{error}</div>

  return (
    <div className="space-y-4">
      <div className="ui-card rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold">Welcome, {user?.username}</h2>
        <p className="ui-text-muted text-sm">Role: {user?.role}</p>
        {user?.dashboardInfo?.message ? <p className="ui-link mt-2 text-sm">{user.dashboardInfo.message}</p> : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="ui-sidebar rounded-xl p-5 shadow">
          <p className="ui-sidebar-muted text-xs uppercase tracking-wider">Role Snapshot</p>
          <p className="mt-2 text-lg font-semibold capitalize">{user?.role || 'Unknown'}</p>
        </div>
        <div className="ui-card rounded-xl p-5 shadow">
          <p className="ui-text-muted text-xs uppercase">Email</p>
          <p className="mt-2 text-base font-semibold">{user?.email || '-'}</p>
        </div>
        <div className="ui-card rounded-xl p-5 shadow">
          <p className="ui-text-muted text-xs uppercase">Phone</p>
          <p className="mt-2 text-base font-semibold">{user?.phone || '-'}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.length === 0 ? (
          <div className="ui-card ui-text-muted rounded-lg p-5 shadow">No dashboard stats available.</div>
        ) : (
          cards.map((card) => (
            <div key={card.key} className="ui-card rounded-lg p-5 shadow">
              <p className="ui-text-muted text-sm capitalize">{card.label}</p>
              <p className="mt-1 text-2xl font-bold">{String(card.value)}</p>
            </div>
          ))
        )}
      </div>
      <div className="ui-card rounded-xl p-5 shadow">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">Hospital Highlights</h3>
          <p className="ui-text-muted text-sm">Real-world facilities and care environments aligned with modern HMS operations.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hospitalGallery.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="ui-gallery-card group text-left"
              onClick={() => setSelectedIndex(index)}
            >
              <img src={item.imageUrl} alt={item.title} className="ui-gallery-image h-52 w-full object-cover" loading="lazy" />
              <div className="p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="ui-text-muted mt-1 text-sm">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedImage ? (
        <div className="ui-overlay fixed inset-0 z-50 grid place-items-center p-4" onClick={() => setSelectedIndex(null)} role="presentation">
          <div className="ui-card w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <img src={selectedImage.imageUrl} alt={selectedImage.title} className="max-h-[70vh] w-full object-cover" />
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-lg font-semibold">{selectedImage.title}</p>
                <p className="ui-text-muted text-sm">{selectedImage.description}</p>
                <p className="ui-text-muted mt-1 text-xs">Image {selectedIndex + 1} of {hospitalGallery.length}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="ui-btn-secondary rounded px-3 py-2" onClick={showPreviousImage} aria-label="Previous image">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="ui-btn-secondary rounded px-3 py-2" onClick={showNextImage} aria-label="Next image">
                  <ChevronRight size={16} />
                </button>
                <button type="button" className="ui-btn-secondary rounded px-3 py-2" onClick={() => setSelectedIndex(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
