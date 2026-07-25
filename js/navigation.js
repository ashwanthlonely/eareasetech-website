/**
 * EarEase-Tech Global Header & Footer Navigation
 * Configured with Official Business Hours (Mon - Fri: 10:00 - 19:00 IST | Sat - Sun: Closed)
 */

document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.getElementById('global-header');
  const footerContainer = document.getElementById('global-footer');

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const svgIcons = {
    ai: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2"></path></svg>`,
    automation: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
    marketing: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path></svg>`,
    data: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    web: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
    saas: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`,
    staffing: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
    wellness: `<svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`,
    chevron: `<svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>`,
    
    // Social Logos
    linkedin: `<svg class="w-4 h-4 text-[#0A66C2] fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>`,
    youtube: `<svg class="w-4 h-4 text-[#FF0000] fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    instagram: `<svg class="w-4 h-4 text-[#E4405F] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  };

  // Render Global Header
  if (headerContainer) {
    headerContainer.innerHTML = `
      <header class="site-header sticky top-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            
            <!-- Logo -->
            <a href="index.html" class="flex items-center gap-3 group">
              <img src="assets/logo.png" alt="EarEase-Tech Logo" class="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
              <div class="flex flex-col">
                <span class="font-bold text-lg leading-none tracking-tight text-slate-900">EarEase-Tech</span>
                <span class="text-[10px] text-amber-800 font-semibold tracking-wider uppercase">AI • Software • Marketing • Wellness</span>
              </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-6 text-sm font-medium">
              
              <a href="index.html" class="nav-link ${currentPage === 'index.html' || currentPage === '' ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}">
                Home
              </a>

              <!-- Services Dropdown (Desktop Hover) -->
              <div class="relative group py-6">
                <a href="our-services.html" class="nav-link flex items-center gap-1 cursor-pointer ${currentPage.includes('service') || currentPage === 'our-services.html' ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}">
                  <span>Services</span>
                  ${svgIcons.chevron}
                </a>

                <!-- Mega Dropdown Panel -->
                <div class="absolute left-1/2 -translate-x-1/2 top-full w-[620px] bg-white rounded-2xl shadow-2xl border border-amber-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-2 gap-2 z-50">
                  
                  <a href="service-ai-automation.html" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.ai}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">AI & ML Solutions</div>
                      <div class="text-[11px] text-slate-500">Custom LLMs, Fine-tuning, RAG</div>
                    </div>
                  </a>

                  <a href="service-ai-automation.html#automation" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.automation}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">AI Workflow Automations</div>
                      <div class="text-[11px] text-slate-500">Autonomous Agents, n8n, RPA</div>
                    </div>
                  </a>

                  <a href="service-digital-marketing.html" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.marketing}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">Digital Marketing & SEO</div>
                      <div class="text-[11px] text-slate-500">Technical SEO, Google/Meta PPC</div>
                    </div>
                  </a>

                  <a href="our-services.html#data" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.data}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">Data Analytics & ETL</div>
                      <div class="text-[11px] text-slate-500">Snowflake, BigQuery, BI Dashboards</div>
                    </div>
                  </a>

                  <a href="service-studio-sprint.html" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.web}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">Web & Mobile App Sprints</div>
                      <div class="text-[11px] text-slate-500">Next.js, React Native, iOS, Android</div>
                    </div>
                  </a>

                  <a href="our-services.html#saas" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.saas}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">SaaS Products & Cloud</div>
                      <div class="text-[11px] text-slate-500">Multi-tenant SaaS, AWS DevOps</div>
                    </div>
                  </a>

                  <a href="service-it-staffing.html" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.staffing}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">IT Staffing & Contracts</div>
                      <div class="text-[11px] text-slate-500">Pre-vetted Developer Pods in 48h</div>
                    </div>
                  </a>

                  <a href="service-mental-wellness.html" class="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50/70 transition-colors">
                    <span class="p-2 rounded-lg bg-amber-100/70 shrink-0 mt-0.5">${svgIcons.wellness}</span>
                    <div>
                      <div class="text-xs font-bold text-slate-900">Corporate Mental Wellness</div>
                      <div class="text-[11px] text-slate-500">Burnout Prevention & Listening Pods</div>
                    </div>
                  </a>

                  <div class="col-span-2 border-t border-slate-100 pt-2 mt-1 text-center">
                    <a href="our-services.html" class="text-xs font-bold text-amber-700 hover:text-amber-800">
                      View All 8 Core Verticals & Scope Details &rarr;
                    </a>
                  </div>

                </div>
              </div>

              <a href="case-studies.html" class="nav-link ${currentPage === 'case-studies.html' ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}">
                Case Studies
              </a>

              <a href="about-us.html" class="nav-link ${currentPage === 'about-us.html' ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}">
                About Us
              </a>

              <a href="careers.html" class="nav-link ${currentPage === 'careers.html' ? 'text-amber-800 font-bold' : 'text-slate-700 hover:text-amber-800'}">
                Careers
              </a>

            </nav>

            <!-- Right Header CTA -->
            <div class="hidden lg:flex items-center gap-4">
              <a href="contact-us.html" class="px-5 py-2.5 bg-[#D4A017] hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105">
                Contact Sales &rarr;
              </a>
            </div>

            <!-- Mobile Hamburger Toggle -->
            <button id="mobile-menu-btn" aria-label="Toggle Navigation Menu" class="md:hidden p-2 rounded-lg text-slate-700 hover:bg-amber-50 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

          </div>
        </div>

        <!-- Mobile Drawer -->
        <div id="mobile-drawer" class="hidden md:hidden bg-white border-b border-amber-100 px-4 py-6 space-y-4 shadow-xl">
          <a href="index.html" class="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">Home</a>
          
          <div class="space-y-2 py-2 border-b border-slate-100">
            <span class="block text-xs font-bold uppercase tracking-wider text-amber-800">Our Services</span>
            <a href="service-ai-automation.html" class="block text-xs text-slate-700 hover:text-amber-800 py-1">AI & ML Solutions</a>
            <a href="service-ai-automation.html#automation" class="block text-xs text-slate-700 hover:text-amber-800 py-1">AI Workflow Automations</a>
            <a href="service-digital-marketing.html" class="block text-xs text-slate-700 hover:text-amber-800 py-1">Digital Marketing & SEO</a>
            <a href="our-services.html#data" class="block text-xs text-slate-700 hover:text-amber-800 py-1">Data Analytics & ETL</a>
            <a href="service-studio-sprint.html" class="block text-xs text-slate-700 hover:text-amber-800 py-1">Web & Mobile App Sprints</a>
            <a href="our-services.html#saas" class="block text-xs text-slate-700 hover:text-amber-800 py-1">SaaS Products & Cloud</a>
            <a href="service-it-staffing.html" class="block text-xs text-slate-700 hover:text-amber-800 py-1">IT Staffing & Contracts</a>
            <a href="service-mental-wellness.html" class="block text-xs text-slate-700 hover:text-amber-800 py-1">Corporate Mental Wellness</a>
          </div>

          <a href="case-studies.html" class="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">Case Studies</a>
          <a href="about-us.html" class="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">About Us</a>
          <a href="careers.html" class="block text-sm font-semibold text-slate-800 py-2 border-b border-slate-100">Careers</a>

          <a href="contact-us.html" class="block text-center w-full py-3 bg-[#D4A017] text-slate-950 font-bold text-xs rounded-xl shadow-md mt-4">
            Contact Sales &rarr;
          </a>
        </div>
      </header>
    `;

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('hidden');
      });
    }
  }

  // Render Global Footer with Official Opening Hours (Mon - Fri: 10:00 - 19:00 IST | Sat - Sun: Closed)
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            
            <!-- Col 1: Brand Info & Social Media Hyperlinks with Logos -->
            <div class="lg:col-span-2 space-y-4">
              <div class="flex items-center gap-3">
                <img src="assets/logo.png" alt="EarEase-Tech Logo" class="h-8 w-auto object-contain" />
                <span class="font-bold text-white text-lg">EarEase-Tech</span>
              </div>
              <p class="text-slate-400 text-xs leading-relaxed max-w-sm">
                Pioneering Enterprise AI/ML Solutions, Digital Marketing, Web & Mobile Software Sprints, B2B IT Staffing Contracts, and Corporate Mental Wellness Programs.
              </p>
              <div class="text-[11px] text-slate-400 space-y-1">
                <div>📍 <strong>HQ Address:</strong> Unit 101, Oxford Towers, 139 HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008, India</div>
                <div>🕒 <strong>Business Hours:</strong> Mon - Fri: 10:00 AM - 07:00 PM IST | Sat - Sun: Closed</div>
              </div>

              <!-- Hyperlinked Social Media Logos -->
              <div class="pt-3 flex items-center gap-3">
                
                <!-- LinkedIn -->
                <a href="https://www.linkedin.com/company/earease-tech/" target="_blank" rel="noopener noreferrer" title="EarEase-Tech on LinkedIn" class="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all hover:scale-105 shadow-sm">
                  ${svgIcons.linkedin}
                  <span class="font-semibold text-xs text-slate-200">LinkedIn</span>
                </a>

                <!-- YouTube -->
                <a href="https://www.youtube.com/@EarEaseTech" target="_blank" rel="noopener noreferrer" title="EarEase-Tech on YouTube" class="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all hover:scale-105 shadow-sm">
                  ${svgIcons.youtube}
                  <span class="font-semibold text-xs text-slate-200">YouTube</span>
                </a>

                <!-- Instagram -->
                <a href="https://www.instagram.com/eareasetech/" target="_blank" rel="noopener noreferrer" title="EarEase-Tech on Instagram" class="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all hover:scale-105 shadow-sm">
                  ${svgIcons.instagram}
                  <span class="font-semibold text-xs text-slate-200">Instagram</span>
                </a>

              </div>
            </div>

            <!-- Col 2: Core Services -->
            <div class="space-y-3">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider">Service Verticals</h4>
              <ul class="space-y-2 text-slate-400">
                <li><a href="service-ai-automation.html" class="hover:text-amber-400">AI & ML Solutions</a></li>
                <li><a href="service-ai-automation.html#automation" class="hover:text-amber-400">AI Automations</a></li>
                <li><a href="service-digital-marketing.html" class="hover:text-amber-400">Digital Marketing & SEO</a></li>
                <li><a href="our-services.html#data" class="hover:text-amber-400">Data Analytics & ETL</a></li>
                <li><a href="service-studio-sprint.html" class="hover:text-amber-400">Web & Mobile Apps</a></li>
                <li><a href="our-services.html#saas" class="hover:text-amber-400">SaaS Products & Cloud</a></li>
                <li><a href="service-it-staffing.html" class="hover:text-amber-400">IT Staffing & Contracts</a></li>
                <li><a href="service-mental-wellness.html" class="hover:text-amber-400">Corporate Mental Wellness</a></li>
              </ul>
            </div>

            <!-- Col 3: Company -->
            <div class="space-y-3">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider">Company</h4>
              <ul class="space-y-2 text-slate-400">
                <li><a href="about-us.html" class="hover:text-amber-400">About EarEase-Tech</a></li>
                <li><a href="case-studies.html" class="hover:text-amber-400">Case Studies & Outcomes</a></li>
                <li><a href="careers.html" class="hover:text-amber-400">Careers & Opportunities</a></li>
                <li><a href="contact-us.html" class="hover:text-amber-400">Contact & Proposal</a></li>
                <li><a href="eet-admin.html" class="hover:text-amber-400">Admin Portal</a></li>
              </ul>
            </div>

            <!-- Col 4: Contact & Legal -->
            <div class="space-y-3">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider">Direct Reach</h4>
              <div class="space-y-2 text-slate-400">
                <div>📧 <a href="mailto:hr@eareasetech.com" class="hover:text-amber-400">hr@eareasetech.com</a></div>
                <div>📞 <a href="tel:+917893691717" class="hover:text-amber-400">+91 78936 91717</a></div>
                <div class="pt-2 text-[11px] text-emerald-400 font-semibold">🔒 100% IP NDA Protected</div>
              </div>
            </div>

          </div>

          <div class="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <div>© 2026 EarEase-Tech Private Limited. All rights reserved.</div>
            <div class="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Protocols</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
});
