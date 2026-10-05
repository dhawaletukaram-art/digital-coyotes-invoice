import { Client, Invoice, Proposal, HistoryItem, MailLog, SmtpConfig, SupabaseConfig } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Elena Rostova',
    company: 'Apex Autonomous Labs',
    email: 'elena@apexautonomous.io',
    phone: '+91 98201 54321',
    location: 'Bengaluru, KA',
    activeServices: ['Generative AI', 'Web Design & Development', 'Interactive Website Redesign'],
    totalBilled: 270000,
    status: 'active',
    notes: 'Key client for autonomous robotics perception suite; prefers monthly invoice cycle.',
    createdAt: '2026-01-14T09:30:00Z'
  },
  {
    id: 'cli-002',
    name: 'Marcus Vance',
    company: 'Vanguard Media Group',
    email: 'marcus@vanguardmedia.com',
    phone: '+91 99100 87654',
    location: 'Mumbai, MH',
    activeServices: ['Branding & Social Media', 'Social & Google Ads', 'Video Production'],
    totalBilled: 212400,
    status: 'active',
    notes: 'Q3 national ad blitz underway; requires PHPMailer automated weekly summary reports.',
    createdAt: '2026-01-20T14:15:00Z'
  },
  {
    id: 'cli-003',
    name: 'Sophia Chen',
    company: 'Solaria Energy Tech',
    email: 'sophia@solariaenergy.co',
    phone: '+91 97400 12345',
    location: 'Hyderabad, TS',
    activeServices: ['Search Engine Optimization', 'UX/UI Design', 'Data Analytics'],
    totalBilled: 155000,
    status: 'active',
    notes: 'Clean energy commercial solar portal redesign; reviewing proposal for dynamic web app.',
    createdAt: '2026-02-02T11:00:00Z'
  },
  {
    id: 'cli-004',
    name: 'Darius Thorne',
    company: 'Krypton Web3 Studio',
    email: 'darius@krypton.network',
    phone: '+91 98860 98765',
    location: 'Gurugram, HR',
    activeServices: ['Web3 Development', 'Dynamic Digital Campaign'],
    totalBilled: 175000,
    status: 'active',
    notes: 'Decentralized exchange aggregator launch; invoice pending final escrow milestone.',
    createdAt: '2026-02-18T16:45:00Z'
  },
  {
    id: 'cli-005',
    name: 'Chloe Monet',
    company: 'UrbanPulse Fashion',
    email: 'chloe@urbanpulse.fr',
    phone: '+91 91234 56789',
    location: 'New Delhi, DL',
    activeServices: ['Dynamic E-Commerce Platform', 'Creative Content Production'],
    totalBilled: 95000,
    status: 'lead',
    notes: 'Direct-to-consumer luxury streetwear label looking for high-performance e-commerce.',
    createdAt: '2026-03-01T10:20:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-001',
    clientId: 'cli-001',
    clientName: 'Apex Autonomous Labs',
    clientEmail: 'elena@apexautonomous.io',
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    items: [
      {
        id: 'item-1',
        serviceTitle: 'Interactive Website Redesign',
        description: 'Complete 3D WebGL scene architecture and responsive interface overhaul.',
        quantity: 1,
        rate: 135000,
        amount: 135000
      },
      {
        id: 'item-2',
        serviceTitle: 'Generative AI',
        description: 'Custom neural embedding vector pipeline & assistant interface integration.',
        quantity: 1,
        rate: 145000,
        amount: 145000
      }
    ],
    subtotal: 280000,
    taxRate: 0,
    taxAmount: 0,
    discount: 10000,
    total: 270000,
    currency: '₹',
    status: 'paid',
    paymentMethod: 'Wire Transfer / NEFT / IMPS',
    paidAt: '2026-03-12T15:20:00Z',
    notes: 'Thank you for partnering with DigiCoyotes! All deliverables deployed to production.',
    lastSentAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-002',
    clientId: 'cli-002',
    clientName: 'Vanguard Media Group',
    clientEmail: 'marcus@vanguardmedia.com',
    issueDate: '2026-03-15',
    dueDate: '2026-03-29',
    items: [
      {
        id: 'item-3',
        serviceTitle: 'Social & Google Ads',
        description: 'Multi-variant advertising campaigns across Meta, Google Ads, and YouTube.',
        quantity: 1,
        rate: 65000,
        amount: 65000
      },
      {
        id: 'item-4',
        serviceTitle: 'Video Production',
        description: '4K Commercial product cut, 9:16 vertical reels, and color grading suite.',
        quantity: 1,
        rate: 115000,
        amount: 115000
      }
    ],
    subtotal: 180000,
    taxRate: 18,
    taxAmount: 32400,
    discount: 0,
    total: 212400,
    currency: '₹',
    status: 'pending',
    notes: 'Payment net-14 terms. Dispatched via PHPMailer with automated payment gateway link.',
    lastSentAt: '2026-03-15T09:15:00Z'
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2026-003',
    clientId: 'cli-003',
    clientName: 'Solaria Energy Tech',
    clientEmail: 'sophia@solariaenergy.co',
    issueDate: '2026-02-15',
    dueDate: '2026-03-01',
    items: [
      {
        id: 'item-5',
        serviceTitle: 'UX/UI Design',
        description: 'Comprehensive enterprise solar telemetry platform Figma design system.',
        quantity: 1,
        rate: 110000,
        amount: 110000
      },
      {
        id: 'item-6',
        serviceTitle: 'Search Engine Optimization',
        description: 'B2B Technical schema optimization, Core Web Vitals, and backlink audit.',
        quantity: 1,
        rate: 45000,
        amount: 45000
      }
    ],
    subtotal: 155000,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 155000,
    currency: '₹',
    status: 'overdue',
    notes: 'Friendly reminder sent via PHPMailer automated queue. Contact billing@digicoyotes.com.',
    lastSentAt: '2026-03-02T08:00:00Z'
  },
  {
    id: 'inv-1004',
    invoiceNumber: 'INV-2026-004',
    clientId: 'cli-004',
    clientName: 'Krypton Web3 Studio',
    clientEmail: 'darius@krypton.network',
    issueDate: '2026-03-22',
    dueDate: '2026-04-05',
    items: [
      {
        id: 'item-7',
        serviceTitle: 'Web3 Development',
        description: 'Smart contract development, audited liquidity router, and wagmi wallet integration.',
        quantity: 1,
        rate: 175000,
        amount: 175000
      }
    ],
    subtotal: 175000,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    total: 175000,
    currency: '₹',
    status: 'draft',
    notes: 'Draft awaiting final testnet contract verification before customer billing.'
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-2001',
    proposalNumber: 'PROP-2026-081',
    title: 'Enterprise AI & Next-Gen Spatial Brand Overhaul',
    clientId: 'cli-001',
    clientName: 'Apex Autonomous Labs',
    clientEmail: 'elena@apexautonomous.io',
    services: ['Web Design & Development', 'Generative AI', 'Interactive Website Redesign', 'Branding & Social Media'],
    summary: 'A complete end-to-end digital repositioning establishing Apex as the market authority in autonomous vision technology.',
    scopeOfWork: [
      'Architect full brand guidelines and geometric 3D visual language.',
      'Develop reactive Next.js / PHP-backed portal with Three.js interactive 3D simulations.',
      'Integrate enterprise LLM reasoning pipelines with customer document intelligence.'
    ],
    milestones: [
      { id: 'm-1', title: 'Phase 1: Brand Strategy & 3D Spatial Wireframes', duration: '2 Weeks', cost: 110000, deliverable: 'Figma System & 3D Prototypes' },
      { id: 'm-2', title: 'Phase 2: Full-Stack Engineering & WebGL Canvas', duration: '4 Weeks', cost: 180000, deliverable: 'Deployed Staging Web Application' },
      { id: 'm-3', title: 'Phase 3: Generative AI Suite & Production Launch', duration: '2 Weeks', cost: 100000, deliverable: 'Live Production with Zero-Downtime' }
    ],
    totalValue: 390000,
    currency: '₹',
    validUntil: '2026-04-30',
    status: 'approved',
    sentAt: '2026-02-10T11:00:00Z',
    approvedAt: '2026-02-14T14:30:00Z'
  },
  {
    id: 'prop-2002',
    proposalNumber: 'PROP-2026-082',
    title: 'Omni-Channel Brand Acceleration & Social Ads Campaign',
    clientId: 'cli-002',
    clientName: 'Vanguard Media Group',
    clientEmail: 'marcus@vanguardmedia.com',
    services: ['Social & Google Ads', 'Video Production', 'Influencer Marketing', 'Dynamic Digital Campaign'],
    summary: 'National advertising blitz across high-yield digital channels to drive 300% growth in qualified pipeline within 90 days.',
    scopeOfWork: [
      'Produce 12 cinematic commercial spots and 40 social cutdowns.',
      'Configure automated ROAS-optimized bidding algorithms across Meta and Google.',
      'Orchestrate 15 tier-1 creator sponsorships with tracked attribution.'
    ],
    milestones: [
      { id: 'm-4', title: 'Sprint 1: Content Production & Video Shoot', duration: '3 Weeks', cost: 125000, deliverable: '4K Commercial Suite' },
      { id: 'm-5', title: 'Sprint 2: Channel Setup & Ad Testing Blitz', duration: '3 Weeks', cost: 95000, deliverable: 'Live Multi-variant Ad Runs' },
      { id: 'm-6', title: 'Sprint 3: Influencer Seeding & Scaling', duration: '4 Weeks', cost: 110000, deliverable: 'Creator Content Library & Attribution' }
    ],
    totalValue: 330000,
    currency: '₹',
    validUntil: '2026-04-15',
    status: 'sent',
    sentAt: '2026-03-10T16:00:00Z'
  },
  {
    id: 'prop-2003',
    proposalNumber: 'PROP-2026-083',
    title: 'Global Dynamic E-Commerce & Creative Production',
    clientId: 'cli-005',
    clientName: 'UrbanPulse Fashion',
    clientEmail: 'chloe@urbanpulse.fr',
    services: ['Dynamic E-Commerce Platform', 'Creative Content Production', 'Email Marketing'],
    summary: 'Transforming luxury streetwear D2C storefront with sub-second page loads, 3D clothing viewports, and automated PHPMailer VIP retention sequences.',
    scopeOfWork: [
      'Custom headless e-commerce engineering with instant multi-currency checkout.',
      'Studio 3D asset pipeline for interactive garment inspection.',
      'Automated email lifecycle flows for VIP drops and abandoned carts.'
    ],
    milestones: [
      { id: 'm-7', title: 'Milestone 1: Storefront Architecture & Checkout', duration: '4 Weeks', cost: 155000, deliverable: 'Functional Staging Store' },
      { id: 'm-8', title: 'Milestone 2: 3D Asset Renders & Email Flows', duration: '3 Weeks', cost: 115000, deliverable: 'Complete Product Assets & Lifecycle Setup' }
    ],
    totalValue: 270000,
    currency: '₹',
    validUntil: '2026-05-01',
    status: 'draft'
  }
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-001',
    timestamp: '2026-03-24T10:14:00Z',
    type: 'email_dispatched',
    title: 'PHPMailer Dispatched: Invoice INV-2026-002',
    description: 'Automated SMTP email sent to Marcus Vance (Vanguard Media Group) with PDF invoice attachment and secure pay link.',
    referenceId: 'inv-1002',
    actor: 'PHPMailer v6.9 Daemon',
    statusBadge: 'Delivered',
    amount: 212400
  },
  {
    id: 'hist-002',
    timestamp: '2026-03-22T14:30:00Z',
    type: 'invoice_created',
    title: 'Draft Invoice Generated: INV-2026-004',
    description: 'New invoice draft created for Krypton Web3 Studio covering Web3 Development milestones.',
    referenceId: 'inv-1004',
    actor: 'Agency Admin',
    statusBadge: 'Draft',
    amount: 175000
  },
  {
    id: 'hist-003',
    timestamp: '2026-03-12T15:20:00Z',
    type: 'invoice_paid',
    title: 'Payment Received: INV-2026-001',
    description: 'Apex Autonomous Labs cleared invoice balance of ₹2,70,000 via Wire Transfer / NEFT / IMPS.',
    referenceId: 'inv-1001',
    actor: 'Stripe / Bank Sync',
    statusBadge: 'Paid',
    amount: 270000
  },
  {
    id: 'hist-004',
    timestamp: '2026-03-10T16:00:00Z',
    type: 'proposal_sent',
    title: 'Proposal Delivered: PROP-2026-082',
    description: 'Omni-channel marketing proposal sent to Vanguard Media Group via PHPMailer SMTP client.',
    referenceId: 'prop-2002',
    actor: 'Project Lead',
    statusBadge: 'Sent',
    amount: 330000
  },
  {
    id: 'hist-005',
    timestamp: '2026-02-14T14:30:00Z',
    type: 'proposal_approved',
    title: 'Proposal Accepted: PROP-2026-081',
    description: 'Elena Rostova digitally signed and approved Enterprise AI Overhaul proposal (₹3,90,000 total).',
    referenceId: 'prop-2001',
    actor: 'Client (Elena Rostova)',
    statusBadge: 'Approved',
    amount: 390000
  },
  {
    id: 'hist-006',
    timestamp: '2026-01-20T14:15:00Z',
    type: 'client_added',
    title: 'Client Profile Created: Vanguard Media Group',
    description: 'New client onboarded into Digital Coyotes directory with 3 active service packages.',
    referenceId: 'cli-002',
    actor: 'Agency Admin',
    statusBadge: 'Active'
  }
];

export const INITIAL_MAIL_LOGS: MailLog[] = [
  {
    id: 'mail-001',
    timestamp: '2026-03-24T10:14:02Z',
    recipient: 'marcus@vanguardmedia.com',
    recipientName: 'Marcus Vance',
    subject: '[Digital Coyotes] Invoice INV-2026-002 Ready for Settlement',
    templateType: 'invoice',
    status: 'sent',
    smtpHost: 'smtp.gmail.com:587 (TLS)',
    response: '250 2.0.0 Ok: queued via PHPMailer',
    phpMailerHeader: 'X-Mailer: PHPMailer 6.9.1 (Digital Coyotes Engine)',
    bodySnippet: 'Dear Marcus, your invoice for Social & Google Ads and Video Production is ready for review...'
  },
  {
    id: 'mail-002',
    timestamp: '2026-03-10T16:00:44Z',
    recipient: 'marcus@vanguardmedia.com',
    recipientName: 'Marcus Vance',
    subject: '[Digital Coyotes] New Proposal: Omni-Channel Brand Acceleration',
    templateType: 'proposal',
    status: 'sent',
    smtpHost: 'smtp.gmail.com:587 (TLS)',
    response: '250 2.0.0 Ok: queued via PHPMailer',
    phpMailerHeader: 'X-Mailer: PHPMailer 6.9.1 (Digital Coyotes Engine)',
    bodySnippet: 'Hi Marcus, please review our comprehensive growth roadmap including 4K commercial reels and Meta ad blitz...'
  },
  {
    id: 'mail-003',
    timestamp: '2026-03-02T08:00:15Z',
    recipient: 'sophia@solariaenergy.co',
    recipientName: 'Sophia Chen',
    subject: '[Digital Coyotes] Account Statement Notice: INV-2026-003',
    templateType: 'reminder',
    status: 'sent',
    smtpHost: 'smtp.gmail.com:587 (TLS)',
    response: '250 2.0.0 Ok: queued via PHPMailer',
    phpMailerHeader: 'X-Mailer: PHPMailer 6.9.1 (Digital Coyotes Engine)',
    bodySnippet: 'Dear Sophia, this is a courteous follow-up regarding invoice INV-2026-003 for UX/UI Design...'
  }
];

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  username: 'thedigitalcoyotes@gmail.com',
  password: '',
  fromEmail: 'thedigitalcoyotes@gmail.com',
  fromName: 'Digital Coyotes Agency Dispatch',
  replyTo: 'thedigitalcoyotes@gmail.com',
  phpMailerVersion: 'PHPMailer v6.9.1 / Gmail SMTP Engine',
  isConfigured: true
};

export const DEFAULT_SUPABASE_CONFIG: SupabaseConfig = {
  url: 'https://cz6b4sd3khbqyn3bwioef3.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6NmI0c2Qza2hicXluM2J3aW9lZjMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODE0MDAwMCwiZXhwIjoyMDUzNzE2MDAwfQ.demo_token_digicoyotes',
  isConnected: true,
  mode: 'fallback_local',
  lastPing: '2026-03-24T11:00:00Z'
};
