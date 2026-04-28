# Backend Quirks and Examiner Q&A Notes

This file documents known backend integration quirks and how the frontend handles them without modifying backend code.

## 1) Login response may not include role

- Observation: login uses default SimpleJWT serializer in backend.
- Frontend handling: calls `/accounts/profile/` and `/accounts/dashboards/` right after login to fetch role/profile context.

## 2) Phone key naming inconsistency

- Observation: profile endpoint returns `phn-no`, registration uses `phn_no`.
- Frontend handling: adapter normalization maps both keys to a unified `phone` field in UI state.

## 3) Patient serializer field differences

- Observation: patient model has doctor relation but serializer payload may not expose all model fields.
- Frontend handling: only relies on serializer-exposed fields for patient forms and tables.

## 4) Prescription endpoint filtering risk

- Observation: standalone prescription filtering appears fragile in backend.
- Frontend handling: primary clinical workflow uses nested prescriptions under medical records.

## 5) Analytics key inconsistencies

- Observation: reports can return inconsistent keys (example: `doctor_fee _total`, `total`).
- Frontend handling: `reportAdapters` normalizes metric keys before rendering cards/charts.

## 6) Permission mismatch between UI expectation and backend truth

- Observation: some actions may appear logically allowed but backend denies based on permissions.
- Frontend handling:
  - role-aware visibility to reduce noise
  - backend remains final authority
  - clear API error messages shown to user

## 7) Billing computed values

- Observation: totals/fees are backend-derived.
- Frontend handling: does not hardcode totals; displays backend-calculated values from response.

## 8) File upload behavior (Lab Reports)

- Observation: report files require multipart handling.
- Frontend handling: uses `FormData` and multipart request for lab report create/update flow.

---

## Suggested Viva Answers (Short)

- **Why no hardcoded role logic?**  
  Role is fetched from backend profile/dashboard after authentication.

- **How do you ensure reliability with backend inconsistencies?**  
  Added an adapter layer to normalize response key variations and defensive rendering.

- **How is authorization enforced?**  
  UI is role-aware for usability, but backend permissions are final and errors are surfaced.

- **How are token expiries handled?**  
  Axios interceptor refreshes access token using refresh token and retries original request.
