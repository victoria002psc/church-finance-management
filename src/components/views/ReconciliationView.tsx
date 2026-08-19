import React from 'react';
import { BankReconciliation } from '../../types.ts';
import { Scale, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface ReconciliationViewProps {
  bankReconciliations: BankReconciliation[];
}

export const ReconciliationView: React.FC<ReconciliationViewProps> = ({
  bankReconciliations = [],
}) => {
  return (
    <div id="level3-reconcile-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Bank Reconciliation
          </h1>
        </div>
      </div>

      {/* RECONCILIATION TABLE */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <Scale className="w-4 h-4 text-[#D4AF37]" />
          <span>Bank vs System</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EBE6DD] text-[#5F6368] font-semibold uppercase text-[9px] tracking-wider">
                <th className="py-2 px-2.5">Date</th>
                <th className="py-2 px-2.5">Account / Reference</th>
                <th className="py-2 px-2.5 text-right">System Amount</th>
                <th className="py-2 px-2.5 text-right">Bank Amount</th>
                <th className="py-2 px-2.5 text-right">Difference</th>
                <th className="py-2 px-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE6DD]">
              {(bankReconciliations || []).map((b) => {
                const diff = (b.systemAmount || 0) - (b.bankAmount || 0);
                const isMatch = Math.abs(diff) === 0;

                return (
                  <tr key={b.id} className="hover:bg-[#F9F8F6] transition-colors">
                    <td className="py-2.5 px-2.5 text-[#5F6368] font-mono text-[11px]">{b.statementDate || b.date}</td>
                    <td className="py-2.5 px-2.5 font-bold text-[#171717]">
                      {b.bankAccountName || 'Diocesan Parish Operating Account'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#171717] tabular-nums">
                      ₹{(b.systemAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#2563EB] tabular-nums">
                      ₹{(b.bankAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className={`py-2.5 px-2.5 text-right font-mono font-bold tabular-nums ${
                      isMatch ? 'text-[#009E68]' : 'text-[#E11D48]'
                    }`}>
                      {diff === 0 ? '₹0' : `₹${diff.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        isMatch 
                          ? 'bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30' 
                          : 'bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30'
                      }`}>
                        {isMatch ? 'Matched' : 'Difference'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
