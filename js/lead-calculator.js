/**
 * EarEase-Tech Service-Specific Interactive Scope & Cost Calculator
 * Multi-Currency Support (INR, USD, EUR, GBP, AED, CAD, AUD, SGD)
 */

document.addEventListener('DOMContentLoaded', () => {
  const calculatorContainer = document.getElementById('lead-calculator-root');
  if (!calculatorContainer) return;

  const svgIcons = {
    check: `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>`,
    ai: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2"></path></svg>`,
    automation: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`,
    marketing: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path></svg>`,
    data: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`,
    web: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
    saas: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>`,
    staffing: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
    wellness: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`
  };

  const pathname = window.location.pathname.toLowerCase();

  // Define Service-Specific Configurations
  const serviceConfigs = {
    ai: {
      title: '⚡ AI, Machine Learning & Automations Custom Estimator',
      subtitle: 'Configure custom Machine Learning models, LLM fine-tuning, RAG databases, and autonomous agents.',
      options: [
        { id: 'ml_predictive', name: 'Machine Learning & Predictive Models', costINR: 44999, weeks: 3, svg: svgIcons.ai },
        { id: 'llm_fine_tune', name: 'Custom LLM Fine-Tuning & Prompting', costINR: 49999, weeks: 3, svg: svgIcons.ai },
        { id: 'rag_vector', name: 'RAG Knowledge Base & Vector Store', costINR: 39999, weeks: 2, svg: svgIcons.data },
        { id: 'auto_agents', name: 'Autonomous Multi-Agent Workflows', costINR: 29999, weeks: 2, svg: svgIcons.automation },
        { id: 'vision_ocr', name: 'Computer Vision & OCR Extraction', costINR: 34999, weeks: 2, svg: svgIcons.web },
        { id: 'n8n_pipeline', name: 'n8n / Zapier Enterprise Integration', costINR: 19999, weeks: 1, svg: svgIcons.saas }
      ],
      defaultSelected: ['ml_predictive', 'llm_fine_tune', 'rag_vector']
    },
    marketing: {
      title: '⚡ Digital Marketing & SEO Growth Estimator',
      subtitle: 'Select performance channels, SEO audits, and lead generation funnel requirements.',
      options: [
        { id: 'seo_audit', name: 'Technical SEO Audit & Keyword Engine', costINR: 19999, weeks: 2, svg: svgIcons.marketing },
        { id: 'google_ppc', name: 'Google Search & Display PPC Ads', costINR: 24999, weeks: 2, svg: svgIcons.automation },
        { id: 'social_ads', name: 'Meta & LinkedIn B2B Paid Campaigns', costINR: 29999, weeks: 2, svg: svgIcons.web },
        { id: 'lead_funnel', name: 'Lead Generation Funnel & CRO', costINR: 19999, weeks: 1, svg: svgIcons.saas },
        { id: 'content_backlinks', name: 'Content Strategy & High-DR Backlinks', costINR: 14999, weeks: 2, svg: svgIcons.ai }
      ],
      defaultSelected: ['seo_audit', 'google_ppc']
    },
    staffing: {
      title: '⚡ IT Staffing & Dedicated Pod Estimator',
      subtitle: 'Select senior engineering roles to deploy into your product pod within 48 hours.',
      options: [
        { id: 'dev_fullstack', name: 'Senior Full-Stack Web/Mobile Dev', costINR: 24999, weeks: 1, svg: svgIcons.staffing },
        { id: 'dev_ai', name: 'Senior AI / Machine Learning Specialist', costINR: 39999, weeks: 1, svg: svgIcons.ai },
        { id: 'dev_devops', name: 'Cloud DevOps & Infra Architect', costINR: 34999, weeks: 1, svg: svgIcons.saas },
        { id: 'dev_data', name: 'Data Engineer & BI Specialist', costINR: 29999, weeks: 1, svg: svgIcons.data },
        { id: 'dev_ux', name: 'UI/UX Designer & QA Engineer', costINR: 19999, weeks: 1, svg: svgIcons.web }
      ],
      defaultSelected: ['dev_fullstack', 'dev_ai']
    },
    wellness: {
      title: '⚡ Mental Wellness Program Estimator',
      subtitle: 'Customize workplace burnout prevention suites, listening labs, and executive sessions.',
      options: [
        { id: 'burnout_suite', name: 'Workplace Burnout Prevention Suite', costINR: 19999, weeks: 1, svg: svgIcons.wellness },
        { id: 'stress_labs', name: 'Executive Stress Resilience Labs', costINR: 24999, weeks: 2, svg: svgIcons.ai },
        { id: 'listening_pods', name: 'Confidential 1-on-1 Listening Pods', costINR: 14999, weeks: 1, svg: svgIcons.staffing },
        { id: 'wellness_app', name: 'Corporate Mental Wellbeing App Suite', costINR: 29999, weeks: 2, svg: svgIcons.web },
        { id: 'hr_analytics', name: 'HR Impact Analytics & Stress Audits', costINR: 12999, weeks: 1, svg: svgIcons.data }
      ],
      defaultSelected: ['burnout_suite', 'listening_pods']
    },
    studio: {
      title: '⚡ Web & Mobile App Engineering Sprint Estimator',
      subtitle: 'Select product building blocks for fixed-sprint web, mobile, and SaaS delivery.',
      options: [
        { id: 'next_web', name: 'High-Performance Next.js Web App', costINR: 34999, weeks: 2, svg: svgIcons.web },
        { id: 'native_mobile', name: 'Native iOS & Android Mobile App', costINR: 49999, weeks: 3, svg: svgIcons.automation },
        { id: 'saas_auth', name: 'Custom SaaS Multi-Tenant Core', costINR: 59999, weeks: 4, svg: svgIcons.saas },
        { id: 'stripe_billing', name: 'Stripe Payment & Billing Dashboard', costINR: 19999, weeks: 1, svg: svgIcons.data },
        { id: 'cloud_infra', name: 'AWS/GCP Cloud Infra & CI/CD Setup', costINR: 14999, weeks: 1, svg: svgIcons.ai }
      ],
      defaultSelected: ['next_web', 'saas_auth']
    },
    global: {
      title: '⚡ Enterprise Multi-Vertical Cost Estimator',
      subtitle: 'Combine cross-functional AI/ML, marketing, staffing, software, and wellness verticals.',
      options: [
        { id: 'ai_ml', name: 'AI & Machine Learning Solutions', costINR: 49999, weeks: 3, svg: svgIcons.ai },
        { id: 'ai_auto', name: 'AI & Workflow Automations', costINR: 29999, weeks: 2, svg: svgIcons.automation },
        { id: 'digital_mktg', name: 'Digital Marketing & SEO', costINR: 19999, weeks: 2, svg: svgIcons.marketing },
        { id: 'data_analytics', name: 'Data Engineering & Analytics', costINR: 39999, weeks: 2, svg: svgIcons.data },
        { id: 'web_app', name: 'Web & Mobile App Development', costINR: 34999, weeks: 2, svg: svgIcons.web },
        { id: 'saas_cloud', name: 'SaaS Products & DevOps', costINR: 59999, weeks: 4, svg: svgIcons.saas },
        { id: 'staffing', name: 'IT Staffing & Contracts', costINR: 24999, weeks: 1, svg: svgIcons.staffing },
        { id: 'wellness', name: 'Corporate & B2C Mental Wellness', costINR: 14999, weeks: 1, svg: svgIcons.wellness }
      ],
      defaultSelected: ['ai_ml', 'ai_auto', 'web_app']
    }
  };

  // Determine current active config based on page path
  let activeConfig = serviceConfigs.global;
  if (pathname.includes('service-ai-automation')) activeConfig = serviceConfigs.ai;
  else if (pathname.includes('service-digital-marketing')) activeConfig = serviceConfigs.marketing;
  else if (pathname.includes('service-it-staffing')) activeConfig = serviceConfigs.staffing;
  else if (pathname.includes('service-mental-wellness')) activeConfig = serviceConfigs.wellness;
  else if (pathname.includes('service-studio-sprint')) activeConfig = serviceConfigs.studio;

  // Currency Exchange Rates
  const currencies = {
    INR: { code: 'INR', symbol: '₹', rate: 1, label: 'INR (₹ India)' },
    USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($ Global)' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.011, label: 'EUR (€ Europe)' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.0094, label: 'GBP (£ UK)' },
    AED: { code: 'AED', symbol: 'AED ', rate: 0.044, label: 'AED (Dubai/UAE)' },
    CAD: { code: 'CAD', symbol: 'CA$', rate: 0.016, label: 'CAD (Canada)' },
    AUD: { code: 'AUD', symbol: 'A$', rate: 0.018, label: 'AUD (Australia)' },
    SGD: { code: 'SGD', symbol: 'S$', rate: 0.016, label: 'SGD (Singapore)' }
  };

  let selectedCurrency = 'INR';
  let selectedOptions = [...activeConfig.defaultSelected];
  let teamScale = 'small'; 
  let timelineUrgency = 'standard'; 

  function formatPrice(amountINR, currCode) {
    const curr = currencies[currCode] || currencies.INR;
    const converted = amountINR * curr.rate;

    if (currCode === 'INR') {
      return curr.symbol + Math.round(converted).toLocaleString('en-IN');
    }
    return curr.symbol + Math.round(converted).toLocaleString();
  }

  function renderCalculator() {
    let totalEstINR = 0;
    let totalWeeks = 0;

    selectedOptions.forEach(id => {
      const item = activeConfig.options.find(o => o.id === id);
      if (item) {
        totalEstINR += item.costINR;
        totalWeeks = Math.max(totalWeeks, item.weeks);
      }
    });

    if (teamScale === 'small') totalEstINR *= 0.8;
    if (teamScale === 'enterprise') totalEstINR *= 1.8;
    if (timelineUrgency === 'accelerated') {
      totalEstINR *= 1.2;
      totalWeeks = Math.max(1, Math.round(totalWeeks * 0.7));
    }

    const formattedPrice = formatPrice(totalEstINR, selectedCurrency);

    calculatorContainer.innerHTML = `
      <div class="surface p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 max-w-4xl mx-auto text-left">
        
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-amber-100">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-block px-3 py-1 bg-amber-100/90 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">${activeConfig.title}</span>
              <span class="text-xs font-semibold text-slate-500">💎 Direct Transparent Rates</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-slate-900">Custom Scope & Cost Calculator</h3>
            <p class="text-slate-600 text-sm mt-1">${activeConfig.subtitle}</p>
          </div>

          <!-- Currency & Price Display Badge -->
          <div class="text-left md:text-right bg-amber-50 p-4 rounded-2xl border border-amber-200 min-w-[230px]">
            <div class="text-xs uppercase font-semibold text-slate-500 flex justify-between items-center mb-1">
              <span>Est. Investment</span>
              <!-- Currency Selector -->
              <select id="calc-currency-select" class="bg-white border border-amber-300 text-xs font-bold text-amber-900 rounded-lg px-2 py-0.5 outline-none cursor-pointer">
                ${Object.keys(currencies).map(code => `
                  <option value="${code}" ${code === selectedCurrency ? 'selected' : ''}>${currencies[code].label}</option>
                `).join('')}
              </select>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-600">${formattedPrice} <span class="text-xs font-semibold text-slate-500">${selectedCurrency}</span></div>
            <div class="text-xs font-medium text-slate-600 mt-1">Est. Delivery: <strong>${totalWeeks} - ${totalWeeks + 2} Weeks</strong></div>
          </div>
        </div>

        <!-- 1. Granular Options Selection -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <label class="block text-sm font-semibold text-slate-800">1. Select Specific Features & Modules:</label>
            <span class="text-xs font-medium text-amber-700">Displaying in ${selectedCurrency}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${activeConfig.options.map(item => {
              const isChecked = selectedOptions.includes(item.id);
              const priceTag = formatPrice(item.costINR, selectedCurrency);
              return `
                <div class="calc-service-btn cursor-pointer p-3.5 rounded-2xl border transition-all ${isChecked ? 'border-amber-500 bg-amber-50/80 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}" data-id="${item.id}">
                  <div class="flex items-center gap-3">
                    <span class="p-1.5 rounded-lg bg-amber-100/70 border border-amber-200/60 shrink-0">${item.svg}</span>
                    <div class="flex-grow">
                      <div class="text-xs font-semibold text-slate-800 leading-tight">${item.name}</div>
                      <div class="text-[11px] font-bold text-amber-600 mt-0.5">+ ${priceTag}</div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Scope Scale & Urgency -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label class="block text-sm font-semibold text-slate-800 mb-2">2. Scope Scale:</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="scale-btn py-2 text-xs rounded-xl border font-medium ${teamScale==='small'?'border-amber-500 bg-amber-50 text-amber-900 font-bold':'border-slate-200 text-slate-700 bg-white'}" data-scale="small">Starter MVP</button>
              <button type="button" class="scale-btn py-2 text-xs rounded-xl border font-medium ${teamScale==='medium'?'border-amber-500 bg-amber-50 text-amber-900 font-bold':'border-slate-200 text-slate-700 bg-white'}" data-scale="medium">Standard Pod</button>
              <button type="button" class="scale-btn py-2 text-xs rounded-xl border font-medium ${teamScale==='enterprise'?'border-amber-500 bg-amber-50 text-amber-900 font-bold':'border-slate-200 text-slate-700 bg-white'}" data-scale="enterprise">Enterprise</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-800 mb-2">3. Delivery Speed:</label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" class="urgency-btn py-2 text-xs rounded-xl border font-medium ${timelineUrgency==='standard'?'border-amber-500 bg-amber-50 text-amber-900 font-bold':'border-slate-200 text-slate-700 bg-white'}" data-urgency="standard">Standard Delivery</button>
              <button type="button" class="urgency-btn py-2 text-xs rounded-xl border font-medium ${timelineUrgency==='accelerated'?'border-amber-500 bg-amber-50 text-amber-900 font-bold':'border-slate-200 text-slate-700 bg-white'}" data-urgency="accelerated">⚡ Accelerated Delivery</button>
            </div>
          </div>
        </div>

        <!-- Proposal Callout -->
        <div class="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-lg text-amber-400">Request fixed proposal for selected modules</h4>
            <p class="text-xs text-slate-300 mt-1">Get an official scope document in ${selectedCurrency} with 100% SLA guarantee within 24 hours.</p>
          </div>
          <a href="contact-us.html?est=${formattedPrice}&currency=${selectedCurrency}&options=${selectedOptions.join(',')}" class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 shrink-0">
            Request Proposal in ${selectedCurrency} &rarr;
          </a>
        </div>

      </div>
    `;

    const currSelect = calculatorContainer.querySelector('#calc-currency-select');
    if (currSelect) {
      currSelect.addEventListener('change', (e) => {
        selectedCurrency = e.target.value;
        renderCalculator();
      });
    }

    calculatorContainer.querySelectorAll('.calc-service-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (selectedOptions.includes(id)) {
          if (selectedOptions.length > 1) {
            selectedOptions = selectedOptions.filter(item => item !== id);
          }
        } else {
          selectedOptions.push(id);
        }
        renderCalculator();
      });
    });

    calculatorContainer.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        teamScale = btn.getAttribute('data-scale');
        renderCalculator();
      });
    });

    calculatorContainer.querySelectorAll('.urgency-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timelineUrgency = btn.getAttribute('data-urgency');
        renderCalculator();
      });
    });
  }

  renderCalculator();
});
