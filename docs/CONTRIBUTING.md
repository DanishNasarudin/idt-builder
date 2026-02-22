# Contributing (idt-builder)

Thanks for contributing! This project is a Next.js app with a filesystem-backed “text DB” (`pricelist/*.txt` + `data/*.json`).

## Ground rules

- **Do not commit secrets**: never add `.env.local` (or any `.env*.local`) to git.
- **Do not commit runtime data**: `pricelist/` and `data/*.json` are intentionally excluded from git.
- Keep changes focused and avoid drive-by refactors unless agreed in the PR.

## Local setup

Follow `DEVELOPMENT.md` for full setup and architecture notes.

Quick checklist:

- `npm ci`
- `cp .env.example .env.local` (fill required values)
- `mkdir -p data pricelist`
- add at least one file like `pricelist/CPU.txt`
- `npm run dev`

## Branching & PR flow

1. Update local `main`:
   - `git checkout main`
   - `git pull`
2. Create a branch:
   - `git checkout -b <type>/<short-description>`
   - Examples: `fix/email-validation`, `feat/quote-pdf`, `chore/deps`
3. Commit in small, reviewable chunks.
4. Push:
   - `git push -u origin <branch-name>`
5. Open a PR and request review.

## Before requesting review

Run:

- `npm run build`

Recommended:

- Add screenshots/screen recordings for UI changes.
- Note any new env vars, required folders, or migration steps in the PR description.

## Where to make common changes

- Main builder page: `app/page.tsx`
- Quote route: `app/quote/[id]/page.tsx`
- Email endpoint: `app/api/contact/route.ts`
- Price list parsing: `services/textDbPriceListActions.ts`
- Quote persistence: `services/textDbActions.ts`
- Shared state/types: `lib/zus-store.ts`
- UI components: `components/custom/*`, `components/ui/*`
- PDF templates: `components/pdf/*` (viewer sandbox: `app/pdf/page.tsx`)

## Adding/adjusting env vars

If your change introduces a new environment variable:

1. Add it to `.env.example`.
2. Document it in `DEVELOPMENT.md` (briefly: name + purpose + where used).
3. Ensure code has a clear failure mode when the var is missing (useful error, not a silent failure).

## Data/storage considerations

This app reads and writes to disk:

- `pricelist/*.txt` is read on the server to populate categories/products.
- `data/<id>.json` is read/written for quote links.

When making changes that touch these, consider:

- Folder existence (`data/` and `pricelist/` must exist).
- Concurrency: writes are queued in `services/textDbActions.ts`.
- Caching: the home page uses `cache()`; restart dev server if fresh price list updates don’t show up.

## Security notes

- Treat any credentials used for SMTP/Clerk as production secrets.
- If a secret is ever committed, rotate it immediately and remove it from git history if needed.
