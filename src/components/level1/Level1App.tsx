import React, { useState } from 'react';
import { 
  Crown, 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Scale, 
  FileSpreadsheet, 
  History, 
  Settings as SettingsIcon, 
  LogOut, 
  RefreshCw, 
  DollarSign, 
  PlusCircle, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';
import { 
  User, 
  L1DashboardData, 
  AdvanceRecord, 
  ExceptionIssue,
  Expense,
  MoneyRequest
} from '../../types.ts';
import { 
  fetchL1DashboardState, 
  recordL1DirectPayment, 
  resolveL1Exception, 
  settleL1Advance, 
  createL1Subordinate 
} from '../../services/api.ts';
import { DetailDrawer } from '../common/DetailDrawer.tsx';
import { Level1Sidebar, Level1Tab } from './Level1Sidebar.tsx';

interface Level1AppProps {
  initialUser: User;
  initialData?: L1DashboardData | null;
  onLogout: () => void;
}

export const Level1App: React.FC<Level1AppProps> = ({
  initialUser,
  initialData,
  onLogout,
}) => {
  const [data, setData] = useState<L1DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Level1Tab>('dashboard');

  // Sub-tabs states
  const [financialSubTab, setFinancialSubTab] = useState<'income' | 'expenses' | 'funds' | 'movements' | 'advances' | 'payments'>('income');
  const [hierarchySubTab, setHierarchySubTab] = useState<'l2' | 'l3' | 'l4'>('l2');
  const [reconciliationSubTab, setReconciliationSubTab] = useState<'bank' | 'cash' | 'exceptions'>('bank');
  const [reportsSubTab, setReportsSubTab] = useState<'event' | 'category' | 'person' | 'fund' | 'monthly' | 'fy'>('event');
  const [auditSubTab, setAuditSubTab] = useState<'logs' | 'issues' | 'docs' | 'fy_audit'>('logs');

  // Drawer detail state
  const [selectedEntityDrawer, setSelectedEntityDrawer] = useState<any | null>(null);
  const [drawerType, setDrawerType] = useState<'L2' | 'L3' | 'L4' | 'FUND' | null>(null);

  // Modals
  const [showDirectPayModal, setShowDirectPayModal] = useState<boolean>(false);
  const [showOnboardModal, setShowOnboardModal] = useState<boolean>(false);
  const [selectedAdvance, setSelectedAdvance] = useState<AdvanceRecord | null>(null);
  const [selectedException, setSelectedException] = useState<ExceptionIssue | null>(null);

  // Form states for Direct Payment
  const [directPayUserId, setDirectPayUserId] = useState<string>('');
  const [directPayRole, setDirectPayRole] = useState<'LEVEL_3' | 'LEVEL_4'>('LEVEL_3');
  const [directPayAmount, setDirectPayAmount] = useState<string>('');
  const [directPayPurpose, setDirectPayPurpose] = useState<string>('');
  const [directPaySubmitting, setDirectPaySubmitting] = useState<boolean>(false);

  // Form states for Onboarding
  const [onboardRole, setOnboardRole] = useState<'LEVEL_2' | 'LEVEL_3'>('LEVEL_2');
  const [onboardName, setOnboardName] = useState<string>('');
  const [onboardEmail, setOnboardEmail] = useState<string>('');
  const [onboardPhone, setOnboardPhone] = useState<string>('+91 ');
  const [onboardDesignation, setOnboardDesignation] = useState<string>('');
  const [onboardArea, setOnboardArea] = useState<string>('');
  const [onboardSubmitting, setOnboardSubmitting] = useState<boolean>(false);

  // Form states for Settle Advance
  const [settleActualSpent, setSettleActualSpent] = useState<string>('');
  const [settleRefund, setSettleRefund] = useState<string>('0');
  const [settleVoucherNo, setSettleVoucherNo] = useState<string>('');
  const [settleRemarks, setSettleRemarks] = useState<string>('');
  const [settleSubmitting, setSettleSubmitting] = useState<boolean>(false);

  // Form states for Resolve Exception
  const [resolveNotes, setResolveNotes] = useState<string>('');
  const [resolveSubmitting, setResolveSubmitting] = useState<boolean>(false);

  const refreshL1State = async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await fetchL1DashboardState();
      setData(state);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Level 1 Backend Service');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directPayUserId || !directPayAmount || Number(directPayAmount) <= 0) return;

    setDirectPaySubmitting(true);
    try {
      const res = await recordL1DirectPayment({
        toUserId: directPayUserId,
        toUserRole: directPayRole,
        amount: Number(directPayAmount),
        purpose: directPayPurpose.trim() || 'Senior Bishop Executive Grant',
      });
      setData(res.state);
      setShowDirectPayModal(false);
      setDirectPayUserId('');
      setDirectPayAmount('');
      setDirectPayPurpose('');
    } catch (err: any) {
      alert(err.message || 'Failed to disburse grant');
    } finally {
      setDirectPaySubmitting(false);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim() || !onboardPhone.trim() || !onboardDesignation.trim()) return;

    setOnboardSubmitting(true);
    try {
      const res = await createL1Subordinate({
        role: onboardRole,
        name: onboardName.trim(),
        email: onboardEmail.trim(),
        phone: onboardPhone.trim(),
        designation: onboardDesignation.trim(),
        assignedArea: onboardArea.trim(),
      });
      setData(res.state);
      setShowOnboardModal(false);
      setOnboardName('');
      setOnboardEmail('');
      setOnboardDesignation('');
      setOnboardArea('');
    } catch (err: any) {
      alert(err.message || 'Failed to onboard subordinate');
    } finally {
      setOnboardSubmitting(false);
    }
  };

  const handleSettleAdvanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvance) return;

    setSettleSubmitting(true);
    try {
      const res = await settleL1Advance({
        advanceId: selectedAdvance.id,
        actualSpent: Number(settleActualSpent) || selectedAdvance.amount,
        returnedOrRefundedAmount: Number(settleRefund) || 0,
        voucherNo: settleVoucherNo.trim(),
        settlementRemarks: settleRemarks.trim(),
      });
      setData(res.state);
      setSelectedAdvance(null);
      setSettleActualSpent('');
      setSettleRefund('0');
      setSettleVoucherNo('');
      setSettleRemarks('');
    } catch (err: any) {
      alert(err.message || 'Failed to settle advance');
    } finally {
      setSettleSubmitting(false);
    }
  };

  const handleResolveExceptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedException) return;

    setResolveSubmitting(true);
    try {
      const res = await resolveL1Exception({
        issueId: selectedException.id,
        resolutionNotes: resolveNotes.trim() || 'Verified and approved by Level 1 Trustee.',
      });
      setData(res.state);
      setSelectedException(null);
      setResolveNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to resolve exception');
    } finally {
      setResolveSubmitting(false);
    }
  };

  const currentUser = data?.currentL1User || initialUser;
  const metrics = data?.organizationMetrics;

  const renderEmptyState = (label: string) => (
    <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  );

  return (
    <div id="level1-app-root" className="min-h-screen bg-[#F7F3EA] text-[#241B2F] flex flex-col font-sans">
      
      {/* GLOBAL HEADER */}
      <header className="border-b border-[#3A2B49] bg-[#21152F] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold shadow-xs">
            <Crown className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm tracking-tight">Supreme Synod Control</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#C9A227] text-[#21152F] rounded-full">
                LEVEL 1 EXECUTIVE
              </span>
            </div>
            <p className="text-xs text-[#D9D0E3] font-medium">
              {currentUser.assignedArea} &bull; <strong className="text-white">{currentUser.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="l1-refresh-data-btn"
            onClick={refreshL1State}
            disabled={loading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-300 disabled:opacity-50 cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="l1-quick-grant-btn"
            onClick={() => setShowDirectPayModal(true)}
            className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Executive Grant</span>
          </button>

          {onLogout && (
            <button
              id="l1-signout-btn"
              onClick={onLogout}
              className="flex items-center space-x-1.5 bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/40 text-[#E11D48] px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Level1Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            outstandingAdvancesCount={metrics?.totalOutstandingAdvances ? Math.round(metrics.totalOutstandingAdvances / 1000) : 0}
            activeExceptionsCount={metrics?.activeExceptionsCount || 0}
            onLogout={onLogout}
          />
        </div>

        {/* Work Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between font-medium">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={refreshL1State} className="underline font-bold cursor-pointer">Retry</button>
            </div>
          )}

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Snapshot metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Available</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1 font-mono">
                    ₹{(metrics?.totalOrganizationControlledFunds || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Allocated</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 font-mono">
                    ₹{(metrics?.totalL2BudgetsAllocated || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Spent</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                    ₹{(metrics?.totalRecordedExpenses || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Outstanding</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-700 mt-1 font-mono">
                    ₹{(metrics?.totalOutstandingAdvances || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Needs Attention</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1 font-mono">
                    {metrics?.pendingActionCount || 0}
                  </div>
                </div>
              </div>

              {/* Attention banner */}
              {(metrics?.pendingActionCount || 0) > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {metrics?.activeExceptionsCount || 0} exceptions and {metrics?.pendingL1DirectAckCount || 0} pending acknowledgements require action.
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('reconciliation')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Issues
                  </button>
                </div>
              )}

              {/* Organization schematic flow */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Diocesan Fund Flow</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">L1 Synod</span>
                    <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(metrics?.totalOrganizationControlledFunds || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">L2 Directors</span>
                    <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(metrics?.totalL2AvailableBalances || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">L3 Overseers</span>
                    <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(metrics?.totalL3AvailableBalances || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-sky-700 uppercase">L4 Workers</span>
                    <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">₹{(metrics?.totalL4AvailableBalances || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Division Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Division Budgets</h3>
                  <button 
                    onClick={() => setActiveTab('financial')} 
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    View All Budgets
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-2 px-3">Directorate</th>
                        <th className="py-2 px-3 text-right">Budget</th>
                        <th className="py-2 px-3 text-right">Spent</th>
                        <th className="py-2 px-3 text-right">Available</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data?.financialOverview?.fundAccounts?.map((fund) => (
                        <tr key={fund.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-950">{fund.fundName}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">₹{fund.totalReceived.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">₹{fund.totalDisbursed.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{fund.remaining.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedEntityDrawer(fund);
                                setDrawerType('FUND');
                              }}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Log Stream */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Activity</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {data?.auditLogs?.slice(0, 4).map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800">{log.action}</span>
                        <span className="text-slate-500 ml-2 font-medium">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. FINANCIAL OVERVIEW */}
          {activeTab === 'financial' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sub-tabs header */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                {[
                  { id: 'income', label: 'Income / Receipts' },
                  { id: 'expenses', label: 'Expenses' },
                  { id: 'funds', label: 'Funds' },
                  { id: 'movements', label: 'Money Movements' },
                  { id: 'advances', label: 'Advances' },
                  { id: 'payments', label: 'Payments' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFinancialSubTab(tab.id as any)}
                    className={`py-2 px-3 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      financialSubTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Income */}
              {financialSubTab === 'income' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">All Receipts</h3>
                  {data?.financialOverview?.incomeReceipts && data.financialOverview.incomeReceipts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Source</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3">Method</th>
                            <th className="py-2 px-3">Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.financialOverview.incomeReceipts.map((inc) => (
                            <tr key={inc.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{inc.date}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{inc.source}</td>
                              <td className="py-2.5 px-3 text-slate-600">{inc.category}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">₹{inc.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-slate-500">{inc.method}</td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono">{inc.ref}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No income records yet')}
                </div>
              )}

              {/* Expenses */}
              {financialSubTab === 'expenses' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Expenditures</h3>
                  {data?.allExpenses && data.allExpenses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Submitted By</th>
                            <th className="py-2 px-3">Purpose</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3">Document</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.allExpenses.map((exp) => (
                            <tr key={exp.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{exp.date}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{exp.personL4Name}</td>
                              <td className="py-2.5 px-3 text-slate-600">{exp.description}</td>
                              <td className="py-2.5 px-3 text-slate-500">{exp.categoryName}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{exp.documentType} #{exp.documentNumber}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No expense records yet')}
                </div>
              )}

              {/* Funds */}
              {financialSubTab === 'funds' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fund Accounts</h3>
                  {data?.financialOverview?.fundAccounts && data.financialOverview.fundAccounts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Fund Account</th>
                            <th className="py-2 px-3">L2 Director</th>
                            <th className="py-2 px-3 text-right">Total Allocated</th>
                            <th className="py-2 px-3 text-right">Total Disbursed</th>
                            <th className="py-2 px-3 text-right">Remaining Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.financialOverview.fundAccounts.map((fund) => (
                            <tr key={fund.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{fund.fundName}</td>
                              <td className="py-2.5 px-3 text-slate-600">{fund.departmentL2Name}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-semibold">₹{fund.totalReceived.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-500">₹{fund.totalDisbursed.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{fund.remaining.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No fund accounts configured')}
                </div>
              )}

              {/* Money Movements */}
              {financialSubTab === 'movements' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ledger Movements</h3>
                  {data?.allMoneyMovements && data.allMoneyMovements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Flow Type</th>
                            <th className="py-2 px-3">Giver</th>
                            <th className="py-2 px-3">Receiver</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3">Purpose</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.allMoneyMovements.map((mov) => (
                            <tr key={mov.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{new Date(mov.date).toLocaleDateString('en-IN')}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-blue-700 text-[10px]">{mov.type}</td>
                              <td className="py-2.5 px-3 text-slate-900 font-semibold">{mov.fromName}</td>
                              <td className="py-2.5 px-3 text-slate-600">{mov.toName}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold">₹{mov.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{mov.purpose}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  mov.status === 'COMPLETED' || mov.status === 'ACKNOWLEDGED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {mov.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No money movements recorded')}
                </div>
              )}

              {/* Advances */}
              {financialSubTab === 'advances' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Outstanding Staff Advances</h3>
                  {data?.advancesAndSettlements && data.advancesAndSettlements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Staff</th>
                            <th className="py-2 px-3">Purpose</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3 text-center">Status</th>
                            <th className="py-2 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.advancesAndSettlements.map((adv) => (
                            <tr key={adv.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{adv.date}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{adv.requesterName} <span className="text-[10px] text-slate-500 font-normal">({adv.requesterRole})</span></td>
                              <td className="py-2.5 px-3 text-slate-600">{adv.purpose}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">₹{adv.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  adv.status === 'OUTSTANDING' 
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {adv.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {adv.status === 'OUTSTANDING' && (
                                  <button
                                    onClick={() => setSelectedAdvance(adv)}
                                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                  >
                                    Settle
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No outstanding advances')}
                </div>
              )}

              {/* Payments */}
              {financialSubTab === 'payments' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Executive Direct Grants</h3>
                  {data?.allMoneyMovements && data.allMoneyMovements.filter(m => m.type === 'L1_TO_L3' || m.type === 'L1_TO_L4').length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Recipient</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3">Purpose</th>
                            <th className="py-2 px-3">Reference</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.allMoneyMovements.filter(m => m.type === 'L1_TO_L3' || m.type === 'L1_TO_L4').map((mov) => (
                            <tr key={mov.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{new Date(mov.date).toLocaleDateString('en-IN')}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{mov.toName} <span className="text-[10px] text-slate-500 font-normal">({mov.toRole})</span></td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-800">₹{mov.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-slate-600">{mov.purpose}</td>
                              <td className="py-2.5 px-3 text-slate-400 font-mono">{mov.ref}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  mov.status === 'ACKNOWLEDGED' || mov.status === 'COMPLETED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {mov.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No direct grants registered')}
                </div>
              )}

            </div>
          )}

          {/* 3. PEOPLE & HIERARCHY */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              <div className="flex items-center justify-between">
                {/* Sub-tabs header */}
                <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                  {[
                    { id: 'l2', label: 'L2 Directors' },
                    { id: 'l3', label: 'L3 Overseers' },
                    { id: 'l4', label: 'L4 Workers' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHierarchySubTab(tab.id as any)}
                      className={`py-2 px-3 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                        hierarchySubTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setOnboardRole(hierarchySubTab === 'l2' ? 'LEVEL_2' : 'LEVEL_3');
                    setShowOnboardModal(true);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Onboard</span>
                </button>
              </div>

              {/* L2 Directors */}
              {hierarchySubTab === 'l2' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Level 2 Directors</h3>
                  {data?.level2Directors && data.level2Directors.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Designation</th>
                            <th className="py-2 px-3 text-right">Allocated</th>
                            <th className="py-2 px-3 text-right">Available</th>
                            <th className="py-2 px-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.level2Directors.map((l2) => (
                            <tr key={l2.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{l2.name}</td>
                              <td className="py-2.5 px-3 text-slate-600">{l2.designation} <span className="text-[10px] text-slate-500 font-normal">({l2.assignedArea})</span></td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{l2.allocatedBudget.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{l2.availableBalance.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedEntityDrawer(l2);
                                    setDrawerType('L2');
                                  }}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No Level 2 leaders onboarded')}
                </div>
              )}

              {/* L3 Overseers */}
              {hierarchySubTab === 'l3' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Level 3 Overseers</h3>
                  {data?.level3Overseers && data.level3Overseers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Reporting To</th>
                            <th className="py-2 px-3 text-right">Total Received</th>
                            <th className="py-2 px-3 text-right">Available</th>
                            <th className="py-2 px-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.level3Overseers.map((l3) => (
                            <tr key={l3.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{l3.name}</td>
                              <td className="py-2.5 px-3 text-slate-600">{l3.reportingToL2Name} <span className="text-[10px] text-slate-500 font-normal">({l3.assignedArea})</span></td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{l3.totalReceived.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{l3.totalAvailable.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedEntityDrawer(l3);
                                    setDrawerType('L3');
                                  }}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No Level 3 overseers onboarded')}
                </div>
              )}

              {/* L4 Workers */}
              {hierarchySubTab === 'l4' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Level 4 Workers</h3>
                  {data?.level4Workers && data.level4Workers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Supervisor</th>
                            <th className="py-2 px-3 text-right">Available Balance</th>
                            <th className="py-2 px-3 text-center">Expenses</th>
                            <th className="py-2 px-3 text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.level4Workers.map((l4) => (
                            <tr key={l4.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{l4.name}</td>
                              <td className="py-2.5 px-3 text-slate-600">{l4.managingL3Name} <span className="text-[10px] text-slate-500 font-normal">({l4.assignedArea})</span></td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">₹{l4.allocatedBalance.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center font-semibold">{l4.expensesCount}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedEntityDrawer(l4);
                                    setDrawerType('L4');
                                  }}
                                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No Level 4 workers onboarded')}
                </div>
              )}

            </div>
          )}

          {/* 4. RECONCILIATION */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sub-tabs header */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                {[
                  { id: 'bank', label: 'Bank Reconciliation' },
                  { id: 'cash', label: 'Cash Reconciliation' },
                  { id: 'exceptions', label: 'Exceptions' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setReconciliationSubTab(tab.id as any)}
                    className={`py-2 px-3 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      reconciliationSubTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Bank */}
              {reconciliationSubTab === 'bank' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Bank Reconciliation</h3>
                  {data?.bankReconciliations && data.bankReconciliations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Account / Ref</th>
                            <th className="py-2 px-3 text-right">System Amount</th>
                            <th className="py-2 px-3 text-right">Bank Amount</th>
                            <th className="py-2 px-3 text-right">Difference</th>
                            <th className="py-2 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.bankReconciliations.map((rec) => (
                            <tr key={rec.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{rec.transactionDate}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-800">{rec.bankAccount} <span className="text-[10px] text-slate-400 font-normal">({rec.referenceNo})</span></td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{rec.systemAmount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{rec.bankStatementAmount.toLocaleString('en-IN')}</td>
                              <td className={`py-2.5 px-3 text-right font-mono font-bold ${rec.difference === 0 ? 'text-emerald-700' : 'text-rose-600'}`}>₹{rec.difference.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  rec.status === 'MATCHED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {rec.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No bank reconciliation records')}
                </div>
              )}

              {/* Cash */}
              {reconciliationSubTab === 'cash' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Cash Reconciliation</h3>
                  {renderEmptyState('No cash reconciliation items recorded')}
                </div>
              )}

              {/* Exceptions */}
              {reconciliationSubTab === 'exceptions' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fiduciary Exceptions</h3>
                  {data?.exceptionsAndIssues && data.exceptionsAndIssues.length > 0 ? (
                    <div className="space-y-3">
                      {data.exceptionsAndIssues.map((ex) => (
                        <div key={ex.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              ex.severity === 'HIGH' 
                                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                : ex.severity === 'MEDIUM' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>{ex.severity} Priority</span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{ex.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{ex.description}</p>
                            {ex.resolutionNotes && <p className="text-[11px] text-emerald-700 mt-1 italic font-semibold">Resolved: {ex.resolutionNotes}</p>}
                          </div>
                          {ex.status !== 'RESOLVED' && (
                            <button
                              onClick={() => setSelectedException(ex)}
                              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : renderEmptyState('No exceptions recorded')}
                </div>
              )}

            </div>
          )}

          {/* 5. REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sub-tabs header */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                {[
                  { id: 'event', label: 'Event Reports' },
                  { id: 'category', label: 'Category' },
                  { id: 'person', label: 'Person' },
                  { id: 'fund', label: 'Fund' },
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'fy', label: 'Financial Year' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setReportsSubTab(tab.id as any)}
                    className={`py-2 px-3 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      reportsSubTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Event Reports */}
              {reportsSubTab === 'event' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Event Budget Status</h3>
                  {data?.events && data.events.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Event Code</th>
                            <th className="py-2 px-3">Event Name</th>
                            <th className="py-2 px-3 text-right">Allocated Budget</th>
                            <th className="py-2 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.events.map((evt) => (
                            <tr key={evt.id}>
                              <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{evt.code}</td>
                              <td className="py-2.5 px-3 text-slate-800 font-semibold">{evt.name}</td>
                              <td className="py-2.5 px-3 text-right font-mono">₹{evt.budgetAllocated.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  evt.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {evt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No events registered')}
                </div>
              )}

              {/* Category Reports */}
              {reportsSubTab === 'category' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Spending by Category</h3>
                  {data?.categories && data.categories.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Parent Group</th>
                            <th className="py-2 px-3">Category Head</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.categories.map((cat) => (
                            <tr key={cat.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-500 uppercase text-[10px]">{cat.parentGroup}</td>
                              <td className="py-2.5 px-3 text-slate-800 font-semibold">{cat.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No categories configured')}
                </div>
              )}

              {/* Person Reports */}
              {reportsSubTab === 'person' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Personnel Ledger Overview</h3>
                  {data?.allHierarchyPeople && data.allHierarchyPeople.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Role</th>
                            <th className="py-2 px-3">Designation</th>
                            <th className="py-2 px-3 text-center">Date Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.allHierarchyPeople.map((usr) => (
                            <tr key={usr.id}>
                              <td className="py-2.5 px-3 font-bold text-slate-950">{usr.name}</td>
                              <td className="py-2.5 px-3 font-mono text-blue-700 text-[10px]">{usr.role}</td>
                              <td className="py-2.5 px-3 text-slate-600">{usr.designation} ({usr.assignedArea})</td>
                              <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{new Date(usr.createdAt).toLocaleDateString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No personnel records found')}
                </div>
              )}

              {/* Fund Reports */}
              {reportsSubTab === 'fund' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Fund Report Breakdown</h3>
                  {renderEmptyState('Fund report breakdown calculated in Financial Overview')}
                </div>
              )}

              {/* Monthly Reports */}
              {reportsSubTab === 'monthly' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Monthly Statements</h3>
                  {renderEmptyState('No monthly statement periods generated yet')}
                </div>
              )}

              {/* Financial Year Reports */}
              {reportsSubTab === 'fy' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">FY 2026-2027 Statement Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Synod Total Income</span>
                      <div className="text-xl font-bold text-blue-700 font-mono mt-1">₹{(metrics?.totalIncomeReceipts || 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Synod Total Expenses</span>
                      <div className="text-xl font-bold text-slate-900 font-mono mt-1">₹{(metrics?.totalRecordedExpenses || 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 6. AUDIT & TRANSPARENCY */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Sub-tabs header */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                {[
                  { id: 'logs', label: 'Audit Log' },
                  { id: 'issues', label: 'Issues' },
                  { id: 'docs', label: 'Supporting Documents' },
                  { id: 'fy_audit', label: 'Financial-Year Audit' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAuditSubTab(tab.id as any)}
                    className={`py-2 px-3 border-b-2 font-bold text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      auditSubTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Audit Log */}
              {auditSubTab === 'logs' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Authoritative Audit Stream</h3>
                  {data?.auditLogs && data.auditLogs.length > 0 ? (
                    <div className="divide-y divide-slate-100 text-xs">
                      {data.auditLogs.map((log) => (
                        <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div>
                            <span className="font-bold text-slate-800">{log.action}</span>
                            <span className="text-slate-500 ml-2 font-medium">{log.details}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">By {log.actorName} ({log.actorRole})</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  ) : renderEmptyState('No audit entries recorded')}
                </div>
              )}

              {/* Issues */}
              {auditSubTab === 'issues' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Unresolved Compliance Issues</h3>
                  {data?.exceptionsAndIssues && data.exceptionsAndIssues.filter(i => i.status !== 'RESOLVED').length > 0 ? (
                    <div className="space-y-3">
                      {data.exceptionsAndIssues.filter(i => i.status !== 'RESOLVED').map((ex) => (
                        <div key={ex.id} className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 uppercase">{ex.severity}</span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1">{ex.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{ex.description}</p>
                          </div>
                          <button
                            onClick={() => setSelectedException(ex)}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
                          >
                            Resolve
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : renderEmptyState('No unresolved issues found')}
                </div>
              )}

              {/* Supporting Documents */}
              {auditSubTab === 'docs' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Vouchers & Bill Invoices</h3>
                  {data?.allExpenses && data.allExpenses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Submitted By</th>
                            <th className="py-2 px-3">Doc Ref</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3 text-center">OCR Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {data.allExpenses.map((exp) => (
                            <tr key={exp.id}>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{exp.date}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{exp.personL4Name}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{exp.documentType} #{exp.documentNumber}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold">₹{exp.amount.toLocaleString('en-IN')}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  exp.ocrResult?.isMismatch 
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {exp.ocrResult?.isMismatch ? 'Mismatch' : 'Verified'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : renderEmptyState('No supporting documents recorded')}
                </div>
              )}

              {/* Financial-Year Audit */}
              {auditSubTab === 'fy_audit' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Financial-Year Audit</h3>
                  {renderEmptyState('Fiduciary audit complete for FY 2025-2026. No pending adjustments.')}
                </div>
              )}

            </div>
          )}

          {/* 7. SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Settings</h3>
              
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Active Financial Year</span>
                  <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-bold">FY 2026 - 2027</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Organization Currency</span>
                  <span className="text-slate-900 font-bold">INR (₹)</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Fiduciary Controls</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Enabled</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAIL DRAWER FOR ENTITY DETAILS */}
      <DetailDrawer
        isOpen={!!selectedEntityDrawer}
        onClose={() => setSelectedEntityDrawer(null)}
        title={selectedEntityDrawer?.name || selectedEntityDrawer?.fundName || 'Entity Details'}
        subtitle={selectedEntityDrawer?.designation || (selectedEntityDrawer?.departmentL2Name ? `Director: ${selectedEntityDrawer.departmentL2Name}` : '')}
      >
        {selectedEntityDrawer && (
          <div className="space-y-6 text-xs">
            {drawerType === 'FUND' && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-blue-800 uppercase">Fiduciary Balance</div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2 font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Allocated</div>
                    <div className="text-sm font-bold text-slate-900">₹{selectedEntityDrawer.totalReceived.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Disbursed</div>
                    <div className="text-sm font-bold text-slate-900">₹{selectedEntityDrawer.totalDisbursed.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Available</div>
                    <div className="text-sm font-bold text-blue-600">₹{selectedEntityDrawer.remaining.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            )}

            {drawerType === 'L2' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-800 uppercase">Fiduciary Ledger</div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-2 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Allocated Budget</div>
                      <div className="text-sm font-bold text-slate-900">₹{selectedEntityDrawer.allocatedBudget.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Available Balance</div>
                      <div className="text-sm font-bold text-emerald-600">₹{selectedEntityDrawer.availableBalance.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-800 text-[10px] uppercase">Department Activity</h4>
                  <div className="space-y-1 text-slate-600">
                    <div>Disbursed to L3: <strong className="text-slate-900 font-mono">₹{selectedEntityDrawer.disbursedToL3.toLocaleString('en-IN')}</strong></div>
                    <div>Paid Direct to L4: <strong className="text-slate-900 font-mono">₹{selectedEntityDrawer.directL4Paid.toLocaleString('en-IN')}</strong></div>
                    <div>Expenses Paid: <strong className="text-slate-900 font-mono">₹{selectedEntityDrawer.expensesPaid.toLocaleString('en-IN')}</strong></div>
                    <div>Supervised Overseers: <strong className="text-slate-900">{selectedEntityDrawer.supervisedOverseersCount}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {drawerType === 'L3' && (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-800 uppercase">Overseer Balance</div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-2 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Total Received</div>
                      <div className="text-sm font-bold text-slate-900">₹{selectedEntityDrawer.totalReceived.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Available Balance</div>
                      <div className="text-sm font-bold text-amber-600">₹{selectedEntityDrawer.totalAvailable.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                  <div>Reporting To L2: <strong className="text-slate-900">{selectedEntityDrawer.reportingToL2Name}</strong></div>
                  <div>Team Count: <strong className="text-slate-900">{selectedEntityDrawer.teamCount} members</strong></div>
                </div>
              </div>
            )}

            {drawerType === 'L4' && (
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-sky-800 uppercase">Worker Balance</div>
                  <div className="text-center pt-2 font-mono">
                    <div className="text-[10px] text-slate-500 uppercase">Allocated Balance</div>
                    <div className="text-base font-bold text-sky-600">₹{selectedEntityDrawer.allocatedBalance.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600">
                  <div>Supervised By L3: <strong className="text-slate-900">{selectedEntityDrawer.managingL3Name}</strong></div>
                  <div>Expenses Count: <strong className="text-slate-900">{selectedEntityDrawer.expensesCount}</strong></div>
                </div>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* DIRECT BISHOP GRANT MODAL */}
      {showDirectPayModal && (
        <div className="fixed inset-0 bg-[#21152F]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-[#171717] text-base">Direct Bishop Executive Grant</h3>
            <form onSubmit={handleDirectPaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Target Recipient Role</label>
                <select
                  value={directPayRole}
                  onChange={(e) => setDirectPayRole(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-medium text-[#171717]"
                >
                  <option value="LEVEL_3">Level 3 Field Overseer</option>
                  <option value="LEVEL_4">Level 4 Parish Worker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Recipient ID / User</label>
                <input
                  type="text"
                  required
                  value={directPayUserId}
                  onChange={(e) => setDirectPayUserId(e.target.value)}
                  placeholder="usr-l3-overseer1"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Grant Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={directPayAmount}
                  onChange={(e) => setDirectPayAmount(e.target.value)}
                  placeholder="50000"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Executive Mandate Purpose</label>
                <input
                  type="text"
                  value={directPayPurpose}
                  onChange={(e) => setDirectPayPurpose(e.target.value)}
                  placeholder="Diocesan Emergency Support"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirectPayModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={directPaySubmitting}
                  className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {directPaySubmitting ? 'Disbursing...' : 'Disburse Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINT LEADER MODAL */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-[#21152F]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-[#171717] text-base">Appoint Subordinate Leader</h3>
            <form onSubmit={handleOnboardSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Leader Level</label>
                <select
                  value={onboardRole}
                  onChange={(e) => setOnboardRole(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="LEVEL_2">Level 2 Central Director</option>
                  <option value="LEVEL_3">Level 3 Field Overseer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="Rev. Arthur Pendelton"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={onboardEmail}
                  onChange={(e) => setOnboardEmail(e.target.value)}
                  placeholder="arthur@gracechurch.org"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={onboardName}
                  onChange={(e) => setOnboardDesignation(e.target.value)}
                  placeholder="Director of Outreach & Missions"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Jurisdiction</label>
                <input
                  type="text"
                  value={onboardArea}
                  onChange={(e) => setOnboardArea(e.target.value)}
                  placeholder="Zonal Region Alpha"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {onboardSubmitting ? 'Appointing...' : 'Appoint Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE EXCEPTION MODAL */}
      {selectedException && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Resolve Compliance Exception</h3>
            <p className="text-xs text-slate-600">{selectedException.description}</p>
            <form onSubmit={handleResolveExceptionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Notes</label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Notes explaining resolution..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedException(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolveSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {resolveSubmitting ? 'Resolving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTLE ADVANCE MODAL */}
      {selectedAdvance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-base">Settle Staff Advance</h3>
            <p className="text-xs text-slate-600">Advance of ₹{selectedAdvance.amount.toLocaleString('en-IN')} for {selectedAdvance.requesterName} ({selectedAdvance.purpose})</p>
            <form onSubmit={handleSettleAdvanceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Spent (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settleActualSpent}
                  onChange={(e) => setSettleActualSpent(e.target.value)}
                  placeholder="Actual spent amount"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Returned / Refunded Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={settleRefund}
                  onChange={(e) => setSettleRefund(e.target.value)}
                  placeholder="Refunded to treasury"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement Voucher No</label>
                <input
                  type="text"
                  required
                  value={settleVoucherNo}
                  onChange={(e) => setSettleVoucherNo(e.target.value)}
                  placeholder="Voucher reference number"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Settlement Remarks</label>
                <textarea
                  rows={2}
                  value={settleRemarks}
                  onChange={(e) => setSettleRemarks(e.target.value)}
                  placeholder="Fiduciary audit comments..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedAdvance(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settleSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {settleSubmitting ? 'Settling...' : 'Complete Settlement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D8] bg-[#FFFDF8] py-3.5 text-center text-xs text-[#5F6368] font-medium">
        Church Financial Management Platform &bull; Level 1 General Synod Overseer Portal
      </footer>
    </div>
  );
};
