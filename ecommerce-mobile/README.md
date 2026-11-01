# Aurelia — Mobile App (Phase 4)

Expo / React Native app consuming the same Spring Boot backend as the web storefront and
admin panel (Phases 1–3). Same brand, same API contracts, native components instead of DOM.

## Setup

This was written file-by-file in a sandboxed environment with no network access, so it has
**not** been run through Metro or a simulator — treat it as a complete, carefully cross-checked
scaffold to `npm install` and run yourself, not a verified build. Steps:

```bash
npm install
cp .env.example .env      # optional; app.json's expo.extra.apiBaseUrl already points at localhost:8080
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with Expo Go.
**On a physical device**, `localhost:8080` won't reach your computer — set
`EXPO_PUBLIC_API_BASE_URL` (or edit `app.json`'s `expo.extra.apiBaseUrl`) to your machine's LAN
IP, e.g. `http://192.168.1.20:8080/api`.

## What's wired up (real API calls, not mocked)

- **Dynamic homepage** (`HomeScreen` + `components/cms/`) — same section-type contract as the
  web app, fetched from `/api/cms/homepage?device=MOBILE`, pull-to-refresh
- **Catalog** — category chips + search (`ShopScreen`), product detail with the dynamic
  attribute table, related products, reviews
- **Cart** — guest (device-generated token persisted in AsyncStorage) and logged-in, coupons
- **Checkout → Orders** — address selection/creation, payment method choice, order placement,
  order history, order detail with status history, cancellation
- **Auth** — register/login/logout, silent access-token refresh on 401 via the same interceptor
  pattern as the web client, session-expiry handled by forcing sign-out
- **Wishlist, Addresses, Account menu, static content pages** (About/Privacy/FAQ/etc.)
- **App-level gates**: on launch, the app calls `/api/app-config/mobile` and will show a
  maintenance screen if `maintenanceMode` is on, or a force-update screen if the configured
  version doesn't match the running app's version and `forceUpdate{Android,iOS}` is set — this
  is the mechanism the "Mobile App Configuration" admin module controls

## Design system

Same tokens as web/admin (`src/theme/tokens.js`): ivory ground, deep emerald primary,
antique-gold accent, Fraunces + Inter + IBM Plex Mono — loaded via `@expo-google-fonts/*`
packages rather than CSS `<link>` tags. No DOM-specific signature interaction (the web's
hover light-sweep doesn't translate to touch), so product cards use a plain fade-in image
transition instead of inventing a gimmick that doesn't fit touch interaction.

## What's intentionally minimal for this phase

- No push notifications (would need Expo push tokens registered against the backend's
  `Notification` entity — the data model supports it, the wiring doesn't exist yet)
- No native payment SDKs (Razorpay/Stripe React Native SDKs) — payment method is selected and
  sent, card entry itself is a deployment-specific integration
- No deep linking / universal links configuration
- Review **submission** isn't built (same gap as the web app — API exists, no form)

## Structure

Mirrors the web app's conventions, translated to RN:
```
src/api/         — one file per backend controller (AsyncStorage instead of localStorage)
src/store/       — Redux Toolkit: auth, cart, wishlist, ui (toasts)
src/components/  — Screen, Button, TextField, ProductCard, cms/ (CmsSectionRenderer + per-type)
src/screens/     — one file per screen, account/ for the authenticated area
src/navigation/  — MainTabs (bottom tabs) + RootNavigator (stack over the tabs)
src/theme/       — tokens.js, the whole design system as a JS object
App.js           — font loading, Redux/Navigation providers, auth bootstrap, maintenance gate
```

## All four phases, together

1. **Backend** (`ecommerce-backend/`) — Spring Boot API, MySQL/H2, JWT auth, all 30 modules
2. **Customer website** (`ecommerce-web/`) — React + Vite storefront
3. **Admin panel** (`ecommerce-admin/`) — React + Vite control panel
4. **Mobile app** (`ecommerce-mobile/`, this one) — Expo / React Native

All three frontends speak to the same backend and the same CMS-driven homepage contract —
change a homepage section in the admin panel and it appears, correctly rendered, on both the
website and this app.
