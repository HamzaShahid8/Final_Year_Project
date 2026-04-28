import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { RouteErrorBoundary } from './components/common/RouteErrorBoundary'
import { AppShell } from './components/layout/AppShell'
import { resourceConfigs } from './config/resourceConfigs'

const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage })))
const ResourcePage = lazy(() => import('./pages/ResourcePage').then((m) => ({ default: m.ResourcePage })))
const MedicalRecordsPage = lazy(() => import('./pages/modules/MedicalRecordsPage').then((m) => ({ default: m.MedicalRecordsPage })))
const PharmacyOrdersPage = lazy(() => import('./pages/modules/PharmacyOrdersPage').then((m) => ({ default: m.PharmacyOrdersPage })))
const LabReportsPage = lazy(() => import('./pages/modules/LabReportsPage').then((m) => ({ default: m.LabReportsPage })))
const PrescriptionsPage = lazy(() => import('./pages/modules/PrescriptionsPage').then((m) => ({ default: m.PrescriptionsPage })))
const ReportsPage = lazy(() => import('./pages/modules/ReportsPage').then((m) => ({ default: m.ReportsPage })))

const resourceRoutes = [
  { path: '/doctors', config: resourceConfigs.doctors },
  { path: '/doctor-schedules', config: resourceConfigs.doctorSchedules },
  { path: '/patients', config: resourceConfigs.patients },
  { path: '/appointments', config: resourceConfigs.appointments },
  { path: '/pharmacy/medicines', config: resourceConfigs.medicines },
  { path: '/pharmacy/order-items', config: resourceConfigs.pharmacyOrderItems },
  { path: '/laboratory/tests', config: resourceConfigs.labTests },
  { path: '/laboratory/orders', config: resourceConfigs.labOrders },
  { path: '/billing/bills', config: resourceConfigs.bills },
]

function App() {
  const withBoundary = (node) => <RouteErrorBoundary>{node}</RouteErrorBoundary>

  return (
    <Suspense fallback={<div className="ui-text-muted grid min-h-screen place-items-center">Loading page...</div>}>
      <Routes>
        <Route path="/login" element={withBoundary(<LoginPage />)} />
        <Route path="/register" element={withBoundary(<RegisterPage />)} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={withBoundary(<DashboardPage />)} />
          <Route path="profile" element={withBoundary(<ProfilePage />)} />
          <Route path="change-password" element={withBoundary(<ChangePasswordPage />)} />
          {resourceRoutes.map((route) => (
            <Route
              key={route.path + route.config.title}
              path={route.path}
              element={withBoundary(<ResourcePage config={route.config} />)}
            />
          ))}
          <Route path="/medical-records" element={withBoundary(<MedicalRecordsPage />)} />
          <Route path="/prescriptions" element={withBoundary(<PrescriptionsPage />)} />
          <Route path="/pharmacy/orders" element={withBoundary(<PharmacyOrdersPage />)} />
          <Route path="/laboratory/reports" element={withBoundary(<LabReportsPage />)} />
          <Route path="/reports" element={withBoundary(<ReportsPage />)} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
