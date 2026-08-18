import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  UserCheck,
  Building,
  CheckCircle2
} from 'lucide-react';
import { L2DashboardData } from '../../../types.ts';

interface Level2AuditViewProps {
  data: L2DashboardData;
}

export const Level2AuditView: React.FC<Level2AuditViewProps> = ({ data }) => {
  const { auditLogs } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.newValue && log.newValue.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterAction === 'ALL' || log.actorRole === filterAction;

    return matchesSearch && matchesFilter;
  });

  return (
    <div id="level2-audit-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              IMMUTABLE LOGS
            </span>
            <span className="text-xs text-slate-400">Diocesan Central Audit Records</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Diocesan Financial & Governance Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically structured ledger logging every fund disbursement, Level 1 acknowledgement, direct payment, and hierarchy creation.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-right">
          <div className="text-[10px] text-slate-400">Total Audit Records</div>
          <div className="text-base font-bold text-emerald-400">{auditLogs.length} Events</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, actor, amount, or transaction detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Roles & Levels</option>
            <option value="LEVEL_1">Level 1 (Bishops)</option>
            <option value="LEVEL_2">Level 2 (Directors)</option>
            <option value="LEVEL_3">Level 3 (Overseers)</option>
            <option value="LEVEL_4">Level 4 (Workers)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No matching audit logs found.</p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2 hover:border-slate-600 transition-colors text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-700 text-slate-200 rounded border border-slate-600">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-200">
                      {log.actorName} ({log.actorRole})
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </div>
                </div>

                <p className="text-slate-300 pl-1">{log.details}</p>

                {(log.previousValue || log.newValue) && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-700/60 text-[11px] text-slate-400">
                    {log.previousValue && (
                      <div>
                        <span className="text-slate-500 mr-1">Previous:</span>
                        <span className="text-slate-300">{log.previousValue}</span>
                      </div>
                    )}
                    {log.newValue && (
                      <div>
                        <span className="text-slate-500 mr-1">New:</span>
                        <span className="text-emerald-400 font-semibold">{log.newValue}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
