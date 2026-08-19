import React from 'react';
import { EventItem, CategoryItem, Expense, SourceBalance } from '../../types.ts';
import { FileSpreadsheet, Download, Calendar, Layers, Filter, Check } from 'lucide-react';

interface ReportsViewProps {
  events: EventItem[];
  categories: CategoryItem[];
  expenses: Expense[];
  sourceBalances: SourceBalance[];
  onOpenExpenseDetail: (expense: Expense) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  events = [],
  categories = [],
  expenses = [],
  sourceBalances = [],
  onOpenExpenseDetail,
}) => {
  return (
    <div id="level3-reports-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Financial Reports
          </h1>
          {/* Plain-Language Statement replacing rule text */}
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            View spending by event, category, month, or financial year.
          </p>
        </div>
      </div>

      {/* THREE PLAIN-LANGUAGE REPORT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Card 1: Event Report */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold mb-2">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-[#171717]">Event Report</h3>
            <p className="text-[11px] text-[#5F6368] mt-1 font-medium leading-relaxed">
              Spending grouped by event.
            </p>
          </div>
          <button
            onClick={() => alert('Downloading Event Report PDF...')}
            className="w-full py-2 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Event PDF</span>
          </button>
        </div>

        {/* Card 2: Category & Monthly Report */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#009E68]/10 text-[#009E68] flex items-center justify-center font-bold mb-2">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-[#171717]">Category & Monthly Report</h3>
            <p className="text-[11px] text-[#5F6368] mt-1 font-medium leading-relaxed">
              Spending by category and month.
            </p>
          </div>
          <button
            onClick={() => alert('Downloading Monthly Category Excel...')}
            className="w-full py-2 bg-[#009E68] hover:bg-[#009E68]/90 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel Ledger</span>
          </button>
        </div>

        {/* Card 3: Financial Year Review */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#24152F] flex items-center justify-center font-bold mb-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className="font-bold text-xs text-[#171717]">Financial Year Review</h3>
            <p className="text-[11px] text-[#5F6368] mt-1 font-medium leading-relaxed">
              Annual income and expense summary.
            </p>
          </div>
          <button
            onClick={() => alert('Downloading Financial Year PDF...')}
            className="w-full py-2 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export FY Statement</span>
          </button>
        </div>

      </div>

    </div>
  );
};
