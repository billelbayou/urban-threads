# Urban Threads

> A full-stack e-commerce platform for urban fashion — built with Next.js 16, Express 5, Prisma, and PostgreSQL.

---

## Architecture

```
urban-threads/
├── apps/
│   ├── frontend/                    # Next.js 16 (App Router, Turbopack)
│   │   ├── src/
│   │   │   ├── app/                 # App Router pages & layouts
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── constants/           # App-wide constants
│   │   │   ├── schemas/             # Zod validation schemas
│   │   │   ├── services/            # API client & service layer
│   │   │   ├── store/               # Zustand state stores
│   │   │   ├── types/               # TypeScript type definitions
│   │   │   └── utils/               # Utility functions
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── postcss.config.mjs
│   │   └── tailwindcss              # Tailwind v4 (PostCSS plugin)
│   │
│   └── backend/                     # Express 5 REST API
│       ├── src/
│       │   ├── config/              # Environment config (Zod-enforced)
│       │   ├── controllers/         # Route handlers
│       │   ├── middleware/          # Auth, error handling, rate limiting
│       │   ├── routes/              # Express route definitions
│       │   ├── schemas/            # Zod request/response schemas
│       │   ├── services/           # Business logic layer
│       │   ├── types/              # TypeScript type definitions
│       │   ├── utils/              # Prisma client, helpers
│       │   ├── __tests__/          # Vitest integration tests
│       │   ├── app.ts              # Express app setup
│       │   └── server.ts           # Entry point
│       ├── prisma/
│       │   ├── schema.prisma       # Database schema
│       │   ├── migrations/         # Prisma migrations
│       │   └── seed.ts             # Database seeder
│       ├── Dockerfile
│       ├── render.yaml
│       └── vitest.config.ts
│
├── packages/                        # Shared packages (reserved)
├── turbo.json                       # Turborepo pipeline config
├── pnpm-workspace.yaml              # Workspace definition
└── package.json                     # Root scripts (dev, build, lint)
```

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| **Framework (Frontend)** | Next.js | ^16.1.6 |
| **UI Library** | React | ^19.0.0 |
| **Styling** | Tailwind CSS | ^4 |
| **State Management** | Zustand | ^5.0.5 |
| **Forms & Validation** | react-hook-form + Zod | ^7.57 / ^3.25 |
| **HTTP Client** | axios | ^1.9.0 |
| **Charts** | recharts + chart.js | ^3.8 / ^4.5 |
| **Animation** | framer-motion | ^12.16 |
| **Carousel** | keen-slider | ^6.8 |
| **Icons** | lucide-react | ^0.562 |
| **Notifications** | sonner | ^2.0 |
| | |
| **Framework (Backend)** | Express | ^5.1.0 |
| **Runtime** | Node.js (tsx / tsc) | ≥20 |
| **ORM** | Prisma | ^7.3.0 |
| **Database** | PostgreSQL (via Supabase) | — |
| **Authentication** | jsonwebtoken + bcrypt | ^9.0 / ^6.0 |
| **File Storage** | Supabase Storage (S3-compatible, AWS SDK v3) | — |
| **Validation** | Zod | ^3.25 |
| **Rate Limiting** | express-rate-limit | ^7.5 |
| **Logging** | morgan | ^1.10 |
| **Testing** | vitest + supertest | ^3.2 / ^7.2 |
| | |
| **Monorepo** | Turborepo | ^2.10 |
| **Package Manager** | pnpm | 10.10.0 |
| **Containerization** | Docker (node:20-alpine) | — |
| **Deployment** | Render (Docker-based) | — |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** 10.10.0 — install via `corepack enable && corepack install`
- **PostgreSQL** — a running instance (or a [Supabase](https://supabase.com) project with connection pooling)
- **Supabase Storage** bucket — for product image uploads (S3-compatible API)
- **Docker** (optional) — for local containerized backend testing

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd urban-threads
corepack enable
corepack install
pnpm install
```

`pnpm install` runs `prisma generate` automatically via the backend's `postinstall` hook.

### 2. Configure Environment Variables

Create the following environment files:

**`apps/backend/.env`**

```env
# Server
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (PostgreSQL — Supabase pooler & direct URLs)
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/postgres

# Auth
JWT_SECRET=<your-secret>
COOKIE_EXPIRES_IN=86400
BCRYPT_ROUNDS=10

# Supabase Storage (S3-compatible)
SUPABASE_URL=https://<project>.storage.supabase.co/storage/v1/s3
SUPABASE_SERVICE_KEY=<service-role-key>
SUPABASE_BUCKET_NAME=products
SUPABASE_REGION=<region>
SUPABASE_ACCESS_KEY_ID=<s3-access-key>
SUPABASE_SECRET_ACCESS_KEY=<s3-secret-key>

# Admin seed user
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<secure-password>
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

**`apps/frontend/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Database Setup

Run Prisma migrations to apply the schema:

```bash
cd apps/backend
npx prisma migrate dev
```

Optionally seed the database with initial data (admin user, categories, products):

```bash
pnpm --filter @repo/backend prisma:seed
```

### 4. Start Development

From the repository root, start all workspaces concurrently:

```bash
pnpm dev
```

This runs `turbo dev`, which starts:
- **Frontend** → `http://localhost:3000` (Next.js with Turbopack)
- **Backend** → `http://localhost:8080` (Express with tsx watch)

---

## Environment Variables Reference

### Backend (`apps/backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5001` | Backend HTTP server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string (pooled via Supabase pgBouncer) |
| `DIRECT_URL` | **Yes** | — | Direct PostgreSQL connection (bypasses pgBouncer for migrations) |
| `JWT_SECRET` | **Yes** | — | Secret key for signing and verifying JWTs |
| `FRONTEND_URL` | **Yes** | — | Frontend origin URL (used for CORS) |
| `COOKIE_EXPIRES_IN` | No | `86400` | JWT cookie TTL in seconds (24h) |
| `BCRYPT_ROUNDS` | No | `10` | Bcrypt salt rounds for password hashing |
| `SUPABASE_URL` | **Yes** | — | Supabase S3-compatible storage endpoint |
| `SUPABASE_SERVICE_KEY` | **Yes** | — | Supabase service role key |
| `SUPABASE_BUCKET_NAME` | No | `products` | Storage bucket for product images |
| `SUPABASE_REGION` | **Yes** | — | S3 region (e.g. `eu-west-3`) |
| `SUPABASE_ACCESS_KEY_ID` | **Yes** | — | S3 access key for Supabase Storage |
| `SUPABASE_SECRET_ACCESS_KEY` | **Yes** | — | S3 secret key for Supabase Storage |
| `ADMIN_EMAIL` | **Yes** | — | Email for the seeded admin account |
| `ADMIN_PASSWORD` | **Yes** | — | Password for the seeded admin account |
| `ADMIN_FIRST_NAME` | **Yes** | — | First name of the default admin |
| `ADMIN_LAST_NAME` | **Yes** | — | Last name of the default admin |

### Frontend (`apps/frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8080/api` | Backend API base URL (publicly exposed to the browser) |

---

## Scripts & Workflows

### Root-Level (Turborepo)

| Command | Description |
|---|---|
| `pnpm dev` | Start all workspaces in development mode |
| `pnpm build` | Build all workspaces for production |
| `pnpm lint` | Run linting across all workspaces |

### Frontend (`@repo/frontend`)

| Command | Description |
|---|---|
| `pnpm --filter @repo/frontend dev` | Start Next.js dev server with Turbopack |
| `pnpm --filter @repo/frontend build` | Production build |
| `pnpm --filter @repo/frontend start` | Start production server |
| `pnpm --filter @repo/frontend lint` | Run Next.js lint |

### Backend (`@repo/backend`)

| Command | Description |
|---|---|
| `pnpm --filter @repo/backend dev` | Start Express with hot reload (tsx watch) |
| `pnpm --filter @repo/backend build` | Generate Prisma client + compile TypeScript |
| `pnpm --filter @repo/backend start` | Run compiled production server |
| `pnpm --filter @repo/backend prisma:seed` | Seed the database with initial data |
| `pnpm --filter @repo/backend test` | Run integration tests (vitest) |
| `pnpm --filter @repo/backend test:watch` | Run tests in watch mode |

---

## API Overview

The Express backend exposes the following route groups under `/api`:

| Route | Description |
|---|---|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `POST /api/auth/logout` | User logout |
| `GET /api/auth/me` | Get authenticated user |
| `GET /api/products` | List products (with filtering & pagination) |
| `GET /api/products/:id` | Get single product |
| `POST /api/products` | Create product (admin) |
| `PUT /api/products/:id` | Update product (admin) |
| `DELETE /api/products/:id` | Soft-delete product (admin) |
| `GET /api/category` | List categories |
| `POST /api/category` | Create category (admin) |
| `GET /api/cart` | Get current user's cart |
| `POST /api/cart` | Add item to cart |
| `DELETE /api/cart` | Remove item from cart |
| `GET /api/orders` | List user's orders |
| `POST /api/orders` | Create order from cart |
| `GET /api/wishlist` | Get user's wishlist |
| `POST /api/wishlist` | Add product to wishlist |
| `DELETE /api/wishlist/:productId` | Remove product from wishlist |
| `POST /api/upload` | Upload product image (admin, Supabase Storage) |
| `GET /health` | Health check endpoint |

---

## Deployment

The backend includes a `Dockerfile` (multi-stage, `node:20-alpine`) and a `render.yaml` manifest for one-click deployment on Render.

Environment variables marked with `sync: false` in `render.yaml` must be set manually in the Render dashboard.

The frontend can be deployed to any Node.js platform (Vercel, Netlify, etc.) — configure `NEXT_PUBLIC_API_URL` to point to the production backend URL.

---

## Testing

```bash
# Run all backend tests
pnpm --filter @repo/backend test
```

Tests use Vitest with Supertest for HTTP integration testing. The test setup reads from `apps/backend/.env.test` if it exists (falls back to the regular `.env`).

---
