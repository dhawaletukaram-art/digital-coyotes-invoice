import React, { useState } from 'react';
import { HistoryItem, MailLog } from '../types';
import { Card3D } from '../components/Card3D';
import { 
  History, 
  Mail, 
  Receipt, 
  FileCheck, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Terminal,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HistoryPageProps {
  history: HistoryItem[];
  mailLogs: MailLog[];
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  mailLogs
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mailer' | 'financial'>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<MailLog | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.actor.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'mailer') {
      return matchesSearch && (item.type === 'email_dispatched' || item.actor.includes('PHPMailer'));
    }
    if (activeTab === 'financial') {
      return matchesSearch && (item.type.includes('invoice') || item.type.includes('proposal'));
    }
    return matchesSearch;
  });

  const filteredMailLogs = mailLogs.filter(log => {
    return log.recipient.toLowerCase().includes(search.toLowerCase()) ||
           log.subject.toLowerCase().includes(search.toLowerCase()) ||
           log.bodySnippet.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
            <span>AUDIT TRAIL & SMTP TELEMETRY</span>
            <span className="text-slate-600">·</span>
            <span>SUPABASE PERSISTENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Activity History & PHPMailer Logs
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Stream Active</span>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Activity ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('mailer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mailer'
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>PHPMailer Transmissions ({mailLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Invoices & Proposals
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs or recipients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Main View: Either General Activity or Dedicated PHPMailer Logs */}
      {activeTab === 'mailer' ? (
        /* Dedicated PHPMailer SMTP Dispatch Logs View */
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">SMTP Host</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredMailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{log.recipientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.recipient}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200 max-w-xs truncate">
                        {log.subject}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-orange-400">
                        {log.smtpHost}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          Headers
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Unified System Activity Feed */
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="space-y-4">
            {filteredHistory.map((item, index) => {
              const isEmail = item.type === 'email_dispatched';
              const isPaid = item.type === 'invoice_paid';
              const isApproved = item.type === 'proposal_approved';

              return (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isEmail 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : isPaid 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isApproved
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isEmail ? <Mail className="w-4 h-4" /> : isPaid ? <Receipt className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-xs font-bold text-white">{item.title}</h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
                      <span>Actor: <span className="text-slate-300">{item.actor}</span></span>
                      {item.amount && (
                        <span>Amount: <span className="text-orange-400 font-bold">₹{item.amount.toLocaleString('en-IN')}</span></span>
                      )}
                      {item.statusBadge && (
                        <span className="text-emerald-400">[{item.statusBadge}]</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredHistory.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No history events match your current filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Mail Log Headers Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  PHPMailer Transmission Envelope
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-slate-400">Recipient: <span className="text-white">{selectedLog.recipient}</span></div>
                <div className="text-slate-400">Subject: <span className="text-white">{selectedLog.subject}</span></div>
                <div className="text-slate-400">SMTP Host: <span className="text-orange-400">{selectedLog.smtpHost}</span></div>
                <div className="text-slate-400">Mailer Header: <span className="text-emerald-400">{selectedLog.phpMailerHeader}</span></div>
                <div className="text-slate-400">Relay Response: <span className="text-slate-300">{selectedLog.response}</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block">Message Body Snippet:</span>
                <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 font-sans text-xs">
                  {selectedLog.bodySnippet}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
