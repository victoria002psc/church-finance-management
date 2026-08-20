import React, { useState, useEffect } from 'react';
import { 
  L3DashboardData, 
  MoneyRequest, 
  Expense, 
  MoneyGiven, 
  MoneyReceived,
  User,
  L1DashboardData
} from './types.ts';
import { 
  fetchL3DashboardState, 
  giveMoneyDirect, 
  approveRequest, 
  giveMoneyLater, 
  rejectRequest, 
  acknowledgeExpense, 
  verifyOcr, 
  validateL4ToL4, 
  createL4User, 
  recordMultiSourceExpense,
  switchActiveUser,
  logoutLevel2User,
  logoutLevel1User
} from './services/api.ts';

import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MobileNav } from './components/MobileNav.tsx';

import { DashboardView } from './components/views/DashboardView.tsx';
import { MoneyView } from './components/views/MoneyView.tsx';
import { RequestsView } from './components/views/RequestsView.tsx';
import { Level4TeamView } from './components/views/Level4TeamView.tsx';
import { ExpensesView } from './components/views/ExpensesView.tsx';
import { ReconciliationView } from './components/views/ReconciliationView.tsx';
import { ReportsView } from './components/views/ReportsView.tsx';
import { AuditView } from './components/views/AuditView.tsx';

import { GiveMoneyModal } from './components/modals/GiveMoneyModal.tsx';
import { RequestReviewModal } from './components/modals/RequestReviewModal.tsx';
import { ExpenseDetailModal } from './components/modals/ExpenseDetailModal.tsx';
import { CreateL4Modal } from './components/modals/CreateL4Modal.tsx';
import { TransactionTraceModal } from './components/modals/TransactionTraceModal.tsx';
import { MultiSourceExpenseModal } from './components/modals/MultiSourceExpenseModal.tsx';

import { Level1App } from './components/level1/Level1App.tsx';
import { Level1Login } from './components/auth/Level1Login.tsx';
import { Level2App } from './components/level2/Level2App.tsx';
import { Level2Login } from './components/auth/Level2Login.tsx';
import { Level3Login } from './components/auth/Level3Login.tsx';
import { Level4Login } from './components/auth/Level4Login.tsx';
import { Level4App } from './components/level4/Level4App.tsx';
import { SignUpView } from './components/auth/SignUpView.tsx';
import { PortalGateway } from './components/auth/PortalGateway.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export type AppRoute = 
  | 'GATEWAY'
  | 'SIGNUP'
  | 'LEVEL_1_LOGIN'
  | 'LEVEL_1_APP'
  | 'LEVEL_2_LOGIN'
  | 'LEVEL_2_APP'
  | 'LEVEL_3_LOGIN'
  | 'LEVEL_3_APP'
  | 'LEVEL_4_LOGIN'
  | 'LEVEL_4_APP';

function resolveInitialRoute(): AppRoute {
  if (typeof window === 'undefined') return 'GATEWAY';
  const path = window.location.pathname.toLowerCase();

  if (path.includes('signup') || path.includes('register')) {
    return 'SIGNUP';
  }
  if (path.includes('level-1/login')) {
    return 'LEVEL_1_LOGIN';
  }
  if (path.includes('level-2/login')) {
    return 'LEVEL_2_LOGIN';
  }
  if (path.includes('level-3/login')) {
    return 'LEVEL_3_LOGIN';
  }
  if (path.includes('level-4/login')) {
    return 'LEVEL_4_LOGIN';
  }

  if (path.includes('level-1')) {
    const hasL1Session = !!localStorage.getItem('church_l1_session');
    return hasL1Session ? 'LEVEL_1_APP' : 'LEVEL_1_LOGIN';
  }
  if (path.includes('level-2')) {
    const hasL2Session = !!localStorage.getItem('church_l2_session');
    return hasL2Session ? 'LEVEL_2_APP' : 'LEVEL_2_LOGIN';
  }
  if (path.includes('level-3')) {
    const hasL3Session = !!localStorage.getItem('church_l3_session');
    return hasL3Session ? 'LEVEL_3_APP' : 'LEVEL_3_LOGIN';
  }
  if (path.includes('level-4')) {
    const hasL4Session = !!localStorage.getItem('church_l4_session');
    return hasL4Session ? 'LEVEL_4_APP' : 'LEVEL_4_LOGIN';
  }

  return 'GATEWAY';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(resolveInitialRoute);
  
  // Level 1 State
  const [l1InitialData, setL1InitialData] = useState<L1DashboardData | null>(null);
  const [l1User, setL1User] = useState<User | null>(() => {
    const raw = localStorage.getItem('church_l1_session');
    return raw ? JSON.parse(raw) : null;
  });

  // Level 4 State
  const [l4User, setL4User] = useState<User | null>(() => {
    const raw = localStorage.getItem('church_l4_session');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });

  // Level 2 State
  const [l2InitialData, setL2InitialData] = useState<any>(null);

  // Level 3 State
  const [data, setData] = useState<L3DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Level 3 Modal States
  const [isGiveMoneyOpen, setIsGiveMoneyOpen] = useState(false);
  const [isCreateL4Open, setIsCreateL4Open] = useState(false);
  const [isMultiSourceOpen, setIsMultiSourceOpen] = useState(false);
  
  const [reviewRequest, setReviewRequest] = useState<MoneyRequest | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [traceItem, setTraceItem] = useState<{ item: any; type: 'MONEY_GIVEN' | 'MONEY_RECEIVED' | 'EXPENSE' | 'REQUEST' } | null>(null);

  // Sync URL history state
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(resolveInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load authoritative Level 3 state when entering Level 3 App
  const loadL3State = async () => {
    try {
      setLoading(true);
      setError(null);
      const state = await fetchL3DashboardState();
      setData(state);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Level 3 Backend Service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRoute === 'LEVEL_3_APP') {
      loadL3State();
    }
  }, [currentRoute]);

  // ==========================================
  // LEVEL 1 AUTH & HANDLERS
  // ==========================================
  const handleL1LoginSuccess = (user: User, state?: L1DashboardData) => {
    localStorage.setItem('church_l1_session', JSON.stringify(user));
    setL1User(user);
    if (state) {
      setL1InitialData(state);
    }
    setCurrentRoute('LEVEL_1_APP');
    window.history.pushState({}, '', '/level-1/dashboard');
  };

  const handleL1Logout = async () => {
    localStorage.removeItem('church_l1_session');
    setL1User(null);
    setL1InitialData(null);
    try {
      await logoutLevel1User();
    } catch (e) {
      // Ignore network error on logout
    }
    setCurrentRoute('LEVEL_1_LOGIN');
    window.history.pushState({}, '', '/level-1/login');
  };

  // ==========================================
  // LEVEL 2 AUTH & HANDLERS
  // ==========================================
  const handleL2LoginSuccess = (user: User, state?: any) => {
    localStorage.setItem('church_l2_session', JSON.stringify(user));
    if (state) {
      setL2InitialData(state);
    }
    setCurrentRoute('LEVEL_2_APP');
    window.history.pushState({}, '', '/level-2/dashboard');
  };

  const handleL2Logout = async () => {
    localStorage.removeItem('church_l2_session');
    setL2InitialData(null);
    try {
      await logoutLevel2User();
    } catch (e) {
      // Ignore network errors on logout
    }
    setCurrentRoute('LEVEL_2_LOGIN');
    window.history.pushState({}, '', '/level-2/login');
  };

  // ==========================================
  // LEVEL 3 AUTH & HANDLERS
  // ==========================================
  const handleL3LoginSuccess = async (user: User, state?: L3DashboardData) => {
    localStorage.setItem('church_l3_session', JSON.stringify(user));
    if (state) {
      setData(state);
    }
    setLoading(true);
    setError(null);
    setCurrentRoute('LEVEL_3_APP');
    window.history.pushState({}, '', '/level-3/dashboard');
    try {
      await switchActiveUser(user.id);
      const res = await fetchL3DashboardState();
      setData(res);
    } catch (e: any) {
      console.warn('L3 state sync warning:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleL3Logout = () => {
    localStorage.removeItem('church_l3_session');
    setData(null);
    setCurrentRoute('LEVEL_3_LOGIN');
    window.history.pushState({}, '', '/level-3/login');
  };

  // ==========================================
  // LEVEL 4 AUTH & HANDLERS
  // ==========================================
  const handleL4LoginSuccess = (user?: User) => {
    const userToStore = user || {
      id: 'usr-l4-worker1',
      name: 'Pastor John Miller',
      role: 'LEVEL_4',
      designation: 'Parish Field Worker',
      email: 'pastor.john@gracechurch.org',
      phone: '+91 98401 22334',
      assignedArea: 'Grace Parish & Project Outreach',
      createdAt: '2026-01-01',
    };
    localStorage.setItem('church_l4_session', JSON.stringify(userToStore));
    setL4User(userToStore);
    setCurrentRoute('LEVEL_4_APP');
    window.history.pushState({}, '', '/level-4/dashboard');
  };

  const handleL4Logout = () => {
    localStorage.removeItem('church_l4_session');
    setL4User(null);
    setCurrentRoute('LEVEL_4_LOGIN');
    window.history.pushState({}, '', '/level-4/login');
  };

  // ==========================================
  // GATEWAY & NAVIGATION
  // ==========================================
  const handleSelectGatewayL1 = () => {
    setCurrentRoute('LEVEL_1_LOGIN');
    window.history.pushState({}, '', '/level-1/login');
  };

  const handleSelectGatewayL2 = () => {
    setCurrentRoute('LEVEL_2_LOGIN');
    window.history.pushState({}, '', '/level-2/login');
  };

  const handleSelectGatewayL3 = () => {
    setCurrentRoute('LEVEL_3_LOGIN');
    window.history.pushState({}, '', '/level-3/login');
  };

  const handleSelectGatewayL4 = () => {
    setCurrentRoute('LEVEL_4_LOGIN');
    window.history.pushState({}, '', '/level-4/login');
  };

  const handleNavigateGateway = () => {
    setCurrentRoute('GATEWAY');
    window.history.pushState({}, '', '/');
  };

  const handleNavigateSignUp = () => {
    setCurrentRoute('SIGNUP');
    window.history.pushState({}, '', '/signup');
  };

  const handleNavigateToLogin = (role?: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4') => {
    if (role === 'LEVEL_1') {
      setCurrentRoute('LEVEL_1_LOGIN');
      window.history.pushState({}, '', '/level-1/login');
    } else if (role === 'LEVEL_2') {
      setCurrentRoute('LEVEL_2_LOGIN');
      window.history.pushState({}, '', '/level-2/login');
    } else if (role === 'LEVEL_4') {
      setCurrentRoute('LEVEL_4_LOGIN');
      window.history.pushState({}, '', '/level-4/login');
    } else {
      setCurrentRoute('LEVEL_3_LOGIN');
      window.history.pushState({}, '', '/level-3/login');
    }
  };

  // Handlers for Level 3 Operations
  const handleSwitchL3User = async (userId: string) => {
    try {
      setLoading(true);
      const res = await switchActiveUser(userId);
      setData(res);
      const activeUser = res.availableL3Users.find((u) => u.id === userId);
      if (activeUser) {
        localStorage.setItem('church_l3_session', JSON.stringify(activeUser));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to switch active user');
    } finally {
      setLoading(false);
    }
  };

  const handleGiveMoney = async (payload: {
    receiverL4Id: string;
    amount: number;
    sourceBalanceId: string;
    eventId?: string;
    categoryId: string;
    purpose?: string;
  }) => {
    const res = await giveMoneyDirect(payload);
    setData(res.state);
  };

  const handleApproveRequest = async (payload: {
    requestId: string;
    actionType: 'APPROVE_ONLY' | 'APPROVE_AND_GIVE';
    sourceBalanceId?: string;
  }) => {
    const res = await approveRequest(payload);
    setData(res.state);
  };

  const handleGiveLater = async (payload: { requestId: string; sourceBalanceId: string }) => {
    const res = await giveMoneyLater(payload);
    setData(res.state);
  };

  const handleRejectRequest = async (payload: { requestId: string; reason: string }) => {
    const res = await rejectRequest(payload);
    setData(res.state);
  };

  const handleAcknowledgeExpense = async (expenseId: string) => {
    const res = await acknowledgeExpense(expenseId);
    setData(res.state);
    if (selectedExpense && selectedExpense.id === expenseId) {
      setSelectedExpense(res.expense);
    }
  };

  const handleVerifyOcr = async (payload: {
    expenseId: string;
    verificationAction: 'VERIFY_CORRECT' | 'FLAG_DISCREPANCY';
    remarks?: string;
  }) => {
    const res = await verifyOcr(payload);
    setData(res.state);
    if (selectedExpense && selectedExpense.id === payload.expenseId) {
      setSelectedExpense(res.expense);
    }
  };

  const handleValidateL4ToL4 = async (payload: {
    transactionId: string;
    action: 'ACCEPT' | 'REJECT';
    l3Remarks?: string;
  }) => {
    const res = await validateL4ToL4(payload);
    setData(res.state);
  };

  const handleCreateL4 = async (payload: {
    name: string;
    email?: string;
    phone: string;
    designation: string;
    assignedArea?: string;
  }) => {
    const res = await createL4User(payload);
    setData(res.state);
  };

  const handleRecordMultiSource = async (payload: {
    personL4Id: string;
    amount: number;
    categoryId: string;
    eventId?: string;
    description?: string;
    documentType?: 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';
    documentNumber?: string;
  }) => {
    const res = await recordMultiSourceExpense(payload);
    setData(res.state);
  };

  // ==========================================
  // RENDER PER ROUTE
  // ==========================================

  // 1. GATEWAY
  if (currentRoute === 'GATEWAY') {
    return (
      <PortalGateway
        onSelectLevel1={handleSelectGatewayL1}
        onSelectLevel2={handleSelectGatewayL2}
        onSelectLevel3={handleSelectGatewayL3}
        onSelectLevel4={handleSelectGatewayL4}
        onSelectSignUp={handleNavigateSignUp}
      />
    );
  }

  const handleSignUpSuccess = (user: User, _token?: string, state?: any) => {
    if (user.role === 'LEVEL_1') {
      handleL1LoginSuccess(user, state);
    } else if (user.role === 'LEVEL_2') {
      handleL2LoginSuccess(user, state);
    } else if (user.role === 'LEVEL_3') {
      handleL3LoginSuccess(user, state);
    } else {
      handleL4LoginSuccess(user);
    }
  };

  // 2. UNIVERSAL SIGN UP VIEW
  if (currentRoute === 'SIGNUP') {
    return (
      <SignUpView
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateLogin={handleNavigateToLogin}
        onNavigateGateway={handleNavigateGateway}
      />
    );
  }

  // 3. LEVEL 1 LOGIN
  if (currentRoute === 'LEVEL_1_LOGIN') {
    return (
      <Level1Login
        onLoginSuccess={handleL1LoginSuccess}
        onNavigateGateway={handleNavigateGateway}
        onNavigateSignUp={handleNavigateSignUp}
      />
    );
  }

  // 4. LEVEL 1 APPLICATION
  if (currentRoute === 'LEVEL_1_APP') {
    const activeUser = l1User || {
      id: 'usr-l1-bishop',
      name: 'Most Rev. Bishop Dr. P. J. Thomas',
      role: 'LEVEL_1',
      designation: 'Diocesan Bishop & Senior Trustee',
      email: 'bishop@gracechurch.org',
      phone: '+91 98400 11001',
      assignedArea: 'Central Diocesan Synod Jurisdiction',
      createdAt: '2026-01-01',
    };
    return (
      <ErrorBoundary fallbackTitle="Level 1 Dashboard Exception">
        <Level1App
          initialUser={activeUser}
          initialData={l1InitialData}
          onLogout={handleL1Logout}
        />
      </ErrorBoundary>
    );
  }

  // 5. LEVEL 2 LOGIN
  if (currentRoute === 'LEVEL_2_LOGIN') {
    return (
      <Level2Login
        onLoginSuccess={handleL2LoginSuccess}
        onNavigateGateway={handleNavigateGateway}
        onNavigateSignUp={handleNavigateSignUp}
      />
    );
  }

  // 6. LEVEL 2 APPLICATION
  if (currentRoute === 'LEVEL_2_APP') {
    return (
      <ErrorBoundary fallbackTitle="Level 2 Dashboard Exception">
        <Level2App initialData={l2InitialData} onLogout={handleL2Logout} />
      </ErrorBoundary>
    );
  }

  // 7. LEVEL 3 LOGIN
  if (currentRoute === 'LEVEL_3_LOGIN') {
    return (
      <Level3Login
        onLoginSuccess={handleL3LoginSuccess}
        onNavigateGateway={handleNavigateGateway}
        onNavigateSignUp={handleNavigateSignUp}
      />
    );
  }

  // 8. LEVEL 4 LOGIN
  if (currentRoute === 'LEVEL_4_LOGIN') {
    return (
      <Level4Login
        onLoginSuccess={handleL4LoginSuccess}
        onNavigateGateway={handleNavigateGateway}
        onNavigateSignUp={handleNavigateSignUp}
      />
    );
  }

  // 9. LEVEL 4 APPLICATION
  if (currentRoute === 'LEVEL_4_APP') {
    return (
      <ErrorBoundary fallbackTitle="Level 4 Workspace Exception">
        <Level4App initialUser={l4User || undefined} onLogout={handleL4Logout} />
      </ErrorBoundary>
    );
  }

  // 8. LEVEL 3 APPLICATION
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-lg mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="font-bold text-base text-stone-900">Loading Church Financial Management System...</h2>
        <p className="text-xs text-stone-500 mt-1">Connecting to authoritative server & calculating source balances</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-md max-w-md w-full text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="font-bold text-base text-stone-900">Backend Connection Error</h2>
          <p className="text-xs text-stone-600">{error}</p>
          <button
            onClick={loadL3State}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="font-bold text-base text-slate-900">Loading Level 3 Overseer Portal...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to server & calculating multi-source ledger balances...</p>
      </div>
    );
  }

  const movements = data?.recentMoneyMovements || [];
  const moneyGivenList = movements.filter((m) => 'giverL3Id' in m) as MoneyGiven[];
  const moneyReceivedList = movements.filter((m) => 'fromL2Id' in m) as MoneyReceived[];

  return (
    <ErrorBoundary fallbackTitle="Level 3 Dashboard Exception">
      <div id="l3-app-root" className="min-h-screen bg-[#F7F5F0] text-[#171717] flex flex-col font-sans">
      {/* Level 3 Header with explicit Logout */}
      <Header
        user={data.currentL3User}
        availableL3Users={data.availableL3Users}
        totalAvailable={data.totalAvailable}
        sourceBalances={data.sourceBalances}
        pendingActionsCount={data.pendingActionsCount}
        onOpenGiveMoney={() => setIsGiveMoneyOpen(true)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onSwitchUser={handleSwitchL3User}
        onLogout={handleL3Logout}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Desktop / Tablet Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            pendingRequestsCount={data.pendingRequestsCount}
            unacknowledgedExpensesCount={data.unacknowledgedExpensesCount}
            ocrMismatchesCount={data.ocrMismatchesCount}
            bankDifferencesCount={data.bankDifferencesCount}
            onLogout={handleL3Logout}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={data}
              onOpenGiveMoney={() => setIsGiveMoneyOpen(true)}
              onOpenReviewRequest={(req) => setReviewRequest(req)}
              onOpenExpenseDetail={(exp) => setSelectedExpense(exp)}
              onOpenTrace={(item, type) => setTraceItem({ item, type })}
              onOpenMultiSource={() => setIsMultiSourceOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'money' && (
            <MoneyView
              sourceBalances={data.sourceBalances}
              moneyReceivedList={moneyReceivedList}
              moneyGivenList={moneyGivenList}
              onOpenGiveMoney={() => setIsGiveMoneyOpen(true)}
              onOpenTrace={(item, type) => setTraceItem({ item, type })}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsView
              requests={data.requests}
              onOpenReviewRequest={(req) => setReviewRequest(req)}
              onOpenTrace={(item, type) => setTraceItem({ item, type })}
            />
          )}

          {activeTab === 'level4' && (
            <Level4TeamView
              l4People={data.l4People}
              moneyGivenList={moneyGivenList}
              expensesList={data.recentExpenses}
              onOpenCreateL4={() => setIsCreateL4Open(true)}
              onOpenGiveMoney={() => setIsGiveMoneyOpen(true)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={data.recentExpenses}
              l4ToL4Transactions={data.l4ToL4Transactions}
              onOpenExpenseDetail={(exp) => setSelectedExpense(exp)}
              onOpenTrace={(item, type) => setTraceItem({ item, type })}
              onValidateL4ToL4={handleValidateL4ToL4}
            />
          )}

          {activeTab === 'reconciliation' && (
            <ReconciliationView bankReconciliations={data.bankReconciliations} />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              events={data.events}
              categories={data.categories}
              expenses={data.recentExpenses}
              sourceBalances={data.sourceBalances}
              onOpenExpenseDetail={(exp) => setSelectedExpense(exp)}
            />
          )}

          {activeTab === 'audit' && (
            <AuditView auditLogs={data.auditLogs} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingRequestsCount={data.pendingRequestsCount}
        unacknowledgedExpensesCount={data.unacknowledgedExpensesCount}
        ocrMismatchesCount={data.ocrMismatchesCount}
      />

      {/* Modals */}
      <GiveMoneyModal
        isOpen={isGiveMoneyOpen}
        onClose={() => setIsGiveMoneyOpen(false)}
        l4Users={data.l4People}
        sourceBalances={data.sourceBalances}
        events={data.events}
        categories={data.categories}
        onGiveMoney={handleGiveMoney}
      />

      <RequestReviewModal
        isOpen={!!reviewRequest}
        onClose={() => setReviewRequest(null)}
        request={reviewRequest}
        sourceBalances={data.sourceBalances}
        onApprove={handleApproveRequest}
        onGiveLater={handleGiveLater}
        onReject={handleRejectRequest}
      />

      <ExpenseDetailModal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        onAcknowledge={handleAcknowledgeExpense}
        onVerifyOcr={handleVerifyOcr}
      />

      <CreateL4Modal
        isOpen={isCreateL4Open}
        onClose={() => setIsCreateL4Open(false)}
        onCreateUser={handleCreateL4}
      />

      <TransactionTraceModal
        isOpen={!!traceItem}
        onClose={() => setTraceItem(null)}
        item={traceItem?.item}
        type={traceItem?.type || 'EXPENSE'}
      />

      <MultiSourceExpenseModal
        isOpen={isMultiSourceOpen}
        onClose={() => setIsMultiSourceOpen(false)}
        l4Users={data.l4People}
        sourceBalances={data.sourceBalances}
        categories={data.categories}
        events={data.events}
        onRecordMultiSource={handleRecordMultiSource}
      />
    </div>
    </ErrorBoundary>
  );
}
