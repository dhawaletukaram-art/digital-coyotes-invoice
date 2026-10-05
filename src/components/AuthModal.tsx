import React, { useState } from 'react';
import { UserProfile, SupabaseConfig } from '../types';
import { DigiCoyoteLogo } from './Logo';
import { ShieldCheck, User, Key, Check, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  supabaseConfig: SupabaseConfig;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  supabaseConfig,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'switch_role' | 'supabase_auth'>('profile');
  const [emailInput, setEmailInput] = useState<string>(userProfile.email);
  const [nameInput, setNameInput] = useState<string>(userProfile.name);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = nameInput
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    onUpdateProfile({
      ...userProfile,
      name: nameInput,
      email: emailInput,
      avatarInitials: initials || 'AG'
    });
    setFeedback('Profile details saved.');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleRoleSelect = (role: 'agency_admin' | 'project_manager' | 'client') => {
    onUpdateProfile({
      ...userProfile,
      role
    });
    setFeedback(`Active view switched to: ${role.replace('_', ' ')}`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DigiCoyoteLogo size={24} />
            <h2 className="text-base font-bold text-white font-display">
              Agency Account & Auth
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('switch_role')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'switch_role' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Switch Role
          </button>
          <button
            onClick={() => setActiveTab('supabase_auth')}
            className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'supabase_auth' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Supabase Auth
          </button>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
            {feedback}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-lg font-bold text-white shadow-md">
                {userProfile.avatarInitials}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">{userProfile.name}</div>
                <div className="text-slate-400 text-xs font-mono">{userProfile.email}</div>
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase">
                  {userProfile.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[11px] text-orange-300 font-mono space-y-1">
              <div className="font-bold text-orange-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Primary Agency Proposal Destination:</span>
              </div>
              <div className="text-slate-300">
                All client proposals are automatically archived & sent to <span className="text-white font-semibold underline">thedigitalcoyotes@gmail.com</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Email Address (Sign In)</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEmailInput('thedigitalcoyotes@gmail.com');
                  setNameInput('Digital Coyotes Admin');
                  onUpdateProfile({
                    ...userProfile,
                    name: 'Digital Coyotes Admin',
                    email: 'thedigitalcoyotes@gmail.com',
                    avatarInitials: 'DC'
                  });
                  setFeedback('Signed in as thedigitalcoyotes@gmail.com');
                  setTimeout(() => setFeedback(null), 2500);
                }}
                className="text-[11px] text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
              >
                Use thedigitalcoyotes@gmail.com
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* ROLE SWITCHER TAB */}
        {activeTab === 'switch_role' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Toggle roles to test different permissions and UI views in Digital Coyotes:
            </p>

            <div className="space-y-2">
              {[
                { id: 'agency_admin', title: 'Agency Admin', desc: 'Full access to financial ledger, SMTP credentials, client deletion, and PHP backend.' },
                { id: 'project_manager', title: 'Project Manager', desc: 'Can create proposals, dispatch invoices, and manage service milestones.' },
                { id: 'client', title: 'Client View', desc: 'Read-only portal view for reviewing and approving proposals and settling invoices.' }
              ].map((r) => {
                const isCurrent = userProfile.role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id as any)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-orange-500/10 border-orange-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.title}</span>
                      {isCurrent && <span className="text-orange-400 font-mono text-[10px]">[CURRENT]</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUPABASE AUTH TAB */}
        {activeTab === 'supabase_auth' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Supabase Auth Provider:</span>
                <span className="text-emerald-400 font-mono">Active</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                Host: {supabaseConfig.url}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Session: Authenticated (thedigitalcoyotes@gmail.com)
              </div>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              Users are authenticated through Supabase Auth JWT tokens. Row Level Security policies verify role permissions before allowing updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
