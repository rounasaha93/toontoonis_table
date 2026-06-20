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
  initSmoothScroll();
})();
