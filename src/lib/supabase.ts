import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Client, 
  Invoice, 
  Proposal, 
  HistoryItem, 
  MailLog, 
  SmtpConfig, 
  SupabaseConfig,
  UserProfile 
} from '../types';
import { 
  INITIAL_CLIENTS, 
  INITIAL_INVOICES, 
  INITIAL_PROPOSALS, 
  INITIAL_HISTORY, 
  INITIAL_MAIL_LOGS,
  DEFAULT_SMTP_CONFIG, 
  DEFAULT_SUPABASE_CONFIG 
} from '../data/initialData';

const STORAGE_KEYS = {
  CLIENTS: 'vinshare_clients',
  INVOICES: 'vinshare_invoices',
  PROPOSALS: 'vinshare_proposals',
  HISTORY: 'vinshare_history',
  MAIL_LOGS: 'vinshare_mail_logs',
  SMTP_CONFIG: 'vinshare_smtp_config',
  SUPABASE_CONFIG: 'vinshare_supabase_config',
  USER_PROFILE: 'vinshare_user_profile'
};

// Singleton Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  const currentConfig = config || getStoredSupabaseConfig();
  if (!currentConfig.url || !currentConfig.anonKey || currentConfig.mode === 'fallback_local') {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(currentConfig.url, currentConfig.anonKey);
    }
    return supabaseInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function resetSupabaseClient(config: SupabaseConfig) {
  try {
    if (config.url && config.anonKey) {
      supabaseInstance = createClient(config.url, config.anonKey);
    } else {
      supabaseInstance = null;
    }
  } catch (err) {
    supabaseInstance = null;
  }
}

// Local Storage helpers
const INR_MIGRATION_KEY = 'dc_inr_currency_v2';
function runInrMigrationIfNeeded(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.getItem(INR_MIGRATION_KEY) !== 'migrated') {
        localStorage.removeItem(STORAGE_KEYS.CLIENTS);
        localStorage.removeItem(STORAGE_KEYS.INVOICES);
        localStorage.removeItem(STORAGE_KEYS.PROPOSALS);
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.setItem(INR_MIGRATION_KEY, 'migrated');
      }
    }
  } catch (e) {
    // safely ignore storage exceptions
  }
}
runInrMigrationIfNeeded();

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// Configuration handlers
export function getStoredSupabaseConfig(): SupabaseConfig {
  return getFromStorage<SupabaseConfig>(STORAGE_KEYS.SUPABASE_CONFIG, DEFAULT_SUPABASE_CONFIG);
}

export function saveStoredSupabaseConfig(config: SupabaseConfig): void {
  setToStorage(STORAGE_KEYS.SUPABASE_CONFIG, config);
  resetSupabaseClient(config);
}

export function getStoredSmtpConfig(): SmtpConfig {
  const config = getFromStorage<SmtpConfig>(STORAGE_KEYS.SMTP_CONFIG, DEFAULT_SMTP_CONFIG);
  if (!config.host || config.host === 'smtp.digitalcoyotes-mailer.net') {
    config.host = 'smtp.gmail.com';
    config.port = 587;
    config.username = 'thedigitalcoyotes@gmail.com';
    config.fromEmail = 'thedigitalcoyotes@gmail.com';
    config.replyTo = 'thedigitalcoyotes@gmail.com';
  }
  return config;
}

export function saveStoredSmtpConfig(config: SmtpConfig): void {
  setToStorage(STORAGE_KEYS.SMTP_CONFIG, config);
}

export function getStoredUserProfile(): UserProfile {
  const profile = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, {
    id: 'usr-admin-01',
    email: 'thedigitalcoyotes@gmail.com',
    name: 'Digital Coyotes Admin',
    role: 'agency_admin',
    avatarInitials: 'DC'
  });
  // Ensure thedigitalcoyotes@gmail.com is defaulted if prior placeholder was loaded
  if (!profile.email || profile.email === 'dhawale.tukaram@gmail.com') {
    profile.email = 'thedigitalcoyotes@gmail.com';
    profile.name = 'Digital Coyotes Admin';
    profile.avatarInitials = 'DC';
  }
  return profile;
}

export function saveStoredUserProfile(profile: UserProfile): void {
  setToStorage(STORAGE_KEYS.USER_PROFILE, profile);
}

// Data Access Layer: Clients
export async function fetchClients(): Promise<Client[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('clients').select('*').order('name');
      if (!error && data && data.length > 0) {
        return data as Client[];
      }
    } catch (e) {
      console.warn('Supabase fetchClients error, using local state:', e);
    }
  }
  return getFromStorage<Client[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
}

export async function saveClient(clientData: Client): Promise<Client> {
  const current = await fetchClients();
  const existingIndex = current.findIndex(c => c.id === clientData.id);
  let updatedList: Client[];

  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = clientData;
  } else {
    updatedList = [clientData, ...current];
  }

  setToStorage(STORAGE_KEYS.CLIENTS, updatedList);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').upsert(clientData);
    } catch (e) {
      console.warn('Supabase client upsert error:', e);
    }
  }

  return clientData;
}

export async function removeClient(clientId: string): Promise<void> {
  const current = await fetchClients();
  const filtered = current.filter(c => c.id !== clientId);
  setToStorage(STORAGE_KEYS.CLIENTS, filtered);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').delete().eq('id', clientId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }
}

// Data Access Layer: Invoices
export async function fetchInvoices(): Promise<Invoice[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('invoices').select('*').order('issueDate', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Invoice[];
      }
    } catch (e) {
      console.warn('Supabase fetchInvoices error, using local state:', e);
    }
  }
  return getFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
}

export async function saveInvoice(invoiceData: Invoice): Promise<Invoice> {
  const current = await fetchInvoices();
  const existingIndex = current.findIndex(i => i.id === invoiceData.id);
  let updatedList: Invoice[];

  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = invoiceData;
  } else {
    updatedList = [invoiceData, ...current];
  }

  setToStorage(STORAGE_KEYS.INVOICES, updatedList);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('invoices').upsert(invoiceData);
    } catch (e) {
      console.warn('Supabase invoice upsert error:', e);
    }
  }

  return invoiceData;
}

export async function removeInvoice(invoiceId: string): Promise<void> {
  const current = await fetchInvoices();
  const filtered = current.filter(i => i.id !== invoiceId);
  setToStorage(STORAGE_KEYS.INVOICES, filtered);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('invoices').delete().eq('id', invoiceId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }
}

// Data Access Layer: Proposals
export async function fetchProposals(): Promise<Proposal[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('proposals').select('*').order('proposalNumber', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Proposal[];
      }
    } catch (e) {
      console.warn('Supabase fetchProposals error, using local state:', e);
    }
  }
  return getFromStorage<Proposal[]>(STORAGE_KEYS.PROPOSALS, INITIAL_PROPOSALS);
}

export async function saveProposal(proposalData: Proposal): Promise<Proposal> {
  const current = await fetchProposals();
  const existingIndex = current.findIndex(p => p.id === proposalData.id);
  let updatedList: Proposal[];

  if (existingIndex >= 0) {
    updatedList = [...current];
    updatedList[existingIndex] = proposalData;
  } else {
    updatedList = [proposalData, ...current];
  }

  setToStorage(STORAGE_KEYS.PROPOSALS, updatedList);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('proposals').upsert(proposalData);
    } catch (e) {
      console.warn('Supabase proposal upsert error:', e);
    }
  }

  return proposalData;
}

export async function removeProposal(proposalId: string): Promise<void> {
  const current = await fetchProposals();
  const filtered = current.filter(p => p.id !== proposalId);
  setToStorage(STORAGE_KEYS.PROPOSALS, filtered);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('proposals').delete().eq('id', proposalId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }
}

// Data Access Layer: History Audit Log
export async function fetchHistory(): Promise<HistoryItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('history').select('*').order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as HistoryItem[];
      }
    } catch (e) {
      console.warn('Supabase fetchHistory error:', e);
    }
  }
  return getFromStorage<HistoryItem[]>(STORAGE_KEYS.HISTORY, INITIAL_HISTORY);
}

export async function recordHistoryEvent(item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem> {
  const newEvent: HistoryItem = {
    ...item,
    id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };

  const current = await fetchHistory();
  const updated = [newEvent, ...current];
  setToStorage(STORAGE_KEYS.HISTORY, updated);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('history').insert(newEvent);
    } catch (e) {
      console.warn('Supabase history insert error:', e);
    }
  }

  return newEvent;
}

// Data Access Layer: Mail Logs
export async function fetchMailLogs(): Promise<MailLog[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('mail_logs').select('*').order('timestamp', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as MailLog[];
      }
    } catch (e) {
      console.warn('Supabase fetchMailLogs error:', e);
    }
  }
  return getFromStorage<MailLog[]>(STORAGE_KEYS.MAIL_LOGS, INITIAL_MAIL_LOGS);
}

export async function recordMailLog(log: Omit<MailLog, 'id' | 'timestamp'>): Promise<MailLog> {
  const newLog: MailLog = {
    ...log,
    id: `mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString()
  };

  const current = await fetchMailLogs();
  const updated = [newLog, ...current];
  setToStorage(STORAGE_KEYS.MAIL_LOGS, updated);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('mail_logs').insert(newLog);
    } catch (e) {
      console.warn('Supabase mail_logs insert error:', e);
    }
  }

  return newLog;
}

// SQL Schema Generator for Supabase
export const SUPABASE_SQL_SCHEMA = `-- Digital Coyotes Supabase PostgreSQL Schema
-- Paste this script into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  "activeServices" TEXT[] DEFAULT '{}',
  "totalBilled" NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  "invoiceNumber" TEXT NOT NULL UNIQUE,
  "clientId" TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  "clientName" TEXT NOT NULL,
  "clientEmail" TEXT NOT NULL,
  "issueDate" DATE NOT NULL,
  "dueDate" DATE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  "taxRate" NUMERIC NOT NULL DEFAULT 0,
  "taxAmount" NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  "paymentMethod" TEXT,
  "paidAt" TIMESTAMPTZ,
  notes TEXT,
  "lastSentAt" TIMESTAMPTZ
);

-- 4. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
  id TEXT PRIMARY KEY,
  "proposalNumber" TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  "clientId" TEXT REFERENCES public.clients(id) ON DELETE SET NULL,
  "clientName" TEXT NOT NULL,
  "clientEmail" TEXT NOT NULL,
  services TEXT[] DEFAULT '{}',
  summary TEXT,
  "scopeOfWork" TEXT[] DEFAULT '{}',
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  "totalValue" NUMERIC NOT NULL DEFAULT 0,
  "validUntil" DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  "sentAt" TIMESTAMPTZ,
  "approvedAt" TIMESTAMPTZ
);

-- 5. History Audit Logs Table
CREATE TABLE IF NOT EXISTS public.history (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "referenceId" TEXT,
  actor TEXT NOT NULL,
  "statusBadge" TEXT,
  amount NUMERIC
);

-- 6. PHPMailer Dispatch Logs Table
CREATE TABLE IF NOT EXISTS public.mail_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  recipient TEXT NOT NULL,
  "recipientName" TEXT NOT NULL,
  subject TEXT NOT NULL,
  "templateType" TEXT NOT NULL,
  status TEXT NOT NULL,
  "smtpHost" TEXT NOT NULL,
  response TEXT NOT NULL,
  "phpMailerHeader" TEXT NOT NULL,
  "bodySnippet" TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated and anon access with valid policies
CREATE POLICY "Public Read/Write for Digital Coyotes App" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Digital Coyotes Invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Digital Coyotes Proposals" ON public.proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Digital Coyotes History" ON public.history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Digital Coyotes MailLogs" ON public.mail_logs FOR ALL USING (true) WITH CHECK (true);
`;
