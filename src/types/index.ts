export type ServiceCategory = 
  | 'Website Development'
  | 'Social Media Marketing'
  | 'Performance Marketing'
  | 'SEO, EO, GEO & Online Visibility'
  | 'AI & Automation Solutions'
  | 'Software & Application Development'
  | 'Core Digital Coyotes Offerings'
  | 'Brand & Strategy'
  | 'Design & Creative'
  | 'Development & AI'
  | 'Marketing & Media';

export interface ServiceInvoicePreset {
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  taxRate?: number;
}

export interface ServiceProposalPreset {
  title: string;
  summary: string;
  scopeOfWork: string[];
  sections: ProposalSection[];
  milestones: ProposalMilestone[];
  pricingItems?: ProposalPricingItem[];
  terms?: string;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  typicalDeliverables: string[];
  startingRate: number; // in INR (₹ Indian Rupees)
  duration: string;
  isPopular?: boolean;
  defaultInvoice?: ServiceInvoicePreset;
  defaultProposal?: ServiceProposalPreset;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  activeServices: string[];
  totalBilled: number;
  status: 'active' | 'lead' | 'inactive';
  notes: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  serviceTitle: string;
  description: string;
  quantity: number;
  rate: number;
  discountPercent?: number;
  taxPercent?: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency?: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  paymentMethod?: string;
  paidAt?: string;
  notes?: string;
  terms?: string;
  lastSentAt?: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface ProposalPricingItem {
  id: string;
  title: string;
  quantity: number;
  rate: number;
  discountPercent: number;
  taxPercent: number;
  amount: number;
}

export interface ProposalMilestone {
  id: string;
  title: string;
  duration: string;
  cost: number;
  deliverable: string;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  services: string[];
  summary: string;
  sections?: ProposalSection[];
  pricingItems?: ProposalPricingItem[];
  scopeOfWork: string[];
  milestones: ProposalMilestone[];
  totalValue: number;
  validUntil: string;
  currency?: string;
  terms?: string;
  notes?: string;
  status: 'draft' | 'sent' | 'approved' | 'declined';
  sentAt?: string;
  approvedAt?: string;
}

export type HistoryEventType = 
  | 'invoice_created'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'proposal_created'
  | 'proposal_sent'
  | 'proposal_approved'
  | 'client_added'
  | 'client_updated'
  | 'email_dispatched'
  | 'system';

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: HistoryEventType;
  title: string;
  description: string;
  referenceId?: string;
  actor: string;
  statusBadge?: string;
  amount?: number;
}

export interface MailLog {
  id: string;
  timestamp: string;
  recipient: string;
  recipientName: string;
  subject: string;
  templateType: 'invoice' | 'proposal' | 'reminder' | 'welcome' | 'custom';
  status: 'sent' | 'queued' | 'failed';
  smtpHost: string;
  response: string;
  phpMailerHeader: string;
  bodySnippet: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  phpMailerVersion: string;
  isConfigured: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  mode: 'live' | 'fallback_local';
  lastPing?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'agency_admin' | 'project_manager' | 'client';
  avatarInitials: string;
}
