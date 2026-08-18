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
    <div id="level3-dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              LEVEL 3 OVERSEER
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentL3User?.assignedArea || 'Ministry Operations'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Level 3 — Department Fund Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Overseeing {(sourceBalances || []).length} Level 2 Funding Sources & Parish Team Allocations
          </p>
        </div>

        {/* PRIMARY CTA & ACTIONS */}
        <div className="flex items-center space-x-3">
          <button
            id="dash-give-money-btn"
            onClick={onOpenGiveMoney}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Give Money</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 — THREE CORE METRICS ONLY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Core Metric 1: Available */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Balance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
            ₹{(totalAvailable || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Net liquidity across {(sourceBalances || []).length} sources
          </div>
        </div>

        {/* Core Metric 2: Received */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Received</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2 font-mono">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Granted from Level 2 Directors
          </div>
        </div>

        {/* Core Metric 3: Given */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Given</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 font-mono">
            ₹{totalGiven.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Disbursed to Level 4 Parish Team
          </div>
        </div>

      </div>

      {/* SECTION 2 — NEEDS YOUR ATTENTION */}
      {activeAlertsCount > 0 ? (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Needs Your Attention</h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                {pendingRequestsCount > 0 && `${pendingRequestsCount} money request(s) awaiting approval. `}
                {unacknowledgedExpensesCount > 0 && `${unacknowledgedExpensesCount} expense voucher(s) requiring review. `}
                {ocrMismatchesCount > 0 && `${ocrMismatchesCount} OCR receipt mismatch(es) flagged.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab(pendingRequestsCount > 0 ? 'requests' : 'expenses')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Review Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>All Level 3 field requests and expenses are up to date. You're all caught up!</span>
        </div>
      )}

      {/* SECTION 3 — LEVEL 2 SOURCES (Compact List / Table) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Level 2 Funding Sources</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Preserved source balances and assigned project funds
            </p>
          </div>
          <button
            onClick={() => onSelectTab('money')}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
          >
            View Full Breakdown
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Source Name</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3 text-right">Available Balance</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(sourceBalances || []).map((src) => (
                <tr key={src.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {src.fundName || src.sourceL2Name || (src as any).sourceName || 'Funding Source'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{src.purpose || 'General Ministry'}</td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">
                    ₹{(src.availableAmount ?? (src as any).available ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedSourceDrawer(src)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-300 hover:border-amber-300 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 — LEVEL 4 ACTIVITY (Compact List) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-emerald-600" />
            <span>Level 4 Field Requests & Activity</span>
          </h3>
          <button
            onClick={() => onSelectTab('requests')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
          >
            Manage Requests
          </button>
        </div>

        <div className="space-y-2">
          {(requests || []).slice(0, 4).map((req) => (
            <div key={req.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{req.requesterName || 'Field Worker'}</div>
                <div className="text-[11px] text-slate-500">
                  {req.remarks || (req as any).purpose || 'Ministry Request'} &bull; {req.requestedAt || (req as any).date || ''}
                </div>
              </div>
              <div className="text-right flex items-center space-x-3">
                <div>
                  <div className="font-bold text-slate-900 font-mono">₹{(req.amount || 0).toLocaleString('en-IN')}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'MONEY_GIVEN' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : req.status === 'APPROVED' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {req.status === 'MONEY_GIVEN' ? 'Money Given' : req.status === 'APPROVED' ? 'Approved (Pending Disbursal)' : 'Requested'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenReviewRequest(req)}
                  className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5 — RECENT ACTIVITY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Financial Activity</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {(recentMoneyMovements || []).slice(0, 5).map((mv: any) => (
            <div key={mv.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                {'giverL3Id' in mv ? (
                  <ArrowUpRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-slate-900">
                    {'giverL3Id' in mv ? `Disbursed to ${mv.recipientL4Name || 'Field Worker'}` : `Received from ${mv.fromL2Name || 'Level 2'}`}
                  </div>
                  <div className="text-[11px] text-slate-500">{mv.purpose || mv.remarks || 'Financial Transfer'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900 font-mono">₹{(mv.amount || 0).toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-400 font-mono">{mv.timestamp || mv.date || ''}</div>
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
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase">Source Balance Tracking</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Received</div>
                  <div className="text-sm font-bold text-blue-600 font-mono">
                    ₹{(selectedSourceDrawer.receivedAmount ?? (selectedSourceDrawer as any).totalReceived ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Given</div>
                  <div className="text-sm font-bold text-amber-600 font-mono">
                    ₹{(selectedSourceDrawer.allocatedAmount ?? (selectedSourceDrawer as any).totalGiven ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Available</div>
                  <div className="text-sm font-bold text-emerald-600 font-mono">
                    ₹{(selectedSourceDrawer.availableAmount ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Level 2 Provider Info</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 font-medium">
                <div><span className="font-semibold text-slate-900">Source Name:</span> {selectedSourceDrawer.sourceL2Name || selectedSourceDrawer.fundName}</div>
                <div><span className="font-semibold text-slate-900">Purpose Tag:</span> {selectedSourceDrawer.purpose}</div>
                <div><span className="font-semibold text-slate-900">Isolation Status:</span> Preserved Ledger Balance</div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedSourceDrawer(null);
                onOpenGiveMoney();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Give Money from this Source
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
