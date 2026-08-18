import React, { useState, useEffect } from 'react';
import { L2DashboardData, DocumentType } from '../../types.ts';
import {
  fetchL2DashboardState,
  switchActiveL2User,
  disburseToL3,
  directL4Payment,
  acknowledgeL1Payment,
  createL3User,
  recordL2Expense,
} from '../../services/api.ts';
import { Level2Header } from './Level2Header.tsx';
import { Level2Sidebar, Level2Tab } from './Level2Sidebar.tsx';
import { Level2OverviewView } from './views/Level2OverviewView.tsx';
import { Level2DisburseView } from './views/Level2DisburseView.tsx';
import { Level2DirectL4View } from './views/Level2DirectL4View.tsx';
import { Level2L1PaymentsView } from './views/Level2L1PaymentsView.tsx';
import { Level2L3TeamView } from './views/Level2L3TeamView.tsx';
import { Level2ExpensesView } from './views/Level2ExpensesView.tsx';
import { Level2ReconciliationView } from './views/Level2ReconciliationView.tsx';
import { Level2AuditView } from './views/Level2AuditView.tsx';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface Level2AppProps {
  initialData?: L2DashboardData | null;
  onLogout: () => void;
}

export const Level2App: React.FC<Level2AppProps> = ({ initialData, onLogout }) => {
  const [data, setData] = useState<L2DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Level2Tab>('overview');

  // Load state on mount if not provided
  const loadState = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchL2DashboardState();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load Level 2 dashboard state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      loadState();
    }
  }, [initialData]);

  const handleSwitchUser = async (userId: string) => {
    try {
      setLoading(true);
      const res = await switchActiveL2User(userId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to switch Level 2 user');
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (payload: {
    toL3Id: string;
    amount: number;
    purpose?: string;
    transactionRef?: string;
  }) => {
    const res = await disburseToL3(payload);
    setData(res.state);
  };

  const handleDirectL4 = async (payload: {
    toL4Id: string;
    amount: number;
    categoryId: string;
    eventId?: string;
    purpose?: string;
    documentType?: DocumentType;
    documentNumber?: string;
  }) => {
    const res = await directL4Payment(payload);
    setData(res.state);
  };

  const handleAcknowledgeL1 = async (paymentId: string) => {
    const res = await acknowledgeL1Payment(paymentId);
    setData(res.state);
  };

  const handleCreateL3 = async (payload: {
    name: string;
    email?: string;
    phone: string;
    designation: string;
    assignedArea?: string;
  }) => {
    const res = await createL3User(payload);
    setData(res.state);
  };

  const handleRecordExpense = async (payload: {
    amount: number;
    categoryId: string;
    eventId?: string;
    description?: string;
    documentType?: DocumentType;
    documentNumber?: string;
  }) => {
    const res = await recordL2Expense(payload);
    setData(res.state);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-sm font-semibold text-slate-200">Loading Level 2 Central Directorate...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to authoritative Diocesan financial database...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-xl">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-100">Unable to Connect</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={loadState}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2"
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
        <p className="text-sm font-semibold text-slate-200">Loading Level 2 Central Directorate...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to authoritative Diocesan financial database...</p>
      </div>
    );
  }

  return (
    <div id="level2-app-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Level 2 Header */}
      <Level2Header
        currentL2User={data.currentL2User}
        centralAvailableBalance={data.centralAvailableBalance}
        centralAllocatedBudget={data.centralAllocatedBudget}
        pendingL1Count={data.pendingL1AcknowledgementsCount}
        pendingRequestsCount={data.pendingRequestsCount}
        ocrMismatchesCount={data.ocrMismatchesCount}
        onLogout={onLogout}
      />

      {/* Body: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
        <Level2Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingL1Count={data.pendingL1AcknowledgementsCount}
          ocrMismatchesCount={data.ocrMismatchesCount}
          bankDifferencesCount={data.bankDifferencesCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/60">
          {activeTab === 'overview' && (
            <Level2OverviewView
              data={data}
              onNavigateTab={setActiveTab}
              onOpenDisburseModal={() => setActiveTab('disburse')}
              onOpenDirectL4Modal={() => setActiveTab('direct-l4')}
              onOpenCreateL3Modal={() => setActiveTab('l3-team')}
            />
          )}

          {activeTab === 'disburse' && (
            <Level2DisburseView
              data={data}
              onDisburse={handleDisburse}
            />
          )}

          {activeTab === 'direct-l4' && (
            <Level2DirectL4View
              data={data}
              onDirectL4Payment={handleDirectL4}
            />
          )}

          {activeTab === 'l1-payments' && (
            <Level2L1PaymentsView
              data={data}
              onAcknowledgeL1={handleAcknowledgeL1}
            />
          )}

          {activeTab === 'l3-team' && (
            <Level2L3TeamView
              data={data}
              onCreateL3Person={handleCreateL3}
              onOpenDisburseModal={() => setActiveTab('disburse')}
            />
          )}

          {activeTab === 'central-expenses' && (
            <Level2ExpensesView
              data={data}
              onRecordExpense={handleRecordExpense}
            />
          )}

          {activeTab === 'reconciliation' && (
            <Level2ReconciliationView
              data={data}
            />
          )}

          {activeTab === 'audit' && (
            <Level2AuditView
              data={data}
            />
          )}
        </main>
      </div>

    </div>
  );
};
