import React from 'react';
import { BankReconciliationItem } from '../../types.ts';
import { Scale, CheckCircle2, AlertTriangle, Building2, ShieldAlert, FileSpreadsheet } from 'lucide-react';

interface ReconciliationViewProps {
  bankReconciliations: BankReconciliationItem[];
}

export const ReconciliationView: React.FC<ReconciliationViewProps> = ({
  bankReconciliations,
}) => {
  const matchedCount = bankReconciliations.filter((b) => b.status === 'MATCHED').length;
  const differenceCount = bankReconciliations.filter((b) => b.status === 'DIFFERENCE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>Bank Reconciliation & Statement Audit</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          Zonal Bank Feed vs System Financial Ledger
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Rules 34, 35 & 60: Compares system transactions directly with bank statements. Differences remain explicitly visible and are never silently altered or forced to match.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Matched Transactions</span>
                <span className="text-[11px] text-emerald-700">Authoritative balance matches bank record</span>
              </div>
            </div>
            <span className="font-mono font-black text-xl text-emerald-800">{matchedCount}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Active Ledger Differences</span>
                <span className="text-[11px] text-amber-700">Differences preserved for audit review</span>
              </div>
            </div>
            <span className="font-mono font-black text-xl text-amber-800">{differenceCount}</span>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3.5">Date & Reference</th>
              <th className="p-3.5">Transaction Description</th>
              <th className="p-3.5">Account Details</th>
              <th className="p-3.5 text-right">System Amount</th>
              <th className="p-3.5 text-right">Bank Statement</th>
              <th className="p-3.5 text-right">Difference</th>
              <th className="p-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bankReconciliations.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-stone-800">{item.transactionDate}</div>
                  <div className="text-[10px] font-mono text-stone-500">{item.referenceNo}</div>
                </td>
                <td className="p-3.5 max-w-xs">
                  <div className="font-semibold text-stone-900">{item.description}</div>
                  {item.differenceReason && (
                    <div className="text-[11px] text-rose-700 bg-rose-50 p-1.5 rounded mt-1 border border-rose-200">
                      <strong>Audit Note:</strong> {item.differenceReason}
                    </div>
                  )}
                </td>
                <td className="p-3.5 text-[11px] text-stone-600">
                  {item.bankAccount}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-stone-900">
                  ₹{item.systemAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-stone-800">
                  ₹{item.bankStatementAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-3.5 text-right font-mono font-bold">
                  {item.difference > 0 ? (
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      ₹{item.difference.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-stone-400 font-mono">₹0</span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  {item.status === 'MATCHED' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>MATCHED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      <span>DIFFERENCE</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 flex items-start space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-stone-800">Financial Integrity Assurance: </strong>
          <span>Bank feeds are linked authoritatively with voucher documents and Level 2 allocations. All differences trigger audit flags until formally investigated.</span>
        </div>
      </div>
    </div>
  );
};
