import React, { useState } from 'react';
import { User, MoneyGiven, Expense } from '../../types.ts';
import { 
  Users, 
  Send, 
  UserPlus, 
  Eye, 
  Layers, 
  CheckCircle2,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface Level4TeamViewProps {
  l4People: User[];
  moneyGivenList: MoneyGiven[];
  expensesList: Expense[];
  onOpenCreateL4: () => void;
  onOpenGiveMoney: () => void;
}

export const Level4TeamView: React.FC<Level4TeamViewProps> = ({
  l4People = [],
  moneyGivenList = [],
  expensesList = [],
  onOpenCreateL4,
  onOpenGiveMoney,
}) => {
  const [selectedPersonDrawer, setSelectedPersonDrawer] = useState<User | null>(null);

  return (
    <div id="level3-l4team-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Level 4 Team
          </h1>
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            People & allocations
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenCreateL4}
            className="px-3 py-1.5 bg-[#24152F] hover:bg-[#30203D] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Worker</span>
          </button>
          <button
            onClick={onOpenGiveMoney}
            className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Give Money</span>
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(l4People || []).map((person) => {
          const personGiven = moneyGivenList.filter(m => m.recipientL4Id === person.id);
          const totalReceivedByPerson = personGiven.reduce((sum, m) => sum + m.amount, 0);

          const personExpenses = expensesList.filter(e => e.personL4Id === person.id || e.submittedByL4Id === person.id);
          const totalSpentByPerson = personExpenses.reduce((sum, e) => sum + e.amount, 0);

          const availableWithPerson = Math.max(0, totalReceivedByPerson - totalSpentByPerson);

          return (
            <div key={person.id} className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-xs text-[#171717]">{person.name}</h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5F6368] font-medium">{person.designation || 'Parish Field Worker'} &bull; {person.assignedArea || 'Grace Parish'}</p>
                </div>

                <div className="text-right">
                  <div className="text-[9px] uppercase font-bold text-[#5F6368]">Available</div>
                  <div className="text-base font-extrabold text-[#009E68] font-mono tabular-nums">
                    ₹{availableWithPerson.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F7F5F0] p-2.5 rounded-lg border border-[#E7E2D8]">
                <div>
                  <span className="text-[#5F6368] text-[10px]">Total Received:</span>
                  <strong className="block text-[#2563EB] font-mono tabular-nums">₹{totalReceivedByPerson.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-[#5F6368] text-[10px]">Total Spent:</span>
                  <strong className="block text-[#171717] font-mono tabular-nums">₹{totalSpentByPerson.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Plain-Language Source Lineage Header */}
              <div className="pt-2 border-t border-[#EBE6DD] flex items-center justify-between text-[11px]">
                <div className="text-[#5F6368]">
                  <strong className="text-[#171717]">Source:</strong> Region A Treasury / Central Mission Fund
                </div>
                <button
                  onClick={() => setSelectedPersonDrawer(person)}
                  className="px-2.5 py-1 bg-white hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded text-[10px] font-semibold text-[#171717] cursor-pointer inline-flex items-center space-x-1 flex-shrink-0"
                >
                  <Eye className="w-3 h-3 text-[#5F6368]" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TEAM MEMBER DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedPersonDrawer}
        onClose={() => setSelectedPersonDrawer(null)}
        title={selectedPersonDrawer?.name || 'Worker Details'}
        subtitle={`Designation: ${selectedPersonDrawer?.designation || 'Level 4 Worker'}`}
      >
        {selectedPersonDrawer && (
          <div className="space-y-4 text-xs text-[#171717]">
            <div className="p-3.5 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-1.5">
              <div><span className="font-semibold">Assigned Area:</span> {selectedPersonDrawer.assignedArea}</div>
              <div><span className="font-semibold">Email:</span> {selectedPersonDrawer.email}</div>
              <div><span className="font-semibold">Phone:</span> {selectedPersonDrawer.phone || '+91 98401 22334'}</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider">Money Source</h4>
            </div>

            <button
              onClick={() => {
                setSelectedPersonDrawer(null);
                onOpenGiveMoney();
              }}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Give Money to {selectedPersonDrawer.name}
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
