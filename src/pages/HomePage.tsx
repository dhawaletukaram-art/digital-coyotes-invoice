import React, { useState } from 'react';
import { DIGICOYOTES_SERVICES } from '../data/services';
import { ServiceCategory, ServiceItem } from '../types';
import { Coyote3D } from '../components/Coyote3D';
import { Card3D } from '../components/Card3D';
import { DigiCoyoteLogo } from '../components/Logo';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Mail, 
  Database, 
  Code2, 
  Cpu, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectServiceForInvoice: (service: ServiceItem) => void;
  onSelectServiceForProposal: (service: ServiceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectServiceForInvoice,
  onSelectServiceForProposal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const categories: Array<'All' | ServiceCategory> = [
    'All',
    'Development & AI',
    'Design & Creative',
    'Marketing & Media',
    'Brand & Strategy'
  ];

  const filteredServices = DIGICOYOTES_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.typicalDeliverables.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section with 3D Spatial Coyote & VinShare Agency Core */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Positioning */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>DIGITAL COYOTES // AGENCY SUITE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">PHP & SUPABASE POWERED</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
              Autonomous Agency Systems for the <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Next Generation</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Digital Coyotes brings together all 25 high-impact capabilities—from Generative AI and 3D WebGL to Performance Ads and Web3. Managed with automated PHPMailer dispatch and resilient Supabase cloud data.
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm shadow-lg shadow-orange-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Launch Agency Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/invoice')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
              >
                <span>Create Invoice</span>
              </button>

              <button
                onClick={() => onNavigate('/proposal')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
              >
                <span>Generate Proposal</span>
              </button>
            </div>

            {/* Trust and Technical Architecture Badges */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block font-mono text-lg font-bold text-white tabular-nums">25</span>
                <span className="text-slate-400">Core Services</span>
              </div>
              <div>
                <span className="block font-mono text-lg font-bold text-orange-400 tabular-nums">99.8%</span>
                <span className="text-slate-400">PHPMailer Delivery</span>
              </div>
              <div>
                <span className="block font-mono text-lg font-bold text-emerald-400 tabular-nums">PostgreSQL</span>
                <span className="text-slate-400">Supabase Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Spatial Canvas */}
          <div className="lg:col-span-6 relative">
            <Coyote3D height={420} interactive={true} showControls={true} />
            
            {/* Overlay hint */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Drag in 3D to examine origami facets
              </span>
              <span>Wireframe & Themes supported</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Architecture Pillars: PHP + PHPMailer + Supabase + 3D */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card3D intensity={10} className="rounded-2xl">
          <div className="h-full p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">PHPMailer Automated Dispatch</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standardized SMTP socket transport using PHPMailer 6.9.1. Dispatches signed invoices, milestone proposals, and payment reminders with full delivery logs.
            </p>
            <div className="text-xs font-mono text-orange-400 pt-1">
              X-Mailer: PHPMailer 6.9.1 · TLS Handshake
            </div>
          </div>
        </Card3D>

        <Card3D intensity={10} className="rounded-2xl">
          <div className="h-full p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Supabase Cloud Database & Auth</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Reliable PostgreSQL persistence with Row-Level Security, multi-tenant client directories, invoice accounting ledger, and automated backup sync.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-1">
              PostgreSQL · Instant REST API · RLS Protected
            </div>
          </div>
        </Card3D>

        <Card3D intensity={10} className="rounded-2xl">
          <div className="h-full p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">3D Spatial & Motion Architecture</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive WebGL polyhedral geometries, responsive lighting, and 3D card tilt physics engineered for agency prestige and memorable brand experience.
            </p>
            <div className="text-xs font-mono text-blue-400 pt-1">
              Three.js · BufferGeometry · 60 FPS Orbit
            </div>
          </div>
        </Card3D>
      </section>

      {/* 3. The 25 DigiCoyotes Services Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-1">
              Full Spectrum Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              DigiCoyotes Services Catalog (25 Core Disciplines)
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Directly select any service below to automatically build an invoice or proposal line item.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search services or deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs (Buttons conforming to design constitution) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white font-semibold shadow-sm shadow-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service, index) => (
            <Card3D key={service.id} intensity={8} className="rounded-2xl group">
              <div className="h-full p-5 rounded-2xl bg-gradient-to-b from-[#101726]/90 to-[#0b101c]/95 border border-slate-800/80 hover:border-orange-500/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {String(index + 1).padStart(2, '0')}. {service.category}
                    </span>
                    {service.isPopular && (
                      <span className="text-[10px] font-mono font-medium text-orange-400">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors font-display">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Typical Deliverables */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Included Deliverables:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                      {service.typicalDeliverables.slice(0, 3).map((item, i) => (
                        <span key={i} className="inline-flex items-center text-slate-300">
                          {item}{i < 2 ? <span className="text-slate-600 mx-1">·</span> : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Line Item Action */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-mono block">From</span>
                    <span className="text-sm font-bold text-white font-mono tabular-nums">
                      ${service.startingRate.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectServiceForInvoice(service)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-orange-500/20 hover:text-orange-300 text-slate-300 border border-slate-700/80 transition-colors cursor-pointer"
                      title="Add to new Invoice"
                    >
                      + Invoice
                    </button>
                    <button
                      onClick={() => onSelectServiceForProposal(service)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                      title="Add to new Proposal"
                    >
                      + Proposal
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No services match your search query "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-xs text-orange-400 underline font-medium cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Client Portal & System Directory Jump Box */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-[#141b2c] via-[#0f1422] to-[#141b2c] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
              <DigiCoyoteLogo size={18} />
              <span>DIGITAL COYOTES AGENCY OS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Ready to automate client billing and proposal approvals?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Open the Digital Coyotes dashboard to view real-time revenue stats, track overdue accounts, dispatch PHPMailer notices, or inspect your connected Supabase tables.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2.5">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md transition-colors text-center cursor-pointer"
            >
              View Full Dashboard
            </button>
            <button
              onClick={() => onNavigate('/settings')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors text-center cursor-pointer"
            >
              Configure Supabase & PHPMailer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
