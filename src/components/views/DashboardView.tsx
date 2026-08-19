import React, { useState } from 'react';
import { L3DashboardData, MoneyRequest, Expense, SourceBalance } from '../../types.ts';
import { 
  Send, 
  Inbox, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Layers,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface DashboardViewProps {
  data: L3DashboardData;
  onOpenGiveMoney: () => void;
  onOpenReviewRequest: (request: MoneyRequest) => void;
  onOpenExpenseDetail: (expense: Expense) => void;
  onOpenTrace: (item: any, type: 'MONEY_GIVEN' | 'MONEY_RECEIVED' | 'EXPENSE' | 'REQUEST') => void;
  onOpenMultiSource: () => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onOpenGiveMoney,
  onOpenReviewRequest,
  onOpenExpenseDetail,
  onOpenTrace,
  onOpenMultiSource,
  onSelectTab,
}) => {
  const { 
    currentL3User, 
    totalAvailable = 0, 
    sourceBalances = [], 
    pendingRequestsCount = 0, 
    unacknowledgedExpensesCount = 0, 
    ocrMismatchesCount = 0,
    requests = [],
    recentMoneyMovements = [],
  } = data || {};

  const [selectedSourceDrawer, setSelectedSourceDrawer] = useState<SourceBalance | null>(null);

  const totalReceived = (sourceBalances || []).reduce((sum, s) => sum + (s?.receivedAmount ?? (s as any)?.totalReceived ?? 0), 0);
  const totalGiven = (sourceBalances || []).reduce((sum, s) => sum + (s?.allocatedAmount ?? (s as any)?.totalGiven ?? 0), 0);

  const activeAlertsCount = (pendingRequestsCount || 0) + (unacknowledgedExpensesCount || 0) + (ocrMismatchesCount || 0);

  return (
    <div id="level3-dashboard-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#D4AF37]/20 text-[#24152F] border border-[#D4AF37]/40 rounded-md">
              LEVEL 3 OVERSEER
            </span>
            <span className="text-xs text-[#5F6368] font-medium">{currentL3User?.assignedArea || 'Ministry Operations'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            {currentL3User?.assignedArea || 'Ministry Operations'} • {(sourceBalances || []).length} sources
          </p>
        </div>

        {/* PRIMARY CTA & ACTIONS */}
        <div className="flex items-center space-x-2.5">
          <button
            id="dash-give-money-btn"
            onClick={onOpenGiveMoney}
            className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Give Money</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 — THREE CORE METRICS ONLY WITH TABULAR NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Core Metric 1: Available */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Available Balance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#009E68] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{(totalAvailable || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">
            Across {(sourceBalances || []).length} sources
          </div>
        </div>

        {/* Core Metric 2: Received */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Received</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">
            From Level 2
          </div>
        </div>

        {/* Core Metric 3: Given */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Given</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{totalGiven.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">
            To Level 4 team
          </div>
        </div>

      </div>

      {/* SECTION 2 — NEEDS YOUR ATTENTION */}
      {activeAlertsCount > 0 ? (
        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#171717] text-xs">Needs Your Attention</h3>
              <p className="text-[11px] text-[#5F6368] mt-0.5 font-medium leading-relaxed">
                {pendingRequestsCount > 0 && `${pendingRequestsCount} pending request(s). `}
                {unacknowledgedExpensesCount > 0 && `${unacknowledgedExpensesCount} expense(s) to review. `}
                {ocrMismatchesCount > 0 && `${ocrMismatchesCount} OCR mismatch(es).`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab(pendingRequestsCount > 0 ? 'requests' : 'expenses')}
            className="px-3 py-1.5 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#24152F] font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Review Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-[#009E68]/10 border border-[#009E68]/30 rounded-xl flex items-center space-x-2.5 text-xs text-[#009E68] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#009E68] flex-shrink-0" />
          <span>All caught up — no pending items.</span>
        </div>
      )}

      {/* SECTION 3 — LEVEL 2 SOURCES (Source-Aware Ledger Table) */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Funding Sources</span>
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('money')}
            className="text-[11px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE6DD] text-[#5F6368] font-semibold uppercase text-[9px] tracking-wider">
                <th className="py-2 px-2.5">Source Name</th>
                <th className="py-2 px-2.5">Purpose</th>
                <th className="py-2 px-2.5 text-right">Available Balance</th>
                <th className="py-2 px-2.5 text-center">Status</th>
                <th className="py-2 px-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DD]">
              {(sourceBalances || []).map((src) => (
                <tr key={src.id} className="hover:bg-[#F9F8F6] transition-colors">
                  <td className="py-2.5 px-2.5 font-bold text-[#171717]">
                    {src.fundName || src.sourceL2Name || (src as any).sourceName || 'Funding Source'}
                  </td>
                  <td className="py-2.5 px-2.5 text-[#5F6368] font-medium">{src.purpose || 'General Ministry'}</td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-[#009E68] font-bold tabular-nums">
                    ₹{(src.availableAmount ?? (src as any).available ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30">
                      Active
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <button
                      onClick={() => setSelectedSourceDrawer(src)}
                      className="px-2 py-1 bg-white hover:bg-[#F7F5F0] text-[#171717] border border-[#E7E2D8] rounded-md text-[10px] font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3 text-[#5F6368]" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 — LEVEL 4 ACTIVITY (Compact Row Stream) */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
            <Inbox className="w-4 h-4 text-[#009E68]" />
              <span>Recent Requests</span>
          </h3>
          <button
            onClick={() => onSelectTab('requests')}
            className="text-[11px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="divide-y divide-[#EBE6DD]">
          {(requests || []).slice(0, 4).map((req) => (
            <div key={req.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#171717] truncate">{req.requesterName || 'Field Worker'}</div>
                <div className="text-[10px] text-[#5F6368] truncate">
                  {req.remarks || (req as any).purpose || 'Ministry Request'} &bull; {req.requestedAt || (req as any).date || ''}
                </div>
              </div>
              <div className="text-right flex items-center space-x-2.5 flex-shrink-0">
                <div className="font-mono tabular-nums">
                  <div className="font-bold text-[#171717]">₹{(req.amount || 0).toLocaleString('en-IN')}</div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    req.status === 'MONEY_GIVEN' 
                      ? 'bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30' 
                      : req.status === 'APPROVED' 
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' 
                      : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30'
                  }`}>
                    {req.status === 'MONEY_GIVEN' ? 'Money Given' : req.status === 'APPROVED' ? 'Approved' : 'Requested'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenReviewRequest(req)}
                  className="p-1 bg-white border border-[#E7E2D8] hover:bg-[#F7F5F0] rounded text-[#5F6368] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5 — RECENT ACTIVITY */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Recent Activity</h3>
        <div className="divide-y divide-[#EBE6DD] max-h-56 overflow-y-auto">
          {(recentMoneyMovements || []).slice(0, 5).map((mv: any) => (
            <div key={mv.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                {'giverL3Id' in mv ? (
                  <ArrowUpRight className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-[#009E68] flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="font-bold text-[#171717] truncate">
                    {'giverL3Id' in mv ? `Disbursed to ${mv.recipientL4Name || 'Field Worker'}` : `Received from ${mv.fromL2Name || 'Level 2'}`}
                  </div>
                  <div className="text-[10px] text-[#5F6368] truncate">{mv.purpose || mv.remarks || 'Financial Transfer'}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 font-mono tabular-nums">
                <div className="font-bold text-[#171717]">₹{(mv.amount || 0).toLocaleString('en-IN')}</div>
                <div className="text-[9px] text-[#7A7A7A]">{mv.timestamp || mv.date || ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOURCE DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedSourceDrawer}
        onClose={() => setSelectedSourceDrawer(null)}
        title={selectedSourceDrawer?.fundName || selectedSourceDrawer?.sourceL2Name || (selectedSourceDrawer as any)?.sourceName || 'Source Details'}
        subtitle={`Purpose: ${selectedSourceDrawer?.purpose || 'Ministry Operations'}`}
      >
        {selectedSourceDrawer && (
          <div className="space-y-6">
            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-[#24152F] uppercase">Balance Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div className="text-[10px] text-[#5F6368] uppercase font-bold">Total Received</div>
                  <div className="text-xs font-bold text-[#2563EB] font-mono tabular-nums mt-0.5">
                    ₹{(selectedSourceDrawer.receivedAmount ?? (selectedSourceDrawer as any).totalReceived ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5F6368] uppercase font-bold">Total Given</div>
                  <div className="text-xs font-bold text-[#F59E0B] font-mono tabular-nums mt-0.5">
                    ₹{(selectedSourceDrawer.allocatedAmount ?? (selectedSourceDrawer as any).totalGiven ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5F6368] uppercase font-bold">Available</div>
                  <div className="text-xs font-bold text-[#009E68] font-mono tabular-nums mt-0.5">
                    ₹{(selectedSourceDrawer.availableAmount ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wider">Source Info</h4>
              <div className="p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-1.5 text-xs text-[#171717]">
                <div><span className="font-semibold">Source Name:</span> {selectedSourceDrawer.sourceL2Name || selectedSourceDrawer.fundName}</div>
                <div><span className="font-semibold">Purpose:</span> {selectedSourceDrawer.purpose}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedSourceDrawer(null);
                onOpenGiveMoney();
              }}
              className="w-full py-2.5 bg-[#009E68] hover:bg-[#009E68]/90 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Give Money from this Source
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
