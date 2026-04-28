import { useEffect, useMemo, useState } from 'react'

const emptyValue = (field) => {
  if (field.type === 'array') return [field.defaultItem || {}]
  if (field.type === 'multiselect') return []
  return field.defaultValue ?? ''
}

const toInitial = (fields, initialData) => {
  const values = {}
  fields.forEach((field) => {
    values[field.name] = initialData?.[field.name] ?? emptyValue(field)
  })
  return values
}

export const FormModal = ({ title, fields, open, initialData, lookups, submitting, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({})
  const [validationErrors, setValidationErrors] = useState({})

  const normalizedFields = useMemo(() => fields || [], [fields])

  useEffect(() => {
    if (open) {
      setFormData(toInitial(normalizedFields, initialData))
    }
  }, [open, initialData, normalizedFields])

  if (!open) return null

  const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }))

  const validate = () => {
    const errors = {}
    normalizedFields.forEach((field) => {
      const value = formData[field.name]
      const isEmpty = value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0)
      if (field.required && isEmpty) {
        errors[field.name] = `${field.label} is required.`
        return
      }
      if (field.type === 'number' && value !== '' && value !== null && value !== undefined) {
        const numericValue = Number(value)
        if (Number.isNaN(numericValue)) errors[field.name] = `${field.label} must be a number.`
        if (field.min !== undefined && numericValue < field.min) errors[field.name] = `${field.label} must be at least ${field.min}.`
      }
      if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
        errors[field.name] = `${field.label} must be at least ${field.minLength} characters.`
      }
    })
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const renderField = (field) => {
    const value = formData[field.name]
    const options = field.options || lookups?.[field.lookupKey] || []

    if (field.type === 'textarea') {
      return <textarea className="ui-input w-full rounded px-3 py-2" rows={3} value={value || ''} onChange={(e) => setField(field.name, e.target.value)} />
    }

    if (field.type === 'select') {
      return (
        <select className="ui-input w-full rounded px-3 py-2" value={value ?? ''} onChange={(e) => setField(field.name, e.target.value)}>
          <option value="">Select {field.label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'multiselect') {
      return (
        <select
          multiple
          className="ui-input w-full rounded px-3 py-2"
          value={Array.isArray(value) ? value.map(String) : []}
          onChange={(e) =>
            setField(
              field.name,
              Array.from(e.target.selectedOptions).map((option) => Number(option.value)),
            )
          }
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'array') {
      const rows = Array.isArray(value) ? value : []
      return (
        <div className="space-y-2 rounded border p-2" style={{ borderColor: 'var(--border)' }}>
          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {field.children.map((child) => (
                <input
                  key={child.name}
                  type={child.type || 'text'}
                  placeholder={child.label}
                  className="ui-input rounded px-3 py-2"
                  value={row[child.name] ?? ''}
                  onChange={(e) => {
                    const next = [...rows]
                    next[index] = { ...next[index], [child.name]: e.target.value }
                    setField(field.name, next)
                  }}
                />
              ))}
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setField(field.name, [...rows, field.defaultItem || {}])}
              className="ui-btn-secondary rounded px-2 py-1 text-sm"
            >
              + Add Row
            </button>
            <button
              type="button"
              onClick={() => setField(field.name, rows.slice(0, -1))}
              className="ui-btn-secondary rounded px-2 py-1 text-sm"
              disabled={rows.length <= 1}
            >
              - Remove Last
            </button>
          </div>
        </div>
      )
    }

    if (field.type === 'file') {
      return (
        <input
          type="file"
          className="ui-input w-full rounded px-3 py-2"
          onChange={(e) => setField(field.name, e.target.files?.[0] || null)}
        />
      )
    }

    return (
      <input
        type={field.type || 'text'}
        className="ui-input w-full rounded px-3 py-2"
        value={value ?? ''}
        onChange={(e) => setField(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    )
  }

  return (
    <div className="ui-overlay fixed inset-0 z-50 grid place-items-center p-4">
      <div className="ui-card flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="ui-btn-secondary rounded px-2 py-1">
            Close
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!validate()) return
            onSubmit(formData)
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {normalizedFields.map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm font-medium">
                  {field.label}
                  {field.required ? <span className="ui-error-text ml-1">*</span> : null}
                </label>
                {renderField(field)}
                {validationErrors[field.name] ? <p className="ui-error-text mt-1 text-xs">{validationErrors[field.name]}</p> : null}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t px-5 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <button type="button" onClick={onClose} className="ui-btn-secondary rounded px-4 py-2">
              Cancel
            </button>
            <button disabled={submitting} className="ui-btn-primary rounded px-4 py-2">
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
