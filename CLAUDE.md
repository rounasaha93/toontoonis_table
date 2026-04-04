# Toontooni's Table — Developer Notes for Claude

## Stack
Plain HTML + CSS + vanilla JS. No build step, no framework, no bundler.  
Local dev: `python3 -m http.server 3000` from the project root.

---

## File structure

```
index.html              — single-page main site
assets/css/style.css    — all styles for index.html
assets/js/main.js       — scroll/nav JS
assets/images/          — logo-black.png, logo-white.svg, food-1.jpg, kitchen.jpg, portrait.jpg
events/
  event-1.html          — An Evening of Mustard & Maach (20 Apr 2026)
  event-2.html          — The Green Season Table (11 May 2026)
  event-3.html          — Monsoon Mela (8 Jun 2026)
  event.css             — shared stylesheet for all event pages
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
| Upcoming Events | `#events` | inside Supper Club |
| Press & Recognition | `#press` | `#0f0a1e` near-black |
| Meet Toonika | `#meet` | red |
| Team | `#team` | saffron |
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
- Event pages use `../` relative paths for assets and links back to index.html

---

## Contact email
`g.toonika@gmail.com` — used in all footer "Get in Touch" links.

---

## Rules learned from past mistakes

### 1. No breadcrumbs — ever
Do not add breadcrumbs to any page. They were built twice in different positions and rejected both times. If navigation context is needed, use a simple text link (e.g. "← Back to Events").

### 2. Nav changes touch 4 places
Whenever a nav item is added, renamed, or removed, update all four locations:
1. Desktop `<ul class="nav-links">` in `index.html`
2. Mobile `<nav id="mobile-nav">` in `index.html`
3. Footer "Navigate" column in `index.html`
4. Footer "Navigate" column in **each** `events/event-*.html`

The site has no shared component system — nav and footer are duplicated per file. Always grep for all instances before finishing.

### 3. Press section — editorial layout, not card grids
The Press & Recognition section must feel like a magazine feature. Symmetric 3-column card grids were rejected twice. Use an asymmetric editorial layout: one large featured quote with oversized typographic treatment, supported by smaller secondary items below.

### 4. Footer nav on event pages must match index.html
Event page footers are independent HTML copies. After any change to the main footer nav, immediately apply the same change to all `events/event-*.html` files.
