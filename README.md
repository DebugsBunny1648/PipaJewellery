# Ecommerce Platform — Full Source (All 4 Phases, MongoDB backend)

Jewellery-first, generic/extensible ecommerce platform. Four projects, one shared backend
contract. The backend was migrated from Spring Data JPA + MySQL to **Spring Data MongoDB**
(see `ecommerce-backend/README.md` and `ecommerce-backend/database/mongodb-reference.md` for
what changed and why). All ids are now strings (Mongo ObjectId hex), not numbers — every
frontend was audited for `Number()`/`parseInt()` calls on id fields, and the two real bugs
found (in the admin panel's product and category forms) were fixed.

## Projects

| Folder | What it is | Setup |
|---|---|---|
| `ecommerce-backend/` | Spring Boot + MongoDB API (Java 17, JWT, all 30 modules) | `docker compose up -d && mvn spring-boot:run` |
| `ecommerce-web/` | React + Vite customer storefront | `npm install && npm run dev` → http://localhost:3000 |
| `ecommerce-admin/` | React + Vite admin panel | `npm install && npm run dev` → http://localhost:3001 |
| `ecommerce-mobile/` | Expo / React Native app | `npm install && npx expo start` |

Each folder has its own README with full details, known gaps, and default login
(`superadmin` / `ChangeMe123!`, seeded automatically by the backend on first run).

## Run order

1. Start `ecommerce-backend` first — `docker compose up -d` (local MongoDB + a mongo-express
   UI at http://localhost:8081), then `mvn spring-boot:run`. The other three all call its API
   at `http://localhost:8080/api` by default (see each project's `.env.example`).
2. Start `ecommerce-web` and/or `ecommerce-admin` and/or `ecommerce-mobile` in any order.

## What changed in this MongoDB pass

- Every entity became a `@Document`; every id is now `String` (Mongo ObjectId), not `Long`
- JPA object-graph relationships (`@ManyToOne`/`@OneToMany`) were redesigned as either plain
  `xxxId: String` references (resolved explicitly in the service layer) or embedded
  sub-documents where the child always lives with its parent — this **removed 9 collections**
  (product images/variants/attribute-values/inventory folded into `products`; cart items into
  `carts`; order items/status-history/payment/shipping folded into `orders`)
- `ProductSpecification` (JPA Criteria) was replaced with MongoDB `Criteria`/`MongoTemplate`
  queries
- All `@Transactional` annotations were removed (no `MongoTransactionManager` configured for
  a standalone `mongod` — documented as a known tradeoff in the backend README)
- Reviewed every lambda in the backend for effectively-final variable-capture violations
  during the rewrite; found none remaining
- Audited all three frontends for numeric-id assumptions; fixed two real bugs in the admin
  panel (`ProductFormModal.jsx`, `Categories.jsx` were calling `Number()` on category ids —
  and `AdminUsers.jsx`/`Roles.jsx` assumed nested `role`/`permissions` objects that no longer
  exist on the API response)

## Honest status

This was built and reviewed in a sandboxed environment without internet access, so I did a
careful, systematic manual audit (grepping for every deleted class/field reference, every
`Long` type, every lambda capture) rather than a real compile — there is still no `mvn`/`npm
install` verification behind this. Treat it as a thoroughly cross-checked scaffold to build
and run yourself, not a CI-verified deliverable.
