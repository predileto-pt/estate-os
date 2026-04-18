# Add app-wide shadcn-style sidebar

**Status:** in-progress
**Owner:** Peter
**Created:** 2026-04-18

## Problem

Primary navigation lives in a horizontal top nav (`src/components/dashboard-top-nav.tsx`) that's cramped at desktop widths and has no room to grow. Settings sub-pages hide behind a separate in-page rail (`SettingsSidebar`); `ContratosSidebar` is another one-off. Property detail pages have no way to surface planned sub-sections (documents, analytics, settings) without nesting tabs inside tabs. Several route layouts (`candidatos`, `propostas`, `imoveis`) already reserve empty `col-span-2` left columns, so the chrome is half-designed.

## Goal

Replace the top nav with an `AppSidebar` that follows the shadcn/ui `Sidebar` pattern — route-aware, keyboard-collapsible, always present on authenticated pages — and relocate brand/email/settings/logout/language-switcher into the sidebar's header and footer.

## Non-goals

- Migrating pre-existing lint warnings (`<img>`, `react-hook-form watch`, `ref-in-render`).
- Building real content for the new `/imoveis/[id]/documents`, `/analytics`, `/settings` sub-pages. This spec ships empty stubs only, enough to prove the sidebar's routing/active-state works.
- A global theme/token overhaul. Shadcn sidebar tokens (`--color-sidebar*` in Tailwind v4's `@theme inline`) are scoped to the sidebar; the rest of the app keeps its current Tailwind gray palette.
- Mobile-specific polish beyond shadcn's default `Sheet` behavior.
- Extracting the property detail *right* sidebar (owners / price / amenities) into a shared component. That stays as-is.
- Nested / secondary sidebars. There is always exactly one sidebar on screen; its content swaps based on route.

## Approach

### 1. Adopt shadcn/ui primitives, scoped to the sidebar

Run `npx shadcn@latest init` so the Tailwind-v4-compatible token scaffolding is done by the CLI. This creates `components.json`, writes the correct `@theme inline` block into `src/app/globals.css`, and installs the deps not already present:

- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `@radix-ui/react-slot`

Already present: `lucide-react`, `@radix-ui/react-select`, Tailwind v4.

**Important — Tailwind v4 token shape.** Under Tailwind v4, sidebar tokens live in `@theme inline` with the `--color-` prefix so the utilities (`bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, etc.) are generated. After `init`, the relevant variables are:

```
--color-sidebar
--color-sidebar-foreground
--color-sidebar-primary
--color-sidebar-primary-foreground
--color-sidebar-accent
--color-sidebar-accent-foreground
--color-sidebar-border
--color-sidebar-ring
```

Map their values to the existing gray scale (`#111`, `#f5f5f4`, `#e5e7eb`, etc. from `globals.css:33-36`) so the sidebar reads as the same app. The existing `@theme { --font-heading, --font-body }` block and `body` rules stay untouched.

### 2. Vendor shadcn source files

Use `npx shadcn@latest add sidebar breadcrumb separator`. This drops:

- `src/components/ui/sidebar.tsx` — exposes `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarInset`, `SidebarTrigger`, `useSidebar`
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/separator.tsx`

The CLI also adds the `sidebar` / `breadcrumb` entries to `components.json` and handles any transitive dep installs.

### 3. Build `src/components/app-sidebar.tsx`

Client component. Reads `usePathname()` and picks exactly one content group to render — the groups are mutually exclusive, there is never more than one sidebar visible. Matching is longest-prefix; order below is the resolution priority:

1. **Property scope** — pathname starts with `/imoveis/[id]` where `[id]` is a concrete id segment (not the `novo` route). Items: Property (`/imoveis/[id]`), Images (`/imoveis/[id]/imagens`), Documents (`/imoveis/[id]/documents`), Analytics (`/imoveis/[id]/analytics`), Settings (`/imoveis/[id]/settings`). `[id]` extracted from the pathname. `/imoveis/[id]/imagens` already exists; the rest are stubs (see §6).
2. **Settings scope** — pathname starts with `/dashboard/settings`. Items: Profile, Organization, Subscriptions, Privacy. Replaces the existing in-page `SettingsSidebar`.
3. **Contratos scope** — pathname matches the `contratos` list group (`/contratos`, `/contratos/modelos`; i.e. *not* `/contratos/modelos/[id]` or `/contratos/modelos/novo`). Items: Contratos, Modelos. Replaces the existing in-page `ContratosSidebar`.
4. **Main scope** — everything else. Items: Dashboard, Formulários, Candidaturas, Imóveis, Propostas, Contratos.

Labels from `useDictionary()`. Styling: sm semibold, no icons.

**Header** — "Predileto" brand, links to `/dashboard`.

**Footer** — user email, settings link, logout action, language switcher stacked in a user menu.

Active-state logic matches the longest path prefix within the active group.

The sidebar always has the same visual frame (width, borders, sticky full-height) regardless of which group is active — only the items change. When the user navigates from `/imoveis` to `/imoveis/[id]`, `AppSidebar` re-renders with different items, but the `SidebarProvider` above it stays mounted — so the open/collapsed state persists across navigations.

### 4. Wire into root layout

`src/app/layout.tsx` conditionally renders the chrome based on the `user` result already fetched via `supabase.auth.getUser()`. `DashboardTopNav` is removed.

```tsx
// Authenticated: sidebar + inset shell
if (user) {
  return (
    <SidebarProvider>
      <AppSidebar email={user.email ?? ""} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

// Unauthenticated (login, register, auth callback): no chrome
return <main className="min-h-screen">{children}</main>;
```

Two distinct render trees — no shared sidebar shell on unauthenticated pages, no hidden-via-CSS sidebar. The conditional sits above `DictionaryProvider` and `QueryProvider` so those still wrap both branches.

### 5. Per-page header pattern via `<PageHeader>`

New file `src/components/page-header.tsx` renders:

```tsx
<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
  <SidebarTrigger className="-ml-1" />
  <Separator orientation="vertical" className="mr-2 h-4" />
  <Breadcrumb>...</Breadcrumb>
  <div className="ml-auto">{actions}</div>
</header>
```

Accepts `breadcrumbs: { label: string; href?: string }[]` and optional `actions: ReactNode`.

**Staging.** `<PageHeader>` gets added to pages in two phases so this spec ships a working acceptance surface in phase one and the long-tail migration lands in phase two:

**Phase one (ships with this spec — day-one minimum):**
- `src/app/dashboard/page.tsx`
- `src/app/imoveis/page.tsx`
- `src/app/imoveis/[id]/page.tsx`
- `src/app/imoveis/[id]/documents/page.tsx`, `/analytics/page.tsx`, `/settings/page.tsx` (stubs)
- `src/app/dashboard/settings/profile/page.tsx` (so Settings-scope active-state can be verified)
- `src/app/contratos/page.tsx` (post-flatten; so Contratos-scope active-state can be verified)
- `src/app/login/page.tsx` and `src/app/register/page.tsx` do **not** get `<PageHeader>` — unauthenticated pages render without chrome.

**Phase two (follow-up, listed in Out-of-scope):**
- `src/app/candidatos/page.tsx`, `src/app/propostas/page.tsx`, `src/app/formularios/page.tsx`
- `src/app/imoveis/[id]/imagens/page.tsx`, `src/app/imoveis/novo/page.tsx`
- `src/app/contratos/modelos/page.tsx`, `src/app/contratos/modelos/[id]/page.tsx`, `src/app/contratos/modelos/novo/page.tsx`
- Remaining settings sub-pages (`organization`, `subscriptions`, `privacy`)

Pages without `<PageHeader>` in phase one still render inside `SidebarInset` — they just look chromeless at the top. Functional, not yet polished.

### 6. Scaffold property sub-routes

Stub files that render `<PageHeader>` + a "Coming soon" body:

- `src/app/imoveis/[id]/documents/page.tsx`
- `src/app/imoveis/[id]/analytics/page.tsx`
- `src/app/imoveis/[id]/settings/page.tsx`

These prove the sidebar's active-state behavior end-to-end.

### 7. Retire `DashboardTopNav`, empty grid columns, and the in-page sidebars

Delete:
- `src/components/dashboard-top-nav.tsx` (logout moves to the `AppSidebar` footer)
- `src/app/dashboard/settings/components/settings-sidebar.tsx` (folded into `AppSidebar` Settings scope)
- `src/app/contratos/components/contratos-sidebar.tsx` (folded into `AppSidebar` Contratos scope)
- `src/app/contratos/components/contract-tools-sidebar.tsx` (grep-verified: only import site is `(with-sidebar)/layout.tsx:17`, which is also being removed)

Collapse the `col-span-2 / col-span-8 / col-span-2` (and similar) grid patterns in:
- `src/app/candidatos/layout.tsx`
- `src/app/propostas/layout.tsx`
- The wrapper inside `src/app/imoveis/page.tsx`
- `src/app/dashboard/settings/layout.tsx` (currently mounts `SettingsSidebar` in col-span-3)

(The `contratos/(with-sidebar)/layout.tsx` grid is handled by deleting the file during the flatten below — no separate collapse step.)

All of the above become a plain `max-w-7xl mx-auto px-4 py-4` container inside `SidebarInset`.

**Flatten the `(with-sidebar)` / `(detail)` route groups in `contratos`.** The groups only existed to mount different sidebars; now the sidebar is global and route-aware, the groups have no job. Move the pages under the groups up one level (`src/app/contratos/(with-sidebar)/page.tsx` → `src/app/contratos/page.tsx`, same for `modelos/page.tsx`; `(detail)/modelos/[id]/page.tsx` → `modelos/[id]/page.tsx`, same for `novo`). Delete the two group-level `layout.tsx` files. Keeping the groups would leave dead structural folders.

## Affected files / surfaces

New:
- `components.json` — shadcn config
- `src/components/ui/sidebar.tsx` — vendored
- `src/components/ui/breadcrumb.tsx` — vendored
- `src/components/ui/separator.tsx` — vendored
- `src/components/app-sidebar.tsx`
- `src/components/page-header.tsx`
- `src/app/imoveis/[id]/documents/page.tsx`
- `src/app/imoveis/[id]/analytics/page.tsx`
- `src/app/imoveis/[id]/settings/page.tsx`

Modified:
- `src/app/layout.tsx` — conditional chrome (see §4)
- `src/app/globals.css` — sidebar tokens added by `shadcn init` (Tailwind-v4 `@theme inline` block with `--color-sidebar*` vars)
- `src/dictionaries/pt.json` and `src/dictionaries/en.json` — new keys for Property-scope labels. `dashboard.documents` already exists; add `dashboard.property` (singular "Property" for the detail view item), `dashboard.images` ("Images"), `dashboard.analytics` ("Analytics"). `dashboard.settings` exists. All four scopes' labels must resolve from the dictionary.
- `src/app/candidatos/layout.tsx`, `src/app/propostas/layout.tsx` — drop empty grid columns
- `src/app/dashboard/layout.tsx` — drop its outer `<main>` wrapper; content lives inside `SidebarInset` now
- `src/app/dashboard/settings/layout.tsx` — drop 12-col grid + `SettingsSidebar` mount; children render directly
- `src/app/contratos/(with-sidebar)/layout.tsx` and `src/app/contratos/(detail)/layout.tsx` — delete after flattening the groups (see §7)
- `src/app/imoveis/page.tsx` wrapper — drop empty grid columns
- All page files listed in §"Per-page header pattern" — add `<PageHeader>`. See "Scope staging" below for day-one minimum vs. follow-up.
- `src/components/language-switcher.tsx` — likely needs a small rewrite. The current `<Select>` trigger won't fit inside the shadcn `SidebarFooter` user menu aesthetics. Convert to a submenu entry in a `DropdownMenu` (or to two radio-style `SidebarMenuItem`s for PT / EN). Acceptable to land as-is in phase one and polish in phase two.
- `package.json` — add `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot` (via `shadcn init`)

Deleted:
- `src/components/dashboard-top-nav.tsx`
- `src/app/dashboard/settings/components/settings-sidebar.tsx`
- `src/app/contratos/components/contratos-sidebar.tsx`
- `src/app/contratos/components/contract-tools-sidebar.tsx`
- `src/app/contratos/(with-sidebar)/layout.tsx`
- `src/app/contratos/(detail)/layout.tsx`

Reused utilities (no new code, no duplication):
- `useDictionary()` / `useLocale()` — `src/components/dictionary-provider.tsx`
- `cn()` — `src/lib/utils.ts`
- `createClient()` — `src/lib/supabase/client.ts` (for logout in sidebar footer)

## Acceptance criteria

- [ ] `/dashboard` renders with the Main scope sidebar expanded, a header inside `SidebarInset` with a "Dashboard" breadcrumb, and no top nav.
- [ ] Main scope items (Dashboard, Formulários, Candidaturas, Imóveis, Propostas, Contratos) mark the current route as active.
- [ ] `cmd/ctrl+b` collapses and expands the sidebar.
- [ ] `/dashboard/settings` and its sub-routes show the Settings scope (Profile, Organization, Subscriptions, Privacy) in the sidebar — no separate in-page rail.
- [ ] `/contratos` and `/contratos/modelos` show the Contratos scope (Contratos, Modelos) in the sidebar — no separate in-page rail.
- [ ] `/contratos/modelos/[id]` and `/contratos/modelos/novo` show the Main scope (these are detail pages; see spec §3 resolution rule).
- [ ] `/imoveis/[id]` swaps to the Property scope (Property, Images, Documents, Analytics, Settings). `[id]` is substituted correctly in every link.
- [ ] `/imoveis/[id]/documents`, `/analytics`, `/settings` render stub pages and the sidebar reflects the active item. `/imoveis/[id]/imagens` (existing) is now the Images item and highlights correctly.
- [ ] On property detail pages there is exactly **one app-level left sidebar** (Property scope); the Main scope does not render alongside. The property detail right sidebar (owners/price/amenities) continues to render unchanged.
- [ ] Unauthenticated routes (`/login`, `/register`) render without the sidebar.
- [ ] Email, settings link, logout button, and language switcher are reachable from the sidebar footer; each works.
- [ ] Language switcher still swaps `pt` ↔ `en` via the cookie; sidebar labels update on refresh.
- [ ] `SettingsSidebar`, `ContratosSidebar`, `ContractToolsSidebar`, `DashboardTopNav` files are deleted; grep confirms no remaining imports of any of them.
- [ ] New dictionary keys (`dashboard.property`, `dashboard.images`, `dashboard.analytics`) exist in both `pt.json` and `en.json`.
- [ ] `npx tsc --noEmit` clean; `npm run lint` produces no new errors beyond the 7 pre-existing ones (`jest.polyfills.ts` require-imports ×5, `cypress/support/commands.ts` namespace ×1, `properties-page-content.tsx` ref-in-render ×1).
- [ ] Existing Jest test (`create-intake-form-request-form.test.tsx`) passes.
- [ ] Visual sanity: at 1440×900, `/dashboard`, `/imoveis`, `/imoveis/[id]`, `/dashboard/settings/profile` each render with content fitting the viewport — no clipped content, no horizontal scrollbar from the `h-16` `PageHeader` shifting layout.

## Resolved decisions

- **A.** `SettingsSidebar` and `ContratosSidebar` are folded into `AppSidebar` as Settings-scope and Contratos-scope content. The in-page rails are deleted in this spec.
- **B.** Sidebar collapse persistence is client-only. Shadcn's `sidebar_state` cookie is used but never read on the server; first SSR render always shows the expanded default. No `cookies().get()` in the root layout.
- **C.** The property detail *right* sidebar (owners / price / amenities) coexists with the app sidebar — both can be on screen. The app sidebar can be collapsed via `cmd/ctrl+b` when the user needs more width. The Property-scope *left* sidebar and the existing property *right* sidebar are independent axes.

## Open questions

- None blocking implementation.

## Out-of-scope follow-ups

- **PageHeader rollout phase two** — add `<PageHeader>` to the long-tail pages listed under §5 "Phase two."
- Real content for `/imoveis/[id]/documents`, `/analytics`, `/settings`.
- Language switcher polish — final form inside the sidebar footer user menu (may start as a rough two-item submenu and refine later).
- Mobile-specific sidebar polish beyond shadcn defaults.
- Extracting the property detail right sidebar into a shared `<DetailSidebar>` component.
