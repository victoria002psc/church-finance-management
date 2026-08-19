import React, { useState } from 'react';
import { Expense } from '../../types.ts';
import { 
  Receipt, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Check, 
  Info,
  Layers
} from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface ExpensesViewProps {
  expenses: Expense[];
  l4ToL4Transactions?: any[];
  onOpenExpenseDetail: (expense: Expense) => void;
  onOpenTrace: (item: any, type: 'EXPENSE') => void;
  onValidateL4ToL4?: (txId: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses = [],
  l4ToL4Transactions = [],
  onOpenExpenseDetail,
  onOpenTrace,
}) => {
  const [selectedExpenseDrawer, setSelectedExpenseDrawer] = useState<Expense | null>(null);

  const totalRecorded = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
  const ackCount = (expenses || []).filter(e => e.acknowledgedByL3).length;
  const pendingCount = (expenses || []).filter(e => !e.acknowledgedByL3).length;
  const ocrMismatchCount = (expenses || []).filter(e => e.ocrResult?.isMismatch).length;

  return (
    <div id="level3-expenses-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Expenses & OCR
          </h1>
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            Bills, vouchers & OCR review
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Total Recorded</div>
          <div className="text-base font-extrabold text-[#171717] font-mono mt-0.5 tabular-nums">
            ₹{totalRecorded.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Acknowledged</div>
          <div className="text-base font-extrabold text-[#009E68] mt-0.5">
            {ackCount}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Pending Review</div>
          <div className="text-base font-extrabold text-[#F59E0B] mt-0.5">
            {pendingCount}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">OCR Mismatches</div>
          <div className="text-base font-extrabold text-[#E11D48] mt-0.5">
            {ocrMismatchCount}
          </div>
        </div>
      </div>

      {/* EXPENSES TABLE */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <Receipt className="w-4 h-4 text-[#009E68]" />
          <span>Expense Records</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE6DD] text-[#5F6368] font-semibold uppercase text-[9px] tracking-wider">
                <th className="py-2 px-2.5">Date</th>
                <th className="py-2 px-2.5">Submitted By</th>
                <th className="py-2 px-2.5">Purpose / Category</th>
                <th className="py-2 px-2.5 text-right">Amount</th>
                <th className="py-2 px-2.5 text-center">OCR Scan</th>
                <th className="py-2 px-2.5 text-center">Status</th>
                <th className="py-2 px-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DD]">
              {(expenses || []).map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F9F8F6] transition-colors">
                  <td className="py-2.5 px-2.5 text-[#5F6368] font-mono text-[11px]">{exp.date}</td>
                  <td className="py-2.5 px-2.5 font-bold text-[#171717]">{exp.submittedByL4Name || exp.personL4Name}</td>
                  <td className="py-2.5 px-2.5">
                    <div className="font-semibold text-[#171717]">{exp.purpose}</div>
                    <div className="text-[10px] text-[#5F6368]">{exp.categoryName}</div>
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#171717] tabular-nums">
                    ₹{(exp.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      exp.ocrResult?.isMismatch 
                        ? 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30' 
                        : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30'
                    }`}>
                      {exp.ocrResult?.isMismatch ? 'Mismatch' : 'Verified'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      exp.acknowledgedByL3 
                        ? 'bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30' 
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}>
                      {exp.acknowledgedByL3 ? 'Acknowledged' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <button
                      onClick={() => onOpenExpenseDetail(exp)}
                      className="px-2 py-1 bg-[#24152F] hover:bg-[#30203D] text-white rounded text-[10px] font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3 text-[#D4AF37]" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
