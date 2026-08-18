import React, { useState } from 'react';
import { SourceBalance, MoneyGiven, MoneyReceived, User } from '../../types.ts';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers, 
  Send, 
  Search, 
  Building, 
  Clock, 
  CheckCircle2, 
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface MoneyViewProps {
  sourceBalances: SourceBalance[];
  moneyReceivedList: MoneyReceived[];
  moneyGivenList: MoneyGiven[];
  onOpenGiveMoney: () => void;
  onOpenTrace: (item: any, type: 'MONEY_GIVEN' | 'MONEY_RECEIVED') => void;
}

export const MoneyView: React.FC<MoneyViewProps> = ({
  sourceBalances,
  moneyReceivedList,
  moneyGivenList,
  onOpenGiveMoney,
  onOpenTrace,
}) => {
  const [subTab, setSubTab] = useState<'SOURCES' | 'RECEIVED' | 'GIVEN'>('SOURCES');

  const totalReceived = sourceBalances.reduce((sum, s) => sum + s.receivedAmount, 0);
  const totalAllocated = sourceBalances.reduce((sum, s) => sum + s.allocatedAmount, 0);
  const totalAvailable = sourceBalances.reduce((sum, s) => sum + s.availableAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Authoritative Money Flows</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Source Balances & Money Movements
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Rules 6, 7 & 30: Preserves distinct Level 2 fund sources without permanent merging. Every rupee given to Level 4 is traceable to its original allocation.
          </p>
        </div>

        <button
          onClick={onOpenGiveMoney}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center space-x-2 self-start md:self-auto transition-all active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>Give Money to Level 4</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Received (From L2)</div>
          <div className="text-2xl font-black font-mono text-stone-900 mt-1">₹{totalReceived.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-stone-400 mt-1">{sourceBalances.length} distinct Level 2 sources</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Disbursed (To L4)</div>
          <div className="text-2xl font-black font-mono text-stone-700 mt-1">₹{totalAllocated.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-stone-400 mt-1">{moneyGivenList.length} completed disbursements</div>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Available Balance</div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">₹{totalAvailable.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Authoritatively synced with sources</div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex border-b border-stone-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => setSubTab('SOURCES')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-2 transition-colors ${
            subTab === 'SOURCES'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Level 2 Source Balances ({sourceBalances.length})</span>
        </button>

        <button
          onClick={() => setSubTab('RECEIVED')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-2 transition-colors ${
            subTab === 'RECEIVED'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          <span>Money Received from Level 2 ({moneyReceivedList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('GIVEN')}
          className={`pb-3 px-1 border-b-2 flex items-center space-x-2 transition-colors ${
            subTab === 'GIVEN'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-600" />
          <span>Money Given to Level 4 ({moneyGivenList.length})</span>
        </button>
      </div>

      {/* Tab 1: Source Balances */}
      {subTab === 'SOURCES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceBalances.map((src) => (
              <div key={src.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-stone-100 px-2 py-0.5 rounded">
                      Level 2 Origin: {src.sourceL2Id}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 mt-1">{src.fundName}</h3>
                    <p className="text-xs text-stone-600">{src.sourceL2Name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Available</span>
                    <span className="text-xl font-black font-mono text-emerald-700">
                      ₹{src.availableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1">
                  <span className="font-semibold block text-stone-500 text-[10px] uppercase">Designated Purpose:</span>
                  <p className="leading-relaxed">{src.purpose}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-stone-100 pt-3">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold block">Total Received</span>
                    <span className="font-mono font-bold text-stone-800">₹{src.receivedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-semibold block">Disbursed to L4</span>
                    <span className="font-mono font-bold text-stone-800">₹{src.allocatedAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <span>Last Received: {new Date(src.lastReceivedDate).toLocaleDateString('en-IN')}</span>
                  <span className="text-emerald-700 font-semibold">Active Balance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Money Received from Level 2 */}
      {subTab === 'RECEIVED' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Received Date</th>
                <th className="p-3.5">Level 2 Giver</th>
                <th className="p-3.5">Fund Source</th>
                <th className="p-3.5">Purpose</th>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {moneyReceivedList.map((rec) => (
                <tr key={rec.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-3.5 font-mono text-stone-700">
                    {new Date(rec.receivedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{rec.fromL2Name}</div>
                    <div className="text-[10px] text-stone-500 font-mono">{rec.fromL2Id}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800">{rec.fundSource}</td>
                  <td className="p-3.5 text-stone-600 max-w-xs">{rec.purpose}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{rec.transactionRef}</td>
                  <td className="p-3.5 text-right font-mono font-black text-emerald-700 text-sm">
                    +₹{rec.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onOpenTrace(rec, 'MONEY_RECEIVED')}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200"
                      title="Full Trace"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Money Given to Level 4 */}
      {subTab === 'GIVEN' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Given Date</th>
                <th className="p-3.5">Level 4 Recipient</th>
                <th className="p-3.5">Level 2 Source Origin</th>
                <th className="p-3.5">Category / Event</th>
                <th className="p-3.5">Purpose / Reference</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {moneyGivenList.map((giv) => (
                <tr key={giv.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-3.5 font-mono text-stone-700">
                    {new Date(giv.givenAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{giv.receiverL4Name}</div>
                    <div className="text-[10px] text-stone-500">Recipient L4</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">{giv.sourceL2Name}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800">{giv.categoryName}</div>
                    <div className="text-[10px] text-stone-500">{giv.eventName || 'No Event'}</div>
                  </td>
                  <td className="p-3.5 text-stone-600 max-w-xs">{giv.purpose}</td>
                  <td className="p-3.5 text-right font-mono font-black text-stone-900 text-sm">
                    ₹{giv.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onOpenTrace(giv, 'MONEY_GIVEN')}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200"
                      title="Full Trace"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
