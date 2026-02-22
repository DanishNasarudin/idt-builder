# Developer Guide (idt-builder)

This repo is a Next.js (App Router) web app for building a custom PC parts list and generating shareable quotations.

## Quick start (local dev)

### Prereqs

- Node.js 18+ (recommended: 20 LTS)
- npm (this repo uses `package-lock.json`)

### Install & run

1. Install deps:
   - `npm ci`
2. Create local env file:
   - `cp .env.example .env.local`
   - Fill in values (see “Environment variables”).
3. Create local working folders (required at runtime):
   - `mkdir -p data pricelist`
4. Add at least one price list file:
   - Create `pricelist/CPU.txt` (example format in “Price list format”).
5. Start the app:
   - `npm run dev`
6. Open:
   - `http://localhost:3000`

### Production-like local run

- `npm run build`
- `npm run start`

## Environment variables

Create `.env.local` (gitignored) from `.env.example`.

Required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk)
- `CLERK_SECRET_KEY` (Clerk; also used as a bearer token for the photostock API request in `app/quote/[id]/page.tsx`)
- `EMAIL` (SMTP username/from address)
- `EMAIL_PASS` (SMTP password)

Common Clerk routing variables (recommended):

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`

Security:

- Never commit `.env.local`.
- If secrets are ever shared/committed accidentally, rotate them immediately (email password + Clerk keys).

## Repo structure (where to change things)

- `app/` – Next.js routes (App Router)
  - `app/page.tsx` – main part-picker page; loads price list + optionally loads an existing quote via `?edit=<id>`
  - `app/quote/[id]/page.tsx` – quotation view route; reads quote JSON from disk and renders the quote
  - `app/api/contact/route.ts` – contact form email endpoint (Nodemailer)
  - `app/pdf/page.tsx` – PDF viewer sandbox page (currently mock data)
- `components/custom/` – product picker UI + quote UI
- `components/pdf/` – React-PDF templates/components
- `services/`
  - `services/textDbPriceListActions.ts` – reads `pricelist/*.txt` on the server and parses into categories/products
  - `services/textDbActions.ts` – reads/writes quotes to `data/<id>.json` (server-side filesystem “DB”)
  - `services/sendEmail.ts` – server action helper to send quote emails (Nodemailer)
- `lib/zus-store.ts` – Zustand store + key shared types for selections/quotes
- `middleware.ts` – Clerk middleware (also blocks `/pdf` and `/shadcn` in production)

## Architecture notes / gotchas

- Storage is filesystem-based (`pricelist/*.txt` + `data/*.json`). This works on a stateful server, but will not be reliable on serverless platforms without persistent storage.
- The home route uses `cache()` in `app/page.tsx`; when editing `pricelist/*.txt` locally, restart `npm run dev` if changes don’t appear.
- UI stack is Tailwind + shadcn-style components in `components/ui/*` + NextUI (provider in `lib/providers.tsx`).

## Git-ignored local files/folders (important)

This repo intentionally does **not** include runtime data:

- `pricelist/` is gitignored (contains business pricing data).
- `data/*.json` is gitignored (generated quotes).

After cloning, you must create these folders locally (and add your own `pricelist/*.txt`) to run the app.

## Local data model

### Price list files (`pricelist/*.txt`)

The app expects one `.txt` file per category (filename becomes `category_name`).

Implemented in `services/textDbPriceListActions.ts`.

**Format**

- A “label” line ends with `:` (example: `AMD Ryzen 9000:`). This becomes a non-selectable label row.
- A product option line contains comma-separated values:
  - `product_name, discounted_price, original_price`

**Example**
Create `pricelist/CPU.txt`:

```
AMD Ryzen 9000:
Ryzen 9 9950X, 2999, 3299
Ryzen 7 9700X, 1599, 1799

Intel Core:
Core i7-14700K, 1799, 1999
```

### Quotes (`data/<id>.json`)

Quotes are stored as JSON files on disk (not in git). These files are read/written server-side:

- Read: `readData(id)` in `services/textDbActions.ts`
- Write (queued): `queueWrite(data, id)` in `services/textDbActions.ts`
- Cleanup: `deleteOldestFiles(maxFiles)` in `services/textDbActions.ts`

If you see runtime errors like “ENOENT: no such file or directory, scandir '.../data'”, create the folder:

- `mkdir -p data`

## Email sending (Nodemailer)

Email is sent from two places:

- `app/api/contact/route.ts` (API route)
- `services/sendEmail.ts` (server action used by quote flow)

Both use:

- `process.env.EMAIL`
- `process.env.EMAIL_PASS`

If you don’t want email sending during local dev, either:

- use a sandbox/test SMTP account, or
- temporarily short-circuit the send call (keep changes out of `main`).

## Branch + review workflow (for contributors)

1. Sync `main`:
   - `git checkout main`
   - `git pull`
2. Create a branch:
   - `git checkout -b <type>/<short-description>`
   - Example: `git checkout -b fix/quote-pdf-spacing`
3. Make changes and run checks:
   - `npm run lint`
   - `npm run build`
4. Push branch:
   - `git push -u origin <branch-name>`
5. Open a PR and request review.

## Common change tasks

### Update the price list

1. Add/replace `.txt` files in `pricelist/` (one file per category).
2. Keep label lines ending in `:` and product lines as `name, dis_price, ori_price`.
3. Reload the home page and verify “Price list last updated” updates (uses file mtime via `getLatestUpdatedTimestamp()`).

### Change how quotes render

- Route/UI: `app/quote/[id]/page.tsx` and `components/custom/quote/*`
- Data shape/state: `lib/zus-store.ts` (types + transforms)
- Persistence: `services/textDbActions.ts`

### Change PDF output

- Templates live in `components/pdf/*`
- The sandbox viewer is `app/pdf/page.tsx`
- If you hit build issues around `@react-pdf/renderer`, check `next.config.js` (externalized package config).

## Deployment notes (high level)

The repo is built as a standard Next.js app:

- Build: `npm run build`
- Serve: `npm run start`

If deploying to constrained environments (e.g., shared hosting), expect to build locally and upload the build artifacts; keep an eye on Node.js version requirements for your installed `next` version.
