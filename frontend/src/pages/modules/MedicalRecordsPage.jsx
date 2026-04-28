import { ResourcePage } from '../ResourcePage'
import { endpoints } from '../../api/endpoints'

const config = {
  title: 'Medical Records',
  description: 'Create records with nested prescriptions.',
  endpoint: endpoints.medicalRecords,
  permissions: {
    create: ['admin', 'receptionist', 'doctor'],
    edit: ['admin', 'receptionist', 'doctor'],
    delete: ['admin', 'receptionist'],
  },
  searchPlaceholder: 'Search diagnosis, notes, symptoms',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'appointment', label: 'Appointment' },
    { key: 'patient', label: 'Patient' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'follow_up_date', label: 'Follow Up' },
  ],
  lookups: [
    { key: 'appointments', endpoint: endpoints.appointments, labelBuilder: (row) => `Appointment ${row.id}` },
    { key: 'patients', endpoint: endpoints.patients, labelBuilder: (row) => `Patient ${row.id}` },
    { key: 'doctors', endpoint: endpoints.doctors, labelBuilder: (row) => row.username || `Doctor ${row.id}` },
  ],
  formFields: [
    { name: 'appointment', label: 'Appointment', type: 'select', lookupKey: 'appointments', required: true },
    { name: 'patient', label: 'Patient', type: 'select', lookupKey: 'patients', required: true },
    { name: 'doctor', label: 'Doctor', type: 'select', lookupKey: 'doctors' },
    { name: 'symptoms', label: 'Symptoms', type: 'textarea' },
    { name: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    { name: 'follow_up_date', label: 'Follow Up Date', type: 'date' },
    {
      name: 'prescriptions',
      label: 'Prescriptions',
      type: 'array',
      defaultItem: { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      children: [
        { name: 'medicine_name', label: 'Medicine' },
        { name: 'dosage', label: 'Dosage' },
        { name: 'frequency', label: 'Frequency' },
        { name: 'duration', label: 'Duration' },
        { name: 'instructions', label: 'Instructions' },
      ],
    },
  ],
  payloadBuilder: (values) => ({
    ...values,
    appointment: Number(values.appointment),
    patient: Number(values.patient),
    doctor: values.doctor ? Number(values.doctor) : undefined,
    prescriptions: (values.prescriptions || []).filter((row) => row.medicine_name),
  }),
}

export const MedicalRecordsPage = () => <ResourcePage config={config} />
