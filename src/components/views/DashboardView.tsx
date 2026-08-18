import React from 'react';
import { L3DashboardData, MoneyRequest, Expense, MoneyGiven, MoneyReceived } from '../../types.ts';
import { 
  Wallet, 
  Send, 
  Inbox, 
  Receipt, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Layers, 
  Clock, 
  Scan, 
  Scale, 
  ChevronRight,
  Search,
  Network
} from 'lucide-react';

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
    totalAvailable, 
    sourceBalances, 
    pendingRequestsCount, 
    unacknowledgedExpensesCount, 
    ocrMismatchesCount,
    bankDifferencesCount,
    requests,
    recentMoneyMovements,
    recentExpenses,
  } = data;

  const pendingRequests = requests.filter((r) => r.status === 'REQUESTED');
  const awaitingDisbursement = requests.filter((r) => r.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Top Greeting & Overseer Context */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Level 3 Field Overseer
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-300">{currentL3User.assignedArea}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {currentL3User.name} &mdash; Financial Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Parish fund allocation, multi-source tracking, field expense verification, OCR audit, and bank reconciliation.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-give-money-btn"
            onClick={onOpenGiveMoney}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Give Money</span>
          </button>
          <button
            id="dash-review-requests-btn"
            onClick={() => onSelectTab('requests')}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg border border-slate-700 flex items-center space-x-2 transition-all"
          >
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>Review Requests ({pendingRequestsCount})</span>
          </button>
          <button
            id="dash-source-balances-btn"
            onClick={() => onSelectTab('money')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Source Balances</span>
          </button>
        </div>
      </div>

      {/* Financial Balances Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Total Available Balance Card */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Total Available Funds</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Authoritative
              </span>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-stone-900 mt-1">
              ₹{totalAvailable.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Maintained across <strong className="text-stone-700">{sourceBalances.length} distinct Level 2 sources</strong> without automatic merging.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Available Reserves:</span>
            <span className="font-mono font-bold text-emerald-700">₹{totalAvailable.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Source Balances Breakdown Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Isolated Source Balances</span>
              </span>
              <button
                onClick={onOpenMultiSource}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded border border-teal-200"
              >
                Multi-Source Allocation Tool
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sourceBalances.map((source) => (
                <div 
                  key={source.id} 
                  className="bg-stone-50 border border-stone-200 rounded-lg p-3.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900 truncate">{source.fundName}</span>
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-700">
                    ₹{source.availableAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="mt-2 text-[10.5px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200">
                    <span>Recv: <strong className="font-mono text-stone-700">₹{source.receivedAmount.toLocaleString('en-IN')}</strong></span>
                    <span>Alloc: <strong className="font-mono text-stone-700">₹{source.allocatedAmount.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1 truncate font-medium">
                    {source.sourceL2Name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Every rupee traces back to its specific Director and budget origin.</span>
            <button 
              onClick={() => onSelectTab('money')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
            >
              <span>View Movement Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Required Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div 
          onClick={() => onSelectTab('requests')}
          className="cursor-pointer bg-white hover:bg-amber-50/50 border border-amber-200 rounded-xl p-4 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <Inbox className="w-5 h-5" />
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {pendingRequests.length} Pending
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono">
            {pendingRequests.length}
          </div>
          <div className="text-xs font-semibold text-stone-700 mt-0.5">Parish Money Requests</div>
          <div className="text-[11px] text-stone-500 mt-1">Requiring overseer decision</div>
        </div>

        {/* Approved - Awaiting Disbursement */}
        <div 
          onClick={() => onSelectTab('requests')}
          className="cursor-pointer bg-white hover:bg-sky-50/50 border border-sky-200 rounded-xl p-4 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between text-sky-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
              {awaitingDisbursement.length} Ready
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono">
            {awaitingDisbursement.length}
          </div>
          <div className="text-xs font-semibold text-stone-700 mt-0.5">Approved &mdash; Awaiting Cash</div>
          <div className="text-[11px] text-stone-500 mt-1">Approval recorded; money not yet given</div>
        </div>

        {/* OCR Mismatches */}
        <div 
          onClick={() => onSelectTab('expenses')}
          className="cursor-pointer bg-white hover:bg-rose-50/50 border border-rose-200 rounded-xl p-4 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <Scan className="w-5 h-5" />
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ocrMismatchesCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
              {ocrMismatchesCount} Mismatches
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono">
            {ocrMismatchesCount}
          </div>
          <div className="text-xs font-semibold text-stone-700 mt-0.5">OCR Bill Discrepancies</div>
          <div className="text-[11px] text-stone-500 mt-1">Receipt amount differs from entered value</div>
        </div>

        {/* Bank Reconciliation Differences */}
        <div 
          onClick={() => onSelectTab('reconciliation')}
          className="cursor-pointer bg-white hover:bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between text-stone-700 mb-2">
            <Scale className="w-5 h-5" />
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bankDifferencesCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {bankDifferencesCount > 0 ? `${bankDifferencesCount} Differences` : 'Balanced'}
            </span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono">
            {bankDifferencesCount}
          </div>
          <div className="text-xs font-semibold text-stone-700 mt-0.5">Bank Reconcile Differences</div>
          <div className="text-[11px] text-stone-500 mt-1">System vs SBI church account comparison</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Money Requests Inbox & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Money Requests Inbox */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Inbox className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  Parish Money Requests Inbox
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                {requests.length} Total
              </span>
            </div>

            <div className="space-y-3">
              {requests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-lg border border-stone-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-stone-900">{req.requesterName}</span>
                      <span
                        className={`text-[9.5px] font-bold uppercase px-2 py-0.2 rounded ${
                          req.status === 'REQUESTED'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'APPROVED'
                            ? 'bg-sky-100 text-sky-800'
                            : req.status === 'MONEY_GIVEN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status === 'APPROVED' ? 'APPROVED — NOT GIVEN' : req.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {req.categoryName} {req.eventName ? `&bull; ${req.eventName}` : ''}
                    </div>
                    <div className="text-[11px] text-stone-600 italic line-clamp-1">
                      "{req.remarks}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 flex-shrink-0">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      ₹{req.amount.toLocaleString('en-IN')}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenTrace(req, 'REQUEST')}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200"
                        title="Trace Transaction"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`review-req-btn-${req.id}`}
                        onClick={() => onOpenReviewRequest(req)}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        {req.status === 'REQUESTED' ? 'Review & Decide' : req.status === 'APPROVED' ? 'Disburse' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {requests.length === 0 && (
                <div className="py-8 text-center text-xs text-stone-400">
                  No money requests in inbox.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 text-right">
            <button
              onClick={() => onSelectTab('requests')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center space-x-1"
            >
              <span>View All Requests &rarr;</span>
            </button>
          </div>
        </div>

        {/* Recent Money Movements */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                  Recent Fund Movements
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Authoritative Audit Trace
              </span>
            </div>

            <div className="space-y-3">
              {recentMoneyMovements.slice(0, 4).map((m: any) => {
                const isGiven = 'giverL3Id' in m;
                return (
                  <div
                    key={m.id}
                    className="p-3.5 bg-stone-50 hover:bg-stone-100/80 rounded-lg border border-stone-200 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isGiven
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-200'
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {isGiven ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-stone-900">
                          {isGiven ? `Gave to ${m.receiverL4Name}` : `Received from ${m.fromL2Name}`}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isGiven ? m.sourceL2Name : m.fundSource} &bull; {new Date(isGiven ? m.givenAt : m.receivedAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-2">
                      <div>
                        <div
                          className={`font-mono font-bold text-sm ${
                            isGiven ? 'text-stone-900' : 'text-emerald-700'
                          }`}
                        >
                          {isGiven ? `-₹${m.amount.toLocaleString('en-IN')}` : `+₹${m.amount.toLocaleString('en-IN')}`}
                        </div>
                        <span className="text-[9.5px] uppercase font-semibold text-stone-400 block">
                          {isGiven ? 'Given to L4' : 'From L2'}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenTrace(m, isGiven ? 'MONEY_GIVEN' : 'MONEY_RECEIVED')}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200"
                        title="Trace Transaction"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-100 text-right">
            <button
              onClick={() => onSelectTab('money')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center space-x-1"
            >
              <span>View All Fund Movements &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Expenses & OCR Review Summary */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Receipt className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
              Recent Parish Expenses & Supporting Bills
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('expenses')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center space-x-1"
          >
            <span>View All Expenses & OCR &rarr;</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-2.5">Date & Leader</th>
                <th className="pb-2.5">Category / Ministry</th>
                <th className="pb-2.5">Document / Voucher</th>
                <th className="pb-2.5">OCR Validation</th>
                <th className="pb-2.5 text-right">Amount</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-stone-900">{exp.personL4Name}</div>
                    <div className="text-[11px] text-stone-500">{exp.date}</div>
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-stone-800">{exp.categoryName}</div>
                    <div className="text-[11px] text-stone-500">{exp.eventName || 'Parish Operations'}</div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        exp.documentType === 'VOUCHER'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {exp.documentType} #{exp.documentNumber}
                    </span>
                  </td>
                  <td className="py-3">
                    {exp.ocrResult ? (
                      exp.ocrResult.isMismatch ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Mismatch: ₹{exp.ocrResult.extractedAmount}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Match</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-stone-400">Voucher / Direct</span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-stone-900 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onOpenTrace(exp, 'EXPENSE')}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded"
                        title="Trace Transaction"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`view-expense-btn-${exp.id}`}
                        onClick={() => onOpenExpenseDetail(exp)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded border border-stone-300"
                      >
                        Review Doc
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
