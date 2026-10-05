import React from 'react';
import { DigiCoyoteLogo } from './Logo';
import { UserProfile, SupabaseConfig } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  FileText, 
  History, 
  Settings, 
  PlusCircle, 
  Database,
  Mail,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCreateInvoice: () => void;
  onOpenCreateProposal: () => void;
  supabaseConfig: SupabaseConfig;
  userProfile: UserProfile;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenCreateInvoice,
  onOpenCreateProposal,
  supabaseConfig,
  userProfile,
  onOpenAuth
}) => {
  const navItems = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clients', path: '/clients' },
    { label: 'Invoices', path: '/invoice' },
    { label: 'Proposals', path: '/proposal' },
    { label: 'History', path: '/history' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090d16]/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand mark */}
        <div 
          onClick={() => onNavigate('/')}
          className="cursor-pointer flex items-center gap-3 shrink-0 group"
        >
          <DigiCoyoteLogo size={32} showText={true} />
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-orange-400 bg-orange-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Create Invoice CTA */}
          <button
            onClick={onOpenCreateInvoice}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-sm shadow-orange-900/40 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Invoice</span>
          </button>

          {/* User Profile / Supabase Session */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors text-left cursor-pointer"
            title="User Profile & Supabase Auth"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {userProfile.avatarInitials}
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono capitalize">
                {userProfile.role.replace('_', ' ')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Sub-Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar bg-[#070b13]">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'text-orange-400 bg-orange-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
