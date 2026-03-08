# AURUM — Next.js Jewellery Ecommerce App

A production-ready full-stack jewellery ecommerce application with admin panel, built with Next.js 15, Prisma, NextAuth v5, and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local — the defaults work for local SQLite development
```

### 3. Set up the database
```bash
# Create the SQLite database and apply schema
npm run db:push

# Seed with demo data, categories, and products
npx ts-node --project tsconfig.json prisma/seed.ts
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Accounts

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@aurum.com        | admin123      |
| Customer | customer@test.com      | customer123   |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login & Register pages
│   │   ├── login/
│   │   └── register/
│   ├── (store)/             # Customer-facing store
│   │   ├── page.tsx         # Homepage
│   │   ├── shop/            # Product listing with filters
│   │   ├── product/[slug]/  # Product detail page
│   │   └── checkout/        # Checkout page
│   ├── admin/               # Admin panel (role-protected)
│   │   ├── page.tsx         # Dashboard with stats
│   │   ├── products/        # Product CRUD
│   │   ├── orders/          # Order management + status updates
│   │   ├── customers/       # Customer list
│   │   └── settings/        # Store settings
│   └── api/                 # REST API routes
│       ├── auth/            # NextAuth + Register
│       ├── products/        # CRUD with admin guard
│       ├── orders/          # Order create & manage
│       └── admin/           # Stats, customers
├── components/
│   ├── ui/                  # Button, Input, Badge, Toaster
│   ├── store/               # ProductCard, CartSidebar
│   └── layout/              # Navbar
├── hooks/
│   └── use-cart.ts          # Zustand cart with persistence
├── lib/
│   ├── auth.ts              # NextAuth v5 config
│   ├── prisma.ts            # Prisma singleton
│   ├── utils.ts             # formatPrice, slugify, etc.
│   └── validations.ts       # Zod schemas
├── types/
│   └── index.ts             # TypeScript types
└── middleware.ts             # Auth + role-based route protection
prisma/
├── schema.prisma            # Full database schema
└── seed.ts                  # Demo data seeder
```

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 15 (App Router)             |
| Language     | TypeScript                          |
| Database     | SQLite (dev) / PostgreSQL (prod)    |
| ORM          | Prisma                              |
| Auth         | NextAuth v5 (credentials)           |
| Styling      | Tailwind CSS                        |
| State        | Zustand (cart)                      |
| Forms        | React Hook Form                     |
| Validation   | Zod                                 |
| Fonts        | Cormorant Garamond + DM Sans        |

---

## ✨ Features

### Store (Customer)
- 🏠 Homepage with hero, categories, featured products
- 🛍️ Shop page with category filter, sort, pagination
- 📦 Product detail page with image gallery, size selection
- 🛒 Persistent cart with slide-out sidebar
- 💳 Checkout with shipping address + order summary
- 🔐 Login / Register with JWT session

### Admin Panel
- 📊 Dashboard with revenue, orders, customer stats
- 📦 Product management — Create, Edit, Soft Delete, Image URLs
- 📋 Order management — List by status, update order & payment status
- 👥 Customer list with order count + total spent
- ⚙️ Settings page

### Backend / API
- `POST /api/auth/register` — User registration
- `GET/POST /api/products` — List products, create (admin)
- `GET/PUT/DELETE /api/products/[id]` — Product CRUD
- `GET/POST /api/orders` — List orders (scoped by role), place order
- `GET/PATCH /api/orders/[id]` — Order details, update status
- `GET /api/admin/stats` — Dashboard metrics
- `GET /api/admin/customers` — Customer list

---

## 🌍 Production Deployment

### Switch to PostgreSQL
In `.env.local`:
```
DATABASE_URL="postgresql://user:password@host:5432/aurum"
```
In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.

### Deploy to Vercel
```bash
vercel deploy
```
Add environment variables in Vercel dashboard.

---

## 🔌 Extending

- **Stripe payments** — Add `STRIPE_SECRET_KEY` and a `/api/checkout/session` route
- **Image uploads** — Integrate Cloudinary in `/api/upload/route.ts`
- **Email notifications** — Add Resend/Nodemailer on order creation
- **Wishlist** — Add a `Wishlist` model and `/api/wishlist` routes
- **Reviews** — Review model is already in schema; build the UI
