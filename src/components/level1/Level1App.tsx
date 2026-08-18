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
  FileText, 
  LogOut, 
  ArrowRight, 
  RefreshCw, 
  CreditCard, 
  AlertCircle,
  Sparkles,
  UserPlus,
  Eye,
  CheckCircle
} from 'lucide-react';
import { 
  User, 
  L1DashboardData, 
  AdvanceRecord, 
  ExceptionIssue 
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
  const [activeTab, setActiveTab] = useState<
    'overview' | 'budgets' | 'multisource' | 'disbursements' | 'advances' | 'exceptions' | 'hierarchy' | 'audit'
  >('overview');

  // Drawer detail state
  const [selectedEntityDrawer, setSelectedEntityDrawer] = useState<any | null>(null);

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
      setError(err.message || 'Failed to connect to Level 1 Backend Service');
    } finally {
      setLoading(false);
    }
  };

  // Direct grant submit
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
    <div id="level1-app-root" className="min-h-screen bg-[#F7F3EA] text-[#241B2F] flex flex-col font-sans">
      
      {/* GLOBAL HEADER (Compact & Executive) */}
      <header className="border-b border-[#3A2B49] bg-[#21152F] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2B1B3D] border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold shadow-xs">
            <Crown className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm tracking-tight">Organization Financial Overview</span>
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

          {/* Direct Bishop Grant CTA */}
          <button
            id="l1-quick-grant-btn"
            onClick={() => setShowDirectPayModal(true)}
            className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Executive Grant</span>
          </button>

          {/* Sign Out Button */}
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

      {/* BODY: LEFT SIDEBAR + MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Desktop / Tablet Left Sidebar */}
        <div className="hidden md:block">
          <Level1Sidebar
            activeTab={activeTab as Level1Tab}
            onSelectTab={(tab) => setActiveTab(tab as any)}
            outstandingAdvancesCount={metrics?.totalOutstandingAdvances ? Math.round(metrics.totalOutstandingAdvances / 1000) : 0}
            activeExceptionsCount={metrics?.activeExceptionsCount || 0}
            onLogout={onLogout}
          />
        </div>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto space-y-6">
        
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between font-medium">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={refreshL1State} className="underline font-bold cursor-pointer">Retry</button>
          </div>
        )}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* SECTION 1 — ORGANIZATION SNAPSHOT (EXACTLY 4 METRICS MAXIMUM) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Total Available */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Available</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2 font-mono">
                  ₹{(metrics?.totalOrganizationControlledFunds || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">
                  Net org treasury liquidity
                </div>
              </div>

              {/* Metric 2: Total Allocated */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Allocated</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
                  ₹{(metrics?.totalL2BudgetsAllocated || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">
                  Assigned to L2 Directorates
                </div>
              </div>

              {/* Metric 3: Total Spent */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
                  ₹{(metrics?.totalRecordedExpenses || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-2 font-medium">
                  Verified field & central expenses
                </div>
              </div>

              {/* Metric 4: Pending / At Risk */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending / At Risk</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2 font-mono">
                  ₹{((metrics?.totalOutstandingAdvances || 0) + (metrics?.activeExceptionsCount || 0) * 50000).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-rose-600 mt-2 font-semibold">
                  {metrics?.activeExceptionsCount || 0} active exception{(metrics?.activeExceptionsCount || 0) !== 1 ? 's' : ''}
                </div>
              </div>

            </div>

            {/* SECTION 2 — NEEDS EXECUTIVE ATTENTION */}
            {(metrics?.activeExceptionsCount || 0) > 0 || (metrics?.totalOutstandingAdvances || 0) > 0 ? (
              <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Needs Executive Attention</h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                      {metrics?.activeExceptionsCount || 0} active compliance exception{(metrics?.activeExceptionsCount || 0) !== 1 ? 's' : ''} require bishop review. Outstanding advances total ₹{(metrics?.totalOutstandingAdvances || 0).toLocaleString('en-IN')}.
                    </p>
                  </div>
                </div>
                <button
                  id="l1-review-exceptions-btn"
                  onClick={() => setActiveTab('exceptions')}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0"
                >
                  <span>Review Exceptions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 font-medium">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>All organizational accounts are balanced and up to date. No pending executive exceptions.</span>
              </div>
            )}

            {/* SECTION 3 — FINANCIAL FLOW (Aggregated Visualization) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Consolidated Financial Flow</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-blue-700 uppercase">LEVEL 1</div>
                  <div className="text-xs font-semibold text-slate-700">Supreme Synod</div>
                  <div className="text-base font-bold text-blue-600 font-mono">₹{(metrics?.totalOrganizationControlledFunds || 0).toLocaleString('en-IN')}</div>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">LEVEL 2</div>
                  <div className="text-xs font-semibold text-slate-700">Directorates</div>
                  <div className="text-base font-bold text-emerald-600 font-mono">₹{(metrics?.totalL2AvailableBalances || 0).toLocaleString('en-IN')}</div>
                </div>

                <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-700 uppercase">LEVEL 3</div>
                  <div className="text-xs font-semibold text-slate-700">Field Overseers</div>
                  <div className="text-base font-bold text-amber-600 font-mono">₹{(metrics?.totalL3AvailableBalances || 0).toLocaleString('en-IN')}</div>
                </div>

                <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-xl space-y-1">
                  <div className="text-[11px] font-bold text-sky-700 uppercase">LEVEL 4</div>
                  <div className="text-xs font-semibold text-slate-700">Parish Workers</div>
                  <div className="text-base font-bold text-sky-600 font-mono">₹{(metrics?.totalL4AvailableBalances || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — ORGANIZATION / DIVISION PERFORMANCE (Compact Table) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Division & Department Performance</span>
                </h3>
                <button
                  onClick={() => setActiveTab('budgets')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
                >
                  Manage All Budgets
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Entity</th>
                      <th className="py-2.5 px-3 text-right">Allocated</th>
                      <th className="py-2.5 px-3 text-right">Spent</th>
                      <th className="py-2.5 px-3 text-right">Available</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data?.financialOverview?.l2Budgets?.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{dept.departmentName}</div>
                          <div className="text-[11px] text-slate-500">{dept.directorName}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700 font-semibold">
                          ₹{dept.allocatedBudget.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700 font-semibold">
                          ₹{dept.spentAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-blue-600 font-bold">
                          ₹{dept.availableBalance.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Healthy
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedEntityDrawer(dept)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5 — RECENT EXECUTIVE ACTIVITY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Recent Executive Log Activity</span>
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data?.financialOverview?.auditLogs?.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-slate-500 ml-2 font-medium">{log.details}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* OTHER TABS (Budgets, Multisource, Disbursements, Advances, Exceptions, Hierarchy, Audit) */}
        {activeTab === 'budgets' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-base">Level 2 Departmental Budgets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Director</th>
                    <th className="py-2.5 px-3 text-right">Allocated Budget</th>
                    <th className="py-2.5 px-3 text-right">Spent</th>
                    <th className="py-2.5 px-3 text-right">Available Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.financialOverview?.l2Budgets?.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-3 font-bold text-slate-900">{b.departmentName}</td>
                      <td className="py-3 px-3 text-slate-600">{b.directorName}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800">₹{b.allocatedBudget.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-800">₹{b.spentAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-blue-600 font-bold">₹{b.availableBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'exceptions' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-base">Compliance Exceptions & Issues</h3>
            <div className="space-y-3">
              {data?.activeExceptions?.map((ex) => (
                <div key={ex.id} className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">{ex.severity}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{ex.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{ex.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedException(ex)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Resolve Issue
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Diocesan Multi-Person Hierarchy</h3>
              <button
                onClick={() => setShowOnboardModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Appoint Leader</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.hierarchyView?.allUsers?.map((usr) => (
                <div key={usr.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{usr.name}</div>
                    <div className="text-xs text-blue-600 font-semibold">{usr.designation}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{usr.assignedArea}</div>
                  </div>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700">
                    {usr.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* DETAIL DRAWER FOR ENTITY DETAILS */}
      <DetailDrawer
        isOpen={!!selectedEntityDrawer}
        onClose={() => setSelectedEntityDrawer(null)}
        title={selectedEntityDrawer?.departmentName || 'Entity Details'}
        subtitle={`Director: ${selectedEntityDrawer?.directorName || ''}`}
      >
        {selectedEntityDrawer && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-blue-800 uppercase">Financial Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Allocated</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">₹{selectedEntityDrawer.allocatedBudget.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Spent</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">₹{selectedEntityDrawer.spentAmount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Available</div>
                  <div className="text-sm font-bold text-blue-600 font-mono">₹{selectedEntityDrawer.availableBalance.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Governance Info</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
                <div><span className="font-semibold text-slate-900">Department:</span> {selectedEntityDrawer.departmentName}</div>
                <div><span className="font-semibold text-slate-900">Director:</span> {selectedEntityDrawer.directorName}</div>
                <div><span className="font-semibold text-slate-900">Status:</span> Active Fiduciary</div>
              </div>
            </div>
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
                  value={onboardDesignation}
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

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D8] bg-[#FFFDF8] py-3.5 text-center text-xs text-[#5F6368] font-medium">
        Church Financial Management Platform &bull; Level 1 Supreme Synod Fiduciary Executive Dashboard
      </footer>
    </div>
  );
};
