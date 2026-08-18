import React from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  IndianRupee,
  Building,
  ShieldCheck
} from 'lucide-react';
import { L2DashboardData } from '../../../types.ts';

interface Level2ReconciliationViewProps {
  data: L2DashboardData;
}

export const Level2ReconciliationView: React.FC<Level2ReconciliationViewProps> = ({ data }) => {
  const { bankReconciliations } = data;

  const matchedCount = bankReconciliations.filter((b) => b.status === 'MATCHED').length;
  const differenceCount = bankReconciliations.filter((b) => b.status === 'DIFFERENCE').length;

  return (
    <div id="level2-reconciliation-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
              FINANCIAL AUDITING
            </span>
            <span className="text-xs text-slate-400">Central Bank Statement Reconciliations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Bank Statement Reconciliation & Ledger Matching
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time validation between Diocesan SBI operations accounts, NEFT disbursements, and recorded vouchers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] text-slate-400">Matched</div>
            <div className="text-sm font-bold text-emerald-400">{matchedCount}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-center">
            <div className="text-[10px] text-slate-400">Differences</div>
            <div className="text-sm font-bold text-amber-400">{differenceCount}</div>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Scale className="w-4 h-4 text-sky-400" />
          <span>Statement Line Items ({bankReconciliations.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Bank Narrative</th>
                <th className="py-2.5 px-3">System Amount</th>
                <th className="py-2.5 px-3">Bank Amount</th>
                <th className="py-2.5 px-3">Difference</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bankReconciliations.map((item) => {
                const isMatched = item.status === 'MATCHED';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(item.transactionDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium">
                      <div>{item.description}</div>
                      <div className="text-[10px] font-mono text-slate-500">{item.referenceNo} • {item.bankAccount}</div>
                      {item.differenceReason && (
                        <div className="text-[10px] text-amber-300/90 mt-1 bg-amber-950/40 p-1.5 rounded border border-amber-800/40">
                          {item.differenceReason}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      ₹{item.systemAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      ₹{item.bankStatementAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      {item.difference === 0 ? (
                        <span className="text-slate-500">₹0</span>
                      ) : (
                        <span className="text-amber-400">₹{item.difference.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        isMatched
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {item.status}
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
