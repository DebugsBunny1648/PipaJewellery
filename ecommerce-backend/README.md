# Ecommerce Platform — Backend (Phase 1)

A generic, extensible ecommerce backend built with Spring Boot + **MongoDB**. Sample data and
business context are jewellery-first, but the product model is category-agnostic via a dynamic
attribute system — the same `products` collection serves fashion, electronics, home decor,
beauty, or any other category without a schema migration.

> **Migration note:** this backend originally used Spring Data JPA + MySQL. It has since been
> migrated to Spring Data MongoDB. All entities became `@Document`s, all ids became `String`
> (Mongo ObjectId) instead of `Long`, JPA `@ManyToOne`/`@OneToMany` object graphs were replaced
> with either plain `xxxId: String` reference fields (resolved manually in the service layer)
> or embedded sub-documents where the child is always read/written with its parent — see
> `database/mongodb-reference.md` for exactly what changed and why.

This is **Phase 1** of a 4-phase build (backend → customer website → admin panel → mobile
app). Phases 2–4 (React web, React admin, React Native) consume this same API — the request/
response JSON shapes are unchanged by the database migration except that every `id` field is
now a string instead of a number.

---

## What's in this scaffold

| Layer | Status |
|---|---|
| Documents (30 modules, ~22 top-level collections) | ✅ Complete — audit fields, soft delete |
| Repositories | ✅ Complete — `MongoRepository<X, String>` |
| Auth (JWT, refresh tokens, RBAC) | ✅ Working — register/login/refresh/logout/change-password |
| Products, Categories, Cart, Orders, CMS | ✅ Fully implemented business logic |
| Coupons, Tax, Static Pages, Site Config, SMTP, Branding, Mobile Config, Notifications, Reviews, Audit Log | ✅ Working CRUD (thinner, entity-level DTOs — see note below) |
| Swagger / OpenAPI docs | ✅ `/swagger-ui.html` |
| Sample jewellery data | ✅ Seeded automatically on first run |
| Forgot/reset password | ⚠️ **Stubbed** — `forgot-password` sends a placeholder email; `reset-password` throws until you add a `PasswordResetToken` collection + validation (noted in code) |
| Cloud file storage (S3 etc.) | ⚠️ Local disk storage implemented; `StorageService` interface is ready for an S3/Cloudinary implementation swap |
| Dynamic SMTP-per-config sending | ⚠️ Email currently sends via the single `application.yml`-configured mailer; `SmtpConfig` CRUD exists but isn't yet wired to build a `JavaMailSender` per row |
| Multi-document transactions | ⚠️ Not used — `@Transactional` was removed throughout since it requires a `MongoTransactionManager` + a replica-set deployment, which a single local `mongod` isn't. Checkout's stock-deduction currently writes each product sequentially rather than atomically; see "Known tradeoffs" below. |

Everything marked ✅ is real, runnable code — not TODO placeholders. Everything marked ⚠️
is explicitly flagged with what to build next.

---

## Quick start

```bash
docker compose up -d        # starts MongoDB (+ mongo-express UI at http://localhost:8081)
mvn spring-boot:run
```

- API base URL: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Default database: `mongodb://localhost:27017/ecommerce_db` (override with `MONGODB_URI`)

On first run, `DataSeeder` automatically creates:
- All 6 roles (SUPER_ADMIN, ADMIN, PRODUCT_MANAGER, ORDER_MANAGER, CONTENT_MANAGER, CUSTOMER)
- A default super admin: **username `superadmin` / password `ChangeMe123!`** — change this immediately outside local dev
- 4 jewellery categories and 5 sample products with stock, so `/api/products` returns real data immediately

### Running against MongoDB Atlas or another remote cluster

```bash
export MONGODB_URI="mongodb+srv://user:password@yourcluster.mongodb.net/ecommerce_db"
export JWT_SECRET=$(openssl rand -base64 48)
mvn spring-boot:run
```

No `ddl-auto` equivalent is needed — collections and indexes are created automatically from
the `@Document`/`@Indexed` annotations on first write (`auto-index-creation: true`).

---

## Project structure

```
com.ecommerce
  config       — Security, Mongo auditing, OpenAPI, CORS, static file serving, data seeding
  controller   — REST controllers (public + /admin/** role-protected)
  service      — Interfaces
  service.impl — Implementations
  repository   — Spring Data MongoDB repositories
  entity       — @Document classes (all extend BaseEntity: String id, audit fields, soft delete)
                 + embedded-only classes with no @Document (ProductImage, ProductVariant,
                 CartItem, OrderItem, Payment, Shipping, etc. — see mongodb-reference.md)
  dto.request  — Request payloads with Bean Validation
  dto.response — Response payloads (ApiResponse<T> envelope, PageResponse<T>)
  security     — JWT provider, filter, UserPrincipal (unified admin+customer principal)
  exception    — Custom exceptions + GlobalExceptionHandler (handles Mongo's DuplicateKeyException too)
  constant     — Enums (RoleName, OrderStatus, PaymentStatus, CmsSectionType, ...)
  util         — SlugUtil, OrderNumberGenerator
```

## Standard API response

Every endpoint returns:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { },
  "errors": [],
  "timestamp": "2026-07-24T10:30:00"
}
```

## Auth model

A single JWT pipeline serves **both** the admin panel and customer apps via `UserPrincipal`,
which wraps either an `AdminUser` (role resolved separately via `roleId` — Mongo has no object
graph auto-fetch) or a `Customer` (always `ROLE_CUSTOMER`). `/api/admin/**` routes require an
admin role; customer routes (`/api/orders`, `/api/checkout`, `/api/wishlist`, `/api/addresses`,
`/api/reviews` POST) require `ROLE_CUSTOMER`. `/api/cart/**` is open to guests via an
`X-Guest-Token` header as well as logged-in customers.

## Key endpoints (see Swagger for the full, generated list)

```
POST /api/auth/register | /login | /admin/login | /refresh-token | /logout
POST /api/auth/forgot-password | /reset-password | /change-password

GET  /api/products?keyword=&categoryId=&minPrice=&maxPrice=&sortBy=&page=&size=
GET  /api/products/{id} | /slug/{slug} | /featured | /new-arrivals | /best-sellers
POST /api/admin/products                      (PRODUCT_MANAGER+)
POST /api/admin/products/{id}/images

GET  /api/categories/tree
GET  /api/cms/homepage?device=web|mobile
GET  /api/pages/{slug}

GET/POST/PUT/DELETE /api/cart, /api/wishlist, /api/addresses
POST /api/checkout
GET  /api/orders, /api/orders/{id}, POST /api/orders/{id}/cancel

/api/admin/orders, /api/admin/coupons, /api/admin/taxes, /api/admin/cms/sections,
/api/admin/config, /api/admin/smtp-config, /api/admin/branding, /api/admin/mobile-config,
/api/admin/users, /api/admin/roles, /api/admin/dashboard/summary, /api/admin/audit-logs,
/api/admin/reviews, /api/admin/inventory, /api/admin/orders/{id}/shipping|payment
```

All `{id}` path segments are Mongo ObjectId hex strings (e.g.
`665f1a2b3c4d5e6f7a8b9c0d`), not numbers.

## Database

See `database/mongodb-reference.md` for the full collection list, indexes, and — importantly —
which former tables got folded into embedded sub-documents (product images/variants/attributes/
inventory into `products`; cart items into `carts`; order items/status history/payment/shipping
into `orders`) versus which stayed separate collections with a plain id-reference field.

## Known tradeoffs from the MongoDB migration

- **No multi-document transactions.** Checkout deducts stock from each product one at a time;
  on a single local `mongod` there's no atomic multi-document commit. For production, either
  deploy Mongo as a replica set and reintroduce `@Transactional` with a `MongoTransactionManager`
  bean, or accept the current at-least-mostly-consistent behavior (a mid-checkout crash could
  leave stock partially deducted — rare, but real).
- **No JPA-style joins.** Every relationship (`categoryId`, `customerId`, `roleId`, etc.) is
  resolved with an explicit `repository.findById(...)` call in the service layer. This is more
  verbose than JPA's automatic fetching but avoids N+1 query surprises and matches how Mongo is
  meant to be used.
- **Regex-based search** (`ProductServiceImpl.search`) uses case-insensitive Mongo regex rather
  than a real text index — fine for a demo catalog, but swap in a `$text` index or Atlas Search
  for anything beyond a few thousand products.

## Next phases

1. **Customer website (React)** — consumes `/api/products`, `/api/cms/homepage`, `/api/cart`,
   `/api/checkout`, `/api/orders`.
2. **Admin panel (React)** — consumes all `/api/admin/**` routes; needs data tables, forms,
   image upload widgets, and a CMS section builder (drag-to-reorder against
   `PATCH /api/admin/cms/sections/reorder`).
3. **Mobile app (React Native)** — same API; use `/api/app-config/mobile` for force-update/
   maintenance-mode checks and `/api/app-config/branding/mobile` for splash/logo assets.

**Important for all three frontends:** every id is now a string, not a number. If you're
working from an earlier version of this codebase, search for `Number(...)` calls applied to
any `id`/`categoryId`/`productId`/etc. field and remove them — a Mongo id like
`"665f1a2b3c4d5e6f7a8b9c0d"` passed through `Number()` silently becomes `NaN`.
