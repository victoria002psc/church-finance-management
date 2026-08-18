import React from 'react';
import { User, Expense, MoneyGiven } from '../../types.ts';
import { 
  Users, 
  UserPlus, 
  Wallet, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Receipt, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';

interface Level4TeamViewProps {
  l4People: (User & { currentAllocatedBalance: number; sourceBreakdown: { sourceName: string; amount: number }[] })[];
  moneyGivenList: MoneyGiven[];
  expensesList: Expense[];
  onOpenCreateL4: () => void;
  onOpenGiveMoney: () => void;
}

export const Level4TeamView: React.FC<Level4TeamViewProps> = ({
  l4People,
  moneyGivenList,
  expensesList,
  onOpenCreateL4,
  onOpenGiveMoney,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Parish Team & Field Leadership</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            Level 4 Parish Team & Source Allocations
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Level 3 Overseer has direct management responsibility for parish coordinators, health leads, and logistics stewards.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="register-l4-btn"
            onClick={onOpenCreateL4}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Parish Leader</span>
          </button>

          <button
            onClick={onOpenGiveMoney}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Disburse Money</span>
          </button>
        </div>
      </div>

      {/* Level 4 People Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {l4People.map((person) => {
          const personExpenses = expensesList.filter((e) => e.personL4Id === person.id);
          const personGiven = moneyGivenList.filter((g) => g.receiverL4Id === person.id);
          const totalSpent = personExpenses.reduce((sum, e) => sum + e.amount, 0);
          const totalGiven = personGiven.reduce((sum, g) => sum + g.amount, 0);

          return (
            <div
              key={person.id}
              className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                      {person.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-sm text-stone-900">{person.name}</h3>
                        <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          L4
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{person.designation}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Available Balance</span>
                    <span className="font-mono font-bold text-lg text-emerald-700">
                      ₹{person.currentAllocatedBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Contact and Area */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{person.assignedArea}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{person.phone}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total Received</span>
                    <span className="font-mono font-bold text-stone-800">₹{totalGiven.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total Spent / Bills</span>
                    <span className="font-mono font-bold text-stone-800">₹{totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Source Breakdown for this Level 4 */}
                <div className="mt-3 pt-2.5 border-t border-stone-100">
                  <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Source Origin Lineage
                  </span>
                  <div className="space-y-1">
                    {person.sourceBreakdown.map((sb, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 px-2 rounded border border-slate-200">
                        <span className="text-slate-700 truncate max-w-[200px]">{sb.sourceName}</span>
                        <span className="font-mono font-bold text-slate-900">₹{sb.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                <span>Active Parish Lead</span>
                <span>{personExpenses.length} Expenses Submitted</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
