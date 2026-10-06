import React, { useState } from 'react';
import { Client, ServiceItem } from '../types';
import { DIGICOYOTES_SERVICES } from '../data/services';
import { Card3D } from '../components/Card3D';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Receipt, 
  Edit3, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Download
} from 'lucide-react';

interface ClientsPageProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onCreateInvoiceForClient: (client: Client) => void;
  onCreateProposalForClient: (client: Client) => void;
  onSendDirectEmail: (client: Client) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onCreateInvoiceForClient,
  onCreateProposalForClient,
  onSendDirectEmail
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'lead' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    status: 'active' as 'active' | 'lead' | 'inactive',
    notes: '',
    activeServices: [] as string[]
  });

  const openAddModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      location: '',
      status: 'active',
      notes: '',
      activeServices: ['Web Design & Development']
    });
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      location: client.location,
      status: client.status,
      notes: client.notes,
      activeServices: client.activeServices
    });
    setIsModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;

    if (editingClient) {
      const updated: Client = {
        ...editingClient,
        ...formData
      };
      onUpdateClient(updated);
    } else {
      const newClient: Client = {
        id: `cli-${Date.now()}`,
        ...formData,
        totalBilled: 0,
        createdAt: new Date().toISOString()
      };
      onAddClient(newClient);
    }

    setIsModalOpen(false);
  };

  const toggleService = (serviceTitle: string) => {
    setFormData(prev => {
      const exists = prev.activeServices.includes(serviceTitle);
      return {
        ...prev,
        activeServices: exists
          ? prev.activeServices.filter(s => s !== serviceTitle)
          : [...prev.activeServices, serviceTitle]
      };
    });
  };

  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.company.toLowerCase().includes(search.toLowerCase()) ||
                        c.email.toLowerCase().includes(search.toLowerCase()) ||
                        c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBilledAll = clients.reduce((acc, c) => acc + c.totalBilled, 0);

  const handleExportCsv = () => {
    const headers = [
      'Client ID',
      'Name',
      'Company',
      'Email',
      'Phone',
      'Location',
      'Status',
      'Subscribed Services',
      'Total Billed (INR)',
      'Created At',
      'Notes'
    ];

    const rows = filteredClients.map(c => [
      `"${c.id}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.company || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${(c.activeServices || []).join('; ').replace(/"/g, '""')}"`,
      c.totalBilled || 0,
      `"${c.createdAt || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `digital_coyotes_clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
            <span>CLIENT MANAGEMENT</span>
            <span className="text-slate-600">·</span>
            <span>SUPABASE CRM POSTGRESQL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Client Directory & Accounts
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
            title="Download client directory as CSV file"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all shadow-md shadow-orange-950/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Total Directory</span>
          <span className="text-xl font-bold text-white font-mono">{clients.length} Accounts</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Active Service Contracts</span>
          <span className="text-xl font-bold text-orange-400 font-mono">
            {clients.filter(c => c.status === 'active').length} Active
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 block font-mono">Cumulative Agency Invoicing</span>
          <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            ₹{totalBilledAll.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by client, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-full sm:w-auto">
          {(['all', 'active', 'lead', 'inactive'] as const).map((filter) => (
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

      {/* Clients Cards Grid with 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const initials = client.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2);

          return (
            <Card3D key={client.id} intensity={8} className="rounded-2xl">
              <div className="h-full p-5 rounded-2xl bg-gradient-to-b from-[#111827]/90 to-[#0b101c]/95 border border-slate-800/80 hover:border-orange-500/40 transition-all flex flex-col justify-between space-y-4">
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center font-bold text-white text-sm shadow-md">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-display leading-tight">
                          {client.name}
                        </h3>
                        <p className="text-xs text-orange-400 font-medium">
                          {client.company}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                      client.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : client.status === 'lead'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${client.email}`} className="hover:text-orange-400 truncate">
                        {client.email}
                      </a>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Active DigiCoyotes Services */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      Active DigiCoyotes Services:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {client.activeServices.map((svc, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Total Billed:</span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      ₹{client.totalBilled.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCreateInvoiceForClient(client)}
                      className="px-2 py-1 text-[11px] font-medium rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/30 transition-colors cursor-pointer"
                      title="Create Invoice"
                    >
                      + Invoice
                    </button>
                    <button
                      onClick={() => onCreateProposalForClient(client)}
                      className="px-2 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Create Proposal"
                    >
                      + Proposal
                    </button>
                    <button
                      onClick={() => onSendDirectEmail(client)}
                      className="p-1 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      title="Dispatch PHPMailer Notice"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(client)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      title="Edit Client"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove client ${client.name}?`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                      title="Delete Client"
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

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display">
                {editingClient ? 'Edit Client Record' : 'Add New Client to Supabase'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Elena Rostova"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Apex Autonomous Labs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Email Address (For PHPMailer) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    placeholder="client@company.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="active">Active Client</option>
                    <option value="lead">Prospect / Lead</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Service Selection from Digital Coyotes Capabilities */}
              <div className="space-y-1.5">
                <label className="text-slate-400 block">
                  Subscribed Services ({DIGICOYOTES_SERVICES.length} Available):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {DIGICOYOTES_SERVICES.map((svc) => {
                    const isSelected = formData.activeServices.includes(svc.title);
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

              <div className="space-y-1">
                <label className="text-slate-400">Internal Agency Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Key account preferences, contract terms, billing contacts..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-md cursor-pointer"
                >
                  {editingClient ? 'Save Changes' : 'Save Client to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
