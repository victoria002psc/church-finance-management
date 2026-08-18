import React, { useState } from 'react';
import { ConfiguredEvent, ConfiguredCategory, Expense, SourceBalance } from '../../types.ts';
import { 
  FileSpreadsheet, 
  Calendar, 
  Tag, 
  TrendingUp, 
  Receipt, 
  Layers, 
  Search, 
  CheckCircle2,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ReportsViewProps {
  events: ConfiguredEvent[];
  categories: ConfiguredCategory[];
  expenses: Expense[];
  sourceBalances: SourceBalance[];
  onOpenExpenseDetail: (expense: Expense) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  events,
  categories,
  expenses,
  sourceBalances,
  onOpenExpenseDetail,
}) => {
  const [reportType, setReportType] = useState<'EVENT' | 'CATEGORY' | 'FINANCIAL_YEAR'>('EVENT');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');

  // Filter for Event Report
  const eventExpenses = expenses.filter((e) => e.eventId === selectedEventId);
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const totalEventSpent = eventExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Filter for Category + Month Report
  const categoryMonthExpenses = expenses.filter((e) => {
    const matchesCat = e.categoryId === selectedCategoryId;
    const matchesMonth = e.date.startsWith(selectedMonth);
    return matchesCat && matchesMonth;
  });
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const totalCatSpent = categoryMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Financial Year 2026-27 total
  const totalFYSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFYReceived = sourceBalances.reduce((sum, s) => sum + s.receivedAmount, 0);
  const totalFYAvailable = sourceBalances.reduce((sum, s) => sum + s.availableAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Financial Reporting & Itemized Audits</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          Zonal Expense Reports & Financial Year Review
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Rules 36, 37, 38 & 59: Reports never display disconnected totals. Every single total is derived authoritatively from underlying itemized transactions, vouchers, and source allocations.
        </p>

        {/* Report Type Selector */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          <button
            onClick={() => setReportType('EVENT')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              reportType === 'EVENT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Reporting (Rule 57)</span>
          </button>

          <button
            onClick={() => setReportType('CATEGORY')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              reportType === 'CATEGORY'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Category & Month Reporting (Rule 58)</span>
          </button>

          <button
            onClick={() => setReportType('FINANCIAL_YEAR')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              reportType === 'FINANCIAL_YEAR'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Financial Year Review (Rule 59)</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Event Reporting (Rule 36 & 57) */}
      {reportType === 'EVENT' && (
        <div className="space-y-4">
          {/* Event Filter & Total Card */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Select Configured Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({evt.code})
                  </option>
                ))}
              </select>
            </div>

            {selectedEvent && (
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Zonal Allocated Budget</span>
                  <span className="font-mono font-bold text-stone-800 text-base">
                    ₹{selectedEvent.budgetAllocated.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Underlying Itemized Total</span>
                  <span className="font-mono font-black text-2xl text-emerald-700">
                    ₹{totalEventSpent.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Underlying Transactions Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="bg-stone-50 p-3.5 border-b border-stone-200 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800 uppercase text-[10.5px]">
                Underlying Itemized Transactions ({eventExpenses.length})
              </span>
              <span className="text-stone-500">Traceable to Level 4 bills and vouchers</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Level 4 Person</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Document / Voucher</th>
                  <th className="p-3">Source Allocation</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {eventExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50/70">
                    <td className="p-3 font-mono text-stone-700">{exp.date}</td>
                    <td className="p-3 font-bold text-stone-900">{exp.personL4Name}</td>
                    <td className="p-3 text-stone-800">{exp.categoryName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {exp.documentType} #{exp.documentNumber}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {exp.sourceAllocations.map((s) => `${s.sourceL3Name}: ₹${s.amount}`).join(', ')}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-stone-900 text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenExpenseDetail(exp)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px]"
                      >
                        Examine &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {eventExpenses.length === 0 && (
              <div className="py-10 text-center text-xs text-stone-400">
                No recorded field expenses for this event yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Category & Month Reporting (Rule 37 & 58) */}
      {reportType === 'CATEGORY' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parentGroup} &rarr; {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-medium text-stone-900"
                />
              </div>
            </div>

            <div className="text-right pl-4 border-l border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Category Monthly Total</span>
              <span className="font-mono font-black text-2xl text-teal-700">
                ₹{totalCatSpent.toLocaleString('en-IN')}
              </span>
              <span className="text-[10.5px] text-stone-500 block mt-0.5">
                {categoryMonthExpenses.length} Transactions
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Person</th>
                  <th className="p-3">Event</th>
                  <th className="p-3">Document</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {categoryMonthExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50/70">
                    <td className="p-3 font-mono text-stone-700">{exp.date}</td>
                    <td className="p-3 font-bold text-stone-900">{exp.personL4Name}</td>
                    <td className="p-3 text-stone-800">{exp.eventName || 'General'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {exp.documentType} #{exp.documentNumber}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold text-[10.5px]">
                        {exp.isAcknowledgedByL3 ? 'L3 Acknowledged' : 'Pending Ack'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-black text-stone-900 text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenExpenseDetail(exp)}
                        className="text-teal-700 hover:text-teal-900 font-bold text-[11px]"
                      >
                        Examine &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {categoryMonthExpenses.length === 0 && (
              <div className="py-10 text-center text-xs text-stone-400">
                No recorded field expenses for this category in {selectedMonth}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Financial Year Review (Rule 38 & 59) */}
      {reportType === 'FINANCIAL_YEAR' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-semibold">FINANCIAL YEAR 2026-27</span>
                <h3 className="text-lg font-bold text-white">Full Traceable Financial Chain (Rule 59)</h3>
              </div>
              <span className="text-xs text-slate-400">Transaction &rarr; Document &rarr; OCR &rarr; Payment &rarr; Bank</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">FY 26-27 Inward Receipts (L2)</span>
                <span className="text-xl font-mono font-bold text-emerald-400">₹{totalFYReceived.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">FY 26-27 Field Disbursements</span>
                <span className="text-xl font-mono font-bold text-stone-200">₹{totalFYSpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">FY 26-27 Remaining Balance</span>
                <span className="text-xl font-mono font-bold text-emerald-300">₹{totalFYAvailable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs space-y-3 text-xs text-stone-700">
            <div className="flex items-center space-x-2 font-bold text-stone-900 uppercase text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Audit Traceability Tree</span>
            </div>
            <p className="leading-relaxed">
              Every rupee in this financial year is bound to its Level 2 funding source (Sunita Rao's Central Operations Fund or Anand Verma's Community Outreach Fund), individual Level 4 receipts, OCR slip verifications, and monthly SBI bank statements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
