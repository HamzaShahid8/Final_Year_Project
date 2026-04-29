import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/httpError'
import { authFormConfig, authVisualConfig } from '../../config/authVisualConfig'

export const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const visual = authVisualConfig.login
  const form = authFormConfig.login

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await login(values)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setApiError(getErrorMessage(error, 'Login failed. Please check your credentials.'))
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4 md:p-6">
      <div className="ui-auth-shell w-full max-w-6xl">
        <div className="ui-auth-visual">
          <img src={visual.imageUrl} alt={visual.title} loading="lazy" />
          <div className="ui-auth-overlay">
            <p className="text-xl font-semibold">{visual.title}</p>
            <p className="mt-1 text-sm text-slate-200">{visual.subtitle}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="ui-card w-full space-y-4 rounded-xl p-6 shadow">
          <h1 className="text-2xl font-bold">{form.heading}</h1>
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input className="ui-input w-full rounded px-3 py-2" {...register('username', { required: form.usernameRequired })} />
            {errors.username && <p className="ui-error-text text-xs">{errors.username.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="ui-input w-full rounded px-3 py-2" {...register('password', { required: form.passwordRequired })} />
            {errors.password && <p className="ui-error-text text-xs">{errors.password.message}</p>}
          </div>
          {apiError && <p className="ui-alert-danger rounded px-3 py-2 text-xs">{apiError}</p>}
          <button disabled={isSubmitting} className="ui-btn-primary w-full rounded px-4 py-2 font-medium disabled:opacity-60">
            {isSubmitting ? form.submitLoadingLabel : form.submitIdleLabel}
          </button>
          <p className="ui-text-muted text-sm">
            {form.footerPrompt} <Link className="ui-link underline" to={form.footerLinkTo}>{form.footerLinkLabel}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
