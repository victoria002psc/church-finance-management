import React from 'react';
import { 
  Users, 
  Wallet, 
  Send, 
  Receipt, 
  Clock, 
  Layers,
  LogOut 
} from 'lucide-react';

export type Level4Tab = 
  | 'workspace' 
  | 'requests' 
  | 'expenses' 
  | 'timeline'
  | 'sources';

interface Level4SidebarProps {
  activeTab: Level4Tab;
  onSelectTab: (tab: Level4Tab) => void;
  pendingRequestsCount?: number;
  onLogout?: () => void;
}

export const Level4Sidebar: React.FC<Level4SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount = 0,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'workspace',
      label: 'Wallet & Workspace',
      icon: Wallet,
      badge: null,
      sublabel: 'Available Funds & Overview',
    },
    {
      id: 'requests',
      label: 'Request Money',
      icon: Send,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-[#F59E0B] text-[#24152F]',
      sublabel: 'Submit Funding Request to L3',
    },
    {
      id: 'expenses',
      label: 'Record Expense',
      icon: Receipt,
      badge: null,
      sublabel: 'Upload Voucher & Receipts',
    },
    {
      id: 'timeline',
      label: 'Money Status Timeline',
      icon: Clock,
      badge: null,
      sublabel: 'Request & Disbursement Audit',
    },
    {
      id: 'sources',
      label: 'My Sources',
      icon: Layers,
      badge: null,
      sublabel: 'Fund Provider Allocations',
    },
  ];

  return (
    <aside className="w-64 bg-[#24152F] border-r border-[#30203D] min-h-[calc(100vh-61px)] py-6 flex flex-col justify-between shadow-lg flex-shrink-0">
      <div className="space-y-6">
        {/* Module Title */}
        <div className="px-5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#F4E7B5]/60">
            Navigation Menu
          </div>
          <div className="text-xs font-semibold text-[#F4E7B5] mt-0.5">
            Level 4 Parish Operations
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`l4-sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id as Level4Tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left group cursor-pointer ${
                  isActive
                    ? 'bg-[#30203D] text-white border-l-4 border-[#D4AF37] shadow-xs'
                    : 'text-[#F4E7B5]/80 hover:bg-[#30203D]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#D4AF37]' : 'text-[#F4E7B5]/60 group-hover:text-[#D4AF37]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-semibold leading-tight">{item.label}</div>
                    {item.sublabel && (
                      <div className="text-[10px] text-[#F4E7B5]/50 truncate mt-0.5">
                        {item.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      item.badgeColor || 'bg-[#D4AF37] text-[#24152F]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom of sidebar */}
      {onLogout && (
        <div className="px-4 pt-4 border-t border-[#30203D]">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/40 text-[#E11D48] rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
