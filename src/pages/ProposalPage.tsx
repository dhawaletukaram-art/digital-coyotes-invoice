import React, { useState } from 'react';
import { Proposal, Client, ProposalMilestone, SmtpConfig, ServiceItem } from '../types';
import { DIGICOYOTES_SERVICES } from '../data/services';
import { DigiCoyoteLogo } from '../components/Logo';
import { Card3D } from '../components/Card3D';
import { ProposalGeneratorForm } from '../components/ProposalGeneratorForm';
import confetti from 'canvas-confetti';
import { 
  FileCheck, 
  Plus, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Trash2, 
  Eye, 
  DollarSign, 
  Layers, 
  Calendar,
  Receipt,
  Sparkles
} from 'lucide-react';

interface ProposalPageProps {
  proposals: Proposal[];
  clients: Client[];
  smtpConfig: SmtpConfig;
  onSaveProposal: (proposal: Proposal) => void;
  onDeleteProposal: (proposalId: string) => void;
  onSendProposalViaMailer: (proposal: Proposal) => Promise<any>;
  onConvertToInvoice: (proposal: Proposal) => void;
  preselectedService?: ServiceItem | null;
  onClearPreselectedService?: () => void;
}

export const ProposalPage: React.FC<ProposalPageProps> = ({
  proposals,
  clients,
  smtpConfig,
  onSaveProposal,
  onDeleteProposal,
  onSendProposalViaMailer,
  onConvertToInvoice,
  preselectedService,
  onClearPreselectedService
}) => {
  const [search, setSearch] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'generator' | 'funnel'>('generator');
  const [editingProposalForGenerator, setEditingProposalForGenerator] = useState<Proposal | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'approved' | 'declined'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [viewingProposal, setViewingProposal] = useState<Proposal | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);
  const [smtpDebugLogs, setSmtpDebugLogs] = useState<string[]>([]);

  // Form State
  const [formClientId, setFormClientId] = useState<string>(clients[0]?.id || '');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formValidUntil, setFormValidUntil] = useState<string>(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [formSelectedServices, setFormSelectedServices] = useState<string[]>([
    preselectedService ? preselectedService.title : 'Web Design & Development'
  ]);
  const [formMilestones, setFormMilestones] = useState<ProposalMilestone[]>([
    {
      id: `m-1`,
      title: 'Phase 1: Discovery, Wireframing & Technical Architecture',
      duration: '2 Weeks',
      cost: 4500,
      deliverable: 'Figma Design System, Database Schemas, API Specs'
    },
    {
      id: `m-2`,
      title: 'Phase 2: Core Engineering, AI Integrations & 3D Spatial Canvas',
      duration: '4 Weeks',
      cost: 7500,
      deliverable: 'Staging Environment, Interactive Three.js WebGL & Supabase Sync'
    },
    {
      id: `m-3`,
      title: 'Phase 3: Production Deployment, PHPMailer & Launch Blitz',
      duration: '2 Weeks',
      cost: 3500,
      deliverable: 'Live Production Flagship, Automated SMTP Triggers, Handoff Docs'
    }
  ]);

  const handleOpenCreateModal = () => {
    if (preselectedService) {
      setFormSelectedServices([preselectedService.title]);
      setFormTitle(`${preselectedService.title} Implementation & Growth Roadmap`);
      setFormSummary(`Strategic rollout of ${preselectedService.title} with full-scale execution and performance tracking.`);
      if (onClearPreselectedService) onClearPreselectedService();
    } else {
      setFormTitle('Autonomous Digital Flagship & Marketing Blitz');
      setFormSummary('Comprehensive transformation delivering zero-latency web architecture, AI reasoning, and multi-channel campaign scaling.');
    }
    setIsCreateModalOpen(true);
  };

  const toggleService = (title: string) => {
    setFormSelectedServices(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleAddMilestone = () => {
    const newM: ProposalMilestone = {
      id: `m-${Date.now()}`,
      title: `Sprint ${formMilestones.length + 1}: Additional Execution`,
      duration: '2 Weeks',
      cost: 3000,
      deliverable: 'Production Deliverables & Verification'
    };
    setFormMilestones([...formMilestones, newM]);
  };

  const handleRemoveMilestone = (idx: number) => {
    if (formMilestones.length <= 1) return;
    setFormMilestones(formMilestones.filter((_, i) => i !== idx));
  };

  const handleMilestoneChange = (idx: number, field: keyof ProposalMilestone, value: any) => {
    const updated = [...formMilestones];
    updated[idx] = {
      ...updated[idx],
      [field]: field === 'cost' ? Number(value) : value
    };
    setFormMilestones(updated);
  };

  const totalValue = formMilestones.reduce((acc, m) => acc + (m.cost || 0), 0);

  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === formClientId);
    if (!client) return;

    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      proposalNumber: `PROP-2026-${String(proposals.length + 1).padStart(3, '0')}`,
      title: formTitle || 'Agency Services Proposal',
      clientId: client.id,
      clientName: client.company || client.name,
      clientEmail: client.email,
      services: formSelectedServices,
      summary: formSummary,
      scopeOfWork: formSelectedServices.map(s => `Implement and scale ${s} per DigiCoyotes technical benchmarks.`),
      milestones: formMilestones,
      totalValue,
      validUntil: formValidUntil,
      status: 'draft'
    };

    onSaveProposal(newProp);
    setIsCreateModalOpen(false);
  };

  const handleDispatchMailer = async (proposal: Proposal) => {
    setIsSending(true);
    setSendSuccessMessage(null);
    setSmtpDebugLogs([]);

    try {
      const result = await onSendProposalViaMailer(proposal);
      setSmtpDebugLogs(result.debugTrace || []);
      setSendSuccessMessage(`Proposal successfully dispatched via PHPMailer to thedigitalcoyotes@gmail.com & ${proposal.clientEmail}!`);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      alert(`Mailer Error: ${err.message || 'Failed to dispatch proposal'}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleApproveProposal = (proposal: Proposal) => {
    const updated: Proposal = {
      ...proposal,
      status: 'approved',
      approvedAt: new Date().toISOString()
    };
    onSaveProposal(updated);
    if (viewingProposal?.id === proposal.id) {
      setViewingProposal(updated);
    }
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Filtered List
  const filteredProposals = proposals.filter(p => {
    const matchSearch = p.proposalNumber.toLowerCase().includes(search.toLowerCase()) ||
                        p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPipeline = proposals.reduce((s, p) => s + p.totalValue, 0);
  const approvedTotal = proposals.filter(p => p.status === 'approved').reduce((s, p) => s + p.totalValue, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
            <span>PROPOSAL FUNNEL</span>
            <span className="text-slate-600">·</span>
            <span>PHPMailer & SUPABASE SOW ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Agency Proposals & SOW Architecture
          </h1>
        </div>

        {/* View Mode Toggle: Generator Studio vs Funnel List */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setEditingProposalForGenerator(null);
                setActiveViewMode('generator');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeViewMode === 'generator'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Proposal Generator (Live Form)
            </button>
            <button
              onClick={() => setActiveViewMode('funnel')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeViewMode === 'funnel'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Proposals Funnel ({proposals.length})
            </button>
          </div>

          <button
            onClick={() => {
              setEditingProposalForGenerator(null);
              setActiveViewMode('generator');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all shadow-md shadow-orange-950/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Proposal</span>
          </button>
        </div>
      </div>

      {/* RENDER VIEW 1: PROPOSAL GENERATOR STUDIO FORM (MATCHING REFERENCE IMAGE 2) */}
      {activeViewMode === 'generator' && (
        <ProposalGeneratorForm
          initialProposal={editingProposalForGenerator}
          clients={clients}
          smtpConfig={smtpConfig}
          onSave={(prop) => {
            onSaveProposal(prop);
            setActiveViewMode('funnel');
            setEditingProposalForGenerator(null);
          }}
          onSendViaMailer={onSendProposalViaMailer}
          onConvertToInvoice={onConvertToInvoice}
          onClose={() => {
            setActiveViewMode('funnel');
            setEditingProposalForGenerator(null);
          }}
        />
      )}

      {/* RENDER VIEW 2: PROPOSALS FUNNEL LIST */}
      {activeViewMode === 'funnel' && (
        <>
          {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Total Pipeline Value</span>
          <span className="text-xl font-bold text-white font-mono tabular-nums">
            ${totalPipeline.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Approved Contracts</span>
          <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            ${approvedTotal.toLocaleString()}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Active Proposals</span>
          <span className="text-xl font-bold text-orange-400 font-mono">
            {proposals.filter(p => p.status === 'sent' || p.status === 'draft').length} Under Review
          </span>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search proposal #, title, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-full sm:w-auto">
          {(['all', 'approved', 'sent', 'draft', 'declined'] as const).map((filter) => (
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

      {/* Proposals Grid with 3D Tilt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProposals.map((proposal) => {
          const isApproved = proposal.status === 'approved';
          const isSent = proposal.status === 'sent';

          return (
            <Card3D key={proposal.id} intensity={8} className="rounded-2xl">
              <div className="h-full p-5 rounded-2xl bg-gradient-to-b from-[#111827]/90 to-[#0b101c]/95 border border-slate-800/80 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-orange-400">
                      {proposal.proposalNumber}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                      isApproved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isSent
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {proposal.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display line-clamp-2">
                    {proposal.title}
                  </h3>

                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">Client: </span>
                    <span className="font-semibold text-white">{proposal.clientName}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proposal.summary}
                  </p>

                  {/* Bundled Services */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      Included Services:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proposal.services.map((svc, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones count and Contract Value */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      {proposal.milestones.length} Milestones
                    </span>
                    <span className="font-mono font-bold text-lg text-white tabular-nums">
                      ${proposal.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingProposal(proposal)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => handleDispatchMailer(proposal)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Dispatch via PHPMailer"
                    >
                      <Send className="w-3 h-3" />
                      <span>PHP Mail</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingProposalForGenerator(proposal);
                        setActiveViewMode('generator');
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Open in Live Proposal Generator Form"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Form</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {isApproved && (
                      <button
                        onClick={() => onConvertToInvoice(proposal)}
                        className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
                        title="Convert to Invoice"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Delete proposal ${proposal.proposalNumber}?`)) {
                          onDeleteProposal(proposal.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                      title="Delete Proposal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          );
        })}
      </div>
      </>
      )}

      {/* Create Proposal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DigiCoyoteLogo size={24} />
                <h2 className="text-lg font-bold text-white font-display">
                  Architect Agency Proposal
                </h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="text-slate-400">Valid Until Date</label>
                  <input
                    type="date"
                    value={formValidUntil}
                    onChange={(e) => setFormValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Proposal Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Next-Gen 3D Web & Generative AI Transformation"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Executive Summary</label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  placeholder="High-level narrative outlining the strategic objectives and quantifiable outcomes..."
                />
              </div>

              {/* Service Selection from 25 DigiCoyotes Capabilities */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-slate-400 block font-mono">
                  Bundle DigiCoyotes Capabilities (Click to toggle):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {DIGICOYOTES_SERVICES.map((svc) => {
                    const isSelected = formSelectedServices.includes(svc.title);
                    return (
                      <button
                        type="button"
                        key={svc.id}
                        onClick={() => toggleService(svc.title)}
                        className={`px-2 py-1.5 rounded text-[11px] text-left transition-colors truncate cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white font-semibold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                        title={svc.title}
                      >
                        {svc.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Milestones Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 font-mono">
                    Milestone Schedule & Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
                  >
                    + Add Milestone Phase
                  </button>
                </div>

                <div className="space-y-3">
                  {formMilestones.map((m, idx) => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[11px] text-slate-400">Phase Title</label>
                          <input
                            type="text"
                            value={m.title}
                            onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[11px] text-slate-400">Duration</label>
                          <input
                            type="text"
                            value={m.duration}
                            onChange={(e) => handleMilestoneChange(idx, 'duration', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] text-slate-400">Cost ($)</label>
                            {formMilestones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMilestone(idx)}
                                className="text-slate-500 hover:text-rose-400 text-[10px] cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={m.cost}
                            onChange={(e) => handleMilestoneChange(idx, 'cost', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-right"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        value={m.deliverable}
                        onChange={(e) => handleMilestoneChange(idx, 'deliverable', e.target.value)}
                        placeholder="Deliverables included in this sprint..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-400">Total Contract Valuation:</span>
                <span className="text-xl font-bold text-orange-400 tabular-nums">
                  ${totalValue.toLocaleString()}
                </span>
              </div>

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
                  Save Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Proposal Modal */}
      {viewingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl bg-[#0f1422] border border-slate-800 p-6 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">
                Agency Statement of Work // {viewingProposal.proposalNumber}
              </span>
              <div className="flex items-center gap-2">
                {viewingProposal.status !== 'approved' && (
                  <button
                    onClick={() => handleApproveProposal(viewingProposal)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Client Approve & Sign</span>
                  </button>
                )}
                {viewingProposal.status === 'approved' && (
                  <button
                    onClick={() => {
                      onConvertToInvoice(viewingProposal);
                      setViewingProposal(null);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Create Invoice from Proposal</span>
                  </button>
                )}
                <button
                  disabled={isSending}
                  onClick={() => handleDispatchMailer(viewingProposal)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending...' : 'Dispatch via PHPMailer'}</span>
                </button>
                <button
                  onClick={() => { setViewingProposal(null); setSendSuccessMessage(null); setSmtpDebugLogs([]); }}
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

            {/* Printable Proposal Body */}
            <div className="p-8 rounded-2xl bg-[#090d16] border border-slate-800/90 text-slate-200 space-y-8 font-sans">
              <div className="flex items-start justify-between">
                <div>
                  <DigiCoyoteLogo size={42} showText={true} />
                  <p className="text-xs text-slate-400 pt-2">
                    Digital Coyotes Strategy & Engineering<br />
                    Prepared for: <span className="text-white font-semibold">{viewingProposal.clientName}</span> ({viewingProposal.clientEmail})<br />
                    Official Destination: <span className="text-orange-400 font-mono font-medium">thedigitalcoyotes@gmail.com</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-orange-400 font-bold block">{viewingProposal.proposalNumber}</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase font-bold ${
                    viewingProposal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {viewingProposal.status}
                  </span>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Valid Until: {viewingProposal.validUntil}
                  </div>
                </div>
              </div>

              {/* Title & Executive Summary */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <h1 className="text-2xl font-bold text-white font-display">
                  {viewingProposal.title}
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {viewingProposal.summary}
                </p>
              </div>

              {/* Active Capabilities */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 block">
                  Engaged DigiCoyotes Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProposal.services.map((svc, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-orange-300 font-medium">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones Schedule */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-slate-400 block">
                  Implementation Milestones & Investment Schedule:
                </span>
                <div className="space-y-2">
                  {viewingProposal.milestones.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-orange-400">{m.duration}</span>
                          <span className="font-semibold text-white text-xs">{m.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{m.deliverable}</p>
                      </div>
                      <div className="font-mono font-bold text-white text-sm whitespace-nowrap text-right">
                        ${m.cost.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Investment Callout */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-orange-500/10 via-slate-900 to-transparent border border-orange-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-orange-400 block">Total Project Investment</span>
                  <span className="text-xs text-slate-400">Milestone phased payment schedule</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  ${viewingProposal.totalValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* SMTP Debug Socket Log */}
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
    </div>
  );
};
