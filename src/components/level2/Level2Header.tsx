import React from 'react';
import { User } from '../../types.ts';
import { 
  Building2, 
  Wallet, 
  Send, 
  LogOut 
} from 'lucide-react';

interface Level2HeaderProps {
  currentL2User?: User;
  centralAvailableBalance?: number;
  centralAllocatedBudget?: number;
  pendingL1Count?: number;
  pendingRequestsCount?: number;
  ocrMismatchesCount?: number;
  onLogout?: () => void;
}

export const Level2Header: React.FC<Level2HeaderProps> = ({
  currentL2User,
  centralAvailableBalance = 0,
  onLogout,
}) => {
  return (
    <header id="level2-app-header" className="bg-[#24152F] text-white border-b border-[#30203D] sticky top-0 z-30 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Director Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#30203D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shadow-inner flex-shrink-0">
              <Building2 className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">CHURCH FINANCIAL MANAGEMENT</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37] text-[#24152F]">
                  LEVEL 2 DIRECTOR
                </span>
              </div>
              <p className="text-xs text-[#F4E7B5] font-medium">
                {currentL2User?.assignedArea || 'Central Operations'} &bull; <strong className="text-white">{currentL2User?.name || 'Finance Director'}</strong> ({currentL2User?.designation || 'Level 2 Director'})
              </p>
            </div>
          </div>

          {/* Controlled Funds Pill & Logout */}
          <div className="flex items-center flex-wrap gap-2.5 justify-between md:justify-end">

            {/* Total Controlled Funds Pill */}
            <div 
              id="l2-header-balance-pill"
              className="bg-[#30203D] border border-[#D4AF37]/30 rounded-xl px-3.5 py-1.5 flex items-center space-x-3 transition-colors shadow-xs"
              title="Level 2 Central Available Funds"
            >
              <div className="w-7 h-7 rounded-md bg-[#009E68]/20 text-[#009E68] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#009E68]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#F4E7B5]/70 tracking-wider">Total Controlled</div>
                <div className="text-sm font-bold text-[#009E68] font-mono tracking-tight">
                  ₹{(centralAvailableBalance ?? 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Level 2 Logout Button */}
            {onLogout && (
              <button
                id="l2-header-logout-btn"
                onClick={onLogout}
                className="px-3 py-2 bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/40 text-[#E11D48] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                title="Sign out of Level 2 Director Portal"
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
