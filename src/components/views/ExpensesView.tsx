import React, { useState } from 'react';
import { Expense, L4ToL4Transaction } from '../../types.ts';
import { 
  Receipt, 
  Scan, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ArrowLeftRight, 
  Clock, 
  CheckCircle,
  Eye
} from 'lucide-react';

interface ExpensesViewProps {
  expenses: Expense[];
  l4ToL4Transactions: L4ToL4Transaction[];
  onOpenExpenseDetail: (expense: Expense) => void;
  onOpenTrace: (item: any, type: 'EXPENSE') => void;
  onValidateL4ToL4: (data: { transactionId: string; action: 'ACCEPT' | 'REJECT'; l3Remarks?: string }) => Promise<void>;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  l4ToL4Transactions,
  onOpenExpenseDetail,
  onOpenTrace,
  onValidateL4ToL4,
}) => {
  const [subTab, setSubTab] = useState<'EXPENSES' | 'OCR' | 'L4_TO_L4'>('EXPENSES');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ocrMismatches = expenses.filter((e) => e.ocrResult?.isMismatch);
  const pendingL4ToL4 = l4ToL4Transactions.filter((t) => t.status === 'PENDING_VALIDATION');

  const handleValidate = async (trxId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      setIsSubmitting(true);
      await onValidateL4ToL4({
        transactionId: trxId,
        action,
        l3Remarks: action === 'ACCEPT' ? 'Remarks and expenditure validated by Level 3.' : 'Remarks unverified.',
      });
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <Receipt className="w-4 h-4" />
          <span>Expenses, Bills, Vouchers & OCR</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          Level 4 Expense Management & Verification
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Rule 18, 22, 23 & 25: All expenses retain supporting documents (bills, invoices, or advance vouchers). OCR differences remain visible without automatic alteration.
        </p>

        {/* Subtabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          <button
            onClick={() => setSubTab('EXPENSES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'EXPENSES'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Field Expenses ({expenses.length})
          </button>

          <button
            onClick={() => setSubTab('OCR')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              subTab === 'OCR'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>OCR Review & Mismatches ({ocrMismatches.length})</span>
          </button>

          <button
            onClick={() => setSubTab('L4_TO_L4')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              subTab === 'L4_TO_L4'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Level 4 &rarr; Level 4 Remarks ({l4ToL4Transactions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: All Field Expenses */}
      {subTab === 'EXPENSES' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Date & Person</th>
                <th className="p-3.5">Category & Event</th>
                <th className="p-3.5">Document / Voucher</th>
                <th className="p-3.5">Source Allocation</th>
                <th className="p-3.5">L3 Status</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900">{exp.personL4Name}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{exp.date}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800">{exp.categoryName}</div>
                    <div className="text-[10.5px] text-stone-500">{exp.eventName || 'Zonal Operation'}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        exp.documentType === 'VOUCHER'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {exp.documentType} #{exp.documentNumber}
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-700">
                    {exp.sourceAllocations.map((s, idx) => (
                      <div key={idx} className="truncate max-w-[180px]">
                        {s.sourceL3Name}: <strong className="font-mono">₹{s.amount}</strong>
                      </div>
                    ))}
                  </td>
                  <td className="p-3.5">
                    {exp.isAcknowledgedByL3 ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Acknowledged</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Ack</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-mono font-black text-stone-900 text-sm">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onOpenTrace(exp, 'EXPENSE')}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200"
                        title="Trace (Rule 55)"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenExpenseDetail(exp)}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: OCR Review & Discrepancies */}
      {subTab === 'OCR' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
            <Scan className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Rule 23 — OCR Mismatch Principle: </strong>
              <span>When a bill/receipt has an amount discrepancy, the system explicitly highlights the difference. OCR extraction is never treated as automated approval, and transactions are never silently altered.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {expenses
              .filter((e) => e.ocrResult)
              .map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-stone-900">{exp.personL4Name}</span>
                      <span className="text-xs font-mono text-stone-400">Doc #{exp.documentNumber}</span>
                      {exp.ocrResult?.isMismatch ? (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 border border-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          <span>AMOUNT MISMATCH</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 border border-emerald-300">
                          <CheckCircle className="w-3 h-3" />
                          <span>OCR MATCHED</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-700">{exp.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">Transaction Amount</span>
                        <span className="font-mono font-bold text-stone-900">₹{exp.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">OCR Extracted Amount</span>
                        <span className={`font-mono font-bold ${exp.ocrResult?.isMismatch ? 'text-rose-700' : 'text-emerald-700'}`}>
                          ₹{exp.ocrResult?.extractedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">OCR Status</span>
                        <span className="font-bold text-stone-800">{exp.ocrResult?.reviewStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onOpenExpenseDetail(exp)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Examine OCR & Voucher
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Level 4 -> Level 4 Transactions (Rule 25 & 26) */}
      {subTab === 'L4_TO_L4' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-800 flex items-start space-x-2.5">
            <ArrowLeftRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Rules 25 & 26 — Level 4 &rarr; Level 4 Validation: </strong>
              <span>When one Level 4 person provides money for another Level 4 person, the transaction tags both members and records required remarks. The transaction remains UNVALIDATED until Level 3 reviews and accepts the remarks.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {l4ToL4Transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-stone-900">{trx.givingL4Name}</span>
                    <span className="text-xs text-stone-400">&rarr;</span>
                    <span className="font-bold text-sm text-emerald-800">{trx.benefitingL4Name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        trx.status === 'PENDING_VALIDATION'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : trx.status === 'VALIDATED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 flex items-center space-x-3">
                    <span>Category: <strong>{trx.categoryName}</strong></span>
                    {trx.eventName && <span>Event: <strong>{trx.eventName}</strong></span>}
                    <span>Date: <strong>{trx.date}</strong></span>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs text-stone-700">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">L4 Remarks:</span>
                    "{trx.remarks}"
                  </div>

                  {trx.l3Remarks && (
                    <div className="text-[11px] text-stone-600 italic">
                      Level 3 Supervisor Remarks: {trx.l3Remarks}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">Amount</span>
                    <span className="font-mono font-black text-xl text-stone-900">
                      ₹{trx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {trx.status === 'PENDING_VALIDATION' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleValidate(trx.id, 'REJECT')}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleValidate(trx.id, 'ACCEPT')}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
                      >
                        Accept & Validate
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validated</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
