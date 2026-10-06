import React, { useState, useEffect } from 'react';
import { 
  Client, 
  Invoice, 
  Proposal, 
  HistoryItem, 
  MailLog, 
  SmtpConfig, 
  SupabaseConfig, 
  UserProfile,
  ServiceItem 
} from './types';
import { 
  fetchClients, 
  saveClient, 
  removeClient, 
  fetchInvoices, 
  saveInvoice, 
  removeInvoice, 
  fetchProposals, 
  saveProposal, 
  removeProposal, 
  fetchHistory, 
  recordHistoryEvent,
  fetchMailLogs, 
  getStoredSmtpConfig, 
  saveStoredSmtpConfig, 
  getStoredSupabaseConfig, 
  saveStoredSupabaseConfig, 
  getStoredUserProfile, 
  saveStoredUserProfile 
} from './lib/supabase';
import { sendInvoiceViaPhpMailer, sendProposalViaPhpMailer } from './lib/phpMailer';

import { Navbar } from './components/Navbar';
import { DigiCoyoteLogo } from './components/Logo';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { InvoicePage } from './pages/InvoicePage';
import { ProposalPage } from './pages/ProposalPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  // Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    if (['/dashboard', '/clients', '/invoice', '/proposal', '/history', '/settings'].includes(path)) {
      return path;
    }
    return '/';
  });

  // Data state
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mailLogs, setMailLogs] = useState<MailLog[]>([]);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(getStoredSmtpConfig());
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile());

  // Modals & Transients
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);
  const [quickCreateInvoiceTrigger, setQuickCreateInvoiceTrigger] = useState<number>(0);
  const [quickCreateProposalTrigger, setQuickCreateProposalTrigger] = useState<number>(0);

  // Sync browser path on popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load from Supabase / Local storage
  useEffect(() => {
    async function loadData() {
      try {
        const [c, inv, p, h, m] = await Promise.all([
          fetchClients(),
          fetchInvoices(),
          fetchProposals(),
          fetchHistory(),
          fetchMailLogs()
        ]);
        setClients(c);
        setInvoices(inv);
        setProposals(p);
        setHistory(h);
        setMailLogs(m);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadData();
  }, []);

  // Client handlers
  const handleAddClient = async (client: Client) => {
    const saved = await saveClient(client);
    setClients(prev => [saved, ...prev]);
    await recordHistoryEvent({
      type: 'client_added',
      title: `Client Created: ${client.company || client.name}`,
      description: `Added ${client.name} (${client.company}) with ${client.activeServices.length} subscribed services.`,
      referenceId: client.id,
      actor: userProfile.name,
      statusBadge: 'Active'
    });
    setHistory(await fetchHistory());
  };

  const handleUpdateClient = async (client: Client) => {
    const saved = await saveClient(client);
    setClients(prev => prev.map(c => c.id === saved.id ? saved : c));
    await recordHistoryEvent({
      type: 'client_updated',
      title: `Client Updated: ${client.company || client.name}`,
      description: `Updated contact profile and active service preferences.`,
      referenceId: client.id,
      actor: userProfile.name
    });
    setHistory(await fetchHistory());
  };

  const handleDeleteClient = async (clientId: string) => {
    await removeClient(clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  // Invoice handlers
  const handleSaveInvoice = async (invoice: Invoice) => {
    const isNew = !invoices.some(i => i.id === invoice.id);
    const saved = await saveInvoice(invoice);
    setInvoices(prev => {
      const idx = prev.findIndex(i => i.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    if (isNew) {
      const curr = invoice.currency || '₹';
      await recordHistoryEvent({
        type: 'invoice_created',
        title: `Invoice Generated: ${invoice.invoiceNumber}`,
        description: `Billed ${invoice.clientName} for ${curr}${invoice.total.toLocaleString('en-IN')} due ${invoice.dueDate}.`,
        referenceId: invoice.id,
        actor: userProfile.name,
        statusBadge: invoice.status,
        amount: invoice.total
      });
      setHistory(await fetchHistory());
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    await removeInvoice(invoiceId);
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
  };

  // Proposal handlers
  const handleSaveProposal = async (proposal: Proposal) => {
    const isNew = !proposals.some(p => p.id === proposal.id);
    const saved = await saveProposal(proposal);
    setProposals(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    if (isNew) {
      const curr = proposal.currency || '₹';
      await recordHistoryEvent({
        type: 'proposal_created',
        title: `Proposal Drafted: ${proposal.proposalNumber}`,
        description: `Created proposal "${proposal.title}" for ${proposal.clientName} (${curr}${proposal.totalValue.toLocaleString('en-IN')}).`,
        referenceId: proposal.id,
        actor: userProfile.name,
        statusBadge: proposal.status,
        amount: proposal.totalValue
      });
      setHistory(await fetchHistory());
    }
  };

  const handleDeleteProposal = async (proposalId: string) => {
    await removeProposal(proposalId);
    setProposals(prev => prev.filter(p => p.id !== proposalId));
  };

  // PHPMailer actions
  const handleSendInvoiceViaMailer = async (invoice: Invoice) => {
    const res = await sendInvoiceViaPhpMailer(invoice, smtpConfig);
    setInvoices(await fetchInvoices());
    setHistory(await fetchHistory());
    setMailLogs(await fetchMailLogs());
    return res;
  };

  const handleSendProposalViaMailer = async (proposal: Proposal) => {
    const res = await sendProposalViaPhpMailer(proposal, smtpConfig);
    setProposals(await fetchProposals());
    setHistory(await fetchHistory());
    setMailLogs(await fetchMailLogs());
    return res;
  };

  // Convert proposal directly to invoice
  const handleConvertProposalToInvoice = async (proposal: Proposal) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: proposal.clientId,
      clientName: proposal.clientName,
      clientEmail: proposal.clientEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: (proposal.pricingItems && proposal.pricingItems.length > 0)
        ? proposal.pricingItems.map((p, idx) => ({
            id: `item-${Date.now()}-${idx}`,
            serviceTitle: p.title,
            description: p.title,
            quantity: p.quantity,
            rate: p.rate,
            discountPercent: p.discountPercent,
            taxPercent: p.taxPercent,
            amount: p.amount
          }))
        : proposal.milestones.map((m, idx) => ({
            id: `item-${Date.now()}-${idx}`,
            serviceTitle: m.title,
            description: m.deliverable,
            quantity: 1,
            rate: m.cost,
            amount: m.cost
          })),
      subtotal: proposal.totalValue,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: proposal.totalValue,
      currency: proposal.currency || '₹',
      status: 'pending',
      notes: `Generated from approved proposal ${proposal.proposalNumber}: "${proposal.title}". Payment terms: Net 14.`
    };

    await handleSaveInvoice(newInvoice);
    navigateTo('/invoice');
  };

  // Settings handlers
  const handleSaveSmtp = (config: SmtpConfig) => {
    setSmtpConfig(config);
    saveStoredSmtpConfig(config);
  };

  const handleSaveSupabase = (config: SupabaseConfig) => {
    setSupabaseConfig(config);
    saveStoredSupabaseConfig(config);
  };

  const handleSaveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    saveStoredUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenCreateInvoice={() => {
          navigateTo('/invoice');
          setQuickCreateInvoiceTrigger(Date.now());
        }}
        onOpenCreateProposal={() => {
          navigateTo('/proposal');
          setQuickCreateProposalTrigger(Date.now());
        }}
        supabaseConfig={supabaseConfig}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentPath === '/' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectServiceForInvoice={(svc) => {
              setPreselectedService(svc);
              navigateTo('/invoice');
            }}
            onSelectServiceForProposal={(svc) => {
              setPreselectedService(svc);
              navigateTo('/proposal');
            }}
          />
        )}

        {currentPath === '/dashboard' && (
          <DashboardPage
            clients={clients}
            invoices={invoices}
            proposals={proposals}
            history={history}
            smtpConfig={smtpConfig}
            supabaseConfig={supabaseConfig}
            onNavigate={navigateTo}
            onOpenCreateInvoice={() => navigateTo('/invoice')}
            onOpenCreateProposal={() => navigateTo('/proposal')}
            onSendInvoice={handleSendInvoiceViaMailer}
            onViewInvoice={() => navigateTo('/invoice')}
          />
        )}

        {currentPath === '/clients' && (
          <ClientsPage
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onCreateInvoiceForClient={(c) => {
              navigateTo('/invoice');
            }}
            onCreateProposalForClient={(c) => {
              navigateTo('/proposal');
            }}
            onSendDirectEmail={(c) => {
              navigateTo('/settings');
            }}
          />
        )}

        {currentPath === '/invoice' && (
          <InvoicePage
            invoices={invoices}
            clients={clients}
            smtpConfig={smtpConfig}
            onSaveInvoice={handleSaveInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onSendInvoiceViaMailer={handleSendInvoiceViaMailer}
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService(null)}
          />
        )}

        {currentPath === '/proposal' && (
          <ProposalPage
            proposals={proposals}
            clients={clients}
            smtpConfig={smtpConfig}
            onSaveProposal={handleSaveProposal}
            onDeleteProposal={handleDeleteProposal}
            onSendProposalViaMailer={handleSendProposalViaMailer}
            onConvertToInvoice={handleConvertProposalToInvoice}
            preselectedService={preselectedService}
            onClearPreselectedService={() => setPreselectedService(null)}
          />
        )}

        {currentPath === '/history' && (
          <HistoryPage
            history={history}
            mailLogs={mailLogs}
          />
        )}

        {currentPath === '/settings' && (
          <SettingsPage
            smtpConfig={smtpConfig}
            supabaseConfig={supabaseConfig}
            userProfile={userProfile}
            onSaveSmtpConfig={handleSaveSmtp}
            onSaveSupabaseConfig={handleSaveSupabase}
            onSaveUserProfile={handleSaveUserProfile}
          />
        )}
      </main>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        supabaseConfig={supabaseConfig}
        onUpdateProfile={handleSaveUserProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <DigiCoyoteLogo size={28} showText={true} />
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400">
              Digital Coyotes 2026 · Autonomous Agency Suite
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
            <button onClick={() => navigateTo('/')} className="hover:text-white transition-colors cursor-pointer">
              Overview
            </button>
            <button onClick={() => navigateTo('/dashboard')} className="hover:text-white transition-colors cursor-pointer">
              Dashboard
            </button>
            <button onClick={() => navigateTo('/clients')} className="hover:text-white transition-colors cursor-pointer">
              Clients
            </button>
            <button onClick={() => navigateTo('/invoice')} className="hover:text-white transition-colors cursor-pointer">
              Invoices
            </button>
            <button onClick={() => navigateTo('/proposal')} className="hover:text-white transition-colors cursor-pointer">
              Proposals
            </button>
            <button onClick={() => navigateTo('/history')} className="hover:text-white transition-colors cursor-pointer">
              History
            </button>
            <button onClick={() => navigateTo('/settings')} className="hover:text-white transition-colors cursor-pointer">
              Settings & PHP
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            PHP Mailer 6.9 · Supabase PostgreSQL · Three.js 3D
          </div>
        </div>
      </footer>
    </div>
  );
}
