import { ServiceItem } from '../types';
import { makeInvoicePreset, makeProposalPreset } from './servicePresets';

export const DIGICOYOTES_SERVICES: ServiceItem[] = [
  // ==========================================
  // 1. WEBSITE DEVELOPMENT
  // ==========================================
  {
    id: 'web-business-websites',
    title: 'Business Websites',
    category: 'Website Development',
    shortDescription: 'High-converting, responsive business websites engineered with modern CMS and brand storytelling.',
    fullDescription: 'Custom business flagship websites tailored for lead generation, trust building, and mobile performance with sub-second loading.',
    typicalDeliverables: ['Custom Responsive Architecture', 'Lead Capture Funnels', 'CMS Setup & Training', 'Speed & Security Hardening'],
    startingRate: 75000,
    duration: '2-3 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Business Website Package',
      [
        { title: 'Business Website Architecture & Layouts', desc: 'Custom responsive design, up to 7 key pages, interactive lead capture', qty: 1, rate: 55000 },
        { title: 'CMS Setup & On-page Schema Integration', desc: 'Content management configuration, contact routing & SEO tags', qty: 1, rate: 20000 }
      ],
      '1. 50% advance, 50% on live domain deployment.\n2. Invoiced in INR with 18% GST.\n3. Includes 30-day post-launch warranty.'
    ),
    defaultProposal: makeProposalPreset(
      'Business Website Engineering Proposal',
      'Digital Coyotes will design, develop, and deploy an ultra-responsive business flagship website positioned to double conversion and showcase authority in the Indian and global marketplace.',
      [
        'Information architecture and UX wireframing (7 pages)',
        'Bespoke visual identity integration & typography',
        'Mobile-first responsive frontend with modern interactions',
        'Direct WhatsApp & inquiry form integration',
        'Google Analytics 4 & Meta Pixel event setup'
      ],
      [
        { title: 'Phase 1: Wireframes & Visual Prototypes', duration: '5 Days', cost: 25000, deliverable: 'Figma prototypes and approved sitemap' },
        { title: 'Phase 2: Frontend Engineering & CMS Build', duration: '7 Days', cost: 35000, deliverable: 'Staging environment with live CMS' },
        { title: 'Phase 3: QA, Domain DNS & Final Launch', duration: '3 Days', cost: 15000, deliverable: 'Live URL with 95+ Google PageSpeed score' }
      ],
      [
        { title: 'Core Business Website Design & Frontend Engineering', rate: 55000 },
        { title: 'CMS Integration, Lead Capture & Analytics Setup', rate: 20000 }
      ]
    )
  },
  {
    id: 'web-corporate-websites',
    title: 'Corporate Websites',
    category: 'Website Development',
    shortDescription: 'Enterprise corporate web presence with stakeholder portals, investor relations, and security compliance.',
    fullDescription: 'Robust corporate portals featuring role-based workflows, compliance standards, high-availability architecture, and multi-regional localization.',
    typicalDeliverables: ['Enterprise Architecture', 'Investor & PR Sections', 'Multi-Language Support', 'SOC-2/GDPR Compliance Readiness'],
    startingRate: 140000,
    duration: '4-6 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Corporate Website Implementation',
      [
        { title: 'Enterprise Corporate Architecture & UX', desc: 'Multi-tiered page architecture, investor relations, brand positioning', qty: 1, rate: 95000 },
        { title: 'Security Hardening, Headless CMS & Governance', desc: 'Role permissions, automated backups, compliance disclosures', qty: 1, rate: 45000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Corporate Digital Headquarters & Web Architecture',
      'Engineering an enterprise-grade digital flagship that reflects institutional caliber, streamlines investor and partner communication, and delivers ironclad security.',
      [
        'Stakeholder research and brand positioning translation',
        'Multi-tiered layout system (15+ unique page templates)',
        'Investor relations, newsroom, and career portal integration',
        'Headless CMS with role-based editorial approval workflows',
        'Enterprise CDN and security firewall setup'
      ],
      [
        { title: 'Phase 1: Discovery & Corporate Design System', duration: '10 Days', cost: 45000, deliverable: 'Design system and stakeholder sign-off' },
        { title: 'Phase 2: Full-Stack Development & Portal Engine', duration: '15 Days', cost: 65000, deliverable: 'Staging portal with mock institutional data' },
        { title: 'Phase 3: Audit, Compliance & Production Deployment', duration: '5 Days', cost: 30000, deliverable: 'Live corporate infrastructure with TLS/SSL hardening' }
      ],
      [
        { title: 'Corporate Portal Architecture & Template Suite', rate: 95000 },
        { title: 'Headless CMS, Security Protocols & Infrastructure', rate: 45000 }
      ]
    )
  },
  {
    id: 'web-ecommerce-websites',
    title: 'E-Commerce Websites',
    category: 'Website Development',
    shortDescription: 'Scalable multi-currency online stores with payment gateways, automated shipping, and cart optimization.',
    fullDescription: 'Custom e-commerce platforms engineered for extreme checkout speed, upsell mechanics, automated GST calculation, and inventory reconciliation.',
    typicalDeliverables: ['Custom Storefront', 'Razorpay/Stripe Gateway', 'Shipping Partner API', 'Abandoned Cart Automation'],
    startingRate: 160000,
    duration: '5-7 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'E-Commerce Platform Deployment',
      [
        { title: 'Full-Scale E-Commerce Storefront Engineering', desc: 'Catalog engine, product filters, dynamic cart & rapid checkout', qty: 1, rate: 110000 },
        { title: 'Payment Gateway (Razorpay/UPI/Cards) & Shipping API', desc: 'Webhook synchronization, automated invoice generation & tracking', qty: 1, rate: 50000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'High-Conversion E-Commerce Flagship Storefront',
      'Deploying a state-of-the-art e-commerce engine designed to optimize average order value, minimize cart abandonment, and automate fulfillment across Indian & international markets.',
      [
        'Custom catalog architecture and instant faceted search',
        'One-click checkout with UPI, Net Banking, Credit/Debit, and Wallets',
        'Automated GST tax breakdown and customer PDF invoicing',
        'Logistics integration (Shiprocket/Delhivery/Bluedart)',
        'Automated cart recovery via WhatsApp & Email'
      ],
      [
        { title: 'Phase 1: UX Wireframes & Store Architecture', duration: '8 Days', cost: 45000, deliverable: 'Figma storefront design & product schema' },
        { title: 'Phase 2: Storefront Development & Gateway Hooks', duration: '18 Days', cost: 75000, deliverable: 'Working staging storefront with sandbox payments' },
        { title: 'Phase 3: Catalog Migration, Stress Test & Launch', duration: '6 Days', cost: 40000, deliverable: 'Live commercial storefront ready for transactions' }
      ],
      [
        { title: 'E-Commerce Core Engine & Faceted Catalog', rate: 110000 },
        { title: 'Payment Gateway, Logistics API & Invoicing Suite', rate: 50000 }
      ]
    )
  },
  {
    id: 'web-shopify-development',
    title: 'Shopify Development',
    category: 'Website Development',
    shortDescription: 'Custom Shopify 2.0 theme design, app integrations, speed optimization, and custom Liquid logic.',
    fullDescription: 'Tailored Shopify stores built with bespoke sections, high-converting checkout extensions, bundle builders, and seamless inventory management.',
    typicalDeliverables: ['Shopify 2.0 Bespoke Theme', 'App Stack Optimization', 'Mobile Cart Drawer', 'Indian Payment Gateways'],
    startingRate: 110000,
    duration: '3-4 weeks',
    defaultInvoice: makeInvoicePreset(
      'Shopify 2.0 Custom Store Build',
      [
        { title: 'Custom Shopify 2.0 Theme & Liquid Architecture', desc: 'Modular drag-and-drop sections, responsive styling, brand aesthetic', qty: 1, rate: 75000 },
        { title: 'Shopify App Integration & Indian Checkout Gateway', desc: 'Razorpay/Cashfree setup, COD verification, Klaviyo sync', qty: 1, rate: 35000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Bespoke Shopify 2.0 Storefront Build & App Optimization',
      'Transforming your brand on Shopify with bespoke Liquid theme development, lightning-fast mobile UX, and high-conversion upsell funnels.',
      [
        'Custom Liquid theme build with modular OS 2.0 sections',
        'Optimized slide-out cart drawer with dynamic free-shipping progress',
        'Integration with Indian payment gateways (UPI, Cards, EMI, COD OTP)',
        'Speed optimization for PageSpeed scores above 85 on mobile',
        'Inventory, courier tracking, and customer account dashboard setup'
      ],
      [
        { title: 'Sprint 1: Theme Architecture & Visual System', duration: '7 Days', cost: 35000, deliverable: 'Approved Figma UI and Shopify staging baseline' },
        { title: 'Sprint 2: Liquid Engineering & Custom Sections', duration: '12 Days', cost: 50000, deliverable: 'Fully coded responsive Shopify theme' },
        { title: 'Sprint 3: Payment, App Stack & Live Cutover', duration: '5 Days', cost: 25000, deliverable: 'Live Shopify store with verified transaction flows' }
      ],
      [
        { title: 'Shopify 2.0 Custom Theme & Section Architecture', rate: 75000 },
        { title: 'Checkout Optimization, Apps & Payment Integrations', rate: 35000 }
      ]
    )
  },
  {
    id: 'web-landing-pages',
    title: 'Landing Pages',
    category: 'Website Development',
    shortDescription: 'High-velocity lead and sales landing pages designed for PPC ads and maximum conversion rate.',
    fullDescription: 'Obsessively optimized single-page funnels engineered with persuasive copywriting, A/B testing scaffolding, and instant CRM synchronization.',
    typicalDeliverables: ['Direct Response Copywriting', 'High-Converting Visuals', 'Sticky CTA & Lead Form', 'A/B Testing Framework'],
    startingRate: 45000,
    duration: '1-2 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Performance Landing Page Suite',
      [
        { title: 'High-Converting Landing Page Design & Frontend', desc: 'Direct-response wireframe, dynamic lead capture, mobile optimization', qty: 1, rate: 35000 },
        { title: 'Tracking Pixel, Webhook & CRM Form Sync', desc: 'Meta Pixel, Google Tag Manager, WhatsApp trigger integration', qty: 1, rate: 10000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'High-Velocity Performance Landing Page',
      'Engineering a hyper-targeted landing page engineered specifically to convert paid ad traffic into qualified inbound sales leads.',
      [
        'Direct-response visual structure and value proposition hierarchy',
        'Sticky multi-step lead capture form with validation',
        'Sub-second mobile loading speed with zero layout shift',
        'Pixel event setup: Lead, InitiateCheckout, Custom Inquiries',
        'Automated lead forwarding to email, WhatsApp, and Google Sheets/CRM'
      ],
      [
        { title: 'Sprint 1: Copywire & UI Design', duration: '3 Days', cost: 20000, deliverable: 'Figma high-fidelity landing page mockup' },
        { title: 'Sprint 2: Fast Code Build & Webhooks', duration: '4 Days', cost: 25000, deliverable: 'Live landing page with tracking verified' }
      ],
      [
        { title: 'Landing Page UI/UX, Copy & Fast Code Build', rate: 35000 },
        { title: 'GTM, Meta Pixel, Webhook & Lead Routing Setup', rate: 10000 }
      ]
    )
  },
  {
    id: 'web-maintenance-hosting',
    title: 'Website Maintenance & Hosting',
    category: 'Website Development',
    shortDescription: 'Monthly managed cloud infrastructure, 99.9% uptime monitoring, daily backups, and security patches.',
    fullDescription: 'Proactive server management, continuous performance auditing, core software updates, and on-demand content maintenance.',
    typicalDeliverables: ['24/7 Uptime Monitoring', 'Automated Daily Backups', 'Core & Plugin Security Updates', 'Monthly Developer Hours'],
    startingRate: 25000,
    duration: 'Ongoing / Monthly',
    defaultInvoice: makeInvoicePreset(
      'Monthly Managed Web Care & Cloud Hosting',
      [
        { title: 'Managed Cloud Infrastructure & 99.9% Uptime Guarantee', desc: 'High-speed cloud server, SSL certificate, CDN edge routing', qty: 1, rate: 12000 },
        { title: 'Proactive Maintenance, Security Patches & 6 Dev Hours', desc: 'Daily database backups, malware scans, on-demand content revisions', qty: 1, rate: 13000 }
      ],
      '1. Monthly recurring retainer. Due at start of each billing cycle.\n2. Invoiced in INR + 18% GST.\n3. Cancel anytime with 30-day notice.'
    ),
    defaultProposal: makeProposalPreset(
      'Managed Web Infrastructure, Security & Care Retainer',
      'Providing peace of mind with 24/7 site monitoring, guaranteed uptime, security hardening, and dedicated monthly development hours for fast revisions.',
      [
        'High-performance cloud hosting with automated SSL renewal',
        'Daily off-site backups with one-click disaster recovery',
        'Zero-downtime security patch deployments and speed audits',
        'Dedicated 6 hours of developer time for content and layout updates',
        'Monthly health report covering traffic, uptime, and speed metrics'
      ],
      [
        { title: 'Monthly Retainer Cycle: Hosting, Security & Care', duration: '30 Days', cost: 25000, deliverable: 'Continuous uptime and monthly maintenance report' }
      ],
      [
        { title: 'Managed Cloud Hosting & Real-time Uptime Shield', rate: 12000 },
        { title: 'Security Patches, Backups & Dedicated Dev Hours', rate: 13000 }
      ]
    )
  },

  // ==========================================
  // 2. SOCIAL MEDIA MARKETING
  // ==========================================
  {
    id: 'smm-youtube-management',
    title: 'YouTube Management',
    category: 'Social Media Marketing',
    shortDescription: 'End-to-end YouTube channel growth: script ideation, cinematic editing, CTR thumbnail design, and SEO tags.',
    fullDescription: 'Data-driven YouTube strategy turning long-form videos and Shorts into inbound customer acquisition and brand authority.',
    typicalDeliverables: ['High-CTR Custom Thumbnails', 'Video SEO & Metadata Strategy', 'YouTube Shorts Repurposing', 'Monthly Growth Analytics'],
    startingRate: 60000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Monthly YouTube Channel Growth Retainer',
      [
        { title: 'YouTube Content Strategy, Titles & High-CTR Thumbnails', desc: '4 Long-form video packages with A/B thumbnail tests and descriptions', qty: 1, rate: 35000 },
        { title: 'YouTube Shorts Creation & Video Search SEO Tags', desc: '8 Shorts edited with kinetic captions and search-ranked keywords', qty: 1, rate: 25000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'YouTube Channel Domination & Organic Authority Plan',
      'Scaling your brand channel into an organic lead machine through algorithmic title testing, click-tested thumbnails, and engaging Shorts syndication.',
      [
        'Content calendar focused on high-intent search and trending queries',
        'Custom CTR-optimized thumbnail design (10%+ CTR benchmark)',
        'Full metadata engineering: descriptions, chapters, tags, and cards',
        'Repurposing pillar videos into viral vertical Shorts',
        'Monthly analytics review: retention graphs, impressions, and subscriber conversion'
      ],
      [
        { title: 'Month 1: Channel Rebranding & First 4 Video Drops', duration: '30 Days', cost: 60000, deliverable: 'Optimized channel layout + 4 long videos + 8 shorts' }
      ],
      [
        { title: 'Long-Form Video Optimization, Thumbnails & SEO', rate: 35000 },
        { title: 'Shorts Repurposing, Captioning & Distribution', rate: 25000 }
      ]
    )
  },
  {
    id: 'smm-social-media-marketing',
    title: 'Social Media Marketing',
    category: 'Social Media Marketing',
    shortDescription: 'Multi-platform social execution across Instagram, LinkedIn, and X with custom graphics and reels.',
    fullDescription: 'Strategic social media management that builds engaged communities, drives organic traffic, and maintains a commanding brand voice.',
    typicalDeliverables: ['Monthly Content Calendar', 'Original Graphic Carousels', 'Scripted Video Reels', 'Community Engagement & Reporting'],
    startingRate: 50000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Omni-Channel Social Media Retainer',
      [
        { title: 'Social Content Creation (16 Posts + 8 Reels)', desc: 'Branded carousels, static designs, caption copywriting & hashtags', qty: 1, rate: 32000 },
        { title: 'Community Management & Performance Analytics', desc: 'Comment replies, DM routing, weekly story drops, monthly audit', qty: 1, rate: 18000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Omni-Channel Social Growth & Community Blueprint',
      'Delivering consistent, aesthetic, and high-engagement social publishing across Instagram and LinkedIn to cement industry leadership and generate inbound interest.',
      [
        'Monthly editorial calendar with 16 bespoke feed posts and 8 reels',
        'Custom brand graphics, typography, and carousel master templates',
        'Compelling storytelling captions tailored to target decision-makers',
        'Hashtag architecture and trend-jacking strategy',
        'Monthly executive reporting on reach, impressions, and follower growth'
      ],
      [
        { title: 'Monthly Retainer: Content Production & Publishing', duration: '30 Days', cost: 50000, deliverable: '24 published assets, active community management & monthly report' }
      ],
      [
        { title: 'Content Creative, Design & Reels Production', rate: 32000 },
        { title: 'Publishing, DM Community Engagement & Analytics', rate: 18000 }
      ]
    )
  },
  {
    id: 'smm-influencer-marketing',
    title: 'Influencer Marketing',
    category: 'Social Media Marketing',
    shortDescription: 'Targeted creator partnerships, contract negotiation, and viral advocacy campaigns with verified reach.',
    fullDescription: 'Connecting brands with high-credibility creators across YouTube and Instagram, managing briefings, delivery quality, and usage rights.',
    typicalDeliverables: ['Curated Creator Roster', 'Creative Briefs & Legal Agreements', 'Deliverable Review & Tracking', 'Usage Rights Licensing'],
    startingRate: 85000,
    duration: '3-4 weeks',
    defaultInvoice: makeInvoicePreset(
      'Influencer Campaign Strategy & Management',
      [
        { title: 'Creator Scouting, Vetting & Brief Coordination', desc: 'Curating 10 verified niche creators, negotiating rates & deliverables', qty: 1, rate: 50000 },
        { title: 'Campaign Execution, Tracking & Rights Governance', desc: 'Draft review, tracking links, deliverable quality checks, UGC rights', qty: 1, rate: 35000 }
      ],
      '1. Creator payouts billed at actuals or managed directly.\n2. Agency management fee invoiced in INR + 18% GST.'
    ),
    defaultProposal: makeProposalPreset(
      'High-Impact Creator & Influencer Advocacy Campaign',
      'Orchestrating an authentic influencer campaign to achieve mass visibility and third-party social proof among targeted consumer demographics.',
      [
        'Identification of 10-15 vetted micro & macro creators with organic engagement',
        'Creative brief development aligning creator voice with brand USPs',
        'Contractual agreements securing full digital ad whitelist rights',
        'Coordination of review samples, draft approvals, and posting schedule',
        'Comprehensive post-campaign report calculating CPM, CPE, and ROI'
      ],
      [
        { title: 'Phase 1: Creator Roster & Brief Approvals', duration: '7 Days', cost: 35000, deliverable: 'Signed creator lineup and approved briefs' },
        { title: 'Phase 2: Content Creation & Revisions', duration: '12 Days', cost: 30000, deliverable: 'Final approved video reels and stories' },
        { title: 'Phase 3: Live Drop & Campaign Analytics', duration: '5 Days', cost: 20000, deliverable: 'Full performance dossier with engagement metrics' }
      ],
      [
        { title: 'Creator Vetting, Rate Negotiation & Coordination', rate: 50000 },
        { title: 'Content QA, Posting Blitz & Analytics Audit', rate: 35000 }
      ]
    )
  },

  // ==========================================
  // 3. PERFORMANCE MARKETING
  // ==========================================
  {
    id: 'perf-meta-ads',
    title: 'Meta Ads (Facebook & Instagram)',
    category: 'Performance Marketing',
    shortDescription: 'Precision Meta Ads campaigns: dynamic creative testing, custom audience funnels, and high-ROAS scaling.',
    fullDescription: 'Data-driven paid social acquisition optimizing Conversions API (CAPI), multi-angle video ad creative, and algorithmic bid caps.',
    typicalDeliverables: ['Ad Creative Matrix (Images & Video)', 'Full-Funnel Campaign Architecture', 'Conversions API & Pixel Setup', 'Weekly ROAS Optimization'],
    startingRate: 55000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Monthly Meta Ads Management Retainer',
      [
        { title: 'Meta Ads Strategy, Creative Production & Setup', desc: '12 bespoke ad creatives (videos & banners), copy variations, CAPI tracking', qty: 1, rate: 35000 },
        { title: 'Campaign Optimization, Audience Testing & Weekly Tuning', desc: 'Daily budget monitoring, audience exclusions, weekly ROAS reporting', qty: 1, rate: 20000 }
      ],
      '1. Ad spend is paid directly to Meta via client credit card.\n2. Agency management fee invoiced in INR + 18% GST.'
    ),
    defaultProposal: makeProposalPreset(
      'Meta Ads Scaling & Predictable Customer Acquisition',
      'Deploying an aggressive Meta Ads growth engine to lower Customer Acquisition Cost (CAC) and scale return on ad spend through scientific creative testing.',
      [
        'Full Conversions API (CAPI) server-side integration for 100% signal capture',
        'Production of 12 multi-hook static and motion video ad variations',
        'Top of funnel broad testing + Middle/Bottom retargeting funnels',
        'Continuous algorithmic bid testing (Cost Cap, Bid Cap, Highest Volume)',
        'Live Google Looker Studio dashboard with real-time ROAS'
      ],
      [
        { title: 'Month 1: Tracking Setup, Creative Sprint & Launch', duration: '30 Days', cost: 55000, deliverable: 'Configured Meta Ads engine, 12 creatives, live dashboard' }
      ],
      [
        { title: 'Meta Ads Campaign Architecture & Creative Sprint', rate: 35000 },
        { title: 'Algorithmic Optimization & Performance Management', rate: 20000 }
      ]
    )
  },
  {
    id: 'perf-google-ads',
    title: 'Google Ads',
    category: 'Performance Marketing',
    shortDescription: 'High-intent Google Search, Performance Max, Display, and Shopping campaigns optimized for revenue.',
    fullDescription: 'Capturing bottom-of-funnel buyers actively searching for your solutions with keyword negatives, smart bidding, and conversion value rules.',
    typicalDeliverables: ['High-Intent Keyword Matrix', 'Responsive Search Ads (RSAs)', 'Negative Keyword Lists', 'Enhanced Conversion Tracking'],
    startingRate: 65000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Monthly Google Ads Management Retainer',
      [
        { title: 'Search & Performance Max Campaign Engineering', desc: 'High-intent keyword grouping, responsive search ad copywriting, assets', qty: 1, rate: 40000 },
        { title: 'Conversion Value Modeling & Continuous Bid Optimization', desc: 'Negative keywords, auction insights, search query sculpting, ROAS audit', qty: 1, rate: 25000 }
      ],
      '1. Ad budget paid directly to Google Ads.\n2. Agency fee billed monthly in INR with 18% GST.'
    ),
    defaultProposal: makeProposalPreset(
      'Google Ads High-Intent Search & PMax Growth Framework',
      'Dominating Google Search and Performance Max networks to capture customers with immediate commercial intent at maximum return.',
      [
        'In-depth competitor keyword analysis and commercial intent mapping',
        'Structure of tightly themed ad groups with dynamic keyword insertion',
        'Setup of Enhanced Conversions and Offline Conversion Tracking (OCT)',
        'Robust negative keyword lists preventing budget leakage',
        'A/B testing of headline hooks, sitelinks, callouts, and snippets'
      ],
      [
        { title: 'Month 1: Audit, Restructure & Alpha/Beta Launch', duration: '30 Days', cost: 65000, deliverable: 'Fully restructured Google Ads account with conversion tracking' }
      ],
      [
        { title: 'Search & PMax Account Architecture & Copywriting', rate: 40000 },
        { title: 'Bid Management, Enhanced Tracking & Search Sculpting', rate: 25000 }
      ]
    )
  },
  {
    id: 'perf-youtube-ads',
    title: 'YouTube Ads',
    category: 'Performance Marketing',
    shortDescription: 'Targeted YouTube in-stream and bumper video ads engineered to educate, intrigue, and convert.',
    fullDescription: 'Capturing viewer attention within the first 5 seconds with persuasive video scripts, demographic affinity targeting, and custom intent audiences.',
    typicalDeliverables: ['Direct-Response Video Scripts', 'Motion Graphic Ad Edits', 'Custom Intent Audience Setup', 'View-Rate & Conversion Tracking'],
    startingRate: 50000,
    duration: 'Ongoing / Monthly',
    defaultInvoice: makeInvoicePreset(
      'YouTube Video Advertising Management',
      [
        { title: 'YouTube Direct-Response Ad Scripts & Video Edits', desc: '2 Skippable in-stream video variations (15s & 30s) with subtitles & end cards', qty: 1, rate: 30000 },
        { title: 'Audience Targeting, Bid Strategy & Campaign Tuning', desc: 'Custom intent audiences based on competitor searches, placement exclusions', qty: 1, rate: 20000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'YouTube Video Ads Customer Acquisition Strategy',
      'Leveraging the power of video storytelling on YouTube to educate prospective buyers, build brand prestige, and generate cost-effective conversions.',
      [
        'Scripting high-converting video angles (Problem-Agitate-Solve)',
        'Video editing with dynamic captions, sound design, and clear CTA banners',
        'Building custom audiences targeting users searching competitor brand terms',
        'Setting up Target CPA bidding to ensure profitable acquisition',
        'Weekly reporting on view-through rate, cost-per-view, and conversions'
      ],
      [
        { title: 'Month 1: Video Production & YouTube Ad Deployment', duration: '30 Days', cost: 50000, deliverable: '2 Live video ad campaigns with active conversion tracking' }
      ],
      [
        { title: 'Video Ad Scripting, Creative Editing & Packaging', rate: 30000 },
        { title: 'Audience Segmentation, Target CPA Setup & Management', rate: 20000 }
      ]
    )
  },
  {
    id: 'perf-lead-generation',
    title: 'Lead Generation Campaigns',
    category: 'Performance Marketing',
    shortDescription: 'Multi-channel B2B and high-ticket B2C lead generation funnels with automated CRM synchronization.',
    fullDescription: 'End-to-end lead pipelines combining instant lead forms, qualifying questionnaires, automated SMS/WhatsApp alerts, and appointment booking.',
    typicalDeliverables: ['Instant Lead Forms & Quizzes', 'CRM & WhatsApp Automation', 'Lead Qualification Logic', 'Cost-Per-Lead (CPL) Optimization'],
    startingRate: 70000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'High-Intent Lead Generation Campaign',
      [
        { title: 'Lead Funnel Engineering & Multi-Channel Ads', desc: 'Interactive lead quiz/form, Meta/Google ad setups, copy variations', qty: 1, rate: 45000 },
        { title: 'Instant WhatsApp/Email Lead Routing & CRM Sync', desc: 'Webhook triggers, automatic rep notification, spam lead filtering', qty: 1, rate: 25000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'End-to-End High-Ticket Lead Generation Engine',
      'Generating predictable, qualified inbound leads for your sales team while lowering Cost-Per-Qualified-Lead through automated filtering.',
      [
        'Multi-step qualification funnels to weed out low-intent inquiries',
        'Cross-platform ad campaigns across Meta and Google Search',
        'Instant lead notifications via WhatsApp and Email within 60 seconds',
        'CRM pipeline integration (HubSpot/Zoho/Google Sheets)',
        'Bi-weekly lead quality calibration based on sales closing data'
      ],
      [
        { title: 'Month 1: Funnel Build, Ad Launch & Pipeline Automation', duration: '30 Days', cost: 70000, deliverable: 'Fully operational lead pipeline delivering qualified leads' }
      ],
      [
        { title: 'Lead Qualification Funnel & Multi-Platform Ad Setup', rate: 45000 },
        { title: 'Automation Triggers, CRM Integration & Optimization', rate: 25000 }
      ]
    )
  },
  {
    id: 'perf-remarketing-campaigns',
    title: 'Remarketing Campaigns',
    category: 'Performance Marketing',
    shortDescription: 'Dynamic remarketing funnels re-engaging past visitors, cart abandoners, and dormant leads.',
    fullDescription: 'Omni-channel retargeting across Meta, Google Display Network, and YouTube ensuring no interested prospect slips away.',
    typicalDeliverables: ['Audience Segmentation (30/60/90 days)', 'Dynamic Product Ads (DPA)', 'Special Offer Creative Variations', 'Frequency Capping Rules'],
    startingRate: 40000,
    duration: 'Ongoing / Monthly',
    defaultInvoice: makeInvoicePreset(
      'Omni-Channel Remarketing Funnel',
      [
        { title: 'Retargeting Creative Suite & Offer Sequencing', desc: '6 High-urgency retargeting banners/videos, review highlights, objection crushers', qty: 1, rate: 25000 },
        { title: 'Custom Audience Segmentation & Frequency Capping', desc: 'Pixel audiences, cart abandoner hooks, lead list matching, burn pixel setup', qty: 1, rate: 15000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'High-Conversion Omni-Channel Remarketing Funnel',
      'Recovering lost website visitors and cart abandoners with timely, persuasive retargeting ads that maximize return on your existing traffic.',
      [
        'Audience segmentation based on recency and depth of visit',
        'Dynamic creative addressing common customer objections and FAQs',
        'Special offer and limited-time discount ad sequencing',
        'Strict frequency capping to prevent ad fatigue and brand annoyance',
        'Conversion exclusion lists so existing buyers are not retargeted'
      ],
      [
        { title: 'Month 1: Setup & Retargeting Launch', duration: '30 Days', cost: 40000, deliverable: 'Live cross-network retargeting recovering abandoned visitors' }
      ],
      [
        { title: 'Remarketing Creative Suite & Objection-Crushing Ads', rate: 25000 },
        { title: 'Audience Segmentation & Frequency Capping Management', rate: 15000 }
      ]
    )
  },

  // ==========================================
  // 4. SEO, EO, GEO & ONLINE VISIBILITY
  // ==========================================
  {
    id: 'seo-search-engine-optimization',
    title: 'Search Engine Optimization (SEO)',
    category: 'SEO, EO, GEO & Online Visibility',
    shortDescription: 'Comprehensive technical SEO, high-intent keyword clustering, Core Web Vitals optimization, and backlink authority.',
    fullDescription: 'Holistic organic search strategy driving page-one Google rankings, organic search volume, and compounding domain authority.',
    typicalDeliverables: ['Technical SEO Audit', 'Keyword Intent Architecture', 'On-Page Optimization (Meta/Headers)', 'Monthly Ranking & Traffic Audit'],
    startingRate: 45000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Monthly Technical & On-Page SEO Retainer',
      [
        { title: 'Technical SEO Optimization & Core Web Vitals', desc: 'Crawl error fixes, schema markup, sitemap tuning, page speed enhancement', qty: 1, rate: 25000 },
        { title: 'Keyword Intent Optimization & Content Updates', desc: 'Targeting 20 primary keywords, on-page content optimization, internal linking', qty: 1, rate: 20000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Strategic SEO Growth & First-Page Ranking Strategy',
      'Achieving sustainable first-page Google rankings through technical excellence, keyword depth, and search intent alignment.',
      [
        'Full technical audit addressing indexing, canonicals, and speed',
        'In-depth keyword clustering identifying high-conversion buyer intent terms',
        'On-page content optimization including title tags, meta, H1-H3, and schema',
        'Internal link restructuring to distribute PageRank to priority pages',
        'Monthly keyword movement and organic session growth reports'
      ],
      [
        { title: 'Month 1: Technical Fixes & Keyword Matrix Implementation', duration: '30 Days', cost: 45000, deliverable: 'Full technical clean up and first batch of optimized URLs' }
      ],
      [
        { title: 'Technical SEO Remediation & Schema Architecture', rate: 25000 },
        { title: 'Content Optimization & Keyword Tracking Suite', rate: 20000 }
      ]
    )
  },
  {
    id: 'seo-engine-optimization',
    title: 'Engine Optimization (EO)',
    category: 'SEO, EO, GEO & Online Visibility',
    shortDescription: 'Algorithmic search engine crawling optimization, log analysis, JavaScript rendering, and programmatic indexing.',
    fullDescription: 'Deep crawl budget optimization, server response timing, structured data graph engineering, and headless CMS rendering for search spiders.',
    typicalDeliverables: ['Server Log Analysis', 'SSR / Prerendering Strategy', 'Schema Entity Graphs', 'Crawl Budget Optimization'],
    startingRate: 55000,
    duration: 'Ongoing / Monthly',
    defaultInvoice: makeInvoicePreset(
      'Search Engine Optimization (EO) Architecture',
      [
        { title: 'Server Log Analysis & Spider Crawl Optimization', desc: 'Bot traffic evaluation, crawl budget waste removal, 301 redirect chains fix', qty: 1, rate: 30000 },
        { title: 'JSON-LD Entity Graph & Headless SSR Indexing', desc: 'Comprehensive Schema.org markup, hydration verification, dynamic XML sitemaps', qty: 1, rate: 25000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Engine Optimization (EO) & Crawl Architecture Blueprint',
      'Optimizing how search engine web crawlers (Googlebot, Bingbot) discover, render, and index your website with zero computational waste.',
      [
        'Server log file analysis to audit crawl frequency and resource bottlenecks',
        'Prerendering and Server-Side Rendering (SSR) audits for JavaScript frameworks',
        'JSON-LD multi-entity graph linking company, services, and key personnel',
        'Dynamic XML sitemap generation with priority and lastmod headers',
        'Core Web Vitals remediation targeting all-green scores'
      ],
      [
        { title: 'Month 1: Log Audit & Server Architecture Tuning', duration: '30 Days', cost: 55000, deliverable: 'Eliminated crawl waste and verified instant indexation' }
      ],
      [
        { title: 'Log Analysis, Bot Crawl Audits & Speed Remediation', rate: 30000 },
        { title: 'Schema Graph Engineering & Headless SSR Indexing', rate: 25000 }
      ]
    )
  },
  {
    id: 'seo-generative-engine-optimization',
    title: 'Generative Engine Optimization (GEO)',
    category: 'SEO, EO, GEO & Online Visibility',
    shortDescription: 'Optimizing brand presence in AI search models: ChatGPT Search, Google Gemini, Perplexity, and Claude.',
    fullDescription: 'Pioneering GEO strategies ensuring your brand is cited as the authoritative source and top recommendation in generative AI engine answers.',
    typicalDeliverables: ['LLM Mention & Citation Audit', 'Semantic Entity Structuring', 'Authority Data Source Seeding', 'AI Search Visibility Index'],
    startingRate: 75000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Generative Engine Optimization (GEO) Retainer',
      [
        { title: 'AI Engine Citation Strategy & Knowledge Graph Seeding', desc: 'Entity optimization for Gemini, Perplexity, ChatGPT citations', qty: 1, rate: 45000 },
        { title: 'Authoritative Dataset Creation & Semantic PR', desc: 'Structured factual answers, verified Wikidata/Wikipedia references, digital PR', qty: 1, rate: 30000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Generative Engine Optimization (GEO) Domination Roadmap',
      'Securing your brand position as the definitive answer and primary citation across next-generation generative AI search engines.',
      [
        'Auditing how ChatGPT, Perplexity, and Google Gemini currently perceive your brand',
        'Structuring web content into clear, factual answers easily ingested by LLMs',
        'Establishing authority footprint on key knowledge repositories and databases',
        'Implementing comprehensive Schema.org Semantic Entity graphs',
        'Monthly AI Search Visibility report tracking generative model mentions'
      ],
      [
        { title: 'Month 1: GEO Baseline Audit & Semantic Seeding', duration: '30 Days', cost: 75000, deliverable: 'Structured entity architecture and initial LLM citation boost' }
      ],
      [
        { title: 'LLM Citation Strategy & Knowledge Graph Engineering', rate: 45000 },
        { title: 'Semantic Authority Seeding & Generative AI PR', rate: 30000 }
      ]
    )
  },
  {
    id: 'seo-online-visibility',
    title: 'Online Visibility & Entity Graph',
    category: 'SEO, EO, GEO & Online Visibility',
    shortDescription: 'Google Business Profile, local 3-pack rankings, multi-directory citations, and digital authority establishment.',
    fullDescription: 'Building an omnipresent digital footprint across local maps, high-authority directories, knowledge panels, and review platforms.',
    typicalDeliverables: ['Google Business Profile Optimization', 'Local 3-Pack Map Rankings', '50+ High-Authority Directory Citations', 'Reputation & Review Funnel'],
    startingRate: 50000,
    duration: '3-4 weeks',
    defaultInvoice: makeInvoicePreset(
      'Online Visibility & Local Presence Accelerator',
      [
        { title: 'Google Business Profile & Map Pack Optimization', desc: 'Profile completion, geotagged photo uploads, service categories, local keywords', qty: 1, rate: 28000 },
        { title: 'Citation Cleanup, Directory Submissions & Review Automation', desc: '50 Consistent NAP citations across tier-1 directories, automated review request link', qty: 1, rate: 22000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Local & Regional Online Visibility Acceleration',
      'Dominating local search results and Google Maps to ensure nearby customers discover and choose your business first.',
      [
        'Optimization of Google Business Profile with rich product and service descriptions',
        'Audit and synchronization of Name, Address, Phone (NAP) across 50+ platforms',
        'Implementation of a frictionless Google Review collection funnel',
        'Local schema markup on main website indicating geo-coordinates and service areas',
        'Monthly ranking reports tracking Google Maps 3-pack visibility'
      ],
      [
        { title: 'Sprint 1: Profile Overhaul & Citation Cleanup', duration: '14 Days', cost: 28000, deliverable: 'Fully updated Google profile and submitted directory records' },
        { title: 'Sprint 2: Review Engine Setup & Local Schema', duration: '14 Days', cost: 22000, deliverable: 'Operational review funnel and validated local schema' }
      ],
      [
        { title: 'Google Business Profile Optimization & Map Domination', rate: 28000 },
        { title: 'Directory Citations, Review Automation & Local Schema', rate: 22000 }
      ]
    )
  },

  // ==========================================
  // 5. AI & AUTOMATION SOLUTIONS
  // ==========================================
  {
    id: 'ai-chatbots',
    title: 'AI Chatbots',
    category: 'AI & Automation Solutions',
    shortDescription: 'Custom trained conversational AI agents for 24/7 customer support, lead qualification, and appointment booking.',
    fullDescription: 'Intelligent AI agents trained on your proprietary docs and FAQs, integrated with WhatsApp, web widgets, and internal CRM systems.',
    typicalDeliverables: ['Custom RAG Knowledge Base', 'Website & WhatsApp Integration', 'Lead Qualification Flow', 'Agent Handoff Logic'],
    startingRate: 80000,
    duration: '2-3 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Custom AI Chatbot Deployment',
      [
        { title: 'AI Agent Architecture & Proprietary Knowledge Training', desc: 'Vector database ingestion, custom system prompt engineering, guardrails', qty: 1, rate: 50000 },
        { title: 'Web Widget & WhatsApp Business API Integration', desc: 'Embeddable chat interface, WhatsApp webhook sync, CRM lead export', qty: 1, rate: 30000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Enterprise AI Chatbot & Customer Support Automation',
      'Deploying an intelligent conversational AI agent capable of answering complex inquiries, capturing leads, and booking meetings 24/7 with zero human latency.',
      [
        'Ingestion of company documentation, pricing sheets, and policies into a RAG pipeline',
        'Custom prompt tuning matching brand voice and preventing hallucinations',
        'Integration into web chat widget and WhatsApp Business API',
        'Automatic human escalation when complex intervention is detected',
        'Dashboard with conversation transcripts and sentiment analytics'
      ],
      [
        { title: 'Phase 1: Knowledge Ingestion & Prompt Calibration', duration: '7 Days', cost: 40000, deliverable: 'Trained model prototype tested against 100 benchmark queries' },
        { title: 'Phase 2: UI Integration & Webhook Connections', duration: '10 Days', cost: 40000, deliverable: 'Live chatbot embedded on website and WhatsApp' }
      ],
      [
        { title: 'AI Model Training, Guardrails & Vector Database', rate: 50000 },
        { title: 'Frontend Embed Widget, WhatsApp Sync & Integrations', rate: 30000 }
      ]
    )
  },
  {
    id: 'ai-business-automation',
    title: 'Business Automation',
    category: 'AI & Automation Solutions',
    shortDescription: 'End-to-end automation connecting finance, operations, customer communication, and internal reporting.',
    fullDescription: 'Eliminating repetitive human tasks through intelligent API integrations, webhooks, robotic process automation, and autonomous triggers.',
    typicalDeliverables: ['Process Architecture Map', 'Multi-System API Webhooks', 'Automated Exception Handling', 'Admin Monitoring Dashboard'],
    startingRate: 95000,
    duration: '3-4 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Business Operations Automation Suite',
      [
        { title: 'Operational Process Audit & Workflow Automation', desc: 'Connecting core tools (Slack/Email/Sheets/ERP), custom webhook triggers', qty: 1, rate: 60000 },
        { title: 'Data Synchronization & Automated Reporting Pipeline', desc: 'Nightly data sync, error alert triggers, executive summary email generation', qty: 1, rate: 35000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'End-to-End Autonomous Business Workflow Architecture',
      'Transforming manual business processes into self-executing digital workflows that save hundreds of staff hours and eliminate data entry errors.',
      [
        'Mapping high-friction manual operational bottlenecks across teams',
        'Engineering resilient automations using webhooks, APIs, and microservices',
        'Automated document routing, notifications, and client updates',
        'Fail-safe retry mechanisms and instant error alerting via Slack/WhatsApp',
        'Comprehensive documentation and staff onboarding session'
      ],
      [
        { title: 'Phase 1: Workflow Discovery & Pipeline Blueprint', duration: '7 Days', cost: 35000, deliverable: 'Approved architectural flowcharts and API credentials test' },
        { title: 'Phase 2: Core Engineering & Staging Testing', duration: '14 Days', cost: 45000, deliverable: 'Operational automated pipelines handling mock transactions' },
        { title: 'Phase 3: Production Cutover & Team Handoff', duration: '5 Days', cost: 15000, deliverable: 'Live autonomous pipelines with monitoring dashboard' }
      ],
      [
        { title: 'Autonomous Workflow Engine & Multi-API Integrations', rate: 60000 },
        { title: 'Data Pipelines, Automated Alerts & Executive Reporting', rate: 35000 }
      ]
    )
  },
  {
    id: 'ai-crm-automation',
    title: 'CRM Automation',
    category: 'AI & Automation Solutions',
    shortDescription: 'Automated deal pipelines, smart lead scoring, task reminders, and automated client onboarding sequences.',
    fullDescription: 'Supercharging your CRM (HubSpot, Zoho, Salesforce, custom DB) with behavioral stage transitions, automated follow-ups, and rep task assignment.',
    typicalDeliverables: ['Pipeline Stage Automations', 'Lead Scoring Rules', 'Automated Email/WhatsApp Nurture', 'Sales Rep Task Triggers'],
    startingRate: 75000,
    duration: '2-3 weeks',
    defaultInvoice: makeInvoicePreset(
      'CRM Pipeline Automation System',
      [
        { title: 'CRM Stage Triggers & Automated Lead Routing', desc: 'Custom deal stages, round-robin lead distribution, automatic deal updates', qty: 1, rate: 45000 },
        { title: 'Automated Multi-Touch Follow-Up Sequences', desc: 'Email + WhatsApp drip sequences based on deal stage inactivity', qty: 1, rate: 30000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Intelligent CRM Pipeline & Sales Follow-Up Automation',
      'Configuring automated sales workflows that prevent leads from going cold, enforce rep accountability, and shorten sales cycle duration.',
      [
        'Audit of current sales process and CRM data hygiene',
        'Configuration of custom deal pipeline stages with required fields',
        'Automated task creation when deals remain stagnant for 48 hours',
        'Multi-step email and WhatsApp follow-up triggers triggered by stage changes',
        'Sales performance dashboard tracking conversion rates across reps'
      ],
      [
        { title: 'Sprint 1: Pipeline Structure & Routing Logic', duration: '7 Days', cost: 40000, deliverable: 'Configured CRM deal stages and lead assignment rules' },
        { title: 'Sprint 2: Drip Workflows & Live Rollout', duration: '7 Days', cost: 35000, deliverable: 'Active automated nurture campaigns and rep training' }
      ],
      [
        { title: 'CRM Deal Pipeline Engineering & Assignment Rules', rate: 45000 },
        { title: 'Multi-Touch Drip Automation & Inactivity Triggers', rate: 30000 }
      ]
    )
  },
  {
    id: 'ai-lead-management-systems',
    title: 'Lead Management Systems',
    category: 'AI & Automation Solutions',
    shortDescription: 'Unified lead ingestion from ads, website, calls, and WhatsApp with instant deduplication and routing.',
    fullDescription: 'A single centralized console that ingests leads from every marketing channel, deduplicates entries, assigns tags, and triggers instant alerts.',
    typicalDeliverables: ['Omni-Channel Lead Ingestion', 'Deduplication & Enrichment Engine', 'Instant Notification Hooks', 'Lead Attribution Dashboard'],
    startingRate: 85000,
    duration: '3-4 weeks',
    defaultInvoice: makeInvoicePreset(
      'Unified Lead Management Platform',
      [
        { title: 'Centralized Lead Ingestion & Normalization Engine', desc: 'Connecting Meta Ads, Google Ads, website forms, WhatsApp leads into 1 DB', qty: 1, rate: 50000 },
        { title: 'Deduplication, Enrichment & Real-time Notification Bot', desc: 'Spam filters, phone number validation, instant Slack/WhatsApp rep alerts', qty: 1, rate: 35000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Centralized Lead Management & Attribution Platform',
      'Eliminating lead leakage by uniting all inbound marketing channels into an intelligent lead management system with instant speed-to-lead response.',
      [
        'Aggregating leads from Meta, Google, landing pages, and WhatsApp in real time',
        'Automatic deduplication and phone number formatting (+91 verification)',
        'Speed-to-lead alerts sent to sales representatives within 10 seconds of opt-in',
        'Marketing source attribution tracking first-click and last-click origin',
        'Analytics view showing cost-per-lead and conversion rate by campaign'
      ],
      [
        { title: 'Phase 1: Ingestion Architecture & Data Schemas', duration: '8 Days', cost: 45000, deliverable: 'Functional lead database receiving live webhooks' },
        { title: 'Phase 2: Deduplication Rules & Notification System', duration: '12 Days', cost: 40000, deliverable: 'Complete automated lead routing with zero dropped leads' }
      ],
      [
        { title: 'Omni-Channel Ingestion & Normalization Infrastructure', rate: 50000 },
        { title: 'Deduplication Logic, Fast Alerts & Source Attribution', rate: 35000 }
      ]
    )
  },
  {
    id: 'ai-proposal-to-invoice-automation',
    title: 'Proposal-to-Invoice Automation',
    category: 'AI & Automation Solutions',
    shortDescription: 'Instant quote and proposal generation with 1-click conversion to GST invoices and automated payment tracking.',
    fullDescription: 'Custom automated quoting engine that allows sales teams to draft bespoke proposals, collect digital approval, and convert to invoices automatically.',
    typicalDeliverables: ['Digital Proposal Engine', '1-Click Invoice Converter', 'PHPMailer & Gmail Integration', 'Payment Settlement Webhooks'],
    startingRate: 65000,
    duration: '2-3 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Proposal-to-Invoice Automation Suite',
      [
        { title: 'Interactive Proposal & Dynamic Quote Generator', desc: 'Itemized milestone calculator, terms templating, digital client approval', qty: 1, rate: 38000 },
        { title: '1-Click GST Invoice Converter & Automated Mail Dispatch', desc: 'Instant PDF generation, PHPMailer SMTP trigger, payment status sync', qty: 1, rate: 27000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Proposal-to-Invoice Automation & Billing Acceleration',
      'Implementing the exact high-velocity billing architecture powering Digital Coyotes: turn signed proposals into compliant invoices in a single click.',
      [
        'Interactive proposal builder with preset service scopes and milestones',
        'Instant conversion of approved proposals into numbered GST invoices',
        'Dual dispatch system: automated PHPMailer SMTP + 1-click direct Gmail compose',
        'Real-time status tracking (Draft, Sent, Paid, Overdue) with financial ledger',
        'Support for Indian Rupees (₹ INR) with statutory 18% GST calculation'
      ],
      [
        { title: 'Sprint 1: Proposal & Invoice Generator System', duration: '7 Days', cost: 35000, deliverable: 'Working UI forms with live mathematical computations' },
        { title: 'Sprint 2: Mail Engine & Supabase/Local Data Persistence', duration: '7 Days', cost: 30000, deliverable: 'Full automated dispatch with transaction logs' }
      ],
      [
        { title: 'Proposal & Quoting Engine with Milestone Logic', rate: 38000 },
        { title: '1-Click Invoice Generation, PDF & Mail Automation', rate: 27000 }
      ]
    )
  },
  {
    id: 'ai-workflow-automation',
    title: 'Workflow Automation',
    category: 'AI & Automation Solutions',
    shortDescription: 'Custom API scripts, webhook listeners, and task automations connecting your business tools.',
    fullDescription: 'Automating repetitive data handling between spreadsheets, databases, email, and messaging platforms with zero ongoing human intervention.',
    typicalDeliverables: ['Custom Webhook Listeners', 'Cross-Platform Data Sync', 'Automated File Processing', 'Error Logging & Monitoring'],
    startingRate: 60000,
    duration: '2 weeks',
    defaultInvoice: makeInvoicePreset(
      'Workflow Automation Scripting & Sync',
      [
        { title: 'Custom Webhook Infrastructure & Middleware Scripting', desc: 'Node.js/Python serverless handlers connecting disparate software APIs', qty: 1, rate: 38000 },
        { title: 'Data Transformation, Error Logging & Fallback Logic', desc: 'Format conversion, retry loops on network errors, daily status ping', qty: 1, rate: 22000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Custom API & Webhook Workflow Automation',
      'Building bespoke, lightweight serverless automations that reliably bridge disparate applications and synchronize records without human effort.',
      [
        'Developing dedicated webhook endpoints that process events in real time',
        'Normalizing complex JSON payloads and mapping data accurately',
        'Implementing exponential backoff retry algorithms for 99.99% reliability',
        'Setting up automated Slack/Email alerts if third-party APIs fail',
        'Full source code handoff and documentation'
      ],
      [
        { title: 'Phase 1: API Discovery & Microservice Architecture', duration: '5 Days', cost: 30000, deliverable: 'Functional endpoint running in staging' },
        { title: 'Phase 2: Error Hardening & Production Deployment', duration: '5 Days', cost: 30000, deliverable: 'Live continuous automation with health logging' }
      ],
      [
        { title: 'Webhook Middleware & API Endpoint Development', rate: 38000 },
        { title: 'Data Mapping, Error Logging & Fail-Safe Mechanisms', rate: 22000 }
      ]
    )
  },
  {
    id: 'ai-consulting-training',
    title: 'AI Consulting & Training',
    category: 'AI & Automation Solutions',
    shortDescription: 'Executive AI strategy workshops, hands-on team training, custom prompt libraries, and AI implementation roadmaps.',
    fullDescription: 'Helping leadership and operational teams safely adopt generative AI and automation tools to double productivity and unlock competitive moats.',
    typicalDeliverables: ['Enterprise AI Audit', 'Executive Strategy Workshop', 'Custom Prompt Engineering Guide', 'AI Adoption Roadmap'],
    startingRate: 90000,
    duration: '2-3 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Enterprise AI Strategy & Hands-on Training',
      [
        { title: 'AI Operational Audit & Strategic Implementation Roadmap', desc: 'Evaluating company workflows, identifying 5 high-ROI AI use cases', qty: 1, rate: 50000 },
        { title: 'Hands-on Team Workshops & Proprietary Prompt Library', desc: 'Two half-day interactive sessions, custom prompt handbook for staff', qty: 1, rate: 40000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Enterprise AI Readiness, Strategy & Workforce Enablement',
      'Empowering your organization to harness generative AI safely, ethically, and effectively to multiply operational output and drive strategic advantage.',
      [
        'Comprehensive audit of current operational software and workflow bottlenecks',
        'Formulation of an enterprise AI roadmap with cost and ROI projections',
        'Hands-on interactive training sessions for marketing, sales, and operations teams',
        'Curated library of tested prompt templates designed for daily tasks',
        'Guidance on data privacy, security, and preventing IP leakage'
      ],
      [
        { title: 'Week 1: Strategic Audit & Architecture Formulation', duration: '7 Days', cost: 45000, deliverable: 'Executive AI Strategy Dossier' },
        { title: 'Week 2: Team Training Workshops & Prompt Handbook', duration: '7 Days', cost: 45000, deliverable: 'Completed team training and prompt asset library' }
      ],
      [
        { title: 'Enterprise AI Opportunity Audit & Strategic Roadmap', rate: 50000 },
        { title: 'Hands-on Team Enablement & Custom Prompt Assets', rate: 40000 }
      ]
    )
  },

  // ==========================================
  // 6. SOFTWARE & APPLICATION DEVELOPMENT
  // ==========================================
  {
    id: 'soft-custom-web-applications',
    title: 'Custom Web Applications',
    category: 'Software & Application Development',
    shortDescription: 'Full-stack React, Next.js, and Node.js web applications engineered for high performance, scale, and clean UX.',
    fullDescription: 'Enterprise web apps built with responsive interfaces, robust backend APIs, role-based authorization, and real-time database synchronization.',
    typicalDeliverables: ['Modern React/TypeScript Frontend', 'Secure REST/GraphQL Backend', 'PostgreSQL / Supabase Database', 'CI/CD Automated Deployment'],
    startingRate: 180000,
    duration: '6-8 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Custom Web Application Development',
      [
        { title: 'Web App Frontend Architecture & Interactive UI', desc: 'React/Next.js responsive SPA, state management, component system', qty: 1, rate: 100000 },
        { title: 'Backend API, Authentication & PostgreSQL Database', desc: 'Secure endpoints, role-based access control, database schema design', qty: 1, rate: 80000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Full-Stack Custom Web Application Engineering',
      'Architecting and building a scalable, high-performance web application designed for seamless user experience, rock-solid security, and future growth.',
      [
        'System architecture design and database schema modeling',
        'Modern React and TypeScript frontend with Tailwind CSS styling',
        'Secure authentication with session management and role-based permissions',
        'Cloud-native backend API with comprehensive unit test coverage',
        'Automated CI/CD deployment pipeline with zero-downtime releases'
      ],
      [
        { title: 'Phase 1: Architecture, Wireframes & Database Design', duration: '12 Days', cost: 50000, deliverable: 'Figma prototypes and approved entity models' },
        { title: 'Phase 2: Core Engineering & Feature Development', duration: '24 Days', cost: 90000, deliverable: 'Staging environment with full feature set' },
        { title: 'Phase 3: Security Testing, QA & Production Deployment', duration: '8 Days', cost: 40000, deliverable: 'Live web application on production cloud infrastructure' }
      ],
      [
        { title: 'Frontend UI/UX Engineering & Responsive Experience', rate: 100000 },
        { title: 'Backend API Architecture, Auth & Cloud Database', rate: 80000 }
      ]
    )
  },
  {
    id: 'soft-mobile-app-development',
    title: 'Mobile App Development',
    category: 'Software & Application Development',
    shortDescription: 'Native-feel iOS and Android mobile apps built with React Native / Flutter featuring offline sync and push alerts.',
    fullDescription: 'Cross-platform mobile engineering with fluid 60fps animations, biometric authentication, device hardware integration, and app store publishing.',
    typicalDeliverables: ['iOS & Android App Builds', 'Push Notification Service', 'Offline Storage Sync', 'App Store / Play Store Approvals'],
    startingRate: 195000,
    duration: '6-10 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Mobile Application Build (iOS & Android)',
      [
        { title: 'Cross-Platform Mobile App (React Native / Flutter)', desc: 'Responsive mobile screens, navigation hierarchy, native hardware access', qty: 1, rate: 120000 },
        { title: 'Cloud Backend Sync, Push Notifications & App Store Prep', desc: 'Real-time database sync, Firebase Cloud Messaging, store compliance packaging', qty: 1, rate: 75000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Cross-Platform Mobile Application Development (iOS & Android)',
      'Delivering a high-polish, feature-rich mobile app that delights users on both Apple App Store and Google Play Store with single-codebase efficiency.',
      [
        'Fluid mobile UI designed specifically for iOS Human Interface & Android Material',
        'Biometric authentication (FaceID, TouchID, Fingerprint)',
        'Push notifications with targeted segmentation via Firebase Cloud Messaging',
        'Offline-first data caching and background sync capabilities',
        'Complete submission management through Apple App Store and Google Play'
      ],
      [
        { title: 'Phase 1: Mobile UX Design & Prototype', duration: '14 Days', cost: 55000, deliverable: 'Interactive Figma mobile clickable prototype' },
        { title: 'Phase 2: Core App Engineering & API Hookup', duration: '28 Days', cost: 95000, deliverable: 'TestFlight and Android APK builds for client testing' },
        { title: 'Phase 3: Store Submission & Production Launch', duration: '12 Days', cost: 45000, deliverable: 'Live published apps on App Store and Google Play' }
      ],
      [
        { title: 'Cross-Platform Mobile App UI & Component Engine', rate: 120000 },
        { title: 'API Integration, Push Alerts & Store Publishing', rate: 75000 }
      ]
    )
  },
  {
    id: 'soft-crm-development',
    title: 'CRM Development',
    category: 'Software & Application Development',
    shortDescription: 'Custom bespoke CRM platform tailored to your exact industry workflows, lead stages, and commission structures.',
    fullDescription: 'Say goodbye to restrictive SaaS per-seat costs with a custom-engineered CRM tailored to your sales process, document generation, and analytics.',
    typicalDeliverables: ['Custom Contact & Company Ledger', 'Multi-Stage Deal Pipelines', 'Activity Tracking & Logs', 'Custom Export & Reporting'],
    startingRate: 165000,
    duration: '5-7 weeks',
    defaultInvoice: makeInvoicePreset(
      'Bespoke CRM Software Development',
      [
        { title: 'Custom CRM Pipeline Engine & Contact Database', desc: 'Custom fields, stage Kanban boards, search indexing, activity logging', qty: 1, rate: 95000 },
        { title: 'User Roles, Document Generator & Reporting Dashboards', desc: 'Admin vs rep permissions, 1-click quotes/invoices, executive analytics', qty: 1, rate: 70000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Bespoke Enterprise CRM System Engineering',
      'Building an owned, unconstrained CRM system engineered around your exact sales methodology without recurring monthly per-seat licensing fees.',
      [
        'Custom entity relationships for leads, contacts, deals, and accounts',
        'Drag-and-drop Kanban pipeline boards with stage gate validations',
        'Automated activity tracking logging calls, emails, and WhatsApp chats',
        'Document generator creating proposals and invoices directly from deal data',
        'Role-based permissions separating sales reps, managers, and executives'
      ],
      [
        { title: 'Phase 1: Sales Flow Discovery & DB Architecture', duration: '10 Days', cost: 45000, deliverable: 'Approved data models and Kanban UI wireframes' },
        { title: 'Phase 2: CRM Core Engine & Pipeline Build', duration: '20 Days', cost: 80000, deliverable: 'Fully functional staging CRM with sample contacts' },
        { title: 'Phase 3: Permissions, Export Tools & Deployment', duration: '10 Days', cost: 40000, deliverable: 'Production deployment with full company data migration' }
      ],
      [
        { title: 'Custom CRM Pipeline, Kanban UI & Contact Engine', rate: 95000 },
        { title: 'Permissions, Automation Triggers & Analytics Suite', rate: 70000 }
      ]
    )
  },
  {
    id: 'soft-erp-solutions',
    title: 'ERP Solutions',
    category: 'Software & Application Development',
    shortDescription: 'Enterprise Resource Planning software uniting inventory, orders, procurement, billing, and accounting.',
    fullDescription: 'Custom modular ERP platforms designed for manufacturing, distribution, and services with audit trails and real-time inventory reconciliation.',
    typicalDeliverables: ['Inventory & Warehouse Module', 'Order & Procurement Tracking', 'GST Billing & Ledger', 'Multi-Location Access Control'],
    startingRate: 250000,
    duration: '8-12 weeks',
    defaultInvoice: makeInvoicePreset(
      'Modular Enterprise ERP System',
      [
        { title: 'Core ERP Architecture, Inventory & Procurement Engine', desc: 'Item catalog, stock ledger, vendor purchase orders, automated low-stock alerts', qty: 1, rate: 140000 },
        { title: 'Order Fulfillment, GST Financial Ledger & Audit Trail', desc: 'Sales order dispatch, statutory tax reports, double-entry ledger, user logs', qty: 1, rate: 110000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Custom Enterprise Resource Planning (ERP) Platform',
      'Unifying your entire business operations—from inventory and supplier procurement to sales fulfillment and financial ledgers—in a single secure cloud ERP.',
      [
        'Real-time inventory tracking across multiple warehouses with batch tracking',
        'Automated purchase order workflows with vendor approval triggers',
        'Sales order management with automated packing slips and dispatch notes',
        'Compliant GST invoicing and double-entry accounting ledger',
        'Detailed audit logging tracking every transaction and user action'
      ],
      [
        { title: 'Phase 1: Operations Mapping & Modular Architecture', duration: '15 Days', cost: 70000, deliverable: 'System specifications and relational schema' },
        { title: 'Phase 2: Inventory, Order & Procurement Modules', duration: '30 Days', cost: 110000, deliverable: 'Working staging system with inventory transactions' },
        { title: 'Phase 3: Financial Ledger, Testing & Team Training', duration: '15 Days', cost: 70000, deliverable: 'Live deployment with staff certification' }
      ],
      [
        { title: 'ERP Core Architecture, Inventory & Purchase Engine', rate: 140000 },
        { title: 'Order Fulfillment, GST Ledger & Multi-Branch System', rate: 110000 }
      ]
    )
  },
  {
    id: 'soft-lead-management-platforms',
    title: 'Lead Management Platforms',
    category: 'Software & Application Development',
    shortDescription: 'Dedicated web platform for agencies and enterprises to distribute, track, score, and monetize sales leads.',
    fullDescription: 'Custom lead dispatch portal featuring live lead verification, cost attribution, webhook APIs, and sales rep leaderboard gamification.',
    typicalDeliverables: ['Lead Ingestion Gateway', 'Automated Lead Distribution Rules', 'Lead Quality Scoring', 'Partner / Buyer Portal'],
    startingRate: 140000,
    duration: '4-6 weeks',
    defaultInvoice: makeInvoicePreset(
      'Lead Management & Distribution Platform',
      [
        { title: 'Lead Ingestion Gateway & Real-Time Distribution Engine', desc: 'API endpoints, round-robin rules, geographic lead assignment, instant alerts', qty: 1, rate: 80000 },
        { title: 'Lead Verification, Scoring & Partner Buyer Portal', desc: 'Phone verification, spam blacklists, partner access with lead purchase tokens', qty: 1, rate: 60000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Enterprise Lead Management & Distribution Platform',
      'Developing a high-speed lead routing and monetization platform to process inbound leads, distribute them to regional sales teams, and track conversion value.',
      [
        'Ultra-fast API and webhook endpoints accepting thousands of leads daily',
        'Configurable distribution rules: round-robin, weighted, and geo-targeted',
        'Real-time lead scoring and automated spam verification',
        'Partner and buyer portal with token billing for lead access',
        'Executive reporting dashboard tracking lead velocity and cost-per-acquisition'
      ],
      [
        { title: 'Phase 1: Ingestion API & Rule Engine Architecture', duration: '10 Days', cost: 45000, deliverable: 'API documentation and rule simulator' },
        { title: 'Phase 2: Distribution Engine & Partner Portal', duration: '18 Days', cost: 65000, deliverable: 'Staging platform with mock lead distribution' },
        { title: 'Phase 3: Security, Stress Testing & Deployment', duration: '7 Days', cost: 30000, deliverable: 'Production deployment capable of 10,000+ daily leads' }
      ],
      [
        { title: 'Lead Ingestion API & Weighted Distribution Engine', rate: 80000 },
        { title: 'Verification Shield, Partner Portal & Analytics', rate: 60000 }
      ]
    )
  },
  {
    id: 'soft-b2b-ordering-platforms',
    title: 'B2B Ordering Platforms',
    category: 'Software & Application Development',
    shortDescription: 'Wholesale and distributor portals with custom price tiers, credit terms, bulk orders, and GST invoices.',
    fullDescription: 'Modern B2B ordering portals allowing authorized dealers, distributors, and wholesale accounts to place bulk orders 24/7 with custom pricing.',
    typicalDeliverables: ['Wholesale Catalog with Tiered Pricing', 'Bulk Order CSV Upload', 'Credit Limit & Net Terms Rules', 'Automated GST Invoicing'],
    startingRate: 175000,
    duration: '5-7 weeks',
    defaultInvoice: makeInvoicePreset(
      'B2B Wholesale Ordering Platform',
      [
        { title: 'Wholesale Catalog, Tiered Pricing & Bulk Ordering', desc: 'Role-based pricing, quick re-order, CSV spreadsheet bulk cart, minimum order values', qty: 1, rate: 105000 },
        { title: 'Dealer Credit Terms, Order Approvals & Invoice Sync', desc: 'Credit limit tracking, Net-30/60 approval workflows, GST e-invoice generation', qty: 1, rate: 70000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'B2B Wholesale Ordering & Distributor Portal',
      'Digitizing wholesale dealer operations with an automated self-service ordering platform that streamlines bulk purchasing, pricing tiers, and credit terms.',
      [
        'Custom pricing matrices allowing unique discount tiers per dealer group',
        'Rapid ordering interface with bulk CSV upload and one-click repeat ordering',
        'Dealer credit management with automated Net-15/30/60 terms validation',
        'Order approval workflows for high-value orders requiring management review',
        'Automated GST-compliant commercial invoices and shipping manifests'
      ],
      [
        { title: 'Phase 1: B2B Pricing Models & Dealer UX Wireframes', duration: '12 Days', cost: 50000, deliverable: 'Figma dealer portal wireframes' },
        { title: 'Phase 2: Wholesale Engine & Credit Logic Development', duration: '20 Days', cost: 85000, deliverable: 'Staging ordering platform with test accounts' },
        { title: 'Phase 3: ERP Integration & Production Launch', duration: '8 Days', cost: 40000, deliverable: 'Live distributor portal ready for dealer orders' }
      ],
      [
        { title: 'Wholesale Ordering Engine & Custom Pricing Matrix', rate: 105000 },
        { title: 'Dealer Credit Management & Automated Invoicing Suite', rate: 70000 }
      ]
    )
  },
  {
    id: 'soft-customer-portals',
    title: 'Customer Portals',
    category: 'Software & Application Development',
    shortDescription: 'Secure self-service client portals for subscriptions, support tickets, project updates, and payment history.',
    fullDescription: 'Empower your customers with a branded private portal to access invoices, track project deliverables, submit tickets, and update billing details.',
    typicalDeliverables: ['Secure Authentication & SSO', 'Deliverable & File Repository', 'Support Ticket Center', 'Billing & Invoice History'],
    startingRate: 130000,
    duration: '4-5 weeks',
    defaultInvoice: makeInvoicePreset(
      'Secure Client Portal Engineering',
      [
        { title: 'Customer Authentication, Dashboard & File Hub', desc: 'Branded login, private file downloads, project milestone tracking', qty: 1, rate: 75000 },
        { title: 'Billing Center, Invoices & Support Ticket Desk', desc: 'Invoice history with PDF download, payment status, support ticketing engine', qty: 1, rate: 55000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Self-Service Customer Portal & Digital Client Hub',
      'Enhancing client satisfaction and reducing account management overhead with a sleek, secure customer portal for invoices, files, and updates.',
      [
        'Branded client login with passwordless magic links and multi-factor auth',
        'Real-time project milestone tracking with deliverable file repository',
        'Financial center displaying all historical invoices and payment receipts',
        'Built-in support ticket desk with automated notifications and status updates',
        'Mobile-friendly responsive UI matching corporate visual identity'
      ],
      [
        { title: 'Phase 1: Portal UI/UX & Security Architecture', duration: '8 Days', cost: 40000, deliverable: 'Interactive Figma design and security spec' },
        { title: 'Phase 2: Client Hub & Billing Integration', duration: '16 Days', cost: 60000, deliverable: 'Staging portal with test client accounts' },
        { title: 'Phase 3: QA, Penetration Testing & Launch', duration: '6 Days', cost: 30000, deliverable: 'Production customer portal with SSL hardening' }
      ],
      [
        { title: 'Customer Authentication, Dashboard & File Hub', rate: 75000 },
        { title: 'Billing History, Invoicing Engine & Ticket Desk', rate: 55000 }
      ]
    )
  },

  // ==========================================
  // 7. CORE DIGITAL COYOTES OFFERINGS
  // ==========================================
  {
    id: 'core-website-development',
    title: 'Website Development (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Flagship Digital Coyotes web engineering: lightning-fast React architecture, custom aesthetics, and sub-second loading.',
    fullDescription: 'Our signature web development package combining bespoke high-converting visual design, clean code, SEO readiness, and zero-latency infrastructure.',
    typicalDeliverables: ['Signature Brand UI/UX', 'Full-Stack React Codebase', 'Lead Capture & CMS', 'Speed & Security Hardening'],
    startingRate: 120000,
    duration: '4-6 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Core Website Development',
      [
        { title: 'Core Digital Coyotes Web Architecture & Design', desc: 'Signature responsive design, brand identity alignment, interactive elements', qty: 1, rate: 75000 },
        { title: 'Frontend Engineering, CMS & Speed Optimization', desc: 'React/TypeScript codebase, 95+ PageSpeed guarantee, schema markup', qty: 1, rate: 45000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Digital Coyotes Flagship Web Engineering & Digital Presence',
      'Deploying a distinctive, world-class web presence engineered to outclass competitors, command premium pricing, and convert visitors into clients.',
      [
        'Signature Digital Coyotes design language tailored to your brand',
        'Zero-latency frontend engineering with sub-second page loads',
        'Interactive conversion funnels with direct WhatsApp & contact triggers',
        'Comprehensive SEO architecture and Google Analytics 4 integration',
        '30-day post-launch warranty and dedicated developer support'
      ],
      [
        { title: 'Phase 1: Visual Design & Prototyping', duration: '10 Days', cost: 45000, deliverable: 'Approved Figma prototypes' },
        { title: 'Phase 2: Codebase & CMS Engineering', duration: '15 Days', cost: 50000, deliverable: 'Staging website with live CMS' },
        { title: 'Phase 3: Launch, Speed Hardening & SEO', duration: '5 Days', cost: 25000, deliverable: 'Live web flagship with 95+ PageSpeed' }
      ],
      [
        { title: 'Bespoke Visual Architecture & Interactive Layouts', rate: 75000 },
        { title: 'Frontend Engineering, Speed Hardening & SEO Suite', rate: 45000 }
      ]
    )
  },
  {
    id: 'core-social-media-marketing',
    title: 'Social Media Marketing (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Signature monthly social management: premium visual carousels, engaging reels, community building, and viral growth.',
    fullDescription: 'End-to-end social media dominance engineered to build engaged audiences, foster trust, and turn followers into paying customers.',
    typicalDeliverables: ['Monthly Aesthetic Content Grid', 'High-Production Video Reels', 'Copywriting & Engagement', 'Monthly Growth Dossier'],
    startingRate: 55000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Social Media Retainer',
      [
        { title: 'Premium Social Content Production (Carousels & Reels)', desc: '16 Signature graphic posts, 8 edited reels with motion graphics & sound', qty: 1, rate: 35000 },
        { title: 'Community Management & Performance Growth Strategy', desc: 'Daily posting, active community replies, hashtag research, growth reporting', qty: 1, rate: 20000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Digital Coyotes Omni-Channel Social Growth & Dominance',
      'Transforming your brand social presence into an authoritative content engine that commands attention and drives consistent inbound inquiries.',
      [
        'Monthly content matrix featuring 16 visual posts and 8 reels',
        'Brand-specific typography, motion graphics, and color harmony',
        'Conversion-focused copywriting with clear calls-to-action',
        'Proactive engagement strategy responding to potential client inquiries',
        'Monthly executive reporting on organic reach and follower acquisition'
      ],
      [
        { title: 'Monthly Retainer Cycle: Content & Community', duration: '30 Days', cost: 55000, deliverable: '24 published assets, active engagement, monthly report' }
      ],
      [
        { title: 'Visual Design, Carousel Creative & Reels Production', rate: 35000 },
        { title: 'Community Management & Strategic Growth Execution', rate: 20000 }
      ]
    )
  },
  {
    id: 'core-seo-services',
    title: 'SEO Services (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Technical audits, keyword ranking dominance, Core Web Vitals optimization, and high-authority link acquisition.',
    fullDescription: 'Our foundational SEO program engineered to establish durable organic search dominance and drive qualified buyers from Google.',
    typicalDeliverables: ['Complete Technical Remediation', 'High-Intent Keyword Matrix', 'On-Page Optimization', 'Monthly Keyword Rankings'],
    startingRate: 48000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Core SEO Retainer',
      [
        { title: 'Technical SEO Optimization & Indexation Auditing', desc: 'Fixing crawl errors, schema markup, site speed tuning, internal link architecture', qty: 1, rate: 26000 },
        { title: 'Keyword Intent Optimization & On-Page Content', desc: 'Targeting 25 high-commercial intent keywords, metadata, heading optimization', qty: 1, rate: 22000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Digital Coyotes First-Page Organic Ranking Acceleration',
      'Scaling your organic Google search presence to capture qualified inbound demand with zero ad spend.',
      [
        'Exhaustive technical audit addressing crawl errors, canonicals, and speed',
        'Commercial keyword mapping targeting ready-to-buy search queries',
        'On-page content optimization across key revenue-generating pages',
        'Implementation of rich schema markup for enhanced search snippets',
        'Transparent monthly reporting on ranking positions and organic traffic'
      ],
      [
        { title: 'Month 1: Technical Fixes & Keyword Strategy Launch', duration: '30 Days', cost: 48000, deliverable: 'Eliminated technical issues and initial ranking improvements' }
      ],
      [
        { title: 'Technical SEO Clean-Up & Schema Architecture', rate: 26000 },
        { title: 'High-Intent Keyword Optimization & Content Updates', rate: 22000 }
      ]
    )
  },
  {
    id: 'core-google-meta-ads',
    title: 'Google Ads & Meta Ads (Combined)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Full-funnel combined ad engine: capture search intent on Google and scale social acquisition on Meta.',
    fullDescription: 'The ultimate performance marketing synergy: combine high-intent Google Search with algorithmic Meta Ads creative testing for maximum ROAS.',
    typicalDeliverables: ['Cross-Network Ad Strategy', 'Meta Ad Creatives & Video Edits', 'Google Search & PMax Setup', 'Unified ROAS Reporting'],
    startingRate: 95000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Combined Google & Meta Performance Marketing',
      [
        { title: 'Meta Ads Management & Creative Suite (12 Creatives)', desc: 'Full-funnel Facebook/Instagram campaigns, ad creative production, CAPI tracking', qty: 1, rate: 50000 },
        { title: 'Google Ads Management (Search & Performance Max)', desc: 'High-intent search campaigns, keyword pruning, negative list management', qty: 1, rate: 45000 }
      ],
      '1. Ad spend paid directly to ad platforms.\n2. Invoiced monthly in INR + 18% GST.'
    ),
    defaultProposal: makeProposalPreset(
      'Unified Google & Meta Performance Growth Engine',
      'Deploying a dual-engine acquisition framework that captures existing search demand on Google while aggressively manufacturing new demand on Meta.',
      [
        'Synchronized full-funnel strategy linking social awareness to search capture',
        'Production of 12 high-converting Meta ad creatives (video & static)',
        'Google Ads account restructuring targeting bottom-of-funnel buyer keywords',
        'Integrated conversion tracking across Google Tag Manager and Meta CAPI',
        'Unified cross-network reporting with blended CAC and ROAS metrics'
      ],
      [
        { title: 'Month 1: Cross-Platform Setup & Scaling Launch', duration: '30 Days', cost: 95000, deliverable: 'Fully operational dual ad engine with live dashboard' }
      ],
      [
        { title: 'Meta Ads Campaign Architecture & Creative Production', rate: 50000 },
        { title: 'Google Ads Search & PMax Management', rate: 45000 }
      ]
    )
  },
  {
    id: 'core-branding-design',
    title: 'Branding & Design (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Distinctive visual identities, logo marks, typography systems, color palettes, and comprehensive brand books.',
    fullDescription: 'Crafting brand identities that instantly communicate prestige, command premium prices, and leave a permanent imprint in the market.',
    typicalDeliverables: ['Vector Logo Suite & Marks', 'Color Palette & Typography', 'Comprehensive Brand Guidelines', 'Social & Marketing Asset Kit'],
    startingRate: 85000,
    duration: '3-4 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Signature Brand Identity',
      [
        { title: 'Brand Identity Exploration, Logo Suite & Marks', desc: 'Primary, secondary, and badge logo variations, vector exports, monochrome', qty: 1, rate: 50000 },
        { title: 'Brand Guidelines, Typography, Palette & Social Kit', desc: 'Comprehensive PDF brand book, digital design tokens, social starter templates', qty: 1, rate: 35000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Signature Brand Identity & Visual Language Masterplan',
      'Forging an iconic, unforgettable brand identity that commands respect, establishes market differentiation, and scales across digital and physical touchpoints.',
      [
        'Deep discovery analyzing industry competitors and aspirational aesthetics',
        'Three distinct creative directions presented in high-fidelity mockups',
        'Comprehensive vector logo suite with dark, light, and monochrome assets',
        'Curated typography hierarchy and accessibility-tested color palette',
        'Complete 30+ page brand guidelines manual and social launch asset kit'
      ],
      [
        { title: 'Phase 1: Creative Directions & Logo Exploration', duration: '10 Days', cost: 40000, deliverable: 'Three design concepts and chosen logo refinement' },
        { title: 'Phase 2: Brand Guidelines & Collateral Packaging', duration: '12 Days', cost: 45000, deliverable: 'Master brand book and full asset export package' }
      ],
      [
        { title: 'Brand Direction, Logo Architecture & Emblem Suite', rate: 50000 },
        { title: 'Brand Guidelines Manual & Digital Asset Kit', rate: 35000 }
      ]
    )
  },
  {
    id: 'core-video-production',
    title: 'Video Production (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Cinematic brand films, commercial product reveals, 3D motion graphics, and high-energy social cutdowns.',
    fullDescription: 'Commercial-grade video production with professional sound design, color grading, and dynamic editing tailored for premium brand elevation.',
    typicalDeliverables: ['Cinematic Brand Commercial', 'Vertical Social Cuts (9:16)', 'Sound Design & Professional SFX', 'Color Graded 4K Master Exports'],
    startingRate: 115000,
    duration: '3-4 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Commercial Video Production & Motion Package',
      [
        { title: 'Brand Commercial Direction, Production & 4K Edit', desc: 'Scriptwriting, cinematic editing, dynamic transitions, color grading master', qty: 1, rate: 75000 },
        { title: 'Sound Design, Motion Graphics & Social Cutdowns', desc: 'Licensed soundtrack, sound effects, 3 vertical (9:16) video cuts for ads', qty: 1, rate: 40000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Cinematic Commercial Video Production & Motion Graphics',
      'Producing high-impact video assets that captivate viewers, highlight product excellence, and drive emotional resonance across all channels.',
      [
        'Concept development, storyboard sketching, and persuasive scriptwriting',
        'Commercial-grade editing with fluid rhythm, motion typography, and pacing',
        'Hollywood-grade sound design, foley, and licensed musical score',
        'Professional color grading mastered for web, mobile, and display screens',
        'Delivery in 16:9 widescreen master and 9:16 vertical reels'
      ],
      [
        { title: 'Phase 1: Script, Storyboard & Creative Pre-Production', duration: '7 Days', cost: 35000, deliverable: 'Approved script and visual storyboard' },
        { title: 'Phase 2: Core Editing, Motion Graphics & Sound Design', duration: '12 Days', cost: 50000, deliverable: 'First rough cut review' },
        { title: 'Phase 3: Color Grade, Final Polish & Multi-Format Render', duration: '5 Days', cost: 30000, deliverable: '4K master exports and 3 social cutdowns' }
      ],
      [
        { title: 'Cinematic Direction, Video Editing & Motion Graphics', rate: 75000 },
        { title: 'Sound Design, Color Master & Multi-Format Exports', rate: 40000 }
      ]
    )
  },
  {
    id: 'core-whatsapp-marketing',
    title: 'WhatsApp Marketing',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Official WhatsApp Business API setup, broadcast campaigns, automated drip sequences, and green tick verification.',
    fullDescription: 'Harnessing the highest-open-rate channel in India with official WhatsApp Business API integration, broadcast templates, and chatbots.',
    typicalDeliverables: ['WhatsApp Business API Provisioning', 'Pre-Approved Message Templates', 'Automated Welcome & Drip Bots', 'Broadcast Campaign Execution'],
    startingRate: 35000,
    duration: '1-2 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'WhatsApp Business API & Marketing Suite',
      [
        { title: 'Official WhatsApp Business API Setup & Verification', desc: 'Meta Business Manager link, phone number provisioning, green tick prep', qty: 1, rate: 20000 },
        { title: 'Template Submission, Broadcast Engine & Automated Drips', desc: '5 Pre-approved message templates, welcome automation, cart recovery bot', qty: 1, rate: 15000 }
      ],
      '1. Meta conversation charges billed at actuals.\n2. Invoiced in INR + 18% GST.'
    ),
    defaultProposal: makeProposalPreset(
      'WhatsApp Business API & Conversational Marketing Strategy',
      'Unlocking 95%+ open rates with official WhatsApp Business marketing: automated customer notifications, verified broadcasts, and conversational sales bots.',
      [
        'Provisioning official WhatsApp Cloud API through Meta Business Manager',
        'Drafting and submitting high-converting message templates for Meta approval',
        'Building automated trigger sequences for new leads, cart recovery, and orders',
        'Setting up broadcast campaign segmentation adhering to Meta anti-spam policies',
        'Staff dashboard for two-way live chat handling and customer management'
      ],
      [
        { title: 'Sprint 1: API Provisioning & Template Approvals', duration: '5 Days', cost: 20000, deliverable: 'Verified WhatsApp API and approved templates' },
        { title: 'Sprint 2: Automation Flows & First Broadcast Drop', duration: '5 Days', cost: 15000, deliverable: 'Live automated drip bot and successful broadcast test' }
      ],
      [
        { title: 'WhatsApp Business API Provisioning & Verification', rate: 20000 },
        { title: 'Template Approvals, Broadcast Engine & Drip Bots', rate: 15000 }
      ]
    )
  },
  {
    id: 'core-sms-marketing',
    title: 'SMS Marketing',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'DLT-registered promotional and transactional SMS campaigns with instant delivery and high open rates across India.',
    fullDescription: 'High-speed bulk SMS and transactional SMS routing with strict TRAI/DLT compliance, sender ID provisioning, and conversion tracking.',
    typicalDeliverables: ['DLT Entity & Header Registration', 'Transactional & Promotional Templates', 'Automated SMS Triggers via API', 'Delivery & Click Analytics'],
    startingRate: 30000,
    duration: '1-2 weeks',
    defaultInvoice: makeInvoicePreset(
      'Compliant SMS Marketing & DLT Setup',
      [
        { title: 'DLT Entity, Header Registration & Template Approvals', desc: 'TRAI compliant entity approval, custom 6-character sender ID, template approvals', qty: 1, rate: 18000 },
        { title: 'SMS Gateway API Integration & Automated Triggers', desc: 'Webhook hooks for invoice alerts, OTPs, promotional broadcast engine', qty: 1, rate: 12000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Compliant SMS Marketing & Transactional Notification Engine',
      'Implementing reliable, DLT-compliant SMS marketing in India for time-sensitive promotions, customer verification, and transactional notifications.',
      [
        'Complete guidance through Indian TRAI DLT registration and header approval',
        'Drafting and securing approval for promotional and transactional SMS templates',
        'API integration connecting SMS triggers to your website and CRM',
        'Dynamic link shortener with click tracking and analytics',
        'Broadcast scheduling console with real-time delivery status reports'
      ],
      [
        { title: 'Sprint 1: DLT Compliance & Header Approval', duration: '5 Days', cost: 18000, deliverable: 'Approved DLT sender ID and registered templates' },
        { title: 'Sprint 2: Gateway Integration & Broadcast Setup', duration: '5 Days', cost: 12000, deliverable: 'Operational SMS sending engine with analytics' }
      ],
      [
        { title: 'DLT Entity, Header Registration & Compliance', rate: 18000 },
        { title: 'SMS Gateway API Hooks & Broadcast Dashboard', rate: 12000 }
      ]
    )
  },
  {
    id: 'core-ecommerce-solutions',
    title: 'E-Commerce Solutions (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Complete end-to-end e-commerce store architecture, payment gateway integration, catalog management, and conversion tuning.',
    fullDescription: 'Full-spectrum online store development engineered to maximize gross merchandise value (GMV), streamline shipping, and convert traffic.',
    typicalDeliverables: ['High-Performance Storefront', 'Integrated Payment Gateway', 'Logistics & Automated Shipping', 'Cart Recovery Funnel'],
    startingRate: 155000,
    duration: '5-7 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Core E-Commerce Flagship Build',
      [
        { title: 'Custom E-Commerce Store Architecture & Design', desc: 'Mobile-first product pages, smart cart, filtering, brand aesthetics', qty: 1, rate: 105000 },
        { title: 'Payment Gateways, Shipping API & Invoicing Automation', desc: 'Razorpay/Stripe, courier API sync, automated GST invoice PDF generation', qty: 1, rate: 50000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Digital Coyotes Core E-Commerce Storefront Architecture',
      'Building an owned, high-conversion e-commerce storefront designed to drive repeat purchases, lower checkout abandonment, and automate fulfillment.',
      [
        'Custom catalog architecture with lightning-fast faceted search',
        'Seamless payment integration supporting UPI, Net Banking, EMI, and Cards',
        'Automated logistics integration for real-time tracking numbers',
        'Automated abandoned cart recovery workflows via WhatsApp and Email',
        'Comprehensive training session for internal product catalog management'
      ],
      [
        { title: 'Phase 1: Storefront UX & Visual Design', duration: '10 Days', cost: 45000, deliverable: 'Figma storefront designs' },
        { title: 'Phase 2: Storefront Engineering & Gateways', duration: '20 Days', cost: 75000, deliverable: 'Staging store with live sandbox testing' },
        { title: 'Phase 3: Catalog Migration & Production Cutover', duration: '7 Days', cost: 35000, deliverable: 'Live e-commerce store taking real orders' }
      ],
      [
        { title: 'Storefront Architecture, Cart & Product Engine', rate: 105000 },
        { title: 'Payment Gateways, Courier APIs & Invoicing Suite', rate: 50000 }
      ]
    )
  },
  {
    id: 'core-mobile-apps-web-apps',
    title: 'Mobile Apps & Web Applications (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Integrated multi-platform ecosystem: cohesive web portal and native iOS/Android mobile applications sharing unified backend APIs.',
    fullDescription: 'The complete software package: provide customers and team members with seamless experiences across desktop web browsers and native mobile devices.',
    typicalDeliverables: ['Web Application Portal', 'iOS & Android Native Apps', 'Unified Cloud Backend & DB', 'Push Notifications & Webhooks'],
    startingRate: 220000,
    duration: '8-12 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Unified Web & Mobile Application Ecosystem',
      [
        { title: 'Responsive Web Application Portal & Admin Panel', desc: 'React/Next.js dashboard, role-based controls, data tables, analytics', qty: 1, rate: 120000 },
        { title: 'Cross-Platform Mobile App (iOS & Android)', desc: 'React Native mobile app, biometric auth, push notifications, unified API sync', qty: 1, rate: 100000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Unified Web & Mobile Application Ecosystem Engineering',
      'Architecting a synchronized digital ecosystem featuring a comprehensive web administration portal and customer-facing iOS and Android apps.',
      [
        'Centralized cloud backend API serving both web portal and mobile clients',
        'Responsive administrative web dashboard for business operations',
        'Cross-platform iOS and Android mobile app sharing state and auth tokens',
        'Real-time push notifications and websocket synchronization',
        'Publishing to Apple App Store, Google Play Store, and web domain'
      ],
      [
        { title: 'Phase 1: Unified Architecture & Wireframe Systems', duration: '14 Days', cost: 60000, deliverable: 'Unified web & mobile Figma prototypes' },
        { title: 'Phase 2: Core Engineering & Staging Synchronization', duration: '35 Days', cost: 110000, deliverable: 'Live web staging & TestFlight mobile builds' },
        { title: 'Phase 3: Security Audit, App Store Submission & Launch', duration: '14 Days', cost: 50000, deliverable: 'Live web app and published mobile apps' }
      ],
      [
        { title: 'Responsive Web Application & Admin Control Panel', rate: 120000 },
        { title: 'Cross-Platform Mobile App, Push Sync & Publishing', rate: 100000 }
      ]
    )
  },
  {
    id: 'core-crm-business-automation',
    title: 'CRM & Business Automation (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Combined CRM workflow engine: automated sales pipeline, email/WhatsApp sequences, and cross-departmental operations.',
    fullDescription: 'Connecting customer relationship management with end-to-end operational automation so zero human time is wasted on manual data shuffling.',
    typicalDeliverables: ['Automated CRM Pipeline', 'Multi-Channel Drip Sequences', 'Operational Task Automation', 'Executive KPI Dashboard'],
    startingRate: 110000,
    duration: '3-4 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Core CRM & Business Automation Integration',
      [
        { title: 'CRM Deal Pipeline Engineering & Assignment Rules', desc: 'Custom stages, lead qualification forms, round-robin rep distribution', qty: 1, rate: 65000 },
        { title: 'Automated Multi-Touch Drip & Operations Webhooks', desc: 'Email + WhatsApp follow-ups, internal task alerts, daily reporting', qty: 1, rate: 45000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Unified CRM Architecture & Business Automation System',
      'Supercharging your sales organization with automated pipeline management and cross-software workflows that maximize closing rates.',
      [
        'Custom CRM setup with bespoke deal stages and mandatory fields',
        'Instant multi-channel follow-ups via email and WhatsApp upon lead capture',
        'Automated task delegation and escalations when deals sit idle',
        'Integration with accounting, billing, and project management tools',
        'Staff training and documentation ensuring 100% adoption'
      ],
      [
        { title: 'Phase 1: Pipeline Audit & Logic Design', duration: '10 Days', cost: 55000, deliverable: 'Configured CRM pipeline and webhook flows' },
        { title: 'Phase 2: Automation Hardening & Live Deployment', duration: '14 Days', cost: 55000, deliverable: 'Active automated operations with zero dropped tasks' }
      ],
      [
        { title: 'CRM Deal Pipeline Engineering & Assignment Rules', rate: 65000 },
        { title: 'Automated Multi-Touch Follow-ups & Ops Webhooks', rate: 45000 }
      ]
    )
  },
  {
    id: 'core-ai-solutions-consulting',
    title: 'AI Solutions & Consulting (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'Custom AI agent deployment, RAG knowledge bases, prompt engineering, and executive AI adoption strategy.',
    fullDescription: 'Our signature AI service combining strategic roadmapping with custom model implementation to automate complex reasoning workflows.',
    typicalDeliverables: ['Custom AI Agents / RAG', 'System Prompt Suite', 'Executive Strategy Audit', 'Production AI Integration'],
    startingRate: 150000,
    duration: '4-6 weeks',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Core AI Solutions Package',
      [
        { title: 'Custom AI Agent Engineering & Vector RAG Pipeline', desc: 'Proprietary knowledge base ingestion, LLM fine-tuning, system guardrails', qty: 1, rate: 90000 },
        { title: 'Executive AI Strategy, API Integration & Team Enablement', desc: 'Connecting AI to core business apps, custom prompt library, staff training', qty: 1, rate: 60000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Enterprise AI Solutions, Agent Deployment & Strategic Consulting',
      'Implementing state-of-the-art generative AI systems directly into your business processes to automate customer inquiries, analysis, and content synthesis.',
      [
        'Ingestion and vectorization of proprietary company documents into a RAG knowledge base',
        'Deployment of autonomous AI agents capable of multi-step task execution',
        'Rigorous prompt engineering and hallucination guardrails',
        'Full API integration into existing software tools and internal chat channels',
        'Executive roadmap outlining ongoing AI capabilities and competitive moats'
      ],
      [
        { title: 'Phase 1: AI Knowledge Architecture & Model Calibration', duration: '12 Days', cost: 70000, deliverable: 'Trained RAG agent tested on real company benchmarks' },
        { title: 'Phase 2: System API Integration & Live Deployment', duration: '18 Days', cost: 80000, deliverable: 'Operational AI solution deployed in production' }
      ],
      [
        { title: 'Custom AI Agent Engineering & RAG Knowledge Pipeline', rate: 90000 },
        { title: 'API Integration, Guardrails & Executive Enablement', rate: 60000 }
      ]
    )
  },
  {
    id: 'core-lead-generation-systems',
    title: 'Lead Generation Systems (Core)',
    category: 'Core Digital Coyotes Offerings',
    shortDescription: 'End-to-end inbound customer acquisition: high-converting funnels, targeted ads, and instant WhatsApp/CRM sync.',
    fullDescription: 'Our all-inclusive lead generation engine engineered to provide a steady, predictable flow of qualified prospects directly to your sales calendar.',
    typicalDeliverables: ['High-Converting Lead Funnel', 'Targeted Ad Creative & Setup', 'Instant Speed-to-Lead Routing', 'Cost-Per-Lead Optimization'],
    startingRate: 80000,
    duration: 'Ongoing / Monthly',
    isPopular: true,
    defaultInvoice: makeInvoicePreset(
      'Digital Coyotes Core Lead Generation System',
      [
        { title: 'Lead Generation Funnel Architecture & Ad Campaign Setup', desc: 'Interactive lead quiz/form, targeted Meta/Google ads, copy variations', qty: 1, rate: 50000 },
        { title: 'Speed-to-Lead WhatsApp Alerts & CRM Synchronization', desc: 'Instant 10-second notifications to sales reps, lead scoring, monthly tuning', qty: 1, rate: 30000 }
      ]
    ),
    defaultProposal: makeProposalPreset(
      'Predictable Lead Generation & Inbound Acquisition Machine',
      'Building a dependable, automated lead generation engine that consistently feeds your sales pipeline with qualified decision-makers.',
      [
        'High-converting landing page with interactive qualification questions',
        'Targeted advertising campaigns across Meta and Google Search',
        'Instant lead alerts delivered to sales reps via WhatsApp within seconds',
        'Automatic CRM logging with source tracking and qualification score',
        'Continuous A/B testing of ad creatives, headlines, and audience segments'
      ],
      [
        { title: 'Month 1: Funnel Build, Ad Launch & Pipeline Automation', duration: '30 Days', cost: 80000, deliverable: 'Operational lead engine delivering qualified prospects' }
      ],
      [
        { title: 'Lead Funnel Architecture & Multi-Platform Ad Setup', rate: 50000 },
        { title: 'Speed-to-Lead Notifications & Continuous Optimization', rate: 30000 }
      ]
    )
  }
];
