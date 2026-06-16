# Agent Instructions

Before making code changes, read `docs/ARCHITECTURE.md` and follow its public
route surface, module boundaries, and change guidelines.

Use that architecture document especially when changing:

- public routes or route visibility,
- quote generation or quote display behavior,
- filesystem-backed data access,
- shared state or shared types,
- service integrations,
- reusable component placement.

Keep the public website surface limited to:

- `/`
- `/quote/[id]`
- `/sign-in`

Treat other pages as internal, dev-only, API, or legacy unless
`docs/ARCHITECTURE.md` is intentionally updated.

For verification, prefer:

- `npm run lint`
- `npm run typecheck`

Do not use `npm run build` as the default verification command.
