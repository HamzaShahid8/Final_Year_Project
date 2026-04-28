const withFallback = (value, fallback) => (value && value.trim() ? value.trim() : fallback)
const normalizeRole = (role) => String(role || '').trim().toLowerCase().replace(/[\s-]+/g, '_')

const defaultImage = withFallback(
  import.meta.env.VITE_PROFILE_IMAGE_DEFAULT,
  'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1800&q=80',
)
const unavailableLabel = withFallback(import.meta.env.VITE_PROFILE_IMAGE_UNAVAILABLE_LABEL, 'Image unavailable')

const roleImageByEnv = {
  admin: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_ADMIN,
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1800&q=80',
  ),
  doctor: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_DOCTOR,
    'https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?auto=format&fit=crop&w=1800&q=80',
  ),
  patient: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_PATIENT,
    'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1800&q=80',
  ),
  receptionist: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_RECEPTIONIST,
    'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1800&q=80',
  ),
  pharmacist: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_PHARMACIST,
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1800&q=80',
  ),
  lab_technician: withFallback(
    import.meta.env.VITE_PROFILE_IMAGE_LAB_TECHNICIAN,
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1800&q=80',
  ),
}

const roleTitleByType = {
  admin: 'Operations Leadership',
  doctor: 'Clinical Excellence',
  patient: 'Patient-Centered Care',
  receptionist: 'Front Desk Coordination',
  pharmacist: 'Medication Safety',
  lab_technician: 'Diagnostic Precision',
}

export const getProfileVisual = (role) => {
  const normalizedRole = normalizeRole(role)
  const normalizedAliases = {
    labtech: 'lab_technician',
    labtechnician: 'lab_technician',
  }
  const resolvedRole = normalizedAliases[normalizedRole] || normalizedRole

  return {
    imageUrl: roleImageByEnv[resolvedRole] || roleImageByEnv.patient || defaultImage,
    fallbackImageUrl: roleImageByEnv.patient || defaultImage,
    unavailableLabel,
    title: roleTitleByType[resolvedRole] || 'Healthcare Professional',
    subtitle: 'Real-world healthcare collaboration powered by secure digital workflows.',
  }
}
