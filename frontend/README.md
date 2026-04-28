# Medicore HMS Frontend (FYP)

Professional, responsive React + Vite frontend for a Django REST Hospital Management backend.

This project is API-driven and role-based for:
- `admin`
- `doctor`
- `patient`
- `receptionist`
- `pharmacist`
- `lab_technician`

## Tech Stack

- React (JSX) + Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- React Hook Form

## Backend Integration Rules

- No backend code changes required.
- No hardcoded IDs, totals, roles, or fake dashboard numbers.
- API base URL must come from env variable.
- Authorization uses JWT access + refresh flow.
- Role/navigation behavior comes from backend user profile/dashboard response.

## Environment Setup

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_TIMEOUT_MS=15000
VITE_API_RETRY_COUNT=1
VITE_API_RETRY_DELAY_MS=500
```

For production, use `.env.production.example`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_API_TIMEOUT_MS=20000
VITE_API_RETRY_COUNT=2
VITE_API_RETRY_DELAY_MS=800
```

## Run Locally

```bash
npm install
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

## Architecture Highlights

- Centralized API client: `src/api/http.js`
  - attaches bearer token
  - refreshes access token automatically
  - clears session on refresh failure
  - timeout and retry policy for safe/idempotent requests
- Centralized endpoints map: `src/api/endpoints.js`
- API adapters for inconsistent analytics keys: `src/utils/reportAdapters.js`
- Role-based navigation: `src/components/layout/navigation.js`
- Shared CRUD engine:
  - `src/pages/ResourcePage.jsx`
  - `src/components/common/EntityTable.jsx`
  - `src/components/common/FormModal.jsx`
- Global toast feedback: `src/context/ToastContext.jsx`
- Route-level UI fallback boundary: `src/components/common/RouteErrorBoundary.jsx`

## Implemented Modules

- Auth: register, login, profile, change password, logout
- Dashboard (role-aware + analytics cards)
- Doctors
- Doctor schedules
- Patients
- Appointments
- Medical records (nested prescriptions input)
- Prescriptions (list)
- Pharmacy medicines
- Pharmacy orders
- Pharmacy order items
- Lab tests
- Lab orders
- Lab reports (multipart file upload)
- Billing
- Reports (revenue, appointments, lab, pharmacy charts)

## Role-Wise Demo Checklist

### Admin
- Login and verify full sidebar visibility.
- Create and update doctor/patient/appointment.
- Create medical record and confirm nested prescriptions save.
- Create bill from appointment and verify backend-calculated totals.
- Open reports page and verify analytics render.

### Receptionist
- Login and verify operational pages are available.
- Create patient and appointment.
- Update appointment status.
- Create bill and mark pending/paid where permitted.

### Doctor
- Login and verify own scoped data appears.
- Create/update own schedule.
- View own appointments and patients.
- Create medical record for allowed appointments.
- Create lab order for own patient where backend allows.

### Patient
- Login and verify read-only/scoped experience.
- View own profile, appointments, records, lab reports, pharmacy orders, bills.
- Confirm restricted actions show backend-safe behavior.

### Pharmacist
- Login and manage medicines.
- Create pharmacy order with order items.
- Validate stock changes reflected in API responses.

### Lab Technician
- Login and manage lab tests.
- Create/upload lab report file for valid lab order.

## Deployment Notes

- Build output is generated in `dist/`.
- Serve `dist/` using any static host (Netlify, Vercel static, Nginx, etc.).
- Ensure backend CORS allows frontend origin.
- Ensure backend serves media files for report attachments.
- Configure production env vars before build.

## Important Verification Before Viva

- Confirm backend is running and reachable from `VITE_API_BASE_URL`.
- Test all 6 roles with real backend users.
- Validate unauthorized access returns clear UI messages.
- Validate reports still render if backend returns missing/renamed keys.
- Validate refresh token flow by waiting for access token expiry and retrying API calls.
