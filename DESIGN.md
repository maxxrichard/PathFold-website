# PathFold design system - "the printed annual"

The public site is laid out like a well-edited printed research report: a masthead of the project's own footage, a tight oversized title, text held to a strict column line, and colour used in whole flat blocks the way a two-colour print job would. The two colours are the project's own: **native blue** for productive folding and **misfold coral** for off-pathway divergence, on paper, with one near-black "night" band per page.

The idea: on this page, the divergence between productive folding (blue) and misfolding (red) becomes the two-colour print scheme of a research annual; the live thing is the pathway explorer on the landing page.

## Tokens (`src/app/globals.css`)

| Role | Token | Value |
| --- | --- | --- |
| Paper (ground) | `--paper` | `#f4f5f2` |
| Paper, one step | `--paper-2` / `--paper-3` | `#e9ebe6` / `#dde0d9` |
| Ink | `--ink` | `#0c1424` |
| Soft ink (secondary text) | `--ink-soft` | `#46506a` |
| Native blue (action, productive folding) | `--native` | `#1d5fe0` |
| Sky field (blue colour page) | `--sky` | `#bfdbff` |
| Misfold coral | `--misfold` | `#d9462b` |
| Coral field (red colour page) | `--coral` | `#ff8a6a` |
| Night band | `--night` / `--night-2` | `#0c1424` / `#182238` |

Colour pages: `field-sky`, `field-coral`, `field-night`, `field-paper-2` set the ground and re-map `--ink`, `--ink-soft`, `--paper-2` for their surface. `text-paper` stays paper on every field; use `text-night` for ink on a paper element inside the night band. Legacy tokens (`--bg`, `--fg`, `--brand-*`) and utilities (`btn`, `card`, `chip`, `input`, `eyebrow`) are kept for the admin area and mapped onto this palette. shadcn tokens (`--primary`, `--muted`, …) are mapped too; `--radius` is 0.

## Type

One family: **General Sans** (Fontshare licence), self-hosted in `src/fonts/` via `next/font/local`, weights 400/500/600/700. Few sizes, far apart:

| Step | Utility | Size |
| --- | --- | --- |
| Small | `t-small` | 13–14px |
| Body | `t-body` | 17–19px |
| Lead | `t-lead` | 20–26px |
| Head (section) | `t-head` | 28–60px |
| Title (page) | `t-title` | 32–80px |
| Display (masthead) | `t-display` | 28–52px |
| Slogan (statement tile) | `t-slogan` | 30–72px |
| Staircase line | `t-stair` | 28–56px |

Headlines: sentence case, tracking −0.02 to −0.03em, two lines or fewer at every width. No eyebrows, no uppercase micro-labels, no monospace outside code, no gradient text.

## Layout

- `container-x`: one pair of margins (16px, 32px from 640px), max 1600px.
- `grid-12`: the twelve-column page grid. The **axis** is column 6 (≈42%): section headings and running text start there (`axis`), small side notes, figures and facts live in the left zone (`aside-zone`). Below 1024px both span the full width.
- Sections are separated by space (`py-section`, 64–112px each side) and by a change of ground, never by rules. Lists and tables use alternating tone bands (`odd:band`) instead of lines.
- Mosaics are gutterless (8px gaps): the statement tiles, partner logos, team tiles, media gallery.
- Corners are square everywhere. Buttons: flat rectangle, ink on paper (`btn btn-primary`), hover native blue; one action per field.
- Shadows only on real overlays (the media lightbox). Forms (`data-ui`) keep their 1px lines.

## Components

- `Section` / `SectionHeading` / `PageHero` (`src/components/ui/Section.tsx`)
- `Masthead`, `StatementTiles`, `Staircase`, `PinnedRows` (`src/components/site/landing.tsx`)
- Rows and tiles in `src/components/site/cards.tsx` (news row, publication row, team tile, partner tile, resource row)
- shadcn (base-nova, `@base-ui/react`): `button`, `input`, `textarea`, `label`, `sheet` (mobile menu), `table`, `tabs`, `select` in `src/components/ui/`

## Motion

- `rise` / `rise-1…4`: load entrance for the first screen (CSS, fill both, no JS needed).
- `Reveal` (`src/components/ui/Reveal.tsx`): content renders visible; after hydration, elements below the fold are held back and rise 20px on entry, staggered with `delay`. Reduced motion: nothing moves.
- The masthead footage is the one moving picture; the explorer path draws itself; the pinned heading holds while the component rows pass.

## Pictures

Only the project's own: `pathfold-folding-paths.mp4` (masthead, shown whole), `pathfold-overview.(jpg|webp)` (about page figure, masthead poster), partner logos, and whatever the admin uploads (team portraits, news cover images, media).
