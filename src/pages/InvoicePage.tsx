import React, { useState } from 'react';
import { Invoice, Client, InvoiceItem, SmtpConfig, ServiceItem } from '../types';
import { DIGICOYOTES_SERVICES } from '../data/services';
import { DigiCoyoteLogo } from '../components/Logo';
import { Card3D } from '../components/Card3D';
import { InvoiceGeneratorForm } from '../components/InvoiceGeneratorForm';
import confetti from 'canvas-confetti';
import { 
  Receipt, 
  Plus, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Trash2, 
  Eye, 
  DollarSign, 
  FileText,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface InvoicePageProps {
  invoices: Invoice[];
  clients: Client[];
  smtpConfig: SmtpConfig;
  onSaveInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onSendInvoiceViaMailer: (invoice: Invoice) => Promise<any>;
  preselectedService?: ServiceItem | null;
  onClearPreselectedService?: () => void;
}

export const InvoicePage: React.FC<InvoicePageProps> = ({
  invoices,
  clients,
  smtpConfig,
  onSaveInvoice,
  onDeleteInvoice,
  onSendInvoiceViaMailer,
  preselectedService,
  onClearPreselectedService
}) => {
  const [search, setSearch] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'generator' | 'ledger'>('generator');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [smtpDebugLogs, setSmtpDebugLogs] = useState<string[]>([]);

  // Invoice Form State
  const [formClientId, setFormClientId] = useState<string>(clients[0]?.id || '');
  const [formIssueDate, setFormIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [formTaxRate, setFormTaxRate] = useState<number>(0);
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formNotes, setFormNotes] = useState<string>('Payment terms: Net 14 days. Wire transfer or ACH accepted.');
  const [formItems, setFormItems] = useState<InvoiceItem[]>([
    preselectedService
      ? {
          id: `item-${Date.now()}`,
          serviceTitle: preselectedService.title,
          description: preselectedService.shortDescription,
          quantity: 1,
          rate: preselectedService.startingRate,
          amount: preselectedService.startingRate
        }
      : {
          id: `item-${Date.now()}`,
          serviceTitle: 'Web Design & Development',
          description: 'Custom React & PHP full-stack production build with responsive UX.',
          quantity: 1,
          rate: 4800,
          amount: 4800
        }
  ]);

  const handleOpenCreateModal = () => {
    if (preselectedService) {
      setFormItems([
        {
          id: `item-${Date.now()}`,
          serviceTitle: preselectedService.title,
          description: preselectedService.shortDescription,
          quantity: 1,
          rate: preselectedService.startingRate,
          amount: preselectedService.startingRate
        }
      ]);
      if (onClearPreselectedService) onClearPreselectedService();
    }
    setIsCreateModalOpen(true);
  };

  const handleAddItem = (service?: ServiceItem) => {
    const defaultSvc = service || DIGICOYOTES_SERVICES[0];
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      serviceTitle: defaultSvc.title,
      description: defaultSvc.shortDescription,
      quantity: 1,
      rate: defaultSvc.startingRate,
      amount: defaultSvc.startingRate
    };
    setFormItems([...formItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (formItems.length <= 1) return;
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...formItems];
    const item = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : item.quantity;
      const r = field === 'rate' ? Number(value) : item.rate;
      item.amount = (q || 0) * (r || 0);
    }

    // If serviceTitle was changed from dropdown, prefill description and rate
    if (field === 'serviceTitle') {
      const matched = DIGICOYOTES_SERVICES.find(s => s.title === value);
      if (matched) {
        item.description = matched.shortDescription;
        item.rate = matched.startingRate;
        item.amount = item.quantity * matched.startingRate;
      }
    }

    updated[index] = item;
    setFormItems(updated);
  };

  // Computations
  const subtotal = formItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = (subtotal * (formTaxRate || 0)) / 100;
  const total = Math.max(0, subtotal + taxAmount - (formDiscount || 0));

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formClientId);
    if (!client) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: client.id,
      clientName: client.company || client.name,
      clientEmail: client.email,
      issueDate: formIssueDate,
      dueDate: formDueDate,
      items: formItems,
      subtotal,
      taxRate: formTaxRate,
      taxAmount,
      discount: formDiscount,
      total,
      status: 'pending',
      notes: formNotes
    };

    onSaveInvoice(newInvoice);
    setIsCreateModalOpen(false);
  };

  const handleDispatchMailer = async (invoice: Invoice) => {
    setIsSending(true);
    setSendSuccessMessage(null);
    setSmtpDebugLogs([]);

    try {
      const result = await onSendInvoiceViaMailer(invoice);
      setSmtpDebugLogs(result.debugTrace || []);
      setSendSuccessMessage(`Dispatched successfully via PHPMailer to ${invoice.clientEmail}!`);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      alert(`Mailer Error: ${err.message || 'Failed to dispatch via PHPMailer'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    const updated: Invoice = {
      ...invoice,
      status: 'paid',
      paidAt: new Date().toISOString(),
      paymentMethod: 'Verified Bank Settlement'
    };
    onSaveInvoice(updated);
    if (viewingInvoice?.id === invoice.id) {
      setViewingInvoice(updated);
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  // Filtered List
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                        inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
                        inv.clientEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
            <span>FINANCIAL LEDGER</span>
            <span className="text-slate-600">·</span>
            <span>PHPMailer DISPATCH ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Invoicing & Settlement Console
          </h1>
        </div>

        {/* View Mode Toggle: Generator Studio vs Ledger List */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveViewMode('generator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeViewMode === 'generator'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Invoice Generator (Live Form)
            </button>
            <button
              onClick={() => setActiveViewMode('ledger')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeViewMode === 'ledger'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Invoices Ledger ({invoices.length})
            </button>
          </div>
        </div>
      </div>

      {/* RENDER VIEW 1: INVOICE GENERATOR STUDIO FORM (MATCHING REFERENCE IMAGE 1) */}
      {activeViewMode === 'generator' && (
        <InvoiceGeneratorForm
          clients={clients}
          smtpConfig={smtpConfig}
          onSave={(inv) => {
            onSaveInvoice(inv);
            setActiveViewMode('ledger');
          }}
          onSendViaMailer={onSendInvoiceViaMailer}
        />
      )}

      {/* RENDER VIEW 2: INVOICES LEDGER TABLE & STATS */}
      {activeViewMode === 'ledger' && (
        <>
          {/* Stats Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">Total Billed Pipeline</span>
              <span className="text-xl font-bold text-white font-mono tabular-nums">
                ₹{totalInvoiced.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">Cleared & Paid</span>
              <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
                ₹{totalPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-mono">Outstanding Balance</span>
              <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                ₹{totalPending.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search invoice # or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-full sm:w-auto">
          {(['all', 'paid', 'pending', 'overdue', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                statusFilter === filter
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Issue / Due Date</th>
                <th className="py-3.5 px-4">Services Rendered</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvoices.map((inv) => {
                const isPaid = inv.status === 'paid';
                const isPending = inv.status === 'pending';
                const isOverdue = inv.status === 'overdue';

                return (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="hover:text-orange-400 hover:underline cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      <div>{inv.clientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                        {inv.clientEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] font-mono text-slate-400">
                      <div>Issued: {inv.issueDate}</div>
                      <div className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
                        Due: {inv.dueDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {inv.items.map((item, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {item.serviceTitle}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums text-sm">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-medium capitalize ${
                        isPaid 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : isPending 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : isOverdue
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-700/40 text-slate-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="View Invoice & Print"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDispatchMailer(inv)}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          title="Dispatch via PHPMailer"
                        >
                          <Send className="w-3 h-3" />
                          <span className="hidden sm:inline">PHP Mail</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                              onDeleteInvoice(inv.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DigiCoyoteLogo size={24} />
                <h2 className="text-lg font-bold text-white font-display">
                  Create Invoice with DigiCoyotes Services
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              {/* Client & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Select Client *</label>
                  <select
                    value={formClientId}
                    onChange={(e) => setFormClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    required
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={formIssueDate}
                    onChange={(e) => setFormIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Line Items Builder with DigiCoyotes 25 Services */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 font-mono">
                    Service Line Items (from DigiCoyotes Catalog)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
                  >
                    + Add Another Service
                  </button>
                </div>

                <div className="space-y-3">
                  {formItems.map((item, idx) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        {/* Service Picker */}
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[11px] text-slate-400">Service Category</label>
                          <select
                            value={item.serviceTitle}
                            onChange={(e) => handleItemChange(idx, 'serviceTitle', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium"
                          >
                            {DIGICOYOTES_SERVICES.map(s => (
                              <option key={s.id} value={s.title}>
                                {s.title} (₹{s.startingRate.toLocaleString('en-IN')})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Qty */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] text-slate-400">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center"
                          />
                        </div>

                        {/* Rate */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] text-slate-400">Rate (₹)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-right"
                          />
                        </div>

                        {/* Total & Remove */}
                        <div className="sm:col-span-2 flex items-end justify-between pb-1">
                          <span className="font-mono font-bold text-orange-400 text-sm">
                            ₹{(item.amount || 0).toLocaleString('en-IN')}
                          </span>
                          {formItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Deliverable description..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax & Discount & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400">Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formTaxRate}
                        onChange={(e) => setFormTaxRate(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">Discount (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formDiscount}
                        onChange={(e) => setFormDiscount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Payment & Bank Terms</label>
                    <textarea
                      rows={2}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {formTaxRate > 0 && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Tax ({formTaxRate}%):</span>
                      <span>+₹{taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {formDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-₹{formDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
                    <span>Total Due:</span>
                    <span className="text-orange-400 text-base">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-md cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Details & Print / Send Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl bg-[#0f1422] border border-slate-800 p-6 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">
                Invoice Preview // {viewingInvoice.invoiceNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                {viewingInvoice.status !== 'paid' && (
                  <button
                    onClick={() => handleMarkAsPaid(viewingInvoice)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Paid</span>
                  </button>
                )}
                <button
                  disabled={isSending}
                  onClick={() => handleDispatchMailer(viewingInvoice)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending...' : 'Dispatch via PHPMailer'}</span>
                </button>
                <button
                  onClick={() => { setViewingInvoice(null); setSendSuccessMessage(null); setSmtpDebugLogs([]); }}
                  className="text-slate-400 hover:text-white text-xs font-mono ml-2 cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
            </div>

            {/* Success message banner */}
            {sendSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}

            {/* Printable Invoice Sheet */}
            <div className="p-8 rounded-2xl bg-[#090d16] border border-slate-800/90 text-slate-200 space-y-8 font-sans">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <DigiCoyoteLogo size={42} showText={true} />
                  <p className="text-xs text-slate-400 pt-2">
                    DigiCoyotes Agency Suite · Autonomous Digital Systems<br />
                    billing@digicoyotes.com · +1 (415) 890-2341
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <h1 className="text-2xl font-extrabold text-white font-mono">INVOICE</h1>
                  <p className="text-sm font-mono text-orange-400 font-bold">{viewingInvoice.invoiceNumber}</p>
                  <div className="text-xs text-slate-400 font-mono">
                    <div>Issue Date: {viewingInvoice.issueDate}</div>
                    <div>Due Date: {viewingInvoice.dueDate}</div>
                  </div>
                </div>
              </div>

              {/* Bill To & Status */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Billed To:</span>
                  <div className="font-bold text-white text-sm">{viewingInvoice.clientName}</div>
                  <div className="text-xs text-slate-400">{viewingInvoice.clientEmail}</div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Settlement Status:</span>
                  <span className={`inline-block px-3 py-1 rounded text-xs font-mono font-bold uppercase ${
                    viewingInvoice.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : viewingInvoice.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {viewingInvoice.status}
                  </span>
                  {viewingInvoice.paidAt && (
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      Paid on: {new Date(viewingInvoice.paidAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-2.5">Service Description</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Unit Rate</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {viewingInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <div className="font-semibold text-white">{item.serviceTitle}</div>
                        <div className="text-[11px] text-slate-400">{item.description}</div>
                      </td>
                      <td className="py-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-mono font-bold text-orange-400">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <div className="w-64 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{viewingInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {viewingInvoice.taxRate > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Tax ({viewingInvoice.taxRate}%):</span>
                      <span>+₹{viewingInvoice.taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {viewingInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-₹{viewingInvoice.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                    <span>Total Balance:</span>
                    <span className="text-orange-400">₹{viewingInvoice.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Bank Notes */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div className="font-mono text-slate-300 font-semibold">Payment Instructions:</div>
                <p>{viewingInvoice.notes || 'Wire routing or ACH instructions available upon request.'}</p>
              </div>
            </div>

            {/* SMTP Debug Socket Log (if dispatched) */}
            {smtpDebugLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-orange-400">
                  <span>PHPMailer SMTP Socket Transmission Trace</span>
                  <span className="text-slate-500">Host: {smtpConfig.host}</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 max-h-36 overflow-y-auto space-y-1 select-all">
                  {smtpDebugLogs.map((log, i) => (
                    <div key={i} className={log.startsWith('>') ? 'text-orange-400 font-semibold' : log.startsWith('250') ? 'text-emerald-400' : 'text-slate-400'}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
