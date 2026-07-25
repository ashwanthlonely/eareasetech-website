# Product Requirements Document (PRD) — EarEase-Tech Enterprise Platform

## Document Metadata
- **Version**: 2.0 (Redeveloped)
- **Status**: Live / Production Ready
- **Target Hosting**: GitHub Pages (`www.eareasetech.com`)

---

## 1. Product Vision & Scope
EarEase-Tech is a premier Enterprise AI, Robotics Labs, Software Engineering, IT Staffing, Digital Marketing, and Mental Wellness Solutions Studio.

### Core Strategic Focus (9 Verticals):
1. **AI & ML Solutions** (LLMs, Fine-tuning, RAG, Computer Vision)
2. **AI & Workflow Automations** (RPA, Autonomous Agents, n8n)
3. **Electronics, IoT & Robotics Research Labs** (ROS2 AMRs, Embedded Firmware, Microcontrollers, Hardware Labs)
4. **Digital Marketing & SEO Services** (Technical SEO, Google/Meta/LinkedIn PPC, Lead Funnels, Content, CRO)
5. **Data Analytics & Data Management** (Data Engineering, ETL, Cloud Warehousing, BI)
6. **Web & Mobile App Development** (Next.js, React Native, iOS, Android)
7. **SaaS Products & Cloud Infrastructure** (Multi-tenant SaaS, AWS/Azure/GCP DevOps)
8. **IT Staffing & B2B Contracts** (Dedicated Engineering Pods, Staff Augmentation in 48 Hours)
9. **Corporate & B2C Mental Wellness Programs** (Workplace Burnout Prevention, Executive Resilience, Listening Labs)

### Purged Features (Migrated to Separate Mentorship Platform):
- All student mentorship/internship training programs (Nexus, curriculum, enroll, flashsales) removed from this domain.

---

## 2. Technical & Architectural Strategy

### GitHub Pages & Static Delivery
- Zero build tools required; native static HTML5, Vanilla JavaScript, and Tailwind CSS.
- Subdirectory safe with relative path prefixing in `js/navigation.js`.
- `.nojekyll` file included to prevent Jekyll build interference.

### Firebase Client & Lead Storage
- `js/firebase-config.js` provides client-side lead submission to Firebase Firestore.
- Graceful LocalStorage fallback ensures leads are captured even offline or prior to Firebase credential setup.
- Internal lead management portal at `crm.html` / `eet-admin.html`.

### SEO, AEO & GEO Governance
- **SEO**: Unique canonical URLs, meta descriptions, OpenGraph, Twitter Cards, `sitemap.xml`, and `robots.txt`.
- **AEO (Answer Engine Optimization)**: Schema.org `FAQPage` JSON-LD for rich snippets and voice/AI answer engines.
- **GEO (Generative Engine Optimization)**: Entity-rich `Organization`, `Service`, and `ITService` structured data formatted for LLM crawlers (ChatGPT, Perplexity, Claude, Gemini, Google SGE).

---

## 3. Contact & Ownership
- **Company**: EarEase-Tech Private Limited
- **Location**: Unit 101, Oxford Towers, 139 HAL Old Airport Road, Kodihalli, Bengaluru, Karnataka 560008, India
- **Contact**: hr@eareasetech.com | +91 78936 91717
