import React from 'react';
import { User, SourceBalance } from '../types.ts';
import { 
  Church, 
  Wallet, 
  Send, 
  ShieldCheck, 
  BellRing, 
  Layers,
  Network,
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
  availableL3Users,
  totalAvailable,
  sourceBalances,
  pendingActionsCount,
  onOpenGiveMoney,
  onSelectTab,
  onSwitchUser,
  onLogout,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Church Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-700 to-emerald-700 flex items-center justify-center shadow-inner flex-shrink-0">
              <Church className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">CHURCH FINANCIAL SYSTEM</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LEVEL 3 OVERSEER MODULE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {user.assignedArea} &bull; <strong className="text-slate-200">{user.name}</strong> ({user.designation})
              </p>
            </div>
          </div>

          {/* Source Balances Pill, Active Overseer Selector, Primary CTA & Logout */}
          <div className="flex items-center flex-wrap gap-2.5 justify-between md:justify-end">

            {/* Active Level 3 Switcher for Multi-Person Testing */}
            {availableL3Users && availableL3Users.length > 1 && onSwitchUser && (
              <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Active L3:</span>
                <select
                  id="header-l3-switcher"
                  value={user.id}
                  onChange={(e) => onSwitchUser(e.target.value)}
                  aria-label="Switch Active Level 3 Persona"
                  className="text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {availableL3Users.map((l3) => (
                    <option key={l3.id} value={l3.id}>
                      {l3.name} ({l3.assignedArea.split('-')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Total Balance Pill */}
            <div 
              id="header-balance-pill"
              onClick={() => onSelectTab('money')}
              className="cursor-pointer bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3.5 py-1.5 flex items-center space-x-3 transition-colors"
              title="Click to view full Source Breakdown"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total Available</div>
                <div className="text-sm font-bold text-emerald-400 font-mono tracking-tight">
                  ₹{totalAvailable.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="hidden lg:flex flex-col border-l border-slate-700 pl-3 text-[11px] text-slate-300">
                <span className="text-slate-400 text-[10px]">{sourceBalances.length} L2 Sources</span>
                <span className="text-emerald-300 font-mono">Isolated</span>
              </div>
            </div>

            {/* Pending actions notification */}
            {pendingActionsCount > 0 && (
              <button
                id="header-pending-actions-btn"
                onClick={() => onSelectTab('requests')}
                className="relative bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                title={`${pendingActionsCount} items require your attention`}
              >
                <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{pendingActionsCount} Action{pendingActionsCount > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Primary Action: Give Money */}
            <button
              id="header-give-money-btn"
              onClick={onOpenGiveMoney}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Give Money</span>
            </button>

            {/* Level 3 Logout Button */}
            {onLogout && (
              <button
                id="header-logout-btn"
                onClick={onLogout}
                title="Logout from Level 3 Field Overseer Portal"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 text-xs font-semibold border border-slate-700 hover:border-rose-800/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

          </div>
        </div>

        {/* Scope banner */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              Authorized Scope: Direct oversight of <strong className="text-slate-200">Parish Team</strong> & isolated <strong className="text-slate-200">Level 2 Director Funds</strong>.
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[10px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Multi-Person Source-Aware Hierarchy Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};
