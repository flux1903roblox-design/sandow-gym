# Sandow — project guide for Claude

Offline-first fitness **PWA**, Hebrew-first / RTL (+ English). React 18 + Vite + TS, Tailwind,
Dexie (IndexedDB), Zustand, react-i18next, HashRouter. Deploys to GitHub Pages via Actions on push to `main`.

## Design language: Cal.com aesthetic (ALWAYS)
The look is defined in [DESIGN-calcom.md](DESIGN-calcom.md); exact values in [tokens.css](tokens.css).
- **Grayscale, minimal, premium.** White / near-black; color ONLY for status (info/success/attention/error).
- **One black primary action per view.** Buttons: primary = solid black; secondary = bordered white; ghost = transparent.
- **Borders over shadows.** 1px subtle borders separate things; `shadow-sm` at most.
- **Radius:** `rounded-md` (6px) for controls; cards ~8px (`rounded-card`); `rounded-full` for avatars/pills.
- **Whitespace-heavy, content-first.** Headings `tracking-tight`.

## How the theme is wired in THIS repo (important)
The Cal.com kit ships a `bg-default`/`text-emphasis` class vocabulary, but **this app keeps its own
semantic token names** (used by every component) and maps their *values* to `tokens.css`. So:
- **Style with the repo tokens**, which already resolve to Cal.com values — do NOT introduce `bg-default` etc.
- Color values live in [tailwind.config.ts](tailwind.config.ts) as `hsl(var(--cal-*) / <alpha-value>)`; `tokens.css` is imported once in [src/styles/index.css](src/styles/index.css). Light by default (no `.dark` class applied).

| Repo token | Cal.com value | Use |
|---|---|---|
| `bg` | `--cal-bg-subtle` (gray-50) | page background |
| `surface` | `--cal-bg` (white) | cards (add a border) |
| `surface-2` / `surface-3` | gray-100 / gray-200 | raised controls / hover |
| `border` | `--cal-border` (gray-200) | hairlines |
| `foreground` | gray-900 | text |
| `muted` / `muted-2` | gray-500 / gray-400 | secondary / tertiary text |
| `primary` (fg) | black (white) | the single black CTA |
| `secondary` | blue `--cal-info` | info only, sparingly (rest timer) |
| `success` / `warning` / `destructive` | green / orange / red | status |

- **There must be exactly one `tailwind.config.*`.** Tailwind auto-loads `.js` over `.ts`; a stray `tailwind.config.js` will silently shadow `tailwind.config.ts`. Keep only the `.ts`.
- **Fonts:** Heebo (Hebrew + fallback). Inter/Cal Sans (Latin) can be layered in later — they have no Hebrew glyphs, so Heebo must remain the Hebrew face.

## RTL (enforced)
Logical properties only — `ps/pe`, `ms/me`, `start/end`, `text-start/end`, `rounded-s/e`. No `pl/pr/ml/mr/left/right`. `npm run lint:rtl` (scripts/check-rtl.mjs) must pass.

## Verify visually (screenshot loop)
Use the Claude Preview MCP: `preview_screenshot` for a rough view, but **read exact values with
`preview_eval`/`preview_inspect`** (the raw screenshot has scroll/scale artifacts here). Match the
phone viewport (375×812). Clear the service worker + caches before reloading or you'll see a stale build.

## Commands
`npm run build` · `npm run preview` (port 4173) · `npm run lint:rtl` · push to `main` → live at
https://flux1903roblox-design.github.io/sandow-gym/
