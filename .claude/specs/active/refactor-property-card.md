# Refactor PropertyCard for the listing grid

**Status:** in-progress
**Owner:** Peter
**Created:** 2026-04-19

## Problem

The current `PropertyCard` (`src/app/imoveis/components/property-card.tsx`) is a wide, five-row stack: header (address + status), type badges + characteristics, owners block, footer (date + Details button). It scans vertically, wastes horizontal space on the new list grid, and doesn't show an image. Now that `/imoveis` has a filter sidebar and the list area is narrower, a square card that shows the property image up front reads faster.

Secondary issues with the current shape:
- The `border-l-4` status bar aligns oddly against the filter-sidebar gutter.
- No price is shown; the user has to open the detail page to see it.

## Goal

Replace the stacked card with a square-ish card that shows, from top to bottom: image, listing type + typology badges, price, address, owner name, Details button. The status-colored `border-l-4` moves to a `border-b-4` at the bottom of the card.

## Non-goals

- Changing the list page's grid layout outside the card itself (keep `col-span-2 / col-span-10` for filters/list).
- Changing `property-detail-content.tsx` or any other non-list property surface.
- Backend changes. If `property.images[].download_url` isn't populated on the list response, the card just renders the placeholder — don't add a new endpoint or presign step for the list.
- New status semantics. Keep the existing five statuses and their colors.
- Touching `PropertySummaryResponse` usage on the dashboard `RecentProperties` panel. That component stays in list form.

## Approach

### 1. Card shape

```
┌──────────────────────┐
│  ┌────────────────┐  │
│  │     image      │  │  ← square 1:1 slot, gray-100 background
│  │    (or ph.)    │  │
│  └────────────────┘  │
│                      │
│  [Venda] [Moradia]   │  ← type badges row
│  € 450 000           │  ← price, bold
│  Rua X, Porto        │  ← address (truncate w/ title)
│  JANUÁRIO V. LOPES   │  ← primary owner full name
│                      │
│  [ Detalhes ]        │
├──────────────────────┤  ← border-b-4, status color
└──────────────────────┘
```

Tailwind skeleton:
- Outer `<Link href="/imoveis/${id}">` — `border border-gray-200 bg-white flex flex-col` + `border-b-4 border-b-{statusColor}` + hover `hover:border-gray-400 transition-colors`.
- Image slot — `aspect-square bg-gray-100 overflow-hidden` with `<img>` or placeholder svg. Grid auto-sizes.
- Content block — `p-3 space-y-2 flex-1`.
- Footer — `px-3 pb-3` with the Details element aligned right.

**DOM shape (resolved).** Whole-card link — outer element is a single `<Link href="/imoveis/${id}">` wrapping the entire card. The Details element is a *non-anchor* styled pill: `<span className={buttonVariants({ variant: "steel" })}>…</span>`. Keyboard focus comes from the outer `<Link>`; the pill is a visual affordance. No nested anchors, no React DOM warnings.

### 2. Status color mapping

Reuse the existing map; move from `border-l-*` to `border-b-*`:

| status | current `border-l` | new `border-b` |
|---|---|---|
| active | `border-l-emerald-500` | `border-b-emerald-500` |
| draft | `border-l-gray-400` | `border-b-gray-400` |
| sold | `border-l-blue-500` | `border-b-blue-500` |
| rented | `border-l-violet-500` | `border-b-violet-500` |
| withdrawn | `border-l-red-400` | `border-b-red-400` |

Drop the status badge inside the card header (the border color already communicates status); keep the full status label available on hover via `title` on the outer element.

### 3. Price formatting

- Source: `property.prices: PropertyPriceResponse[]`.
- Pick the price whose `listing_type` matches the property's `listing_type`. If more than one, take the most recent (`created_at` desc). If none, render nothing (no placeholder, no "€ 0").
- Format via existing `formatPrice(amount, locale)` in `src/lib/utils.ts`. `amount` arrives as a string; convert with `Number()`.
- Append `/mês` (pt) or `/mo` (en) when `listing_type === "purchase"` (the backend enum name is misleading; `purchase` is the rental value in the current data model — see Out-of-scope follow-ups for the backend rename). Use a new dictionary key `perMonth` (`"/mês"` / `"/mo"`) — one key, appended at render time with no space.

### 4. Image slot

- Source: `property.images`. Find `display_order === 0` (or the minimum `display_order`, tie-broken on `created_at`).
- If `image.download_url` is present, render `<img src={download_url} alt={property.address} className="size-full object-cover">`.
- Otherwise, render a muted inline SVG building glyph centered on the `aspect-square` gray background (lucide `Building2` at `size-8 text-gray-300` is fine).
- **Do not** call presign for the list — if `download_url` isn't on the list response, this is a backend follow-up.

### 5. Owner rendering

- Show the first owner's `full_name`. If more than one owner, append `" +N"` where N = `owners.length - 1`.
- Drop the NIF badge from the card. NIF stays on the detail page.
- If no owners, skip the line entirely (don't render an empty placeholder).

### 6. Characteristics row removal

The icons-and-metrics row (area, bedrooms, bathrooms) is dropped from this card. Those live on the detail page. The square card shape doesn't have room, and the current consumer (`/imoveis` list) doesn't filter or sort by those values yet.

### 7. List grid

Update `src/app/imoveis/components/property-list.tsx` to switch from the vertical `space-y-4` stack to a responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`. The filter sidebar keeps its `col-span-2`; the list's `col-span-10` is where the card grid lives.

## Affected files / surfaces

Modified:
- `src/app/imoveis/components/property-card.tsx` — full rewrite of the card body per the shape in §1.
- `src/app/imoveis/components/property-list.tsx` — switch container to responsive grid.
- `src/dictionaries/pt.json`, `src/dictionaries/en.json` — add `perMonth` (`"/mês"` / `"/mo"`).

Dictionary keys that stay put (not edited by this spec):
- `propertyStatusDraft`, `propertyStatusActive`, `propertyStatusSold`, `propertyStatusRented`, `propertyStatusWithdrawn` — they leave the card face but are still used on the outer `title` attribute for screen readers, and remain valid for any other surface (detail page, dashboard recent list).

Reused utilities:
- `formatPrice(amount, locale)` in `src/lib/utils.ts`.
- `useLocale()` in `src/components/dictionary-provider.tsx`.
- `Building2` placeholder icon from `lucide-react` (already installed).
- `buttonVariants` from `src/components/ui/button.tsx` — used on the Details styled pill (see §1 DOM shape).
- Existing status color constants (inline today; keep them inline in the card — see Out-of-scope for the shared-map follow-up).

Not touched:
- `property-detail-content.tsx` (the detail page).
- `recent-properties.tsx` on the dashboard (different consumer, list-style rendering).
- Backend / OpenAPI types.

## Acceptance criteria

- [ ] `/imoveis` renders property cards in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop at the filter+list layout's `col-span-10`).
- [ ] Each card has an `aspect-square` image slot at the top — showing the first image if `download_url` is present, otherwise a centered muted placeholder glyph.
- [ ] Below the image, in order: type badges (listing type + typology) → price → address → owner line → Details button.
- [ ] Price: renders `formatPrice(amount, locale)` with `/mês` (pt) or `/mo` (en) suffix for `purchase` listings; renders nothing if no matching price exists.
- [ ] Address truncates on overflow; full address available via `title`.
- [ ] Owner line shows first owner's `full_name`; when `owners.length > 1`, appends `" +N"`. Line absent when `owners.length === 0`.
- [ ] Status color appears as `border-b-4` in the matching color from the existing map. No `border-l-*` on the card.
- [ ] The status badge chip is removed from the card body (color is on the border now). `title` on the outer element spells out the status (resolved via `dict.propertyStatus*`) for screen readers.
- [ ] No React runtime warnings about invalid DOM nesting (`<a>` inside `<a>`). See §1 DOM-nesting note.
- [ ] `npx tsc --noEmit` clean, `npm run lint` no new errors.

## Resolved decisions

- **A.** `listing_type === "purchase"` is the rental value in the current backend schema (the enum name is misleading). The `/mês` suffix applies when the price's `listing_type` is `purchase`. Renaming the backend enum to `sale | rental` is a follow-up (see Out-of-scope).
- **B.** Whole-card link. Outer element is a single `<Link>`; the Details pill is a non-anchor `<span>` styled via `buttonVariants({ variant: "steel" })`. No nested anchors.

## Open questions

- None blocking implementation.

## Out of scope follow-ups

- **Backend enum rename** — the `ListingType` enum should be `sale | rental`, not `sale | purchase`. Update the OpenAPI schema + regenerate `src/lib/types/estate-os-api.ts`, migrate the DB column, and update every frontend consumer. Out of scope here; this spec codes against the current (misleading) enum and comments where the mapping is non-obvious.
- Adding a `download_url` (or a `primary_image_url`) to the list response so the image slot is reliably populated without per-card presign calls.
- Per-card quick actions (publish/unpublish, delete) — the detail page still owns those.
- Card density toggle on the list page (compact vs. grid).
- Applying the new card to the dashboard's `RecentProperties` panel — that panel is list-style by design.
- Hoist the status-color record into a shared `src/app/imoveis/components/status-colors.ts` so `PropertyCard`, `RecentProperties`, and any future property surface read from the same source. Keep it inline for this spec; extract when a third consumer shows up.
