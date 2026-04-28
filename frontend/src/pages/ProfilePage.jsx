import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfileVisual } from '../config/profileVisualConfig'

export const ProfilePage = () => {
  const { user } = useAuth()
  const [previewOpen, setPreviewOpen] = useState(false)
  const visual = getProfileVisual(user?.role)
  const [imageSrc, setImageSrc] = useState(visual.imageUrl)
  const [imageUnavailable, setImageUnavailable] = useState(false)

  useEffect(() => {
    setImageSrc(visual.imageUrl)
    setImageUnavailable(false)
  }, [visual.imageUrl])

  const handleImageError = () => {
    if (imageSrc !== visual.fallbackImageUrl) {
      setImageSrc(visual.fallbackImageUrl)
      return
    }
    setImageUnavailable(true)
  }

  return (
    <div className="space-y-4">
      <div className="ui-card overflow-hidden rounded-xl shadow">
        <button
          type="button"
          className="ui-profile-visual relative block w-full text-left"
          onClick={() => !imageUnavailable && setPreviewOpen(true)}
          disabled={imageUnavailable}
        >
          <img src={imageSrc} alt={visual.title} className="h-64 w-full object-cover" loading="lazy" onError={handleImageError} />
          <div className="ui-auth-overlay">
            <p className="text-xl font-semibold">{visual.title}</p>
            <p className="mt-1 text-sm text-slate-200">{visual.subtitle}</p>
            <p className="mt-2 text-xs text-slate-200/90">{imageUnavailable ? visual.unavailableLabel : 'Click to expand image'}</p>
          </div>
        </button>
      </div>

      <div className="ui-card max-w-3xl rounded-xl p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Profile</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileItem label="Username" value={user?.username} />
          <ProfileItem label="Email" value={user?.email} />
          <ProfileItem label="Role" value={user?.role} />
          <ProfileItem label="Phone" value={user?.phone || 'N/A'} />
        </div>
      </div>

      {previewOpen && !imageUnavailable ? (
        <div className="ui-overlay fixed inset-0 z-50 grid place-items-center p-4" role="presentation" onClick={() => setPreviewOpen(false)}>
          <div className="ui-card w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <img src={imageSrc} alt={visual.title} className="max-h-[74vh] w-full object-cover" onError={handleImageError} />
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-lg font-semibold">{visual.title}</p>
                <p className="ui-text-muted text-sm">{visual.subtitle}</p>
              </div>
              <button type="button" className="ui-btn-secondary rounded px-3 py-2" onClick={() => setPreviewOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const ProfileItem = ({ label, value }) => (
  <div className="ui-soft rounded p-3">
    <p className="ui-text-muted text-xs uppercase">{label}</p>
    <p className="text-base font-medium">{value}</p>
  </div>
)
