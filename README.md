# CADC Website Redesign

Reconstruction of the Community Action Development Corporation website — cadcok.org.


Built by IronSilk Strategies.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## Local development
```bash
npm install
npm run dev
```

## Project structure
- `lib/programs.ts` — single source of truth for all 9 CADC programs (nav, home grid, orbit hero all read from this)
- `components/` — shared UI (header, footer, orbit hero, program grid)
- `app/programs/[slug]/` — individual program pages
- `app/page.tsx` — home page

## Status
Site shell + home page complete. Program pages in progress, starting with Head Start.
