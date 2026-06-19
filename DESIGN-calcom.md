# DESIGN — Cal.com aesthetic (permanent design language)

This file defines the design language Claude Code must use for **all UI in this project**.
It reproduces the Cal.com look: grayscale, minimal, premium. Read this before building any screen.

---

## 0. Core philosophy
- **Grayscale brand.** White / near-black backgrounds. Color is used **only** for status (success / error / warning / info). Cal.com draws its black-and-white feel from Uber — use color sparingly.
- **Borders over shadows.** Separate elements with 1px subtle borders, not heavy elevation. `shadow-sm` at most.
- **Whitespace-heavy, content-first.** Generous spacing, calm layouts.
- **One accent per view.** A single black primary action; everything else is neutral.
- The "premium" feel comes from restraint: consistent 6px radius, subtle borders, and the Cal Sans / Inter pairing.

---

## 1. Typography (two-font system)
- **Cal Sans** (`font-cal`) — geometric display font, **headings and large display text ONLY**. Tight letter-spacing; add positive tracking as size shrinks. Open source (SIL OFL).
- **Inter** (`font-sans`) — **everything else** (body, UI, labels, inputs). Open source.
- Never use Cal Sans for body text. Never use a third font.

Heading scale (size / letter-spacing):
- h1 56px · h2 40px (+0.01em) · h3 36px (+0.015em) · h4 28px (+0.02em) · h5 20px (+0.03em) · h6 16px (+0.04em)
- Headings use `tracking-tight` by default.

Getting the fonts:
- Cal Sans: download `CalSans-SemiBold.woff2` from github.com/calcom/font (classic) or github.com/calcom/sans (v2 variable), or `npm i @calcom/cal-sans-ui`.
- Inter: via `next/font/google`.

---

## 2. Semantic tokens (NEVER use raw grays in components)
Always style with these semantic names — they give free light/dark theming and white-labeling.

**Backgrounds:** `bg-default` (white) · `bg-subtle` · `bg-muted` · `bg-emphasis` · `bg-inverted`
**Borders:** `border-default` · `border-subtle` · `border-emphasis`
**Text:** `text-default` / `text-emphasis` · `text-subtle` · `text-muted` · `text-inverted`
**Brand:** `bg-brand-default` · `bg-brand-emphasis` · `text-brand` (text ON brand)
**Status:** `bg-info` / `text-info`, `bg-success` / `text-success`, `bg-attention` / `text-attention`, `bg-error` / `text-error` (+ matching borders)

Confirmed literal endpoints:
- Brand: light `#111827` (black) → dark `#FFFFFF` (white). Brand emphasis: light `#101010` → dark `#e1e1e1`. Brand text: light white → dark black.
- Highest-contrast text: `#111827` (light) / `#f9fafb` (dark).
- Default border: `#e5e7eb` (light) / `#374151` (dark).

Neutral scale = standard Tailwind `gray`:
```
gray-50 #f9fafb · gray-100 #f3f4f6 · gray-200 #e5e7eb · gray-300 #d1d5db · gray-400 #9ca3af
gray-500 #6b7280 · gray-600 #4b5563 · gray-700 #374151 · gray-800 #1f2937 · gray-900 #111827
```

---

## 3. Radius / shadows / borders / spacing
- **Radius:** `rounded-md` = **6px** everywhere (buttons, inputs, cards, dialogs). `rounded-full` for avatars/pills.
- **Shadows:** minimal — `shadow-sm` on buttons/cards, slightly larger on dropdowns/dialogs. Never heavy.
- **Borders:** 1px, `border-subtle` / `border-default`. Primary separation device.
- **Spacing:** Tailwind 4px scale; cards `p-4`/`p-6`; generous gaps.

---

## 4. Component patterns
- **Buttons** (CVA variants):
  - *primary* — solid black: `bg-brand-default text-brand hover:bg-brand-emphasis`
  - *secondary* — `border border-default bg-default text-emphasis hover:bg-subtle`
  - *minimal* — transparent, `hover:bg-subtle`
  - *destructive* — red
  - Sizes sm/base/lg; height ~`h-9`, `px-3`, `text-sm font-medium`, `rounded-md`, focus ring, icon + loading support. **One primary per view.**
- **Inputs:** `w-full rounded-md border border-default bg-default px-3 py-2 text-sm text-emphasis placeholder:text-muted focus:border-emphasis focus:ring-2 focus:ring-emphasis`. Labels: `text-emphasis text-sm font-medium`.
- **Cards:** `rounded-md border border-subtle bg-default p-6 shadow-sm`.
- **Dialogs/modals:** Radix Dialog, centered, `rounded-md`/`rounded-lg`, `bg-default`, subtle overlay, modest shadow.
- **Dropdowns/menus:** Radix, `bg-default border border-subtle rounded-md shadow-sm`, items `hover:bg-subtle`.
- **Badges:** small `rounded-md` or pill, subtle status background.
- **Toggles/switches:** Radix Switch, brand color when on.
- **Tabs:** minimal underline or subtle pill.
- **Avatars:** `rounded-full`, subtle ring/border.
- **App shell:** left sidebar `bg-muted`/`bg-subtle` with subtle borders; content area `bg-default`. Booking-style pages are clean and centered.

---

## 5. Stack conventions
- Next.js + Tailwind CSS + **Radix UI** primitives + **CVA** (class-variance-authority) for variants + **`cn()`** (clsx + tailwind-merge) for class merging. Same shadcn-style pattern.
- Build reusable components with CVA variants rather than ad-hoc class strings.

---

## 6. White-label / brand-color path
If a colored brand is ever needed: swap **only** the `--cal-brand*` variables and keep the neutral grayscale scale intact. Do not introduce colored backgrounds elsewhere.

---

### Reminder for Claude Code
Style every element with the semantic tokens above (never raw `gray-200` etc.), keep Cal Sans for headings only, use `rounded-md`, prefer 1px subtle borders over shadows, and keep a single black primary action per view. Use `tokens.css` (in this repo) for the actual values.
