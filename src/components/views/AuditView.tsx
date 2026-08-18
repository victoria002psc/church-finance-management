import React, { useState } from 'react';
import { AuditLog } from '../../types.ts';
import { History, Search, ShieldCheck, Filter, Clock, User, Layers } from 'lucide-react';

interface AuditViewProps {
  auditLogs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <History className="w-4 h-4" />
          <span>Immutable Audit Log</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          Level 3 Action History & Transaction Integrity
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Rules 39, 40, 41 & 61: Every material financial action records who, when, previous values, new values, approvals, disbursements, acknowledgements, and OCR verifications.
        </p>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by actor, action, transaction ID, or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="ALL">All Entity Types</option>
              <option value="REQUEST">Money Requests</option>
              <option value="MONEY_GIVEN">Money Given</option>
              <option value="MONEY_RECEIVED">Money Received</option>
              <option value="EXPENSE">Expenses</option>
              <option value="OCR_REVIEW">OCR Reviews</option>
              <option value="L4_PERSON">L4 People</option>
              <option value="L4_TO_L4">L4 &rarr; L4 Transfers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Timeline / Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-stone-50/80 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-stone-900">{log.actorName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {log.actorRole}
                  </span>
                  <span className="text-xs text-stone-400">&bull;</span>
                  <span className="text-xs font-semibold text-emerald-800 font-mono">
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">#{log.entityId}</span>
                </div>

                <div className="text-[11px] font-mono text-stone-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {log.details}
              </p>

              {(log.previousValue || log.newValue) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-stone-50 p-2 rounded-lg border border-stone-200">
                  {log.previousValue && (
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">Previous State:</span>
                      <span className="text-rose-700 font-mono">{log.previousValue}</span>
                    </div>
                  )}
                  {log.newValue && (
                    <div>
                      <span className="text-stone-400 text-[10px] uppercase font-bold block">New State:</span>
                      <span className="text-emerald-700 font-mono font-bold">{log.newValue}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-xs text-stone-400">
              No audit records matching criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
