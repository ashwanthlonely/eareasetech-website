/**
 * Global Navigation & Footer for EarEase-Tech
 * Injects a consistent header and footer across all pages.
 * 
 * Usage: Add these placeholders in your HTML:
 *   <div id="global-header"></div>   (where the header should appear)
 *   <div id="global-footer"></div>   (where the footer should appear)
 * 
 * Then include this script at the end of <body>:
 *   <script src="js/navigation.js"></script>
 * 
 * For pages in subdirectories use:
 *   <script src="../js/navigation.js"></script>
 */

(function () {
  'use strict';

  // Detect if we are in a subdirectory (e.g. lead-magnets/)
  const depth = (function () {
    const scripts = document.querySelectorAll('script[src*="navigation.js"]');
    for (const s of scripts) {
      const src = s.getAttribute('src') || '';
      if (src.startsWith('../')) return 1;
      if (src.startsWith('../../')) return 2;
    }
    return 0;
  })();

  const prefix = depth === 0 ? '' : '../'.repeat(depth);

  // Determine the current page for active-link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    const hrefPage = href.split('/').pop().split('#')[0];
    const current = currentPage.split('#')[0];
    return hrefPage === current;
  }

  // ─── NAV LINKS ───────────────────────────────────────────────────
  const navLinks = [
    { label: 'Home',            href: prefix + 'index.html' },
    { label: 'Services',        href: prefix + 'our-services.html' },
    { label: 'Case Studies',    href: prefix + 'case-studies.html' },
    { label: 'Resources',       href: prefix + 'resources.html' },
    { label: 'About Us',        href: prefix + 'about-us.html' },
    { label: 'Mentorships',     href: prefix + 'internships.html' },
    { label: 'Careers',         href: prefix + 'careers.html' },
    { label: 'Contact',         href: prefix + 'contact-us.html' },
  ];

  // ─── BUILD HEADER ────────────────────────────────────────────────
  function buildHeader() {
    const container = document.getElementById('global-header');
    if (!container) return;

    // Desktop nav links
    const desktopLinks = navLinks.map(function (link) {
      const active = isActive(link.href);
      return '<a href="' + link.href + '" class="nav-link' + (active ? ' active' : '') + '">' + link.label + '</a>';
    }).join('\n            ');

    // Mobile nav links
    const mobileLinks = navLinks.map(function (link) {
      const active = isActive(link.href);
      return '<a href="' + link.href + '" class="block' + (active ? ' text-[#D4A017]' : ' hover:text-[#D4A017]') + '">' + link.label + '</a>';
    }).join('\n        ');

    const headerHTML = ''
      + '<header class="site-header sticky top-0 z-50 nav-enter">'
      + '\n  <div class="nav-shell max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">'
      + '\n    <a href="' + prefix + 'index.html" class="flex items-center space-x-3">'
      + '\n      <img src="' + prefix + 'assets/optimized/logo-256.png" alt="EarEase-Tech Logo" class="w-10 h-10 object-contain" />'
      + '\n      <p class="brand-mark text-xl font-bold text-slate-900">EarEase<span class="text-[#D4A017]">-Tech</span></p>'
      + '\n    </a>'
      + '\n    <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">'
      + '\n            ' + desktopLinks
      + '\n    </nav>'
      + '\n    <div class="md:hidden">'
      + '\n      <button id="menu-toggle" class="text-[#D4A017]" aria-label="Toggle navigation">'
      + '\n        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">'
      + '\n          <path d="M4 6h16M4 12h16M4 18h16"></path>'
      + '\n        </svg>'
      + '\n      </button>'
      + '\n    </div>'
      + '\n  </div>'
      + '\n  <div id="mobile-menu" class="mobile-menu-panel md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-slate-800">'
      + '\n        ' + mobileLinks
      + '\n  </div>'
      + '\n</header>';

    container.innerHTML = headerHTML;

    // Mobile menu toggle
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const header = container.querySelector('.site-header');
    const mobileLinksInMenu = container.querySelectorAll('#mobile-menu a');

    requestAnimationFrame(function () {
      if (header) header.classList.add('nav-ready');
    });

    function updateHeaderOnScroll() {
      if (!header) return;
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
    }

    mobileLinksInMenu.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
      });
    });
  }

  // ─── BUILD FOOTER ────────────────────────────────────────────────
  function buildFooter() {
    const container = document.getElementById('global-footer');
    if (!container) return;

    container.innerHTML = ''
      + '<footer class="bg-[#1b1f2a] text-white/80 py-6">'
      + '\n  <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">'
      + '\n    <p class="text-sm">&copy; 2025 EarEase-Tech Private Limited. All rights reserved.</p>'
      + '\n    <p class="text-sm">Wellness-led IT consulting &bull; Mentorships &bull; Listening labs</p>'
      + '\n  </div>'
      + '\n</footer>';
  }

  // ─── INIT SCROLL ANIMATIONS ──────────────────────────────────────
  function initAnimations() {
    if (typeof IntersectionObserver === 'undefined') return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-animate]').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── INJECT GLOBAL HEADER/FOOTER STYLES ──────────────────────────
  function injectStyles() {
    if (document.getElementById('global-nav-animations')) return;

    const style = document.createElement('style');
    style.id = 'global-nav-animations';
    style.textContent = ''
      + 'img, video {'
      + '  -webkit-user-drag: none;'
      + '  -khtml-user-drag: none;'
      + '  -moz-user-drag: none;'
      + '  -o-user-drag: none;'
      + '  user-drag: none;'
      + '  user-select: none;'
      + '}'
      + '\n.site-header {'
      + '  background: rgba(255, 255, 255, 0.82);'
      + '  backdrop-filter: blur(18px) saturate(160%);'
      + '  border-bottom: 1px solid rgba(255,255,255,0.55);'
      + '  box-shadow: 0 10px 34px rgba(15,23,42,0.07);'
      + '  transition: background 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;'
      + '}'
      + '\n.site-header::after {'
      + '  content: "";'
      + '  position: absolute;'
      + '  inset: auto 0 0 0;'
      + '  height: 1px;'
      + '  background: linear-gradient(90deg, rgba(212,160,23,0), rgba(212,160,23,0.95), rgba(212,160,23,0));'
      + '  opacity: 0;'
      + '  transition: opacity 0.35s ease;'
      + '}'
      + '\n.site-header.nav-enter {'
      + '  opacity: 0;'
      + '  transform: translateY(-12px);'
      + '}'
      + '\n.site-header.nav-ready {'
      + '  opacity: 1;'
      + '  transform: translateY(0);'
      + '  transition: opacity 0.45s ease, transform 0.45s ease, background 0.35s ease, box-shadow 0.35s ease;'
      + '}'
      + '\n.site-header.is-scrolled {'
      + '  background: rgba(255, 255, 255, 0.94);'
      + '  box-shadow: 0 14px 38px rgba(15,23,42,0.14);'
      + '}'
      + '\n.site-header.is-scrolled::after {'
      + '  opacity: 1;'
      + '}'
      + '\n.nav-shell {'
      + '  transition: padding 0.3s ease;'
      + '}'
      + '\n.site-header.is-scrolled .nav-shell {'
      + '  padding-top: 0.7rem;'
      + '  padding-bottom: 0.7rem;'
      + '}'
      + '\n.brand-mark {'
      + '  letter-spacing: 0.02em;'
      + '  transition: transform 0.3s ease, text-shadow 0.3s ease;'
      + '}'
      + '\n.site-header:hover .brand-mark {'
      + '  transform: translateY(-1px);'
      + '  text-shadow: 0 8px 22px rgba(212, 160, 23, 0.2);'
      + '}'
      + '\n.nav-link {'
      + '  position: relative;'
      + '  color: #0f172a;'
      + '  transition: color 0.25s ease, transform 0.25s ease, text-shadow 0.25s ease;'
      + '}'
      + '\n.nav-link::after {'
      + '  content: "";'
      + '  position: absolute;'
      + '  left: 0;'
      + '  right: 0;'
      + '  bottom: -0.35rem;'
      + '  height: 2px;'
      + '  transform: scaleX(0);'
      + '  transform-origin: center;'
      + '  transition: transform 0.3s ease;'
      + '  background: linear-gradient(90deg, #d4a017 0%, #f8c14d 60%, #d4a017 100%);'
      + '}'
      + '\n.nav-link:hover,'
      + '\n.nav-link.active {'
      + '  color: #d4a017;'
      + '  transform: translateY(-1px);'
      + '  text-shadow: 0 8px 18px rgba(212,160,23,0.2);'
      + '}'
      + '\n.nav-link:hover::after,'
      + '\n.nav-link.active::after {'
      + '  transform: scaleX(1);'
      + '}'
      + '\n.mobile-menu-panel {'
      + '  max-height: 0;'
      + '  opacity: 0;'
      + '  overflow: hidden;'
      + '  transform: translateY(-8px);'
      + '  transition: max-height 0.35s ease, opacity 0.25s ease, transform 0.35s ease;'
      + '  pointer-events: none;'
      + '}'
      + '\n.mobile-menu-panel.is-open {'
      + '  max-height: 320px;'
      + '  opacity: 1;'
      + '  transform: translateY(0);'
      + '  pointer-events: auto;'
      + '}';
    document.head.appendChild(style);
  }
  
  /**
   * Prevents right-click and dragging on all images and videos.
   */
  function initMediaSecurity() {
    const preventAction = function (e) {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO' || e.target.closest('img') || e.target.closest('video')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventAction, false);
    document.addEventListener('dragstart', preventAction, false);
  }

  // ─── RUN ─────────────────────────────────────────────────────────
  injectStyles();
  buildHeader();
  buildFooter();
  initAnimations();
  initMediaSecurity();
})();
