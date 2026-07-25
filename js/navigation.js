/**
 * Global Navigation & Footer for EarEase-Tech
 * Clean, Optimized Header with Professional SVG Icons & Responsive Drawer
 */

(function () {
  'use strict';

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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    const hrefPage = href.split('/').pop().split('#')[0];
    const current = currentPage.split('#')[0];
    return hrefPage === current;
  }

  // Professional SVG Icons
  const svgIcons = {
    ai: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2"></path></svg>`,
    automation: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
    marketing: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path></svg>`,
    data: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    web: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
    saas: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`,
    staffing: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
    wellness: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`
  };

  const servicesList = [
    { label: 'AI & ML Solutions', href: prefix + 'service-ai-automation.html', svg: svgIcons.ai },
    { label: 'AI Workflow Automations', href: prefix + 'service-ai-automation.html#automation', svg: svgIcons.automation },
    { label: 'Digital Marketing & SEO', href: prefix + 'service-digital-marketing.html', svg: svgIcons.marketing },
    { label: 'Data Analytics & Management', href: prefix + 'our-services.html#data', svg: svgIcons.data },
    { label: 'Web & Mobile App Dev', href: prefix + 'service-studio-sprint.html', svg: svgIcons.web },
    { label: 'SaaS Products & Cloud DevOps', href: prefix + 'our-services.html#saas', svg: svgIcons.saas },
    { label: 'IT Staffing & Contracts', href: prefix + 'service-it-staffing.html', svg: svgIcons.staffing },
    { label: 'Corporate Mental Wellness', href: prefix + 'service-mental-wellness.html', svg: svgIcons.wellness }
  ];

  function buildHeader() {
    const container = document.getElementById('global-header');
    if (!container) return;

    const servicesDropdownHTML = servicesList.map(s => `
      <a href="${s.href}" class="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:text-[#D4A017] hover:bg-amber-50/70 rounded-xl transition-all font-medium">
        <span class="p-1 rounded-lg bg-amber-100/60 border border-amber-200/50">${s.svg}</span>
        <span>${s.label}</span>
      </a>
    `).join('');

    const headerHTML = `
<header class="site-header sticky top-0 z-50 transition-all duration-300">
  <div class="nav-shell max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
    
    <!-- Brand Logo -->
    <a href="${prefix}index.html" class="flex items-center space-x-3 group shrink-0">
      <img src="${prefix}assets/logo.png" onerror="this.onerror=null; this.src='${prefix}assets/optimized/logo-256.png'" alt="EarEase-Tech Logo" class="w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-105" />
      <span class="brand-mark text-xl font-bold tracking-tight text-slate-900">EarEase<span class="text-[#D4A017]">-Tech</span></span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
      <a href="${prefix}index.html" class="nav-link ${isActive('index.html') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">Home</a>
      
      <!-- Services Dropdown -->
      <div class="relative group">
        <a href="${prefix}our-services.html" class="nav-link flex items-center gap-1 py-2 ${isActive('our-services.html') || currentPage.startsWith('service-') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">
          <span>Services</span>
          <svg class="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
        </a>
        <div class="absolute left-0 top-full pt-2 hidden group-hover:block w-72 z-50">
          <div class="bg-white/95 backdrop-blur-lg border border-amber-100 p-2 rounded-2xl shadow-2xl space-y-0.5">
            ${servicesDropdownHTML}
          </div>
        </div>
      </div>

      <a href="${prefix}case-studies.html" class="nav-link ${isActive('case-studies.html') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">Case Studies</a>
      <a href="${prefix}about-us.html" class="nav-link ${isActive('about-us.html') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">About Us</a>
      <a href="${prefix}careers.html" class="nav-link ${isActive('careers.html') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">Careers</a>
      <a href="${prefix}contact-us.html" class="nav-link ${isActive('contact-us.html') ? 'active font-bold text-[#D4A017]' : 'hover:text-[#D4A017]'}">Contact</a>
    </nav>

    <!-- Header CTA Button -->
    <div class="hidden md:flex items-center">
      <a href="${prefix}contact-us.html" class="px-5 py-2.5 bg-[#D4A017] hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-105">
        Get Proposal &rarr;
      </a>
    </div>

    <!-- Mobile Menu Button -->
    <div class="md:hidden">
      <button id="menu-toggle" class="p-2 text-slate-900 hover:text-[#D4A017] focus:outline-none" aria-label="Toggle navigation">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Drawer Menu -->
  <div id="mobile-menu" class="hidden md:hidden px-6 py-4 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xl space-y-2 text-sm">
    <a href="${prefix}index.html" class="block py-1.5 font-semibold text-slate-800 hover:text-[#D4A017]">Home</a>
    
    <div class="py-1">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Services</div>
      <div class="pl-2 space-y-2 border-l-2 border-amber-200">
        ${servicesList.map(s => `
          <a href="${s.href}" class="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-[#D4A017]">
            ${s.svg}
            <span>${s.label}</span>
          </a>
        `).join('')}
      </div>
    </div>

    <a href="${prefix}case-studies.html" class="block py-1.5 font-semibold text-slate-800 hover:text-[#D4A017]">Case Studies</a>
    <a href="${prefix}about-us.html" class="block py-1.5 font-semibold text-slate-800 hover:text-[#D4A017]">About Us</a>
    <a href="${prefix}careers.html" class="block py-1.5 font-semibold text-slate-800 hover:text-[#D4A017]">Careers</a>
    <a href="${prefix}contact-us.html" class="block py-1.5 font-semibold text-slate-800 hover:text-[#D4A017]">Contact Us</a>

    <div class="pt-3 border-t border-slate-100">
      <a href="${prefix}contact-us.html" class="block w-full text-center px-4 py-2.5 bg-[#D4A017] text-slate-950 font-bold text-xs rounded-xl shadow-md">
        Get Proposal &rarr;
      </a>
    </div>
  </div>
</header>`;

    container.innerHTML = headerHTML;

    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('hidden');
      });
    }
  }

  function buildFooter() {
    const container = document.getElementById('global-footer');
    if (!container) return;

    const footerHTML = `
<footer class="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
      
      <div class="lg:col-span-2 space-y-4">
        <a href="${prefix}index.html" class="flex items-center space-x-3">
          <img src="${prefix}assets/logo.png" onerror="this.onerror=null; this.src='${prefix}assets/optimized/logo-256.png'" alt="EarEase-Tech Logo" class="w-10 h-10 object-contain" />
          <span class="text-2xl font-bold text-white">EarEase<span class="text-[#D4A017]">-Tech</span></span>
        </a>
        <p class="text-slate-400 text-sm max-w-sm leading-relaxed">
          Engineering Autonomous AI, Digital Marketing, Cloud SaaS Products, B2B IT Staffing, and Human-Centric Mental Wellness Solutions.
        </p>
        <div class="flex items-center space-x-4 pt-2">
          <a href="https://www.linkedin.com/company/earease-tech/" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-slate-900 hover:bg-[#D4A017] hover:text-slate-950 border border-slate-800 flex items-center justify-center transition-all">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">Core Verticals</h4>
        <ul class="space-y-2 text-xs text-slate-400">
          <li><a href="${prefix}service-ai-automation.html" class="hover:text-white transition-colors">AI & ML Solutions</a></li>
          <li><a href="${prefix}service-ai-automation.html#automation" class="hover:text-white transition-colors">AI Automations</a></li>
          <li><a href="${prefix}service-digital-marketing.html" class="hover:text-white transition-colors">Digital Marketing & SEO</a></li>
          <li><a href="${prefix}our-services.html#data" class="hover:text-white transition-colors">Data Analytics</a></li>
          <li><a href="${prefix}service-studio-sprint.html" class="hover:text-white transition-colors">Web & App Dev</a></li>
          <li><a href="${prefix}our-services.html#saas" class="hover:text-white transition-colors">SaaS & Cloud DevOps</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">Solutions & Staffing</h4>
        <ul class="space-y-2 text-xs text-slate-400">
          <li><a href="${prefix}service-it-staffing.html" class="hover:text-white transition-colors">B2B IT Staffing</a></li>
          <li><a href="${prefix}service-it-staffing.html#contracts" class="hover:text-white transition-colors">Dedicated Tech Pods</a></li>
          <li><a href="${prefix}service-mental-wellness.html" class="hover:text-white transition-colors">Corporate Mental Wellness</a></li>
          <li><a href="${prefix}service-mental-wellness.html#b2c" class="hover:text-white transition-colors">Individual Wellbeing</a></li>
          <li><a href="${prefix}case-studies.html" class="hover:text-white transition-colors">Enterprise Case Studies</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">Company</h4>
        <ul class="space-y-2 text-xs text-slate-400">
          <li><a href="${prefix}about-us.html" class="hover:text-white transition-colors">About EarEase-Tech</a></li>
          <li><a href="${prefix}careers.html" class="hover:text-white transition-colors">Careers & Hiring</a></li>
          <li><a href="${prefix}resources.html" class="hover:text-white transition-colors">Resources & Playbooks</a></li>
          <li><a href="${prefix}contact-us.html" class="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="${prefix}crm.html" class="hover:text-white transition-colors">Client Lead Portal</a></li>
        </ul>
      </div>

    </div>

    <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
      <p>&copy; ${new Date().getFullYear()} EarEase-Tech. All rights reserved. Built for enterprise & human well-being.</p>
      <div class="flex space-x-6">
        <a href="${prefix}contact-us.html" class="hover:text-slate-400">Privacy Policy</a>
        <a href="${prefix}contact-us.html" class="hover:text-slate-400">Terms of Service</a>
        <a href="${prefix}sitemap.xml" class="hover:text-slate-400">Sitemap</a>
      </div>
    </div>
  </div>
</footer>`;

    container.innerHTML = footerHTML;
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildHeader();
    buildFooter();
  });
})();
