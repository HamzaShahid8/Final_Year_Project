# Medicore HMS Frontend Demo Script (5-7 Minutes)

## 1) Opening (30-45 sec)

- Project: Final Year Project Hospital Management System frontend.
- Stack: React + Vite + Tailwind, API-driven with Django REST backend.
- Key objective: no hardcoded data; all modules consume live backend endpoints.

## 2) Architecture Overview (45-60 sec)

- Show `README.md` architecture section briefly.
- Mention:
  - centralized API client (`src/api/http.js`)
  - endpoint map (`src/api/endpoints.js`)
  - JWT access/refresh flow
  - role-based navigation using backend role
  - reusable CRUD engine (`ResourcePage`, `EntityTable`, `FormModal`)

## 3) Authentication Flow (60 sec)

- Register a user (or show pre-created users if email worker is slow).
- Login and show protected routing.
- Open profile page and point out normalized phone handling.
- Show logout.

## 4) Role-Based Navigation (60 sec)

- Login as 2-3 roles quickly (Admin, Doctor, Patient).
- Show sidebar changes by role.
- Mention backend remains source of truth for authorization.

## 5) Core Workflows (2-3 min)

- Admin/Receptionist:
  - create patient
  - create appointment
  - create bill (show backend-calculated totals)
- Doctor:
  - create medical record with nested prescriptions
  - create lab order
- Pharmacist/Lab Technician:
  - create pharmacy order with items
  - upload lab report file (multipart)

## 6) Analytics and Reports (45-60 sec)

- Open dashboard and reports.
- Show cards + charts populated from live APIs.
- Mention adapter layer handles inconsistent backend metric keys safely.

## 7) Engineering Quality Highlights (30-45 sec)

- lazy-loaded routes (performance)
- debounced search and pagination-ready list pages
- route error boundaries
- global toasts
- responsive layout for desktop/tablet/mobile

## 8) Closing (15-20 sec)

- Reiterate: complete end-to-end frontend, backend untouched, role-based, API-driven, production-style architecture.
