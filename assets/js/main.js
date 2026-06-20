/* ============================================================
   TOONTOONI'S TABLE — Main JS
   Loads the shared header/footer partials, then wires up nav,
   scroll reveals, smooth scrolling and lazy video.
   ============================================================ */

// ── PARTIAL INJECTION ──
// Header/footer live in /partials/*.html (single source of truth) and are
// fetched at runtime. Paths are root-relative, so this works at the domain
// root and via `python3 -m http.server` started from the project root.
async function injectPartial(hostId, url) {
  const host = document.getElementById(hostId);
  if (!host) return;
  try {
    const res = await fetch(url);
    if (res.ok) host.innerHTML = await res.text();
  } catch (e) {
    /* network/file error — leave placeholder empty, page stays usable */
  }
}

// ── NAV (scroll effect + hamburger) ──
function initNav() {
  const mainNav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!mainNav || !hamburger || !mobileNav) return;

  const onScroll = () => mainNav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll);
  onScroll();

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when any link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── REVEAL ON SCROLL ──
function initReveal() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

// ── PARTNER LOGO TICKER ──
// The CSS marquee translates the track by -50%, so the logo set must appear
// twice. Clone it once at runtime (keeps the HTML to a single set). Skipped
// when the user prefers reduced motion (the CSS falls back to a static wrap).
function initTicker() {
  const ticker = document.querySelector('.logo-ticker');
  const track = ticker && ticker.querySelector('.logo-track');
  if (!ticker || !track) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Duplicate the logo set once for a seamless -50% loop.
  track.querySelectorAll('.logo-chip').forEach(chip => {
    const clone = chip.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Start the scroll the moment the section reaches the viewport.
  const start = () => ticker.classList.add('in-view');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { start(); io.disconnect(); }
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(ticker);
  } else {
    start(); // no IO support → just run it
  }
}

// ── SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS ──
// Handles both plain "#id" links and root-relative "/#id" nav links. A link is
// smooth-scrolled only when it targets a hash on the *current* page; otherwise
// the browser navigates normally (e.g. /#supper-club clicked from an event page).
const normPath = p => (p.replace(/index\.html$/, '').replace(/\/+$/, '') || '/');

function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const url = new URL(anchor.getAttribute('href'), window.location.href);
      if (!url.hash) return;
      if (normPath(url.pathname) !== normPath(window.location.pathname)) return;
      const target = document.querySelector(url.hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── BOOTSTRAP ──
(async function bootstrap() {
  await Promise.all([
    injectPartial('site-header', '/partials/header.html'),
    injectPartial('site-footer', '/partials/footer.html'),
  ]);
  initNav();
  initReveal();
  initTicker();
  initSmoothScroll();
})();
