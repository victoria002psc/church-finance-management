import React, { useState } from 'react';
import { SourceBalance, MoneyReceived, MoneyGiven } from '../../types.ts';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers, 
  Eye, 
  Info,
  Calendar,
  Wallet,
  ShieldCheck,
  Building
} from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface MoneyViewProps {
  sourceBalances: SourceBalance[];
  moneyReceivedList: MoneyReceived[];
  moneyGivenList: MoneyGiven[];
  onOpenGiveMoney: () => void;
  onOpenTrace: (item: any, type: 'MONEY_GIVEN' | 'MONEY_RECEIVED') => void;
}

export const MoneyView: React.FC<MoneyViewProps> = ({
  sourceBalances = [],
  moneyReceivedList = [],
  moneyGivenList = [],
  onOpenGiveMoney,
  onOpenTrace,
}) => {
  const [selectedSourceDrawer, setSelectedSourceDrawer] = useState<SourceBalance | null>(null);

  const totalAvailable = (sourceBalances || []).reduce((sum, s) => sum + (s?.availableAmount ?? (s as any)?.available ?? 0), 0);
  const totalReceived = (sourceBalances || []).reduce((sum, s) => sum + (s?.receivedAmount ?? (s as any)?.totalReceived ?? 0), 0);
  const totalGiven = (sourceBalances || []).reduce((sum, s) => sum + (s?.allocatedAmount ?? (s as any)?.totalGiven ?? 0), 0);

  return (
    <div id="level3-money-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Money & Sources
          </h1>
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            Received, given, and available balances
          </p>
        </div>
        <button
          onClick={onOpenGiveMoney}
          className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Give Money</span>
        </button>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Available Balance</div>
          <div className="text-2xl font-extrabold text-[#009E68] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{totalAvailable.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">Across {(sourceBalances || []).length} sources</div>
        </div>

        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Received</div>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">From Level 2</div>
        </div>

        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Given</div>
          <div className="text-2xl font-extrabold text-[#F59E0B] mt-1.5 font-mono tracking-tight tabular-nums">
            ₹{totalGiven.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#5F6368] font-medium mt-1">To Level 4 team</div>
        </div>
      </div>

      {/* SECTION: WHERE THE MONEY CAME FROM (SOURCE CARDS) */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-[#D4AF37]" />
          <span>Where the Money Came From</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(sourceBalances || []).map((src) => {
            const avail = src.availableAmount ?? (src as any).available ?? 0;
            const rec = src.receivedAmount ?? (src as any).totalReceived ?? 0;
            const given = src.allocatedAmount ?? (src as any).totalGiven ?? 0;

            return (
              <div key={src.id} className="p-4 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-3 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-[#171717]">
                      {src.fundName || src.sourceL2Name || (src as any).sourceName || 'Level 2 Source'}
                    </h3>
                    <p className="text-[11px] text-[#5F6368] font-medium">{src.purpose || 'General Ministry Purpose'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-[#5F6368]">Available</span>
                    <div className="text-base font-extrabold text-[#009E68] font-mono tabular-nums">
                      ₹{avail.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Received / Given breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-[#E7E2D8]">
                  <div>
                    <span className="text-[#5F6368] text-[10px]">Received:</span>
                    <strong className="block text-[#2563EB] font-mono tabular-nums">₹{rec.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[#5F6368] text-[10px]">Given:</span>
                    <strong className="block text-[#F59E0B] font-mono tabular-nums">₹{given.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => setSelectedSourceDrawer(src)}
                    className="px-2.5 py-1 bg-white hover:bg-[#F7F5F0] text-[#171717] border border-[#E7E2D8] rounded-md text-[10px] font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-[#5F6368]" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: RECENT TRANSACTIONS */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <ArrowLeftRight className="w-4 h-4 text-[#2563EB]" />
          <span>Transactions</span>
        </h2>

        <div className="divide-y divide-[#EBE6DD]">
          {(moneyReceivedList || []).map((m) => (
            <div key={`rec-${m.id}`} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#171717] truncate">
                    Received from {m.fromL2Name || 'Level 2 Director'}
                  </div>
                  <div className="text-[10px] text-[#5F6368] truncate">{m.purpose || m.remarks || 'Direct Disbursal'} &bull; {m.date || m.timestamp}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 font-mono tabular-nums">
                <div className="font-extrabold text-[#009E68]">+₹{(m.amount || 0).toLocaleString('en-IN')}</div>
                <button
                  onClick={() => onOpenTrace(m, 'MONEY_RECEIVED')}
                  className="text-[9px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
                >
                  Trace →
                </button>
              </div>
            </div>
          ))}

          {(moneyGivenList || []).map((m) => (
            <div key={`giv-${m.id}`} className="py-2.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#171717] truncate">
                    Disbursed to {m.recipientL4Name || 'Field Worker'}
                  </div>
                  <div className="text-[10px] text-[#5F6368] truncate">{m.purpose || m.remarks || 'Field Allocation'} &bull; {m.date || m.timestamp}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 font-mono tabular-nums">
                <div className="font-extrabold text-[#171717]">-₹{(m.amount || 0).toLocaleString('en-IN')}</div>
                <button
                  onClick={() => onOpenTrace(m, 'MONEY_GIVEN')}
                  className="text-[9px] text-[#2563EB] hover:underline font-semibold cursor-pointer"
                >
                  Trace →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOURCE DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedSourceDrawer}
        onClose={() => setSelectedSourceDrawer(null)}
        title={selectedSourceDrawer?.fundName || selectedSourceDrawer?.sourceL2Name || (selectedSourceDrawer as any)?.sourceName || 'Source Details'}
        subtitle={`Purpose: ${selectedSourceDrawer?.purpose || 'Ministry Operations'}`}
      >
        {selectedSourceDrawer && (
          <div className="space-y-5 text-xs text-[#171717]">
            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl space-y-2">
              <div className="text-[10px] font-bold text-[#24152F] uppercase">Balance Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono tabular-nums">
                <div>
                  <div className="text-[9px] text-[#5F6368] uppercase font-bold">Received</div>
                  <div className="text-xs font-bold text-[#2563EB] mt-0.5">
                    ₹{(selectedSourceDrawer.receivedAmount ?? (selectedSourceDrawer as any).totalReceived ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#5F6368] uppercase font-bold">Given</div>
                  <div className="text-xs font-bold text-[#F59E0B] mt-0.5">
                    ₹{(selectedSourceDrawer.allocatedAmount ?? (selectedSourceDrawer as any).totalGiven ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-[#5F6368] uppercase font-bold">Available</div>
                  <div className="text-xs font-bold text-[#009E68] mt-0.5">
                    ₹{(selectedSourceDrawer.availableAmount ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl">
              <div className="font-bold text-[#171717] text-xs">Source Info</div>
              <div><span className="font-semibold">Provider:</span> {selectedSourceDrawer.sourceL2Name || selectedSourceDrawer.fundName}</div>
              <div><span className="font-semibold">Purpose:</span> {selectedSourceDrawer.purpose || 'General Ministry'}</div>
              <div><span className="font-semibold">ID:</span> <code className="font-mono text-[11px] text-[#5F6368]">{selectedSourceDrawer.id}</code></div>
            </div>

            <button
              onClick={() => {
                setSelectedSourceDrawer(null);
                onOpenGiveMoney();
              }}
              className="w-full py-2.5 bg-[#009E68] hover:bg-[#009E68]/90 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Give Money from this Source
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
