import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Inbox, 
  Receipt, 
  MoreHorizontal 
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingRequestsCount: number;
  unacknowledgedExpensesCount: number;
  ocrMismatchesCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount,
  unacknowledgedExpensesCount,
  ocrMismatchesCount,
}) => {
  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, badge: null },
    { id: 'money', label: 'Money', icon: ArrowLeftRight, badge: null },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { id: 'expenses', label: 'Expenses', icon: Receipt, badge: (unacknowledgedExpensesCount + ocrMismatchesCount) > 0 ? (unacknowledgedExpensesCount + ocrMismatchesCount) : null },
    { id: 'reports', label: 'More', icon: MoreHorizontal, badge: null },
  ];

  return (
    <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'reports' && ['level4', 'reconciliation', 'audit'].includes(activeTab));
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-0 right-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
