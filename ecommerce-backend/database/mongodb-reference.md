# MongoDB Collections Reference

There's no fixed schema to migrate in MongoDB — `spring.data.mongodb.auto-index-creation: true`
(set in `application.yml`) creates every index annotated in the entity classes automatically on
startup. This document is the reviewable reference for what those collections and indexes are,
since there's no `schema.sql` equivalent to check into version control.

## Collections

| Collection | Purpose | Notable indexes |
|---|---|---|
| `roles` | RBAC roles | `name` (unique) |
| `permissions` | Permission catalog | `code` (unique) |
| `admin_users` | Back-office logins | `username` (unique), `email` (unique) |
| `customers` | Customer accounts | `email` (unique), `phone` (unique, sparse) |
| `addresses` | Customer shipping/billing addresses | `customerId` |
| `refresh_tokens` | JWT refresh tokens | `token` (unique), `userId` |
| `categories` | Category tree | `slug` (unique), `parentId` |
| `products` | Product catalog — **embeds** images, variants, dynamic attribute values, and inventory (see below) | `slug` (unique), `sku` (unique), `categoryId`, `productType` |
| `product_attributes` | Attribute name catalog (for admin-panel dropdowns) | `name` (unique) |
| `carts` | Guest + logged-in carts — **embeds** cart items | `customerId`, `guestToken` (unique, sparse) |
| `wishlists` | One per customer — plain `productIds: string[]` | `customerId` (unique) |
| `orders` | Orders — **embeds** items, status history, payment, and shipping (see below) | `orderNumber` (unique), `customerId` |
| `coupons` | Discount codes | `code` (unique) |
| `taxes` | Tax rules | — |
| `cms_sections` | Homepage/CMS blocks | — |
| `static_pages` | About/Privacy/FAQ/etc. | `slug` (unique) |
| `site_configs` | Key/value platform settings | `configKey` (unique) |
| `smtp_configs` | SMTP server configs | — |
| `branding` | Logo/color/font per platform | — |
| `mobile_app_config` | Force-update / maintenance mode | — |
| `notifications` | In-app notifications | `customerId` |
| `reviews` | Product reviews | `productId` |
| `audit_logs` | Admin activity log | — |

## Why some things are embedded, not separate collections

MongoDB is a document store, not a relational database — the schema was redesigned around
that rather than translated column-for-column from the old MySQL/JPA version. Anything that's
**always read and almost always written together with its parent** is embedded directly on
that parent document, rather than being its own collection with a foreign key:

- `Product` embeds `images[]`, `variants[]`, `attributeValues[]`, and a single `inventory`
  object. A product page render is one document fetch — no joins.
- `Cart` embeds `items[]` (with a denormalized product name/image snapshot, so rendering the
  cart never needs a lookup back into `products`).
- `Order` embeds `items[]`, `statusHistory[]`, and single `payment` / `shipping` objects.
- `Wishlist` is just `{ customerId, productIds: string[] }`.

This is also why this backend has **9 fewer collections/repositories** than the old MySQL
version (no more separate `product_images`, `product_variants`, `product_attribute_values`,
`inventory`, `cart_items`, `wishlist_items`, `order_items`, `order_status_history`, `payments`,
or `shipping` tables/repositories) — those concepts still exist as Java classes, just embedded.

Things that are genuinely shared/referenced from multiple places, or queried independently of
their "owner," remain separate collections with a plain `xxxId: String` reference field
(there is no JPA-style object graph auto-fetch in this codebase — every relationship is
resolved with an explicit `repository.findById(...)` call in the service layer):

- `categoryId` / `subcategoryId` on `Product`, `parentId` on `Category`
- `customerId` on `Address`, `Order`, `Cart`, `Wishlist`, `Notification`, `Review`
- `roleId` on `AdminUser`
- `couponId` on `Cart` and `Order`

## IDs

Every `id` is a MongoDB ObjectId, serialized as a 24-character hex string (e.g.
`"665f1a2b3c4d5e6f7a8b9c0d"`) — not a number. Every DTO, controller path variable, and
reference field in this codebase is typed `String` accordingly.
