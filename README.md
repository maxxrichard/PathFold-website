# PathFold

**PathFold - Language Modelling for Protein (Mis-)Folding Pathway Dynamics**, a BMFTR-funded
research project.

The site is a Next.js 16 app with a PostgreSQL database (Prisma) and a built-in admin area where all dynamic
content (news, publications, team, partners, media, resources, work packages, milestones, contact messages,
site settings) can be managed without touching the code.

## Stack

| Layer     | Choice                                                           |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Server Actions), React 19, TypeScript     |
| Styling   | Tailwind CSS v4, Framer Motion, Lucide icons                      |
| Database  | PostgreSQL via Prisma 6 (Neon / Vercel Postgres / Prisma Postgres) |
| Auth      | Admin sessions with bcrypt + signed JWT cookie (`jose`)            |
| Uploads   | Vercel Blob in production, `/public/uploads` locally               |
| Hosting   | Vercel                                                             |

## Pages

- `/` – hero, key facts, problem statement, interactive pathway explorer, framework components, news, publications, partners
- `/about` – project description, key facts (DFKI-style sidebar), research questions & hypotheses, work packages, milestones, roadmap, open science, partners
- `/research` – tiered supervision, energy-based latent space, PathFold-P, PathFold-M, Toolbox & DynBench, datasets, applications
- `/team`, `/publications` (filter/search), `/news` (+ `/news/[slug]`), `/media` (gallery + press kit), `/resources`, `/contact` (form → database)
- `/admin` – dashboard; `/admin/<content type>` list / create / edit / delete; `/admin/settings` (site texts, contact details, password)

## Local development

Requirements: Node 20+ and npm. No local PostgreSQL installation is needed: Prisma ships a local Postgres server.

```bash
npm install
cp .env.example .env            # then edit AUTH_SECRET / ADMIN_* if you like
npm run db:dev                  # starts a local Postgres (keep it running, or add --detach)
```

`npm run db:dev` prints a `postgres://…` URL. The default in `.env.example` matches a server started with
`npx prisma dev -n pathfold -p 51214 --detach`; adjust `DATABASE_URL` if yours differs. Keep the
`&pgbouncer=true` suffix – the local server (and most hosted poolers) run in transaction-pooling mode.

```bash
npm run db:setup                # pushes the schema and seeds the content from the proposal
npm run dev                     # http://localhost:3000
```

Sign in at <http://localhost:3000/admin/login> with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
(defaults: `admin@pathfold.local` / `change-me-now`). Change the password under *Settings* afterwards.

Useful scripts:

| Script              | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `npm run db:push`   | Apply `prisma/schema.prisma` to the database          |
| `npm run db:seed`   | Seed initial content (idempotent, skips filled tables) |
| `npm run db:studio` | Open Prisma Studio to inspect the data                |
| `npm run build`     | Production build (runs `prisma generate` first)       |
| `npm run lint`      | ESLint                                                |

## Deploying to Vercel

1. Push this repository to GitHub and import it in Vercel (framework preset: Next.js).
2. **Database** – in the Vercel project go to *Storage → Create database* and pick **Neon** (or Vercel Postgres /
   Prisma Postgres). Connect it to the project; Vercel adds `DATABASE_URL` automatically.
   If the URL points to a pooled endpoint (Neon `-pooler`, pgbouncer), append `?pgbouncer=true&connection_limit=1`.
3. **Environment variables** (*Settings → Environment Variables*):
   - `AUTH_SECRET` – long random string (`openssl rand -base64 32`)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` – first admin account (created automatically on first login)
   - `NEXT_PUBLIC_SITE_URL` – e.g. `https://pathfold.example.org`
   - `BLOB_READ_WRITE_TOKEN` – optional, added automatically when you create a **Blob** store under *Storage*; enables image uploads from the admin
4. **Create the tables** once: run `npx prisma db push` locally with `DATABASE_URL` set to the production URL
   (`DATABASE_URL="postgres://…" npx prisma db push`), then optionally `DATABASE_URL="postgres://…" npm run db:seed`.
   Alternatively open the Vercel project's database tab and use the Neon SQL editor with `prisma migrate diff`.
5. Deploy. The build script runs `prisma generate && next build`.
6. **Custom domain** – *Settings → Domains*, add your domain and point its DNS (CNAME to `cname.vercel-dns.com`,
   or A record `76.76.21.21`) as instructed by Vercel. Update `NEXT_PUBLIC_SITE_URL` afterwards.

All public pages are rendered on demand from the database, so changes in the admin are visible immediately.

## Managing content

Every content type is described declaratively in `src/lib/admin/registry.ts` (fields, list columns, ordering).
To add a field: extend the Prisma model in `prisma/schema.prisma`, run `npm run db:push`, and add the field to the
registry – the admin list and form adapt automatically.

Static narrative texts (project description, research questions, component descriptions, data sources, roadmap)
live in `src/lib/content.ts`; short editable texts (hero, contact details, funding statement, social links) are in
*Admin → Settings*.

## Project structure

```
prisma/              schema + seed (content from the proposal)
public/              logo, logo mark, overview infographic, Open Graph image
src/app/(site)/      public pages (shared navbar/footer layout)
src/app/admin/       login + gated dashboard (generic [model] routes, settings)
src/app/api/upload   admin-only upload endpoint (Vercel Blob / local disk)
src/components/      site, admin and ui components
src/lib/             db, auth, data access, settings, admin registry + server actions, static content
```

## Content notes

The seed and static texts are derived from the project proposal. Sensitive details (budget, salaries,
phone numbers, letters of support, bank details) are intentionally not included.
