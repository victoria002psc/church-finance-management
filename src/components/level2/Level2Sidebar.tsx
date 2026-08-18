import React from 'react';
import {
  LayoutDashboard,
  Send,
  CreditCard,
  Building,
  Users,
  Receipt,
  Scale,
  History,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export type Level2Tab =
  | 'overview'
  | 'disburse'
  | 'direct-l4'
  | 'l1-payments'
  | 'l3-team'
  | 'central-expenses'
  | 'reconciliation'
  | 'audit';

interface Level2SidebarProps {
  activeTab: Level2Tab;
  onSelectTab: (tab: Level2Tab) => void;
  pendingL1Count: number;
  ocrMismatchesCount: number;
  bankDifferencesCount: number;
}

export const Level2Sidebar: React.FC<Level2SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingL1Count,
  ocrMismatchesCount,
  bankDifferencesCount,
}) => {
  const navItems = [
    {
      id: 'overview' as Level2Tab,
      label: 'Treasury & Command',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'disburse' as Level2Tab,
      label: 'Disburse to Level 3',
      icon: Send,
      badge: null,
    },
    {
      id: 'direct-l4' as Level2Tab,
      label: 'Direct L4 Payments',
      icon: CreditCard,
      badge: null,
    },
    {
      id: 'l1-payments' as Level2Tab,
      label: 'Level 1 Grants (Acks)',
      icon: Building,
      badge: pendingL1Count > 0 ? pendingL1Count : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'l3-team' as Level2Tab,
      label: 'Level 3 Field Team',
      icon: Users,
      badge: null,
    },
    {
      id: 'central-expenses' as Level2Tab,
      label: 'Central Expenses & OCR',
      icon: Receipt,
      badge: ocrMismatchesCount > 0 ? ocrMismatchesCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      id: 'reconciliation' as Level2Tab,
      label: 'Bank Reconciliation',
      icon: Scale,
      badge: bankDifferencesCount > 0 ? bankDifferencesCount : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'audit' as Level2Tab,
      label: 'Diocesan Audit Trail',
      icon: History,
      badge: null,
    },
  ];

  return (
    <aside id="level2-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Sidebar Header Section */}
      <div className="p-4 border-b border-slate-800">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Level 2 Operations
        </div>
        <div className="text-xs text-slate-300 mt-0.5">
          Central Directorate Console
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`l2-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded-full leading-none ${
                    item.badgeColor || 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 block mb-0.5">System Architecture</span>
          Isolated source balances & hierarchical accountability active across all Diocesan entities.
        </div>
      </div>
    </aside>
  );
};
