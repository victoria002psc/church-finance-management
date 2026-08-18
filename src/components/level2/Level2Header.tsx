import React from 'react';
import { 
  Building2, 
  IndianRupee, 
  AlertTriangle,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { User } from '../../types.ts';

interface Level2HeaderProps {
  currentL2User: User;
  centralAvailableBalance: number;
  centralAllocatedBudget: number;
  pendingL1Count: number;
  pendingRequestsCount: number;
  ocrMismatchesCount: number;
  onLogout: () => void;
}

export const Level2Header: React.FC<Level2HeaderProps> = ({
  currentL2User,
  centralAvailableBalance,
  centralAllocatedBudget,
  pendingL1Count,
  pendingRequestsCount,
  ocrMismatchesCount,
  onLogout,
}) => {
  return (
    <header id="level2-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-inner font-bold text-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 text-base tracking-tight">
                  Diocesan Central Directorate
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  LEVEL 2 SYSTEM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Central Financial Management & Overseer Governance
              </p>
            </div>
          </div>

          {/* Center: Live Central Balance */}
          <div className="hidden md:flex items-center bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-lg space-x-4">
            <div>
              <span className="text-xs text-slate-400 block">Central Available</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 inline mr-0.5" />
                {centralAvailableBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-xs text-slate-400 block">Total Central Budget</span>
              <span className="text-xs font-medium text-slate-300">
                ₹{centralAllocatedBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Pending alerts indicator */}
            {(pendingL1Count > 0 || ocrMismatchesCount > 0) && (
              <div className="hidden lg:flex items-center space-x-2 bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-md text-amber-300 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {pendingL1Count > 0 && `${pendingL1Count} L1 Grant${pendingL1Count > 1 ? 's' : ''} to Acknowledge`}
                  {pendingL1Count > 0 && ocrMismatchesCount > 0 && ' • '}
                  {ocrMismatchesCount > 0 && `${ocrMismatchesCount} OCR Alert${ocrMismatchesCount > 1 ? 's' : ''}`}
                </span>
              </div>
            )}

            {/* Authenticated Level 2 Director Profile Badge (Non-selectable, strictly displays authenticated identity) */}
            <div 
              id="l2-authenticated-user-badge" 
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80"
              title={`Authenticated as ${currentL2User.name} (${currentL2User.designation})`}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white font-semibold text-xs border border-emerald-500/40">
                {currentL2User.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-100 flex items-center">
                  {currentL2User.name}
                  <ShieldCheck className="w-3 h-3 ml-1 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium truncate max-w-[150px]">
                  {currentL2User.designation}
                </div>
              </div>
            </div>

            {/* Prominent Level 2 Logout Button */}
            <button
              id="l2-logout-btn"
              onClick={onLogout}
              title="Logout from Level 2 Central Directorate"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 text-xs font-semibold border border-slate-700 hover:border-rose-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
