import { ResourcePage } from '../ResourcePage'
import { endpoints } from '../../api/endpoints'

const config = {
  title: 'Prescriptions',
  description: 'Standalone prescription records.',
  endpoint: endpoints.prescriptions,
  searchPlaceholder: 'Search by medicine name',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'medicine_name', label: 'Medicine' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'duration', label: 'Duration' },
    { key: 'created_at', label: 'Created At' },
  ],
  allowCreate: false,
  allowEdit: false,
  allowDelete: false,
}

export const PrescriptionsPage = () => <ResourcePage config={config} />
