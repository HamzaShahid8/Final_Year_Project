import { ResourcePage } from '../ResourcePage'
import { endpoints } from '../../api/endpoints'

const config = {
  title: 'Lab Reports',
  description: 'Upload and manage lab reports with result files.',
  endpoint: endpoints.labReports,
  permissions: {
    create: ['admin', 'receptionist', 'lab_technician'],
    edit: ['admin', 'receptionist', 'lab_technician'],
    delete: ['admin', 'receptionist', 'lab_technician'],
  },
  searchPlaceholder: 'Search reports by result',
  multipart: true,
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'lab_order', label: 'Lab Order' },
    { key: 'result', label: 'Result' },
    { key: 'report_file', label: 'File' },
    { key: 'created_at', label: 'Created At' },
  ],
  lookups: [{ key: 'labOrders', endpoint: endpoints.labOrders, labelBuilder: (row) => `Lab Order ${row.id}` }],
  formFields: [
    { name: 'lab_order', label: 'Lab Order', type: 'select', lookupKey: 'labOrders', required: true },
    { name: 'result', label: 'Result', type: 'textarea', required: true, minLength: 3 },
    { name: 'report_file', label: 'Report File', type: 'file' },
  ],
  payloadBuilder: (values) => {
    const data = new FormData()
    data.append('lab_order', Number(values.lab_order))
    data.append('result', values.result || '')
    if (values.report_file) data.append('report_file', values.report_file)
    return data
  },
}

export const LabReportsPage = () => <ResourcePage config={config} />
