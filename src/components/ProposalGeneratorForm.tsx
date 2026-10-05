import React, { useState } from 'react';
import { Proposal, Client, ProposalSection, ProposalPricingItem, SmtpConfig } from '../types';
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
  GripVertical,
  Receipt,
  X
} from 'lucide-react';

interface ProposalGeneratorFormProps {
  initialProposal?: Proposal | null;
  clients: Client[];
  smtpConfig: SmtpConfig;
  onSave: (proposal: Proposal) => void;
  onSendViaMailer: (proposal: Proposal) => Promise<any>;
  onConvertToInvoice?: (proposal: Proposal) => void;
  onClose?: () => void;
}

export const ProposalGeneratorForm: React.FC<ProposalGeneratorFormProps> = ({
  initialProposal,
  clients,
  smtpConfig,
  onSave,
  onSendViaMailer,
  onConvertToInvoice,
  onClose
}) => {
  const [currency, setCurrency] = useState<'₹' | '$'>(initialProposal?.currency as any || '₹');
  const [proposalNumber, setProposalNumber] = useState<string>(
    initialProposal?.proposalNumber || `PRP-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [title, setTitle] = useState<string>(
    initialProposal?.title || 'Brand & Product Design Engagement'
  );
  const [issuedDate, setIssuedDate] = useState<string>(
    initialProposal?.validUntil ? new Date().toISOString().split('T')[0] : '2026-10-05'
  );
  const [validUntil, setValidUntil] = useState<string>(
    initialProposal?.validUntil || '2026-11-04'
  );
  const [status, setStatus] = useState<'draft' | 'sent' | 'approved' | 'declined'>(
    initialProposal?.status || 'draft'
  );

  // Client Details
  const defaultClient = clients[0];
  const [clientName, setClientName] = useState<string>(
    initialProposal?.clientName || defaultClient?.company || 'Arcline Ventures Pvt. Ltd.'
  );
  const [clientEmail, setClientEmail] = useState<string>(
    initialProposal?.clientEmail || defaultClient?.email || 'hello@arcline.co'
  );
  const [clientAddress, setClientAddress] = useState<string>(
    initialProposal?.clientAddress || 'MG Road, Bengaluru, KA 560001'
  );

  // Sections matching Image 2
  const [sections, setSections] = useState<ProposalSection[]>(
    initialProposal?.sections && initialProposal.sections.length > 0
      ? initialProposal.sections
      : [
          {
            id: 'sec-1',
            title: 'Overview',
            content:
              'Digital Coyotes will partner with Arcline to redefine the brand foundation and translate it into a working product design system across web and mobile surfaces.'
          },
          {
            id: 'sec-2',
            title: 'Scope of Work',
            content:
              '1. Discovery workshops (2 weeks)\n2. Brand identity & guidelines\n3. Design system v1 (40+ components)\n4. Web + iOS product screens'
          },
          {
            id: 'sec-3',
            title: 'Timeline',
            content:
              '10 weeks end-to-end. Weekly reviews on Fridays. Final handover with production documentation.'
          }
        ]
  );

  // Itemized Pricing matching Image 2
  const [pricingItems, setPricingItems] = useState<ProposalPricingItem[]>(
    initialProposal?.pricingItems && initialProposal.pricingItems.length > 0
      ? initialProposal.pricingItems
      : [
          {
            id: 'price-1',
            title: 'Discovery & strategy',
            quantity: 1,
            rate: 120000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 141600
          },
          {
            id: 'price-2',
            title: 'Brand identity & guidelines',
            quantity: 1,
            rate: 180000,
            discountPercent: 0,
            taxPercent: 18,
            amount: 212400
          },
          {
            id: 'price-3',
            title: 'Design system v1',
            quantity: 1,
            rate: 240000,
            discountPercent: 5,
            taxPercent: 18,
            amount: 269040
          }
        ]
  );

  // Terms and Notes
  const [terms, setTerms] = useState<string>(
    initialProposal?.terms ||
      '1. Payment due within 15 days of invoice date.\n2. Late payments incur 1.5% monthly interest.\n3. All disputes subject to Bengaluru jurisdiction.'
  );
  const [notes, setNotes] = useState<string>(
    initialProposal?.notes || 'Thank you for your business. We appreciate the partnership.'
  );

  // State Feedback
  const [isSending, setIsSending] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Calculation helpers
  const calculateItemAmount = (qty: number, rate: number, discPercent: number, taxPercent: number) => {
    const base = (qty || 0) * (rate || 0);
    const discounted = base - (base * (discPercent || 0)) / 100;
    const withTax = discounted + (discounted * (taxPercent || 0)) / 100;
    return Math.round(withTax);
  };

  const handlePricingFieldChange = (index: number, field: keyof ProposalPricingItem, value: any) => {
    const updated = [...pricingItems];
    const current = { ...updated[index], [field]: value };

    const q = field === 'quantity' ? Number(value) : current.quantity || 1;
    const r = field === 'rate' ? Number(value) : current.rate || 0;
    const d = field === 'discountPercent' ? Number(value) : current.discountPercent || 0;
    const t = field === 'taxPercent' ? Number(value) : current.taxPercent || 0;

    current.amount = calculateItemAmount(q, r, d, t);
    updated[index] = current;
    setPricingItems(updated);
  };

  const handleAddPricingItem = () => {
    const newItem: ProposalPricingItem = {
      id: `price-${Date.now()}`,
      title: 'Sprint Deliverable Milestone',
      quantity: 1,
      rate: 100000,
      discountPercent: 0,
      taxPercent: 18,
      amount: 118000
    };
    setPricingItems([...pricingItems, newItem]);
  };

  const handleRemovePricingItem = (index: number) => {
    if (pricingItems.length <= 1) return;
    setPricingItems(pricingItems.filter((_, i) => i !== index));
  };

  // Section Handlers
  const handleAddSection = () => {
    const newSec: ProposalSection = {
      id: `sec-${Date.now()}`,
      title: 'New Section',
      content: 'Add deliverables, expectations, or methodology details here...'
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: keyof ProposalSection, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  // Total computation
  const totalValue = pricingItems.reduce((acc, item) => acc + (item.amount || 0), 0);

  const compileProposalObject = (): Proposal => {
    return {
      id: initialProposal?.id || `prop-${Date.now()}`,
      proposalNumber,
      title,
      clientId: defaultClient?.id || 'cli-001',
      clientName,
      clientEmail,
      clientAddress,
      services: pricingItems.map(p => p.title),
      summary: sections[0]?.content || 'Proposal engagement summary.',
      sections,
      pricingItems,
      scopeOfWork: sections.map(s => `${s.title}: ${s.content}`),
      milestones: pricingItems.map(p => ({
        id: p.id,
        title: p.title,
        duration: 'Sprint',
        cost: p.amount,
        deliverable: p.title
      })),
      totalValue,
      validUntil,
      currency,
      terms,
      notes,
      status
    };
  };

  const handleSave = () => {
    const compiled = compileProposalObject();
    onSave(compiled);
    setNotification('Proposal saved successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const [lastGmailComposeUrl, setLastGmailComposeUrl] = useState<string | null>(null);

  const handleEmailDispatch = async () => {
    setIsSending(true);
    setNotification(null);
    setLastGmailComposeUrl(null);
    try {
      const compiled = compileProposalObject();
      const res = await onSendViaMailer(compiled);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      
      if (res?.realDispatched) {
        setNotification(`Proposal dispatched via SMTP directly into thedigitalcoyotes@gmail.com!`);
      } else {
        if (res?.gmailComposeUrl) {
          setLastGmailComposeUrl(res.gmailComposeUrl);
        }
        setNotification(`Proposal prepared for thedigitalcoyotes@gmail.com! Click "Open in Gmail" to deliver instantly, or enter your Google App Password in Settings > SMTP.`);
      }
    } catch (err: any) {
      alert(`Error sending proposal: ${err.message || 'SMTP Socket error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenDirectGmail = () => {
    const compiled = compileProposalObject();
    const plainText = `DIGITAL COYOTES — AGENCY PROPOSAL\nProposal Number: ${compiled.proposalNumber}\nClient: ${compiled.clientName} (${compiled.clientEmail})\nTotal: $${compiled.totalValue.toLocaleString()}\n\nOverview:\n${compiled.summary}\n\nDeliverables:\n${compiled.pricingItems?.map(p => `- ${p.title}: $${p.amount.toLocaleString()}`).join('\n')}\n\nTerms:\n${compiled.terms}`;
    const subject = `[Digital Coyotes] Agency Proposal: ${compiled.title} ($${compiled.totalValue.toLocaleString()})`;
    openInGmailCompose('thedigitalcoyotes@gmail.com', subject, plainText, compiled.clientEmail);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header matching Reference Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            /// PROPOSAL GENERATOR
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Build Proposal
          </h1>
        </div>

        {/* Action Buttons: Save, Versions, Email, Download PDF */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(c => c === '₹' ? '$' : '₹')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-orange-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle currency symbol"
          >
            {currency} Currency
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => alert(`Proposal Version: v1.0 · Synced with PostgreSQL Supabase.`)}
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
            title="Open in your web Gmail with thedigitalcoyotes@gmail.com prefilled"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open in Gmail</span>
          </button>

          <button
            disabled={isSending}
            onClick={handleEmailDispatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600 border border-orange-500/30 text-xs font-medium text-orange-400 hover:text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            title="Dispatch proposal via SMTP to thedigitalcoyotes@gmail.com"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : 'SMTP Dispatch'}</span>
          </button>

          {onConvertToInvoice && (
            <button
              type="button"
              onClick={() => {
                const compiled = compileProposalObject();
                onSave(compiled);
                onConvertToInvoice(compiled);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-sm transition-colors cursor-pointer"
              title="Convert proposal line items into a ready-to-bill invoice"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm transition-colors cursor-pointer"
              title="Return to proposals funnel"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
          )}
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
          {/* Card 1: Proposal Details */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white font-display">Proposal Details</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px]">Number</label>
                  <input
                    type="text"
                    value={proposalNumber}
                    onChange={(e) => setProposalNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px]">Issued</label>
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px]">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Address</label>
                <textarea
                  rows={2}
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Sections matching Image 2 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">Sections</h3>
              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((sec, idx) => (
                <div key={sec.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="w-3.5 h-3.5 text-slate-600" />
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Remove section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={sec.content}
                    onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Itemized Pricing matching Image 2 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">Itemized Pricing</h3>
              <button
                type="button"
                onClick={handleAddPricingItem}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {pricingItems.map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handlePricingFieldChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                  />

                  <div className="grid grid-cols-4 gap-2 items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">QTY</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handlePricingFieldChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">RATE</span>
                      <input
                        type="number"
                        min="0"
                        value={item.rate}
                        onChange={(e) => handlePricingFieldChange(idx, 'rate', e.target.value)}
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
                        onChange={(e) => handlePricingFieldChange(idx, 'discountPercent', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>

                    <div className="space-y-0.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">TAX %</span>
                        {pricingItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePricingItem(idx)}
                            className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
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
                        onChange={(e) => handlePricingFieldChange(idx, 'taxPercent', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Customizable Terms */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white font-display">Customizable Terms</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATUS & LIVE PREVIEW (MATCHING IMAGE 2) */}
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

          {/* LIVE PREVIEW CANVAS (Exact styling of Image 2 paper sheet) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                LIVE PREVIEW
              </span>
              <span>100% Client Visual Replica</span>
            </div>

            {/* Floating Paper Preview */}
            <div className="relative rounded-2xl bg-[#ffffff] text-slate-900 p-7 shadow-2xl overflow-hidden font-sans border border-slate-200 space-y-5">
              {/* Top Accent Gradient Bar matching screenshot */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-teal-400" />

              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    DC
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      Digital Coyotes Studio
                    </h2>
                    <p className="text-[11px] text-slate-500">Design that ships.</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-blue-600 tracking-tight font-display">
                    PROPOSAL
                  </div>
                  <div className="text-xs font-mono text-slate-500">#{proposalNumber}</div>
                </div>
              </div>

              {/* Client Header & Title */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                  FOR {clientName.toUpperCase()}
                </span>
                <h1 className="text-xl font-bold text-slate-900 font-display leading-tight">
                  {title}
                </h1>
                <div className="text-[11px] text-slate-400 font-mono">
                  Issued {issuedDate} · Valid until {validUntil}
                </div>
              </div>

              {/* Sections Rendered */}
              <div className="space-y-4 pt-2">
                {sections.map((sec, i) => (
                  <div key={sec.id} className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 font-display">
                      {sec.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Investment Table matching Image 2 */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Investment
                </h4>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-mono text-[10px] uppercase">
                      <th className="py-2 px-3 rounded-l-lg">ITEM</th>
                      <th className="py-2 px-2 text-center">QTY</th>
                      <th className="py-2 px-3 text-right">RATE</th>
                      <th className="py-2 px-3 text-right rounded-r-lg">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {pricingItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-900">{item.title}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          {currency}{item.rate.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {currency}{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Big TOTAL pill matching screenshot */}
                <div className="pt-2 flex justify-end">
                  <div className="inline-flex items-center gap-3 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold shadow-md">
                    <span className="text-xs uppercase font-mono tracking-wider">TOTAL</span>
                    <span className="text-base font-mono tracking-tight font-extrabold">
                      {currency}{totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms at bottom */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
                  TERMS
                </span>
                <p className="whitespace-pre-line leading-relaxed">{terms}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
