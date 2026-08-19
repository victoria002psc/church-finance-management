import React, { useState } from 'react';
import { AuditLog } from '../../types.ts';
import { History, ShieldCheck, Eye, Clock, User } from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface AuditViewProps {
  auditLogs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({
  auditLogs = [],
}) => {
  const [selectedAuditDrawer, setSelectedAuditDrawer] = useState<AuditLog | null>(null);

  return (
    <div id="level3-audit-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Audit History
          </h1>
        </div>
      </div>

      {/* AUDIT LOG TIMELINE */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <History className="w-4 h-4 text-[#2563EB]" />
          <span>Activity Log</span>
        </h2>

        <div className="divide-y divide-[#EBE6DD]">
          {(auditLogs || []).map((log) => {
            // Human-readable primary title
            const humanActionTitle = log.actionDetails || log.actionType || 'System Event Recorded';

            return (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center flex-shrink-0 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    {/* Primary Level 1 Human Readable Content */}
                    <div className="font-bold text-[#171717] truncate">{humanActionTitle}</div>
                    <div className="text-[10px] text-[#5F6368] truncate">
                      By <strong>{log.performedByName || 'Overseer'}</strong> &bull; {log.timestamp || log.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-[#F7F5F0] border border-[#E7E2D8] text-[#171717] rounded">
                    {log.actionType}
                  </span>
                  <button
                    onClick={() => setSelectedAuditDrawer(log)}
                    className="px-2 py-1 bg-white hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded text-[10px] font-semibold text-[#171717] cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-[#5F6368]" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TECHNICAL AUDIT DRAWER (LEVEL 3 PROGRESSIVE DISCLOSURE) */}
      <DetailDrawer
        isOpen={!!selectedAuditDrawer}
        onClose={() => setSelectedAuditDrawer(null)}
        title={selectedAuditDrawer?.actionDetails || 'Audit Log Trace'}
        subtitle={`Audit ID: ${selectedAuditDrawer?.id || ''}`}
      >
        {selectedAuditDrawer && (
          <div className="space-y-4 text-xs text-[#171717]">
            <div className="p-3.5 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-1.5 font-mono">
              <div><span className="font-semibold text-[#171717]">User ID:</span> {selectedAuditDrawer.performedById || '#usr_level_3_178705031166'}</div>
              <div><span className="font-semibold text-[#171717]">User Name:</span> {selectedAuditDrawer.performedByName}</div>
              <div><span className="font-semibold text-[#171717]">Action Type:</span> {selectedAuditDrawer.actionType}</div>
              <div><span className="font-semibold text-[#171717]">Entity ID:</span> {selectedAuditDrawer.entityId}</div>
              <div><span className="font-semibold text-[#171717]">Timestamp:</span> {selectedAuditDrawer.timestamp}</div>
            </div>

            {selectedAuditDrawer.previousValue && (
              <div className="space-y-1">
                <div className="font-bold text-[#171717] uppercase text-[10px]">Previous State</div>
                <pre className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[10px] overflow-x-auto">
                  {JSON.stringify(selectedAuditDrawer.previousValue, null, 2)}
                </pre>
              </div>
            )}

            {selectedAuditDrawer.newValue && (
              <div className="space-y-1">
                <div className="font-bold text-[#171717] uppercase text-[10px]">New State</div>
                <pre className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] overflow-x-auto">
                  {JSON.stringify(selectedAuditDrawer.newValue, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
