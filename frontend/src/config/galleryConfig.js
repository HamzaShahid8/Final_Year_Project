const withFallback = (value, fallback) => (value && value.trim() ? value.trim() : fallback)
const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}
const toBool = (value, fallback) => {
  if (value === undefined) return fallback
  return String(value).toLowerCase() === 'true'
}

export const gallerySettings = {
  autoRotate: toBool(import.meta.env.VITE_GALLERY_AUTOROTATE, true),
  rotateIntervalMs: toNumber(import.meta.env.VITE_GALLERY_INTERVAL_MS, 4500),
  keyboardNavigation: toBool(import.meta.env.VITE_GALLERY_KEYBOARD, true),
}

export const hospitalGallery = [
  {
    id: 'emergency-unit',
    title: 'Emergency Response Unit',
    description: 'Rapid triage and critical care readiness around the clock.',
    imageUrl: withFallback(
      import.meta.env.VITE_GALLERY_IMAGE_1,
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80',
    ),
  },
  {
    id: 'digital-diagnostics',
    title: 'Digital Diagnostics',
    description: 'Advanced imaging and lab workflows integrated with HMS.',
    imageUrl: withFallback(
      import.meta.env.VITE_GALLERY_IMAGE_2,
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
    ),
  },
  {
    id: 'patient-experience',
    title: 'Patient Experience Center',
    description: 'Human-centered care spaces designed for comfort and trust.',
    imageUrl: withFallback(
      import.meta.env.VITE_GALLERY_IMAGE_3,
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80',
    ),
  },
]
