# Matoshree Cabs — Backend Monorepo (V1)

Web-based cab booking platform for Pune. This repository is the **backend
foundation**: a pnpm + Turborepo monorepo with a shared package and the first
NestJS microservice (**Identity**: auth + RBAC). It follows the agreed stack —
Node.js + NestJS microservices, PostgreSQL + Prisma, JWT, OTP stored in
Postgres, direct HTTP between services (no broker in V1), local filesystem for
files in dev.

## Why backend first

The frontend's booking form, fare estimate, dashboards, and auth screens all
consume backend contracts (fare engine, booking state machine, RBAC). Building
the backend first gives a stable API plus shared Zod/TypeScript types that the
frontend imports directly — so the UI is built against the real thing once,
not reworked later.

## Development conventions (enforced)

- **Constants live in their own files** under `packages/shared/src/constants/`
  (one concern per file: roles, booking status, payment, cancellation, fare,
  app). Import them via `@matoshreecabs/shared` — never hardcode literals.
- **Keep every file under ~300 lines.** If a file grows past that, split it by
  responsibility into a sibling file (e.g. a service → service + helper).
- **Feature-per-folder**: each domain area is a folder with its own
  module/service/controller (`auth/`, `users/`, `rbac/`).
- **Validation via shared Zod schemas** (`packages/shared/src/schemas`) applied
  with `ZodValidationPipe`, so the same rules run on client and server.
- **RBAC is server-side**: permissions live in the `RolePermission` table and
  are checked with guards — the UI never substitutes for enforcement.

## Structure

```
matoshreecabs/
├── apps/
│   └── identity/               NestJS service: auth + RBAC
│       ├── prisma/schema.prisma Full data model (PRD §9)
│       ├── prisma/seed.ts       RBAC matrix + initial developer
│       └── src/
│           ├── auth/            register, OTP, password login, JWT
│           ├── users/           user persistence
│           ├── rbac/            capability checks
│           ├── common/          pipes, guards, decorators
│           └── prisma/          Prisma module/service
├── packages/
│   └── shared/                  constants, enums, Zod schemas, types
├── docker-compose.yml           local PostgreSQL
├── turbo.json / pnpm-workspace.yaml
└── .env.example
```

## Run it locally

Prerequisites: Node 20+, pnpm 9+, Docker (for Postgres).

```bash
# 1. install
pnpm install

# 2. start Postgres
docker compose up -d

# 3. env
cp .env.example .env            # then edit apps/identity/.env or use root .env

# 4. build shared types (identity imports @matoshreecabs/shared)
pnpm --filter @matoshreecabs/shared build

# 5. database: generate client, run migration, seed
pnpm db:generate
pnpm db:migrate                 # creates tables
pnpm db:seed                    # RBAC matrix + dev@matoshreecabs.local

# 6. run the identity service
pnpm --filter @matoshreecabs/identity dev
# -> http://localhost:4001/api
```

## Identity API (implemented)

| Method | Path                | Body                          | Purpose                          |
|--------|---------------------|-------------------------------|----------------------------------|
| POST   | `/api/auth/register`| name, email, mobile, password?| Create a customer account        |
| POST   | `/api/auth/otp/request` | email                     | Issue an OTP (dev returns code)  |
| POST   | `/api/auth/otp/verify`  | email, otp                | Log in with OTP → JWT            |
| POST   | `/api/auth/login`   | email, password               | Log in with password → JWT       |
| GET    | `/api/auth/me`      | — (Bearer token)              | Current user from JWT            |

Quick check:

```bash
curl -X POST localhost:4001/api/auth/register -H 'content-type: application/json' \
  -d '{"name":"Ravi","email":"ravi@example.com","mobile":"9876543210","password":"Passw0rd!"}'

curl -X POST localhost:4001/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"ravi@example.com","password":"Passw0rd!"}'
```

## Next increments (roadmap)

1. **Gateway** service (BFF) — single entry point, forwards to services over HTTP.
2. **Booking** service — booking + pricing engine + payment/refund (kept in one
   service/DB so the advance→verify→refund flow stays transactional) + state
   machine using `BOOKING_STATUS_TRANSITIONS`.
3. **Catalogue** service — cabs, drivers, rate cards, content, offers, reviews.
4. **Notification** service — email outbox (SES/Resend); receives OTP + booking
   events over HTTP.
5. Then the **frontend** (Next.js) against these contracts.

> Note: files written to local disk don't survive a redeploy — swap the dev
> filesystem storage for object storage (S3/R2) before production.
