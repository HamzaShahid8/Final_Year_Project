import { ResourcePage } from '../ResourcePage'
import { endpoints } from '../../api/endpoints'

const config = {
  title: 'Pharmacy Orders',
  description: 'Create pharmacy orders with medicine items.',
  endpoint: endpoints.pharmacyOrders,
  permissions: {
    create: ['admin', 'receptionist', 'pharmacist'],
    edit: ['admin', 'receptionist', 'pharmacist'],
    delete: ['admin', 'receptionist', 'pharmacist'],
  },
  searchPlaceholder: 'Search by patient or medical record',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient' },
    { key: 'medical_record', label: 'Medical Record' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'created_at', label: 'Created At' },
  ],
  lookups: [
    { key: 'patients', endpoint: endpoints.patients, labelBuilder: (row) => `Patient ${row.id}` },
    { key: 'medicalRecords', endpoint: endpoints.medicalRecords, labelBuilder: (row) => `Record ${row.id}` },
    { key: 'medicines', endpoint: endpoints.medicines, labelBuilder: (row) => `${row.name} (Stock ${row.stock_quantity})` },
  ],
  formFields: [
    { name: 'patient', label: 'Patient', type: 'select', lookupKey: 'patients', required: true },
    { name: 'medical_record', label: 'Medical Record', type: 'select', lookupKey: 'medicalRecords', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
      ],
    },
    {
      name: 'items',
      label: 'Order Items',
      type: 'array',
      defaultItem: { medicine: '', quantity: 1 },
      children: [
        { name: 'medicine', label: 'Medicine ID', type: 'number' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
      ],
    },
  ],
  payloadBuilder: (values) => ({
    patient: Number(values.patient),
    medical_record: Number(values.medical_record),
    status: values.status,
    items: (values.items || [])
      .filter((item) => item.medicine && item.quantity)
      .map((item) => ({ medicine: Number(item.medicine), quantity: Number(item.quantity) })),
  }),
}

export const PharmacyOrdersPage = () => <ResourcePage config={config} />
