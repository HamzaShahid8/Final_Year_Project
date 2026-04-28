import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/httpError'
import { authVisualConfig } from '../../config/authVisualConfig'

const roles = ['admin', 'doctor', 'patient', 'receptionist', 'pharmacist', 'lab_technician']

export const RegisterPage = () => {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const visual = authVisualConfig.register

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
      <div className="ui-auth-shell w-full max-w-6xl">
        <div className="ui-auth-visual">
          <img src={visual.imageUrl} alt={visual.title} loading="lazy" />
          <div className="ui-auth-overlay">
            <p className="text-xl font-semibold">{visual.title}</p>
            <p className="mt-1 text-sm text-slate-200">{visual.subtitle}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="ui-card w-full space-y-4 rounded-xl p-6 shadow">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <input className="ui-input w-full rounded px-3 py-2" {...register('username', { required: 'Required' })} />
              {errors.username && <p className="ui-error-text text-xs">{errors.username.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" className="ui-input w-full rounded px-3 py-2" {...register('email', { required: 'Required' })} />
              {errors.email && <p className="ui-error-text text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone Number</label>
              <input className="ui-input w-full rounded px-3 py-2" {...register('phn_no', { required: 'Required' })} />
              {errors.phn_no && <p className="ui-error-text text-xs">{errors.phn_no.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <select className="ui-input w-full rounded px-3 py-2" {...register('role', { required: 'Required' })}>
                <option value="">Select role</option>
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              {errors.role && <p className="ui-error-text text-xs">{errors.role.message}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="ui-input w-full rounded px-3 py-2" {...register('password', { required: 'Required', minLength: 6 })} />
            {errors.password && <p className="ui-error-text text-xs">{errors.password.message}</p>}
          </div>
          {apiError && <p className="ui-alert-danger rounded px-3 py-2 text-xs">{apiError}</p>}
          <button disabled={isSubmitting} className="ui-btn-primary w-full rounded px-4 py-2 font-medium disabled:opacity-60">
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
          <p className="ui-text-muted text-sm">
            Already registered? <Link className="ui-link underline" to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
