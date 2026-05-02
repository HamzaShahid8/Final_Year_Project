import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/httpError'
import { authFormConfig, authLayoutConfig, authVisualConfig } from '../../config/authVisualConfig'

const roles = ['admin', 'doctor', 'patient', 'receptionist', 'pharmacist', 'lab_technician']

export const RegisterPage = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const visual = authVisualConfig.register
  const form = authFormConfig.register

  const onSubmit = async (values) => {
    setApiError('')
    try {
      await registerUser(values)
      navigate('/login')
    } catch (error) {
      setApiError(getErrorMessage(error, error.message || 'Registration failed'))
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4 md:p-6">
      <div className={authLayoutConfig.shellClassName}>
        <div className="ui-auth-visual">
          <img src={visual.imageUrl} alt={visual.title} loading="lazy" />
          <div className="ui-auth-overlay">
            <p className="text-xl font-semibold">{visual.title}</p>
            <p className="mt-1 text-sm text-slate-200">{visual.subtitle}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={authLayoutConfig.formClassName}>
          <h1 className="text-2xl font-bold">{form.heading}</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input className="ui-input w-full rounded px-3 py-2" {...register('username', { required: form.requiredFieldMessage })} />
              {errors.username && <p className="ui-error-text text-xs">{errors.username.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" className="ui-input w-full rounded px-3 py-2" {...register('email', { required: form.requiredFieldMessage })} />
              {errors.email && <p className="ui-error-text text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone Number</label>
              <input className="ui-input w-full rounded px-3 py-2" {...register('phn_no', { required: form.requiredFieldMessage })} />
              {errors.phn_no && <p className="ui-error-text text-xs">{errors.phn_no.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select className="ui-input w-full rounded px-3 py-2" {...register('role', { required: form.requiredFieldMessage })}>
                <option value="">Select role</option>
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              {errors.role && <p className="ui-error-text text-xs">{errors.role.message}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="ui-input w-full rounded px-3 py-2" {...register('password', { required: form.requiredFieldMessage, minLength: 6 })} />
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
