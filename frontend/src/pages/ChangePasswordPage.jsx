import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

export const ChangePasswordPage = () => {
  const { changePassword } = useAuth()
  const [message, setMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (values) => {
    setMessage('')
    setApiError('')
    try {
      await changePassword(values)
      setMessage('Password updated successfully.')
      reset()
    } catch (error) {
      setApiError(error.response?.data?.error || 'Unable to update password.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ui-card max-w-xl space-y-4 rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold">Change Password</h2>
      <div>
        <label className="mb-1 block text-sm font-medium">Old Password</label>
        <input type="password" className="ui-input w-full rounded px-3 py-2" {...register('old_password', { required: 'Required' })} />
        {errors.old_password && <p className="ui-error-text text-xs">{errors.old_password.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">New Password</label>
        <input type="password" className="ui-input w-full rounded px-3 py-2" {...register('new_password', { required: 'Required', minLength: 6 })} />
        {errors.new_password && <p className="ui-error-text text-xs">{errors.new_password.message}</p>}
      </div>
      {message && <p className="ui-alert-success rounded px-3 py-2 text-sm">{message}</p>}
      {apiError && <p className="ui-alert-danger rounded px-3 py-2 text-sm">{apiError}</p>}
      <button disabled={isSubmitting} className="ui-btn-primary rounded px-4 py-2 font-medium disabled:opacity-60">
        {isSubmitting ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}
