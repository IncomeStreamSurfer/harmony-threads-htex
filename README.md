# Harmony Threads

Vintage-inspired band graphic tee store built with Astro + Supabase + Stripe.

## Stack

- **Astro 5** (SSR via Vercel adapter)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Supabase** (PostgreSQL + RLS)
- **Stripe** (Checkout, dynamic pricing from Supabase)
- **Resend** (transactional email)

## Pages

- `/` — Homepage with hero, featured products, story, testimonials, FAQ, newsletter
- `/shop` — Full product catalogue
- `/product/[slug]` — Product detail with variant selection
- `/about` — Brand story
- `/contact` — Contact form
- `/blog` — Journal (dynamic from Supabase `content` table)
- `/blog/[slug]` — Individual article
- `/checkout/success` — Post-purchase confirmation
- `/checkout/cancel` — Abandoned checkout
- `/admin` — Admin dashboard
- `/llms.txt` — LLM-readable site index

## Setup

1. Copy `.env.example` to `.env` and fill in values
2. `npm install`
3. `npm run dev`

## TODO

- Connect custom domain in Vercel
- Verify your own domain in Resend (currently sends from onboarding@resend.dev)
- Add more products via `/admin/products`
- Set up Google Analytics / Plausible
