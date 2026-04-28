import {
  CalendarCheck2,
  ClipboardPlus,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Receipt,
  UserRound,
  Users,
} from 'lucide-react'

const rolePages = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: UserRound },
    { to: '/doctors', label: 'Doctors', icon: Users },
    { to: '/doctor-schedules', label: 'Schedules', icon: CalendarCheck2 },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/appointments', label: 'Appointments', icon: ClipboardPlus },
    { to: '/medical-records', label: 'Medical Records', icon: ClipboardPlus },
    { to: '/pharmacy/medicines', label: 'Pharmacy', icon: Pill },
    { to: '/laboratory/tests', label: 'Laboratory', icon: FlaskConical },
    { to: '/billing/bills', label: 'Billing', icon: Receipt },
    { to: '/reports', label: 'Reports', icon: LayoutDashboard },
  ],
  receptionist: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/doctors', label: 'Doctors', icon: Users },
    { to: '/doctor-schedules', label: 'Schedules', icon: CalendarCheck2 },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/appointments', label: 'Appointments', icon: ClipboardPlus },
    { to: '/billing/bills', label: 'Billing', icon: Receipt },
    { to: '/reports', label: 'Reports', icon: LayoutDashboard },
  ],
  doctor: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: UserRound },
    { to: '/doctor-schedules', label: 'My Schedules', icon: CalendarCheck2 },
    { to: '/appointments', label: 'Appointments', icon: ClipboardPlus },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/medical-records', label: 'Medical Records', icon: ClipboardPlus },
    { to: '/laboratory/orders', label: 'Lab Orders', icon: FlaskConical },
    { to: '/billing/bills', label: 'Billing', icon: Receipt },
  ],
  patient: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: UserRound },
    { to: '/appointments', label: 'Appointments', icon: ClipboardPlus },
    { to: '/medical-records', label: 'Medical Records', icon: ClipboardPlus },
    { to: '/pharmacy/orders', label: 'Pharmacy Orders', icon: Pill },
    { to: '/laboratory/reports', label: 'Lab Reports', icon: FlaskConical },
    { to: '/billing/bills', label: 'Bills', icon: Receipt },
  ],
  pharmacist: [
    { to: '/pharmacy/medicines', label: 'Medicines', icon: Pill },
    { to: '/pharmacy/orders', label: 'Orders', icon: ClipboardPlus },
    { to: '/pharmacy/order-items', label: 'Order Items', icon: ClipboardPlus },
  ],
  lab_technician: [
    { to: '/laboratory/tests', label: 'Lab Tests', icon: FlaskConical },
    { to: '/laboratory/orders', label: 'Lab Orders', icon: ClipboardPlus },
    { to: '/laboratory/reports', label: 'Lab Reports', icon: ClipboardPlus },
  ],
}

export const getNavigationByRole = (role) => rolePages[role] ?? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
