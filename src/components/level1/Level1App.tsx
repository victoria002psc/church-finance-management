import React, { useState } from 'react';
import { 
  Crown, 
  Building2, 
  Church, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Filter, 
  CreditCard, 
  Briefcase, 
  AlertCircle,
  ChevronRight,
  Layers,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { 
  User, 
  L1DashboardData, 
  AdvanceRecord, 
  ExceptionIssue, 
  L1DirectPayment 
} from '../../types.ts';
import { 
  fetchL1DashboardState, 
  recordL1DirectPayment, 
  resolveL1Exception, 
  settleL1Advance, 
  createL1Subordinate 
} from '../../services/api.ts';

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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'budgets' | 'multisource' | 'disbursements' | 'advances' | 'exceptions' | 'hierarchy' | 'audit'
  >('overview');

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

  // Load L1 State
  const refreshL1State = async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await fetchL1DashboardState();
      setData(state);
    } catch (err: any) {
      setError(err.message || 'Failed to sync with Level 1 Diocesan Authority');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!data) {
      refreshL1State();
    }
  }, []);

  // Direct payment submit
  const handleDirectPaymentSubmit = async (e: React.FormEvent) => {
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
      setDirectPayAmount('');
      setDirectPayPurpose('');
    } catch (err: any) {
      alert(err.message || 'Failed to disburse grant');
    } finally {
      setDirectPaySubmitting(false);
    }
  };

  // Onboard subordinate submit
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

  // Settle advance submit
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

  // Resolve exception submit
  const handleResolveExceptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedException) return;

    setResolveSubmitting(true);
    try {
      const res = await resolveL1Exception({
        issueId: selectedException.id,
        resolutionNotes: resolveNotes.trim() || 'Verified and approved by Level 1 Senior Diocesan Trustee.',
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

  return (
    <div id="level1-app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Bar */}
      <header className="border-b border-indigo-950/80 bg-slate-900/90 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-900/40">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-100 text-sm tracking-tight">Diocesan Supreme Council</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                LEVEL 1 GOVERNANCE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Macro Financial Fiduciary & General Overseer Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            id="l1-refresh-data-btn"
            onClick={refreshL1State}
            disabled={loading}
            className="p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors border border-slate-700 disabled:opacity-50 cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* User Profile Info */}
          <div className="hidden sm:flex items-center space-x-2.5 bg-indigo-950/40 border border-indigo-900/60 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-indigo-300">{currentUser.designation}</div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            id="l1-signout-btn"
            onClick={onLogout}
            className="flex items-center space-x-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* 2. Navigation Tabs */}
      <nav className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-8 py-2 overflow-x-auto flex items-center space-x-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Executive Overview', icon: TrendingUp },
          { id: 'budgets', label: 'L2 Department Budgets', icon: Building2 },
          { id: 'multisource', label: 'Multi-Source L3 Breakdown', icon: Layers },
          { id: 'disbursements', label: 'Direct Bishop Grants', icon: DollarSign },
          { id: 'advances', label: 'Advances & Settlements', icon: CreditCard, count: metrics?.totalOutstandingAdvances ? `₹${(metrics.totalOutstandingAdvances/1000).toFixed(0)}k` : undefined },
          { id: 'exceptions', label: 'Exceptions & Issues', icon: AlertTriangle, count: metrics?.activeExceptionsCount },
          { id: 'hierarchy', label: 'Diocesan Hierarchy', icon: Users },
          { id: 'audit', label: 'Compliance Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`l1-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                  isActive ? 'bg-white text-indigo-900' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Main Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-950/70 border border-rose-800 text-rose-200 text-xs rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={refreshL1State} className="underline font-bold cursor-pointer">Retry</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Diocesan Controlled Funds</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-2 font-mono">
                  ₹{(metrics?.totalOrganizationControlledFunds || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Net after ₹{(metrics?.totalRecordedExpenses || 0).toLocaleString('en-IN')} expenses</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income Receipts</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
                  ₹{(metrics?.totalIncomeReceipts || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Synod endowments, tithes, and donations
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total L2 Central Available</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2 font-mono">
                  ₹{(metrics?.totalL2AvailableBalances || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Allocated budget: ₹{(metrics?.totalL2BudgetsAllocated || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Field Liquidity (L3 + L4)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 mt-2 font-mono">
                  ₹{((metrics?.totalL3AvailableBalances || 0) + (metrics?.totalL4AvailableBalances || 0)).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  L3: ₹{(metrics?.totalL3AvailableBalances || 0).toLocaleString('en-IN')} | L4: ₹{(metrics?.totalL4AvailableBalances || 0).toLocaleString('en-IN')}
                </div>
              </div>

            </div>

            {/* Quick Actions & Governance Bar */}
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Diocesan Executive Fiduciary Controls</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute direct bishop disbursements, appoint new directors or overseers, and audit outstanding advances.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  id="l1-quick-grant-btn"
                  onClick={() => setShowDirectPayModal(true)}
                  className="flex-1 md:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Direct Bishop Grant</span>
                </button>

                <button
                  id="l1-quick-onboard-btn"
                  onClick={() => setShowOnboardModal(true)}
                  className="flex-1 md:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Appoint Leader</span>
                </button>
              </div>
            </div>

            {/* Income Receipts & Fund Accounts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Income Receipts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Diocesan Income Treasury Receipts</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ₹{(metrics?.totalIncomeReceipts || 0).toLocaleString('en-IN')} Total
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {data?.financialOverview?.incomeReceipts?.map((rec) => (
                    <div key={rec.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-200">{rec.source}</div>
                        <div className="text-[11px] text-slate-400">{rec.category} &bull; {rec.date}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{rec.method} ({rec.ref})</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 text-sm font-mono">+₹{rec.amount.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fund Accounts & L2 Budgets */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>Central Department Fund Accounts</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('budgets')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {data?.financialOverview?.fundAccounts?.map((fund) => (
                    <div key={fund.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-slate-200">{fund.fundName}</div>
                          <div className="text-[11px] text-slate-400">{fund.departmentL2Name}</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-slate-200">₹{fund.remaining.toLocaleString('en-IN')} avail</div>
                          <div className="text-[10px] text-slate-500">Budget: ₹{fund.totalReceived.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (fund.totalDisbursed / fund.totalReceived) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: L2 DEPARTMENT BUDGETS */}
        {/* ========================================================================= */}
        {activeTab === 'budgets' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-slate-100 text-base">Level 2 Central Directorate Budgets & Availability</h2>
                <p className="text-xs text-slate-400">Track allocated treasury limits, disbursements to Level 3, direct L4 payments, and remaining funds.</p>
              </div>
              <button
                onClick={() => setShowOnboardModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Onboard Level 2 Director</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Director Name</th>
                    <th className="py-3 px-3">Department / Scope</th>
                    <th className="py-3 px-3 text-right">Allocated Budget</th>
                    <th className="py-3 px-3 text-right">Disbursed to L3</th>
                    <th className="py-3 px-3 text-right">Direct L4 Paid</th>
                    <th className="py-3 px-3 text-right">Expenses Paid</th>
                    <th className="py-3 px-3 text-right">Available Balance</th>
                    <th className="py-3 px-3 text-center">Overseers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {data?.level2Directors?.map((dir) => (
                    <tr key={dir.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-sans">
                        <div className="font-bold text-slate-200">{dir.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{dir.email}</div>
                      </td>
                      <td className="py-3.5 px-3 font-sans text-slate-300">
                        <div>{dir.designation}</div>
                        <div className="text-[11px] text-slate-500">{dir.assignedArea}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-slate-100">
                        ₹{dir.allocatedBudget.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right text-indigo-400">
                        ₹{dir.disbursedToL3.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right text-sky-400">
                        ₹{dir.directL4Paid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right text-rose-400">
                        ₹{dir.expensesPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-400 text-sm">
                        ₹{dir.availableBalance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center font-sans">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full text-xs font-bold">
                          {dir.supervisedOverseersCount} L3
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MULTI-SOURCE L3 BREAKDOWN */}
        {/* ========================================================================= */}
        {activeTab === 'multisource' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-100 text-base">Level 3 Multi-Source Segregated Fund Balances</h2>
              <p className="text-xs text-slate-400">
                Auditing how each Field Overseer holds distinct balances from different Level 2 Directors without blending or co-mingling funds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.financialOverview?.l3SourceBalancesBreakdown?.map((l3Breakdown) => (
                <div key={l3Breakdown.l3Id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center space-x-2">
                      <Church className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-200 text-sm">{l3Breakdown.l3Name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-amber-400">
                        ₹{l3Breakdown.totalRemaining.toLocaleString('en-IN')} total remaining
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {l3Breakdown.sources.map((s, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div>
                          <div className="font-sans font-semibold text-slate-300">{s.sourceL2Name}</div>
                          <div className="text-[10px] text-slate-500">Rec: ₹{s.received.toLocaleString('en-IN')} | Spent: ₹{s.spent.toLocaleString('en-IN')}</div>
                        </div>
                        <div className="font-bold text-emerald-400">
                          ₹{s.remaining.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DIRECT BISHOP DISBURSEMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'disbursements' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-slate-100 text-base">Diocesan Executive Grants & Direct Disbursements</h2>
                <p className="text-xs text-slate-400">Direct grants issued by the Bishop / Leadership to Level 3 Overseers or Level 4 Parish Workers.</p>
              </div>
              <button
                onClick={() => setShowDirectPayModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Issue Direct Grant</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Recipient</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Purpose</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">L2 Acknowledgment</th>
                    <th className="py-3 px-3 font-mono">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {data?.allMoneyMovements?.filter(m => m.type.startsWith('L1_')).map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 text-slate-400 font-mono">{mov.date.split('T')[0]}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-200">{mov.toName}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full text-[10px] font-bold">
                          {mov.toRole}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">{mov.purpose}</td>
                      <td className="py-3.5 px-3 text-right font-bold text-indigo-400 font-mono text-sm">
                        ₹{mov.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {mov.status === 'ACKNOWLEDGED' ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                            ACKNOWLEDGED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                            PENDING L2 ACK
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{mov.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ADVANCES & SETTLEMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'advances' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-100 text-base">Operational Advances & Settlement Tracking</h2>
              <p className="text-xs text-slate-400">Strictly distinguish advances from final expenses. Audit open advances, actual expenditures, and cash returns.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.advancesAndSettlements?.map((adv) => (
                <div key={adv.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-slate-500 font-mono">{adv.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adv.status === 'SETTLED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {adv.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-200 text-sm">{adv.requesterName}</div>
                    <div className="text-xs text-indigo-400 font-semibold">{adv.categoryName}</div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{adv.purpose}</p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Advance Given:</span>
                        <span className="font-bold text-slate-200">₹{adv.amount.toLocaleString('en-IN')}</span>
                      </div>
                      {adv.status === 'SETTLED' && (
                        <>
                          <div className="flex justify-between text-emerald-400">
                            <span>Actual Spent:</span>
                            <span>₹{(adv.actualSpent || 0).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sky-400">
                            <span>Refund Returned:</span>
                            <span>₹{(adv.returnedOrRefundedAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {adv.status === 'OUTSTANDING' && (
                    <button
                      onClick={() => {
                        setSelectedAdvance(adv);
                        setSettleActualSpent(adv.amount.toString());
                      }}
                      className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                    >
                      Audit & Settle Advance
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: EXCEPTIONS & ISSUES */}
        {/* ========================================================================= */}
        {activeTab === 'exceptions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-100 text-base">Diocesan Exception & Financial Issue Monitor</h2>
              <p className="text-xs text-slate-400">Centralized log of bank statement mismatches, OCR bill disparities, missing vouchers, and budget variances.</p>
            </div>

            <div className="space-y-3">
              {data?.exceptionsAndIssues?.map((issue) => (
                <div key={issue.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        issue.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        issue.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {issue.severity} SEVERITY
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{issue.issueType}</span>
                    </div>

                    <h4 className="font-bold text-slate-200 text-sm">{issue.title}</h4>
                    <p className="text-xs text-slate-400 max-w-2xl">{issue.description}</p>
                    <div className="text-[11px] text-slate-500">
                      Identified by: <span className="text-slate-300">{issue.identifiedBy}</span> on {issue.identifiedDate.split('T')[0]}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end space-y-2 flex-shrink-0">
                    {issue.status === 'RESOLVED' ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                        RESOLVED
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedException(issue)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                      >
                        Resolve Issue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: HIERARCHY DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'hierarchy' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-bold text-slate-100 text-base">Diocesan Organizational Hierarchy Directory</h2>
                <p className="text-xs text-slate-400">Formal reporting structure across Level 1, Level 2, Level 3, and Level 4.</p>
              </div>
              <button
                onClick={() => setShowOnboardModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Onboard New Personnel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.allHierarchyPeople?.map((person) => (
                <div key={person.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      person.role === 'LEVEL_1' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      person.role === 'LEVEL_2' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      person.role === 'LEVEL_3' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {person.role}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{person.phone}</span>
                  </div>

                  <div className="font-bold text-slate-200 text-sm">{person.name}</div>
                  <div className="text-xs text-slate-400">{person.designation}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{person.email}</div>
                  <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                    Scope: <span className="text-slate-300">{person.assignedArea || 'Diocesan Jurisdiction'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: AUDIT TRAIL */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-100 text-base">Immutable Diocesan Compliance & Ledger Audit Logs</h2>
              <p className="text-xs text-slate-400">Cryptographically sequenced events across all four levels of church financial administration.</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {data?.auditLogs?.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-indigo-400">{log.actorName}</span>
                      <span className="text-slate-500 font-mono">({log.actorRole})</span>
                      <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px] flex-shrink-0 ml-4">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* MODAL 1: DIRECT BISHOP DISBURSEMENT */}
      {/* ========================================== */}
      {showDirectPayModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <Crown className="w-5 h-5 text-indigo-400" />
                <span>Issue Direct Bishop Executive Grant</span>
              </h3>
              <button 
                onClick={() => setShowDirectPayModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDirectPaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Recipient Role Tier</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDirectPayRole('LEVEL_3');
                      setDirectPayUserId('');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      directPayRole === 'LEVEL_3'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Level 3 Field Overseer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDirectPayRole('LEVEL_4');
                      setDirectPayUserId('');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      directPayRole === 'LEVEL_4'
                        ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Level 4 Parish Worker
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Select Recipient Person</label>
                <select
                  required
                  value={directPayUserId}
                  onChange={(e) => setDirectPayUserId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose recipient --</option>
                  {data?.allHierarchyPeople
                    ?.filter((u) => u.role === directPayRole)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.designation} - {u.assignedArea})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Grant Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={directPayAmount}
                  onChange={(e) => setDirectPayAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Purpose / Mission Justification</label>
                <textarea
                  rows={2}
                  value={directPayPurpose}
                  onChange={(e) => setDirectPayPurpose(e.target.value)}
                  placeholder="e.g. Emergency disaster relief & parish flood response"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDirectPayModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={directPaySubmitting || !directPayUserId || !directPayAmount}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {directPaySubmitting ? 'Disbursing...' : 'Disburse Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ONBOARD PERSONNEL */}
      {/* ========================================== */}
      {showOnboardModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <span>Appoint Diocesan Leadership</span>
              </h3>
              <button 
                onClick={() => setShowOnboardModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Appointed Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOnboardRole('LEVEL_2')}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      onboardRole === 'LEVEL_2'
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Level 2 Central Director
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardRole('LEVEL_3')}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      onboardRole === 'LEVEL_3'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Level 3 Field Overseer
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Legal / Ordained Name</label>
                <input
                  type="text"
                  required
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="e.g. Pastor Samuel George"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={onboardEmail}
                  onChange={(e) => setOnboardEmail(e.target.value)}
                  placeholder="name@gracechurch.org"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Official Designation Title</label>
                <input
                  type="text"
                  required
                  value={onboardDesignation}
                  onChange={(e) => setOnboardDesignation(e.target.value)}
                  placeholder={onboardRole === 'LEVEL_2' ? 'Director of Youth & Education' : 'West Zonal Overseer'}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={onboardPhone}
                  onChange={(e) => setOnboardPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Jurisdiction / Department Scope</label>
                <input
                  type="text"
                  value={onboardArea}
                  onChange={(e) => setOnboardArea(e.target.value)}
                  placeholder="e.g. South Zone - Rayalaseema & Hubli"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardSubmitting || !onboardName.trim()}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {onboardSubmitting ? 'Onboarding...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: SETTLE ADVANCE */}
      {/* ========================================== */}
      {selectedAdvance && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">
                Audit & Settle Advance: {selectedAdvance.id}
              </h3>
              <button 
                onClick={() => setSelectedAdvance(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div><span className="text-slate-400">Worker:</span> <span className="font-bold text-slate-200">{selectedAdvance.requesterName}</span></div>
              <div><span className="text-slate-400">Purpose:</span> <span className="text-slate-300">{selectedAdvance.purpose}</span></div>
              <div><span className="text-slate-400">Original Advance:</span> <span className="font-bold text-indigo-400 font-mono">₹{selectedAdvance.amount.toLocaleString('en-IN')}</span></div>
            </div>

            <form onSubmit={handleSettleAdvanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Actual Amount Spent (₹ INR)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedAdvance.amount}
                  value={settleActualSpent}
                  onChange={(e) => {
                    const spent = Number(e.target.value);
                    setSettleActualSpent(e.target.value);
                    setSettleRefund(Math.max(0, selectedAdvance.amount - spent).toString());
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cash Returned / Refunded (₹ INR)</label>
                <input
                  type="number"
                  value={settleRefund}
                  onChange={(e) => setSettleRefund(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Settlement Voucher No</label>
                <input
                  type="text"
                  value={settleVoucherNo}
                  onChange={(e) => setSettleVoucherNo(e.target.value)}
                  placeholder="VCHR-SETTLE-2026-001"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Audit & Settlement Remarks</label>
                <textarea
                  rows={2}
                  value={settleRemarks}
                  onChange={(e) => setSettleRemarks(e.target.value)}
                  placeholder="e.g. Scanned fuel bills verified and remainder refunded to cash box."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedAdvance(null)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settleSubmitting}
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  {settleSubmitting ? 'Settling...' : 'Close & Settle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 4: RESOLVE EXCEPTION */}
      {/* ========================================== */}
      {selectedException && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base">
                Resolve Exception: {selectedException.id}
              </h3>
              <button 
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-200">{selectedException.title}</div>
              <p className="text-slate-400">{selectedException.description}</p>
            </div>

            <form onSubmit={handleResolveExceptionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Resolution & Compliance Notes</label>
                <textarea
                  rows={3}
                  required
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="e.g. Bank credit slip verified against NEFT scroll; ₹250 difference justified as bank interest accrual."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedException(null)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolveSubmitting || !resolveNotes.trim()}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  {resolveSubmitting ? 'Resolving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-3.5 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Church Financial Management Platform &bull; Level 1 Diocesan Leadership Fiduciary Framework</div>
        <div className="text-indigo-400 font-mono text-[11px]">Synod Assembly Standard v2.6</div>
      </footer>
    </div>
  );
};
