# Toontooni's Table — Developer Notes for Claude

## Stack
Plain HTML + CSS + vanilla JS. No build step, no framework, no bundler.  
Local dev: `python3 -m http.server 3000` from the project root.

---

## File structure

```
index.html              — main site (single page)
services.html           — "Our Services" sub-page (linked from About Us)
event-prh-grazing-table.html  — Event detail: PRH grazing table
event-table-of-love.html      — Event detail: Table of Love (Cumin Co.)
event-nuuk-popup.html         — Event detail: Modern Bengali Table (Nuuk)
partials/header.html    — SHARED nav (desktop + mobile) — single source of truth
partials/footer.html    — SHARED footer — single source of truth
assets/css/style.css    — all styles
assets/js/main.js       — injects partials, then wires nav / reveal / smooth-scroll / logo ticker
assets/images/          — logo-black.png, logo-white.svg,
                          experience-1..3.jpg (Supper Club), host.jpg (Meet the Host),
                          food-plating.jpg (Beyond the Table), partners/ (25 logos)
sitemap.xml
robots.txt
site.webmanifest
CLAUDE.md               — this file
```

---

## Sections on index.html (in order)

| Section | `id` | Background |
|---|---|---|
| Hero | `#home` | saffron |
| Statement band | — | indigo |
| Supper Club | `#supper-club` | white/saffron |
| Events (`#events`, inside Supper Club): Event Highlights — 3 cards linking to event detail pages — + Upcoming Events (IG / mailing-list note) | `#events` | inside Supper Club |
| Press & Recognition | `#press` | `#0f0a1e` near-black |
| Meet the Host (nav: "Host") | `#meet` | red |
| More About Us (nav: "About Us"; 3 cards — Meet the Team / Our Services / Logo Story) | `#team` | saffron |
| Beyond the Table | `#beyond` | orange |
| Footer / Contact | `#contact` | indigo |

---

## Colour palette

```css
--saffron:  #E6C229
--indigo:   #6610F2
--red:      #DB2655
--orange:   #F17105
--ink:      #1a1000
```

## Fonts
Montserrat (headings, labels, nav) + Nunito (body) via Google Fonts.

## Key CSS conventions
- `.reveal` + `.visible` — scroll-triggered fade-up (IntersectionObserver in main.js)
- `.d1 / .d2 / .d3` — staggered transition delays
- `.container` — max-width 1140px, padding 3.5rem sides (1.5rem on mobile)
- `.section` — padding 6rem 0
- Sub-pages (`services.html`, `event-*.html`) live at the repo root and reuse the shared
  header/footer partials. They link back via root-relative anchors (`/#events`, `/#contact`).
  New event detail pages follow the standard template in any `event-*.html`: collab eyebrow
  → `.event-title` → `.event-hero-img` (3:2) → writeup with `.event-subhead` headings
  → `.gallery-grid` of square `<img>` → optional `.event-partner-list`.
- Event photos live in `assets/images/events/<slug>/NN.jpg` (optimised, ≤1400px). Card images on
  the index Event Highlights use the same files.
- Every page carries full SEO/GEO meta: canonical, Open Graph, Twitter card, `geo.*` tags, and
  JSON-LD (FoodEstablishment on home; Article + BreadcrumbList on event pages; Service + Breadcrumb
  on services). Canonical host is `toontoonistable.com` — keep new URLs on that host.
- Bust caches by bumping the `?v=N` query on the `style.css` / `main.js` links across all pages.

---

## Contact email
`g.toonika@gmail.com` — used in all footer "Get in Touch" links.

---

## Rules learned from past mistakes

### 1. No breadcrumbs — ever
Do not add breadcrumbs to any page. They were built twice in different positions and rejected both times. If navigation context is needed, use a simple text link (e.g. "← Back to Events").

### 2. Nav / footer are now shared partials — edit in ONE place
Header and footer were previously duplicated across every HTML file. They are now
single source-of-truth partials, injected at runtime by `assets/js/main.js`:
- Nav (desktop + mobile): `partials/header.html`
- Footer: `partials/footer.html`

Each page just carries the placeholders `<div id="site-header"></div>` and
`<div id="site-footer"></div>`. To change a nav item or footer link, edit the partial
only — it propagates everywhere automatically.

Notes:
- Partial links are root-relative (`/#supper-club`, `/assets/...`) so the same markup
  works from the root page and from any future sub-page (e.g. a `/foo/` directory).
  They resolve correctly when served at the domain root or via
  `python3 -m http.server` started from the project root.
- Partials are loaded with `fetch()`, so the site must be served over http(s)
  (the dev server or the live host) — opening a file directly via `file://` will not
  inject the header/footer.

### 3. Press section — editorial layout, not card grids
The Press & Recognition section must feel like a magazine feature. Symmetric 3-column card grids were rejected twice. Use an asymmetric editorial layout: one large featured quote with oversized typographic treatment, supported by smaller secondary items below.

### 4. (Obsolete) Footer copies — now a single shared partial
Footers used to be independent HTML copies per page. They are now one shared file
(`partials/footer.html`). No need to sync across files anymore — see rule #2.
