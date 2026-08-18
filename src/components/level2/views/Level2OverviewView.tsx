import React from 'react';
import {
  IndianRupee,
  Send,
  CreditCard,
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { L2DashboardData } from '../../../types.ts';
import { Level2Tab } from '../Level2Sidebar.tsx';

interface Level2OverviewViewProps {
  data: L2DashboardData;
  onNavigateTab: (tab: Level2Tab) => void;
  onOpenDisburseModal: () => void;
  onOpenDirectL4Modal: () => void;
  onOpenCreateL3Modal: () => void;
}

export const Level2OverviewView: React.FC<Level2OverviewViewProps> = ({
  data,
  onNavigateTab,
  onOpenDisburseModal,
  onOpenDirectL4Modal,
  onOpenCreateL3Modal,
}) => {
  const {
    currentL2User,
    centralAllocatedBudget,
    centralAvailableBalance,
    centralDisbursedToL3,
    centralDirectL4Paid,
    centralExpensesPaid,
    pendingL1AcknowledgementsCount,
    ocrMismatchesCount,
    bankDifferencesCount,
    supervisedL3Overseers,
    disbursedToL3History,
    directL4Payments,
    l1DirectPayments,
  } = data;

  const totalCommittedOrSpent = centralDisbursedToL3 + centralDirectL4Paid + centralExpensesPaid;
  const utilizedPercent = centralAllocatedBudget > 0 
    ? Math.round((totalCommittedOrSpent / centralAllocatedBudget) * 100) 
    : 0;

  return (
    <div id="level2-overview-view" className="space-y-6">
      
      {/* Top Banner: Director Profile & Central Budget Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                CENTRAL DIRECTORATE
              </span>
              <span className="text-xs text-slate-400">
                Department: {currentL2User.assignedArea || 'Central Operations'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mt-1">
              {currentL2User.name}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {currentL2User.designation} • Overseeing {supervisedL3Overseers.length} Level 3 Field Overseers
            </p>
          </div>

          {/* Quick Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="l2-overview-disburse-btn"
              onClick={onOpenDisburseModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Disburse to Level 3</span>
            </button>

            <button
              id="l2-overview-direct-l4-btn"
              onClick={onOpenDirectL4Modal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Direct L4 Payment</span>
            </button>

            <button
              id="l2-overview-create-l3-btn"
              onClick={onOpenCreateL3Modal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
            >
              <Users className="w-4 h-4" />
              <span>+ New Level 3 Person</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Banner for Pending Level 1 Grants */}
      {pendingL1AcknowledgementsCount > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                {pendingL1AcknowledgementsCount} Level 1 Direct Grant{pendingL1AcknowledgementsCount > 1 ? 's' : ''} Awaiting Acknowledgement
              </h4>
              <p className="text-xs text-amber-200/70">
                Senior Bishops (Level 1) disbursed direct allocations. Review and acknowledge to record governance compliance.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('l1-payments')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Review & Acknowledge
          </button>
        </div>
      )}

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Central Available Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Central Available Balance</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">
              Live Safe
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 flex items-center">
            <IndianRupee className="w-5 h-5 inline mr-0.5" />
            {centralAvailableBalance.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Allocated: ₹{centralAllocatedBudget.toLocaleString('en-IN')}</span>
            <span className="text-slate-300 font-medium">{100 - utilizedPercent}% Remaining</span>
          </div>
        </div>

        {/* Card 2: Disbursed to Level 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Disbursed to Level 3</span>
            <Send className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-sky-400 flex items-center">
            <IndianRupee className="w-5 h-5 inline mr-0.5" />
            {centralDisbursedToL3.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>To {supervisedL3Overseers.length} Overseers</span>
            <button 
              onClick={() => onNavigateTab('disburse')} 
              className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center"
            >
              History <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Direct L4 Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Direct L4 Payments</span>
            <CreditCard className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-400 flex items-center">
            <IndianRupee className="w-5 h-5 inline mr-0.5" />
            {centralDirectL4Paid.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Actual Giver: Level 2</span>
            <button 
              onClick={() => onNavigateTab('direct-l4')} 
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center"
            >
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Central Expenses Paid */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Central Expenses</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 flex items-center">
            <IndianRupee className="w-5 h-5 inline mr-0.5" />
            {centralExpensesPaid.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Office & Operational</span>
            <button 
              onClick={() => onNavigateTab('central-expenses')} 
              className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center"
            >
              Audit <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Supervised Level 3 Overseers Status Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Supervised Level 3 Field Overseers</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each overseer maintains segregated funds allocated by this Level 2 director and other central sources.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('l3-team')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center space-x-1"
          >
            <span>Manage All Overseers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supervisedL3Overseers.map((overseer) => {
            return (
              <div
                key={overseer.id}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
                      {overseer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{overseer.name}</h4>
                      <p className="text-[11px] text-slate-400">{overseer.designation}</p>
                      <p className="text-[10px] text-emerald-400 font-medium mt-0.5">{overseer.assignedArea}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Funds Received:</span>
                    <span className="font-bold text-slate-200">
                      ₹{overseer.currentOverseerBalance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">From This Director:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{overseer.sourceAllocationsFromThisL2.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenDisburseModal}
                      className="w-full py-1.5 px-3 bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disburse Funds to {overseer.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Column: Recent Disbursements & Direct L4 Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Level 3 Disbursements */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Send className="w-4 h-4 text-sky-400" />
              <span>Recent Level 3 Disbursements</span>
            </h3>
            <button
              onClick={() => onNavigateTab('disburse')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
            >
              View All
            </button>
          </div>

          {disbursedToL3History.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No disbursements recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {disbursedToL3History.slice(0, 5).map((disb) => (
                <div
                  key={disb.id}
                  className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{disb.toL3Name}</div>
                    <div className="text-[11px] text-slate-400">{disb.purpose}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Ref: {disb.transactionRef}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">
                      ₹{disb.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(disb.receivedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Direct L4 Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Recent Direct L4 Payments</span>
            </h3>
            <button
              onClick={() => onNavigateTab('direct-l4')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All
            </button>
          </div>

          {directL4Payments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No direct Level 4 payments recorded.</p>
          ) : (
            <div className="space-y-2.5">
              {directL4Payments.slice(0, 5).map((pay) => (
                <div
                  key={pay.id}
                  className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-100">{pay.toL4Name}</div>
                    <div className="text-[11px] text-slate-400">{pay.purpose}</div>
                    <div className="text-[10px] text-indigo-300/80 mt-0.5">
                      {pay.categoryName} • {pay.documentType} #{pay.documentNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-indigo-300">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(pay.givenAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
