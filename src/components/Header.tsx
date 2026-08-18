import React from 'react';
import { User, SourceBalance } from '../types.ts';
import { 
  Church, 
  Wallet, 
  Send, 
  BellRing, 
  LogOut
} from 'lucide-react';

interface HeaderProps {
  user: User;
  availableL3Users?: User[];
  totalAvailable: number;
  sourceBalances: SourceBalance[];
  pendingActionsCount: number;
  onOpenGiveMoney: () => void;
  onSelectTab: (tab: string) => void;
  onSwitchUser?: (userId: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  totalAvailable,
  sourceBalances,
  pendingActionsCount,
  onOpenGiveMoney,
  onSelectTab,
  onLogout,
}) => {
  return (
    <header id="app-header" className="bg-[#24152F] text-white border-b border-[#30203D] sticky top-0 z-30 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Church Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#30203D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-inner flex-shrink-0">
              <Church className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">CHURCH FINANCIAL MANAGEMENT</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#24152F]">
                  LEVEL 3 OVERSEER
                </span>
              </div>
              <p className="text-xs text-[#F4E7B5] font-medium">
                {user?.assignedArea || 'Parish Operations'} &bull; <strong className="text-white">{user?.name || 'Overseer'}</strong> ({user?.designation || 'Level 3 Overseer'})
              </p>
            </div>
          </div>

          {/* Source Balances Pill, Primary CTA & Logout */}
          <div className="flex items-center flex-wrap gap-2.5 justify-between md:justify-end">

            {/* Total Balance Pill */}
            <div 
              id="header-balance-pill"
              onClick={() => onSelectTab('money')}
              className="cursor-pointer bg-[#30203D] hover:bg-[#30203D]/80 border border-[#D4AF37]/30 rounded-xl px-3.5 py-1.5 flex items-center space-x-3 transition-colors shadow-xs"
              title="Click to view full Source Breakdown"
            >
              <div className="w-7 h-7 rounded-md bg-[#009E68]/20 text-[#009E68] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#009E68]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#F4E7B5]/70 tracking-wider">Total Available</div>
                <div className="text-sm font-bold text-[#009E68] font-mono tracking-tight">
                  ₹{(totalAvailable ?? 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="hidden lg:flex flex-col border-l border-[#24152F] pl-3 text-[11px] text-[#F4E7B5]">
                <span className="text-[#F4E7B5]/60 text-[10px]">{(sourceBalances || []).length} L2 Sources</span>
                <span className="text-[#D4AF37] font-mono">Isolated</span>
              </div>
            </div>

            {/* Pending actions notification */}
            {(pendingActionsCount || 0) > 0 && (
              <button
                id="header-pending-actions-btn"
                onClick={() => onSelectTab('requests')}
                className="relative bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] border border-[#F59E0B]/40 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                title={`${pendingActionsCount} items require your attention`}
              >
                <BellRing className="w-4 h-4 text-[#F59E0B] animate-pulse" />
                <span>{pendingActionsCount} Action{pendingActionsCount > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Primary Action: Give Money */}
            <button
              id="header-give-money-btn"
              onClick={onOpenGiveMoney}
              className="bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Give Money</span>
            </button>

            {/* Level 3 Logout Button */}
            {onLogout && (
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="px-3 py-2 bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/40 text-[#E11D48] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                title="Sign out of Level 3 Overseer Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
