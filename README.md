# Luxe Marketplace (Part 1 – Foundation)

A premium, black-and-gold, all-category ecommerce frontend.
This is the **visual foundation only**. No cart, no payments, and no live database connection yet.

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v3
- react-router-dom
- Supabase JS client (placeholder, not connected)
- lucide-react icons

## Requirements
- Node.js 20 LTS or newer
- npm 10 or newer

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env.local      # Windows: copy .env.example .env.local

# 3. Start the development server
npm run dev
```

Open http://localhost:5173 in your browser.
On your Android phone (same Wi‑Fi network), open `http://<your-computer-IP>:5173`.

## Build for production
```bash
npm run build
npm run preview
```

## Project Notes
- Brand name is configurable in `src/config/brand.ts` and `.env.local` (`VITE_APP_NAME`).
- The logo is a text placeholder in `src/components/common/BrandLogo.tsx`.
- Demo products live in `src/data/demoProducts.ts`. They are not real inventory.
- "Buy Now" buttons are visual only. They are wired to nothing yet.
- Never commit `.env.local` or any service-role / secret keys.

## Roadmap
- Part 2: Supabase connection and product catalogue
- Part 3: Mobile OTP login and profiles
- Part 4: Cart, Cash-on-Delivery checkout, orders
- Part 5: Admin dashboard, banners, reviews
