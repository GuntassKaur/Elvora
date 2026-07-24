# ELVORA — Luxury Fashion eCommerce

ELVORA is a production-ready luxury fashion web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your Supabase credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> Find these in your **Supabase Dashboard → Project Settings → API**.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

### Step 1 — Create a Supabase Project
1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Wait for the project to finish provisioning (~1–2 minutes).

### Step 2 — Run the Migration
In the Supabase **SQL Editor**, paste and run the contents of:
```
supabase/migrations/20260724000000_create_tables.sql
```

This creates the `products`, `customers`, and `orders` tables with:
- Primary keys, foreign keys, indexes
- Row Level Security (RLS) policies for guest checkout
- Default values and constraints

### Step 3 — Seed Sample Products
In the Supabase **SQL Editor**, paste and run:
```
supabase/seed.sql
```

This populates the `products` table with all 25 ELVORA luxury products.

> **Note:** The app works without seeding — it falls back to the local `products.ts` dataset automatically if Supabase is empty or unreachable.

---

## 🏃 Running the Application

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

---

## 🏗️ Architecture

### Backend Modules (`src/lib/`)

| File | Responsibility |
|:-----|:---------------|
| `supabase.ts` | Supabase client initialization |
| `database.ts` | TypeScript interfaces for DB rows + `mapRowToProduct` |
| `products.ts` | Fetch products from Supabase (with local fallback) |
| `customers.ts` | Insert guest customer records |
| `orders.ts` | Create & retrieve orders |

### Database Tables

| Table | Purpose |
|:------|:--------|
| `products` | Product catalogue synced from Supabase |
| `customers` | Guest customer records created at checkout |
| `orders` | Completed orders with items, shipping & payment data |

### Data Flow

```
User checks out
    → createCustomer()  →  Supabase: customers table
    → createOrder()     →  Supabase: orders table
    → setOrderSnapshot() → Zustand (persisted in localStorage)
    → redirect /success

/success page loads
    → reads Zustand orderSnapshot (instant, no DB call)
    → if page is refreshed: fetches order from Supabase by order_id
```

### Fallback Strategy

If Supabase is unreachable or credentials are not set:
- Products fall back to `src/data/products.ts` (always available)
- Orders are saved to Zustand + localStorage (persisted across refreshes)
- The app **never crashes** due to database issues

---

## 💳 Payment

ELVORA uses a **Secure Demo Payment** simulation:
- Realistic 3D credit card preview (Visa / Mastercard / RuPay / Amex)
- 3-stage processing animation
- ~8% simulated card decline (for realism)
- Use test card: `4242 4242 4242 4242` · any future expiry · any CVV

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx            # Homepage
│   ├── shop/page.tsx       # Shop with filters
│   ├── product/[id]/       # Product detail
│   ├── checkout/page.tsx   # 2-step checkout + Demo Payment
│   └── success/page.tsx    # Order confirmation receipt
├── components/             # Navbar, ProductCard, CartDrawer, etc.
├── data/
│   ├── products.ts         # Local product dataset (fallback)
│   └── imageManifest.ts    # Centralised Pexels image URLs
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── database.ts         # DB types & mappers
│   ├── products.ts         # Product DB operations
│   ├── customers.ts        # Customer DB operations
│   ├── orders.ts           # Order DB operations
│   └── schemas.ts          # Zod validation schemas
├── store/
│   ├── useCartStore.ts     # Cart + order snapshot state
│   └── useProductsStore.ts # Products global state
└── supabase/
    ├── migrations/         # SQL migration files
    └── seed.sql            # Sample product seed data
```
