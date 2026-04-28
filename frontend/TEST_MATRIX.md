# Test Matrix (Role x Module)

Use this checklist during final QA and viva rehearsal.

Legend:
- ✅ Expected access
- 🔒 Should be denied/scoped by backend

## Admin

- ✅ Dashboard, Reports
- ✅ Doctors, Schedules, Patients, Appointments
- ✅ Medical Records, Prescriptions (where backend allows)
- ✅ Pharmacy (medicines/orders/order items)
- ✅ Laboratory (tests/orders/reports)
- ✅ Billing

## Receptionist

- ✅ Dashboard, Reports (as permitted by backend)
- ✅ Doctors, Schedules, Patients, Appointments
- ✅ Billing
- ✅ Medical Records (as permitted)
- 🔒 restricted actions should return backend error where not allowed

## Doctor

- ✅ Dashboard (doctor-scoped)
- ✅ Own schedules
- ✅ Own appointments/patients (scoped)
- ✅ Create medical records for own patients (backend-permitted)
- ✅ Create lab orders for own patients (backend-permitted)
- 🔒 cannot perform admin-only destructive actions

## Patient

- ✅ Own dashboard/profile
- ✅ Own appointments/records/reports/orders/bills (scoped)
- 🔒 no unauthorized create/update/delete outside patient permissions

## Pharmacist

- ✅ Medicine inventory management
- ✅ Pharmacy orders and order items
- ✅ stock-sensitive order operations
- 🔒 non-pharmacy modules should be restricted

## Lab Technician

- ✅ Lab tests management
- ✅ Lab reports upload/update
- ✅ Lab orders visibility per backend permissions
- 🔒 non-lab restricted operations denied

## Cross-Cutting Functional Tests

- ✅ Login + token refresh flow
- ✅ Logout invalidates session
- ✅ Route protection redirects unauthenticated users
- ✅ API errors display clearly (permission, validation, server)
- ✅ Search and sorting work on list pages
- ✅ Pagination controls work when backend paginates
- ✅ Status badges show expected backend statuses
- ✅ Responsive behavior on desktop/tablet/mobile

## High-Risk Regression Checks

- Medical record nested prescriptions payload
- Pharmacy order item quantity/stock handling
- Lab report multipart upload
- Billing totals sourced from backend response
- Reports rendering with inconsistent key names
