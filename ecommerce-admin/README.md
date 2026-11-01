# Aurelia — Admin Panel (Phase 3)

React + Vite control panel for the Spring Boot backend (Phase 1). Shares the Aurelia brand
palette with the customer site but restructured as a dense, utilitarian control panel —
sidebar navigation, data tables, modal forms — rather than a marketing surface.

## Setup

```bash
cp .env.example .env      # set VITE_API_BASE_URL if the backend isn't on localhost:8080
npm install
npm run dev                # http://localhost:3001
```

Sign in with the seeded default: **`superadmin` / `ChangeMe123!`** (shown on the login screen
too — change it via Admin Users once you're in).

## Role-based navigation

The sidebar filters itself per signed-in role (`SUPER_ADMIN` sees everything; `PRODUCT_MANAGER`
only sees Products/Categories; etc.) using the same role-to-module mapping as the backend's
`@PreAuthorize` checks — see `src/layouts/AdminLayout.jsx` `NAV_SECTIONS` and
`src/store/slices/authSlice.js` `hasRole()`.

## What's fully wired (real CRUD against the live API)

- **Products** — search, create/edit (including the dynamic attribute editor — add any
  key/value pair like "Material: Gold" or "RAM: 8GB" without touching a database schema),
  image upload, activate/deactivate, delete, low-stock highlighting
- **Categories** — parent/child nesting, create/edit/delete
- **Orders** — list, detail view, status update with remarks, shipping/tracking info
- **Homepage CMS builder** — create/edit sections for all 20 section types (fields shown
  adapt to the type — a newsletter block doesn't show a "linked category" input), up/down
  reordering that calls the reorder endpoint, show/hide, device visibility (web/mobile/both)
- **Static Pages, Coupons, Tax Rules, Site Config, SMTP Config (+ test email), Branding,
  Mobile App Config, Admin Users, Roles & Permissions** — all real create/edit/delete forms

## Known gaps (flagged honestly, not hidden)

- **Reviews page** requires you to paste in a product ID to load its reviews — there's no
  "all pending reviews" endpoint on the backend yet (the public API only returns *approved*
  reviews by design, so a moderation queue needs a new backend endpoint returning unapproved
  ones; it isn't there yet).
- **Audit Log will show as empty** — the backend's `AuditLogService.record(...)` exists but
  isn't yet called from the other services' create/update/delete operations. Wiring that in
  is mechanical (call it at the end of each mutating service method) but wasn't done in this
  pass — flagging clearly rather than shipping a page that quietly does nothing.

Two gaps noted in an earlier pass are now closed: the order detail page has a **Payment**
card (mark-as-paid / refund, wired to `orderApi.updatePaymentStatus` / `refundPayment`), and
**status history** now renders for real — the backend's `OrderResponse` DTO was extended with
a `statusHistory` array populated from `Order.statusHistory`, sorted chronologically.

## Structure

Mirrors the customer site's conventions:
```
src/api/       — one file per backend controller
src/store/     — auth (login/logout/role check) + ui (toasts) slices
src/components/— Modal, DataTable, StatusBadge, ProtectedRoute (role-aware)
src/layouts/   — AdminLayout (sidebar + topbar)
src/pages/     — grouped by domain: products/, categories/, orders/, cms/, content/, settings/
```

## Next phase

Phase 4: the React Native mobile app, consuming the same backend — homepage via
`/api/cms/homepage?device=MOBILE`, force-update/maintenance via `/api/app-config/mobile`.
