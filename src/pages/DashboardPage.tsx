import React from 'react';
import { Client, Invoice, Proposal, HistoryItem, SmtpConfig, SupabaseConfig } from '../types';
import { Card3D } from '../components/Card3D';
import { Coyote3D } from '../components/Coyote3D';
import { 
  IndianRupee, 
  Clock, 
  FileCheck, 
  Users, 
  Send, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Mail,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  clients: Client[];
  invoices: Invoice[];
  proposals: Proposal[];
  history: HistoryItem[];
  smtpConfig: SmtpConfig;
  supabaseConfig: SupabaseConfig;
  onNavigate: (path: string) => void;
  onOpenCreateInvoice: () => void;
  onOpenCreateProposal: () => void;
  onSendInvoice: (invoice: Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  clients,
  invoices,
  proposals,
  history,
  smtpConfig,
  supabaseConfig,
  onNavigate,
  onOpenCreateInvoice,
  onOpenCreateProposal,
  onSendInvoice,
  onViewInvoice
}) => {
  // Compute Key Metrics
  const totalPaidRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = invoices
    .filter(i => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const proposalPipeline = proposals
    .filter(p => p.status === 'sent' || p.status === 'draft')
    .reduce((sum, p) => sum + p.totalValue, 0);

  const activeClientsCount = clients.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
            <span>DIGITAL COYOTES // AGENCY COMMAND</span>
            <span className="text-slate-600">·</span>
            <span>POSTGRESQL & PHPMailer SYNCED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Agency Overview & Financial Health
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all shadow-md shadow-orange-950/40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </button>
          <button
            onClick={onOpenCreateProposal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Proposal</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card3D intensity={6} className="rounded-2xl">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Cleared Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              ₹{totalPaidRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span>+18.4% from last quarter</span>
            </div>
          </div>
        </Card3D>

        <Card3D intensity={6} className="rounded-2xl">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Pending & Overdue Invoices</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Across {invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length} client accounts
            </div>
          </div>
        </Card3D>

        <Card3D intensity={6} className="rounded-2xl">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Proposal Pipeline Value</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              ₹{proposalPipeline.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {proposals.filter(p => p.status === 'sent').length} awaiting client signature
            </div>
          </div>
        </Card3D>

        <Card3D intensity={6} className="rounded-2xl">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Active Accounts</span>
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {activeClientsCount}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {clients.length} total client relationships
            </div>
          </div>
        </Card3D>
      </div>

      {/* Middle Layout: Invoices Table + 3D Agency Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Invoices with PHPMailer Actions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-white font-display">Recent Invoices</h2>
              <p className="text-xs text-slate-400">Billed with DigiCoyotes 25 capability packages</p>
            </div>
            <button
              onClick={() => onNavigate('/invoice')}
              className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View all invoices</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {invoices.slice(0, 4).map((invoice) => {
                    const isPaid = invoice.status === 'paid';
                    const isPending = invoice.status === 'pending';
                    const isOverdue = invoice.status === 'overdue';

                    return (
                      <tr key={invoice.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          <button
                            onClick={() => onViewInvoice(invoice)}
                            className="hover:text-orange-400 hover:underline cursor-pointer"
                          >
                            {invoice.invoiceNumber}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {invoice.clientName}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {invoice.items.map((item, i) => (
                              <span key={i} className="text-[10px] text-slate-300">
                                {item.serviceTitle}{i < invoice.items.length - 1 ? ' ·' : ''}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                          ₹{invoice.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium capitalize ${
                            isPaid 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : isPending 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : isOverdue
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-slate-700/40 text-slate-300'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSendInvoice(invoice)}
                              className="px-2 py-1 text-[11px] font-medium rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Dispatch via PHPMailer"
                            >
                              <Send className="w-3 h-3" />
                              <span>PHP Mail</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Proposals Funnel Snapshot */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">Active Proposals</h2>
              <button
                onClick={() => onNavigate('/proposal')}
                className="text-xs font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                <span>All proposals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposals.slice(0, 2).map((proposal) => (
                <div key={proposal.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-orange-400">{proposal.proposalNumber}</span>
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      proposal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white truncate">{proposal.title}</h3>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">{proposal.clientName}</span>
                    <span className="font-mono font-bold text-white">₹{proposal.totalValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): 3D Mini Coyote & System Engines Status */}
        <div className="lg:col-span-4 space-y-5">
          {/* Mini 3D Coyote Interactive Box */}
          <div className="rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-white">3D Agency Emblem</span>
              <span className="text-[10px] font-mono text-orange-400">Live Orbit</span>
            </div>
            <Coyote3D height={200} interactive={true} showControls={false} />
            <div className="text-[11px] text-slate-400 text-center font-mono">
              Origami Coyote Polyhedral Visualizer
            </div>
          </div>

          {/* Engine Status Card */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              System Infrastructure
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="block font-medium text-slate-200">Supabase Backend</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {supabaseConfig.mode === 'live' ? 'Connected to Cloud' : 'Active Local Store'}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <div>
                    <span className="block font-medium text-slate-200">PHPMailer SMTP</span>
                    <span className="text-[10px] text-slate-400 font-mono">{smtpConfig.phpMailerVersion}</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-orange-400" />
              </div>
            </div>

            <button
              onClick={() => onNavigate('/settings')}
              className="w-full py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center cursor-pointer"
            >
              Manage Server & PHP Credentials
            </button>
          </div>

          {/* Live Activity Feed */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Recent Audit Trail
              </h3>
              <button
                onClick={() => onNavigate('/history')}
                className="text-[11px] text-orange-400 hover:underline cursor-pointer"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="border-l-2 border-orange-500/40 pl-3 py-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-slate-500">{item.actor}</span>
                  </div>
                  <div className="font-medium text-slate-200 text-[11px]">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
