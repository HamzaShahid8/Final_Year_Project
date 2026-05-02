const withFallback = (value, fallback) => (value && value.trim() ? value.trim() : fallback)

const sharedAuthImageUrl = withFallback(
  import.meta.env.VITE_AUTH_SHARED_IMAGE || import.meta.env.VITE_AUTH_REGISTER_IMAGE,
  'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=80',
)

export const authVisualConfig = {
  login: {
    title: 'Connected Care Starts Here',
    subtitle: 'Secure sign-in for doctors, nurses, pharmacists, and patient operations.',
    imageUrl: sharedAuthImageUrl,
  },
  register: {
    title: 'Build Your Care Team Access',
    subtitle: 'Create role-based accounts for a safer and more efficient hospital workflow.',
    imageUrl: sharedAuthImageUrl,
  },
}

export const authFormConfig = {
  login: {
    heading: 'Sign In',
    submitIdleLabel: 'Sign In',
    submitLoadingLabel: 'Signing in...',
    footerPrompt: 'New user?',
    footerLinkLabel: 'Create account',
    footerLinkTo: '/register',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
  },
  register: {
    heading: 'Create Account',
    submitIdleLabel: 'Register',
    submitLoadingLabel: 'Submitting...',
    footerPrompt: 'Already registered?',
    footerLinkLabel: 'Sign in',
    footerLinkTo: '/login',
    requiredFieldMessage: 'Required',
  },
}

export const authLayoutConfig = {
  shellClassName: 'ui-auth-shell w-full max-w-6xl',
  formClassName: 'ui-card ui-auth-form w-full space-y-4 rounded-xl p-6 shadow',
}
