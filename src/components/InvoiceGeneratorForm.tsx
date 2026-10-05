import React, { useState } from 'react';
import { Invoice, Client, InvoiceItem, SmtpConfig } from '../types';
import { DIGICOYOTES_SERVICES } from '../data/services';
import { DigiCoyoteLogo } from './Logo';
import { openInGmailCompose } from '../lib/phpMailer';
import confetti from 'canvas-confetti';
import { 
  Save, 
  History as HistoryIcon, 
  Mail, 
  Download, 
  Plus, 
  Trash2, 
  Calendar, 
  Send, 
  CheckCircle2, 
  Check, 
  DollarSign 
} from 'lucide-react';

interface InvoiceGeneratorFormProps {
  initialInvoice?: Invoice | null;
  clients: Client[];
  smtpConfig: SmtpConfig;
  onSave: (invoice: Invoice) => void;
  onSendViaMailer: (invoice: Invoice) => Promise<any>;
  onClose?: () => void;
}

export const InvoiceGeneratorForm: React.FC<InvoiceGeneratorFormProps> = ({
  initialInvoice,
  clients,
  smtpConfig,
  onSave,
  onSendViaMailer,
  onClose
}) => {
  // Form State matching Image 1
  const [currency, setCurrency] = useState<'₹' | '$'>(initialInvoice?.currency as any || '₹');
  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    initialInvoice?.invoiceNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [issueDate, setIssueDate] = useState<string>(
    initialInvoice?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(
    initialInvoice?.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<'draft' | 'pending' | 'paid' | 'overdue'>(
    initialInvoice?.status || 'draft'
  );

  // Client Details
  const defaultClient = clients[0];
  const [clientName, setClientName] = useState<string>(
    initialInvoice?.clientName || defaultClient?.company || 'Arcline Ventures Pvt. Ltd.'
  );
  const [clientEmail, setClientEmail] = useState<string>(
    initialInvoice?.clientEmail || defaultClient?.email || 'accounts@arcline.co'
  );
  const [clientAddress, setClientAddress] = useState<string>(
    initialInvoice?.clientAddress ||
      'MG Road, Bengaluru, KA 560001\nGSTIN 29XXXX1234F1Z5'
  );

  // Line Items
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items && initialInvoice.items.length > 0
      ? initialInvoice.items
      : [
          {
            id: 'item-1',
            serviceTitle: 'Q3 brand refresh',
            description: 'Brand strategy, design tokens and digital guidelines.',
            quantity: 1,
            rate: 240000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 283200
          },
          {
            id: 'item-2',
            serviceTitle: 'Design system audit',
            description: 'Component architecture and accessibility evaluation.',
            quantity: 1,
            rate: 84000,
            discountPercent: 5,
            taxPercent: 18,
            amount: 94164
          }
        ]
  );

  // Notes & Terms
  const [notes, setNotes] = useState<string>(
    initialInvoice?.notes || 'Thank you for your business. We appreciate the partnership.'
  );
  const [terms, setTerms] = useState<string>(
    initialInvoice?.terms ||
      '1. Payment due within 15 days of invoice date.\n2. Late payments incur 1.5% monthly interest.\n3. All disputes subject to Bengaluru jurisdiction.'
  );

  // State feedback
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Calculations
  const calculateItemAmount = (qty: number, rate: number, discPercent: number, taxPercent: number) => {
    const base = (qty || 0) * (rate || 0);
    const discounted = base - (base * (discPercent || 0)) / 100;
    const withTax = discounted + (discounted * (taxPercent || 0)) / 100;
    return Math.round(withTax);
  };

  const handleItemFieldChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    const q = field === 'quantity' ? Number(value) : current.quantity || 1;
    const r = field === 'rate' ? Number(value) : current.rate || 0;
    const d = field === 'discountPercent' ? Number(value) : current.discountPercent || 0;
    const t = field === 'taxPercent' ? Number(value) : current.taxPercent || 0;

    current.amount = calculateItemAmount(q, r, d, t);
    updated[index] = current;
    setItems(updated);
  };

  const handleAddItem = (serviceTitle?: string) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      serviceTitle: serviceTitle || 'New Deliverable Milestone',
      description: 'Design and engineering deliverable.',
      quantity: 1,
      rate: 50000,
      discountPercent: 0,
      taxPercent: 18,
      amount: 59000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Financial aggregates
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.quantity * item.rate * (item.discountPercent || 0)) / 100, 0);
  const totalTax = items.reduce((sum, item) => {
    const baseAfterDisc = (item.quantity * item.rate) - ((item.quantity * item.rate * (item.discountPercent || 0)) / 100);
    return sum + (baseAfterDisc * (item.taxPercent || 0)) / 100;
  }, 0);
  const grandTotal = Math.round(subtotal - totalDiscount + totalTax);

  const compileInvoiceObject = (): Invoice => {
    return {
      id: initialInvoice?.id || `inv-${Date.now()}`,
      invoiceNumber,
      clientId: defaultClient?.id || 'cli-001',
      clientName,
      clientEmail,
      clientAddress,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate: items[0]?.taxPercent || 18,
      taxAmount: Math.round(totalTax),
      discount: Math.round(totalDiscount),
      total: grandTotal,
      currency,
      status,
      notes,
      terms
    };
  };

  const handleSave = () => {
    const compiled = compileInvoiceObject();
    onSave(compiled);
    setNotification('Invoice saved successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenDirectGmail = () => {
    const compiled = compileInvoiceObject();
    const plainText = `DIGITAL COYOTES — INVOICE ${compiled.invoiceNumber}\nClient: ${compiled.clientName} (${compiled.clientEmail})\nTotal: ${currency}${compiled.total.toLocaleString('en-IN')}\nDue: ${compiled.dueDate}\n\nLine Items:\n${compiled.items.map(i => `- ${i.serviceTitle}: ${i.quantity} x ${currency}${i.rate.toLocaleString('en-IN')} = ${currency}${i.amount.toLocaleString('en-IN')}`).join('\n')}\n\nNotes:\n${compiled.notes || 'Payment terms: Due on receipt.'}`;
    const subject = `[Digital Coyotes] Invoice ${compiled.invoiceNumber} for ${compiled.clientName} (${currency}${compiled.total.toLocaleString('en-IN')})`;
    openInGmailCompose(compiled.clientEmail || 'thedigitalcoyotes@gmail.com', subject, plainText, 'thedigitalcoyotes@gmail.com');
  };

  const handleEmailDispatch = async () => {
    setIsSending(true);
    setNotification(null);
    try {
      const compiled = compileInvoiceObject();
      const res = await onSendViaMailer(compiled);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      if (res?.realDispatched) {
        setNotification(`Invoice dispatched via SMTP directly to ${compiled.clientEmail} and thedigitalcoyotes@gmail.com!`);
      } else {
        setNotification(`Invoice prepared for dispatch! Click "Open in Gmail" to send immediately in 1 click, or configure your Google App Password in Settings > SMTP.`);
      }
    } catch (err: any) {
      alert(`Error sending mail: ${err.message || 'SMTP Socket error'}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header matching Reference Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            /// INVOICE GENERATOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Create Invoice
          </h1>
        </div>

        {/* Action Buttons: Save, Versions, Email, Download PDF */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Display */}
          <div
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5 shadow-sm"
            title="Billing Currency: Indian Rupees (INR)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>₹ INR (Rupees)</span>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => alert(`Active Version: v1.0 · Synced with PostgreSQL Supabase.`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            <HistoryIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Versions</span>
          </button>

          {/* Direct 1-Click Gmail Web Compose */}
          <button
            type="button"
            onClick={handleOpenDirectGmail}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            title="Open in your web Gmail with recipient and invoice details prefilled"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open in Gmail</span>
          </button>

          <button
            disabled={isSending}
            onClick={handleEmailDispatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600 border border-orange-500/30 text-xs font-medium text-orange-400 hover:text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            title="Dispatch invoice via SMTP"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : 'SMTP Dispatch'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={handleOpenDirectGmail}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open in Gmail (Send Now)</span>
          </button>
        </div>
      )}

      {/* Main 2-Column Split: Left Form Inputs | Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FORM INPUTS */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Invoice Details */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white font-display">Invoice Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Issue Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500 capitalize"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Client */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white font-display">Client</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                  placeholder="Client Organization Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  placeholder="billing@client.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Address</label>
                <textarea
                  rows={2}
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Street, City, Postal Code, Tax / GSTIN ID"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Line Items with QTY, RATE, DISC %, TAX % matching reference */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">Line Items</h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3"
                >
                  <input
                    type="text"
                    value={item.serviceTitle}
                    onChange={(e) => handleItemFieldChange(idx, 'serviceTitle', e.target.value)}
                    placeholder="Item title or service description"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                  />

                  {/* 4-Input Grid matching Reference: QTY, RATE, DISC %, TAX % */}
                  <div className="grid grid-cols-4 gap-2 items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">QTY</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemFieldChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">RATE ({currency})</span>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleItemFieldChange(idx, 'rate', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-right font-mono"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">DISC %</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent || 0}
                        onChange={(e) => handleItemFieldChange(idx, 'discountPercent', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>

                    <div className="space-y-0.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">TAX %</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                            title="Remove line item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxPercent || 0}
                        onChange={(e) => handleItemFieldChange(idx, 'taxPercent', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Notes & Terms */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white font-display">Notes & Terms</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Terms</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATUS & LIVE PREVIEW (MATCHING IMAGE 1) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-20">
          {/* Status Box */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Submit for review</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs font-mono font-medium text-slate-300 capitalize">
                {status}
              </span>
            </div>
          </div>

          {/* LIVE PREVIEW CANVAS (Exact styling of the reference screenshot paper sheet) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                LIVE PREVIEW
              </span>
              <span>100% Client Visual Replica</span>
            </div>

            {/* Floating Paper Preview */}
            <div className="relative rounded-2xl bg-[#ffffff] text-slate-900 p-7 shadow-2xl overflow-hidden font-sans border border-slate-200">
              {/* Top Accent Gradient Bar matching screenshot */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-teal-400" />

              {/* Header: Company & Invoice Label */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    DC
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      Digital Coyotes Studio
                    </h2>
                    <p className="text-[11px] text-slate-500">Design that ships.</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      billing@digitalcoyotes.com · +1 415 890 2341
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-blue-600 tracking-tight font-display">
                    INVOICE
                  </div>
                  <div className="text-xs font-mono text-slate-500">#{invoiceNumber}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Issued {issueDate}<br />
                    Due {dueDate}
                  </div>
                </div>
              </div>

              {/* From & Billed To */}
              <div className="grid grid-cols-2 gap-4 py-5 text-xs border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">FROM</span>
                  <div className="font-bold text-slate-900">Digital Coyotes Studio Pvt Ltd</div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    42 MG Road, Bengaluru, KA 560001<br />
                    GSTIN 29AABCDE1234F1Z5
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">BILLED TO</span>
                  <div className="font-bold text-slate-900">{clientName}</div>
                  <div className="text-[11px] text-slate-600 leading-tight whitespace-pre-line">
                    {clientAddress}
                  </div>
                  <div className="text-[11px] text-blue-600 font-mono">{clientEmail}</div>
                </div>
              </div>

              {/* Items Table matching Cyan/Blue Bar from screenshot */}
              <div className="py-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-mono text-[10px] uppercase">
                      <th className="py-2 px-3 rounded-l-lg">DESCRIPTION</th>
                      <th className="py-2 px-2 text-center">QTY</th>
                      <th className="py-2 px-3 text-right">RATE</th>
                      <th className="py-2 px-2 text-center">TAX</th>
                      <th className="py-2 px-3 text-right rounded-r-lg">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-900">{item.serviceTitle}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          {currency}{item.rate.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-500 text-[11px]">
                          {item.taxPercent || 0}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {currency}{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bank Details & Financial Summary Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                {/* Left: Bank Details */}
                <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                  <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                    BANK DETAILS
                  </div>
                  <div>Digital Coyotes Studio Pvt Ltd</div>
                  <div>HDFC Bank · A/C 5011 2233 4455</div>
                  <div>IFSC HDFC0000123</div>
                </div>

                {/* Right: Subtotal, Discount, Tax */}
                <div className="space-y-1.5 text-xs font-mono text-right">
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Subtotal</span>
                    <span>{currency}{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{currency}{Math.round(totalDiscount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span className="text-slate-400">Tax</span>
                    <span>+{currency}{Math.round(totalTax).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Big Vibrant TOTAL DUE pill from screenshot */}
                  <div className="pt-2">
                    <div className="inline-flex items-center justify-between w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold shadow-md">
                      <span className="text-xs uppercase font-mono tracking-wider">TOTAL DUE</span>
                      <span className="text-sm font-mono tracking-tight font-extrabold">
                        {currency}{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes at bottom */}
              <div className="pt-5 mt-4 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                  NOTES
                </span>
                <p>{notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
