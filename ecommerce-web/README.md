# Aurelia — Customer Website (Phase 2)

React + Vite storefront consuming the Spring Boot backend from Phase 1. Jewellery-branded
("Aurelia"), but every page is data-driven off the generic product/category/CMS API, so
re-skinning for another vertical is a design-token change, not a rewrite.

## Design system

- **Palette**: ivory ground (`#FAF6EF`), deep emerald primary (`#0F3D30`), antique-gold accent
  (`#AD8548`) — see `src/styles/tokens.css` for the full token set.
- **Type**: Fraunces (display serif) + Inter (body) + IBM Plex Mono (price tags / eyebrows,
  like a hallmark stamp).
- **Signature interaction**: a single diagonal light-sweep across product images on hover
  (`.product-card__sweep`), evoking light catching a cut facet — restrained to one pass, not
  a looping shimmer.

## Setup

```bash
cp .env.example .env       # set VITE_API_BASE_URL if the backend isn't on localhost:8080
npm install
npm run dev                # http://localhost:3000
```

The dev server proxies `/api/*` to `http://localhost:8080` (see `vite.config.js`), so you can
also leave `VITE_API_BASE_URL` unset and just run the Phase 1 backend alongside this.

## What's wired up (all real, not placeholder)

- **Dynamic homepage** (`src/pages/Home.jsx` + `src/components/cms/`) — renders whatever
  sections the admin panel creates via `/api/admin/cms/sections`, in order, with a distinct
  component per `sectionType` (hero, carousel, category grid, featured/new/best-seller product
  rows, offer banner, image+text, testimonials, newsletter, static block, etc.)
- **Catalog** — search/filter/sort (`/shop`, `/category/:slug`, `/search`), product detail with
  dynamic attribute table (the jewellery-specific fields — material, purity, weight — render
  generically from whatever attributes the admin attached to that product)
- **Cart** — guest (via an `X-Guest-Token` header, generated and persisted in `localStorage`)
  and logged-in, coupon apply/remove, quantity controls
- **Checkout → Orders** — address selection/creation, payment method choice, order placement,
  order history, order detail, cancellation
- **Auth** — register/login/logout with silent access-token refresh on 401 (see
  `src/api/client.js` interceptor)
- **Wishlist, Addresses, Reviews (read), Static pages** (About/Privacy/Terms/FAQ/etc. — content
  fully admin-managed via `/api/pages/:slug`)

## What's intentionally minimal for this phase

- Review **submission** UI isn't built (the API call exists in `reviewApi.create`, just no form)
- Payment gateway UI (Razorpay/Stripe checkout widget) isn't integrated — `paymentMethod` is
  collected and sent, but card entry itself needs a gateway SDK, which is a deployment-specific
  choice left to you
- No SSR/SEO prerendering (fine for an admin-tool-adjacent storefront demo; add Next.js or
  vite-plugin-ssr later if organic search matters)

## Structure

```
src/
  api/          — one file per backend controller, all requests go through client.js
  store/        — Redux Toolkit slices: auth, cart, wishlist, ui (toasts)
  components/   — Header, Footer, ProductCard, cms/ (CmsSectionRenderer + one file per section type)
  pages/        — route-level components, account/ for the authenticated area
  layouts/      — MainLayout (header/footer/toast shell)
  styles/       — tokens.css (the whole design system in one file)
```

## Next phase

Phase 3 (admin panel) will consume the same backend's `/api/admin/**` routes — most notably
the CMS section builder, which needs a real UI for the `metadataJson`/reorder endpoints this
website's renderer already knows how to consume.
