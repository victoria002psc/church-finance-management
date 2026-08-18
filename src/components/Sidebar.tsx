import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Inbox, 
  Users, 
  Receipt, 
  FileSpreadsheet, 
  History, 
  Scale,
  Sparkles,
  Network,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingRequestsCount: number;
  unacknowledgedExpensesCount: number;
  ocrMismatchesCount: number;
  bankDifferencesCount: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount,
  unacknowledgedExpensesCount,
  ocrMismatchesCount,
  bankDifferencesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'money',
      label: 'Money & Sources',
      icon: ArrowLeftRight,
      badge: null,
      sublabel: 'Received, Given, Source Balances',
    },
    {
      id: 'requests',
      label: 'Money Requests',
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-amber-500 text-white',
      sublabel: 'Approvals & Disbursements',
    },
    {
      id: 'level4',
      label: 'Level 4 Team',
      icon: Users,
      badge: null,
      sublabel: 'Managed People & Allocations',
    },
    {
      id: 'expenses',
      label: 'Expenses & OCR',
      icon: Receipt,
      badge: (unacknowledgedExpensesCount + ocrMismatchesCount) > 0 
        ? (unacknowledgedExpensesCount + ocrMismatchesCount) 
        : null,
      badgeColor: ocrMismatchesCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white',
      sublabel: 'Bills, Vouchers, OCR Discrepancies',
    },
    {
      id: 'reconciliation',
      label: 'Bank & Reconcile',
      icon: Scale,
      badge: bankDifferencesCount > 0 ? 'Diff' : null,
      badgeColor: 'bg-amber-500 text-white',
      sublabel: 'System vs Bank Statement',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      badge: null,
      sublabel: 'Event, Category, Financial Year',
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: History,
      badge: null,
      sublabel: 'Full Transaction Integrity',
    },
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900/95 text-slate-300 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-65px)]">
      {/* Navigation list */}
      <div className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Church Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-3 text-left truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="truncate">
                  <div className="truncate">{item.label}</div>
                  {item.sublabel && (
                    <div className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {item.sublabel}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    item.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Governance & Rules Footer info */}
      <div className="p-3 m-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Financial Governance</span>
        </div>
        <ul className="space-y-1 text-[10.5px] text-slate-400 list-disc list-inside">
          <li>Multiple persons at each tier</li>
          <li>Source allocations preserved</li>
          <li>Approval ≠ Money Given</li>
          <li>Audit logs strictly immutable</li>
        </ul>
      </div>

      {/* Sign Out Button */}
      {onLogout && (
        <div className="p-3 border-t border-slate-800 mt-auto">
          <button
            id="sidebar-signout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
