import React, { useState } from 'react';
import { Expense } from '../../types.ts';
import { 
  X, 
  Receipt, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Scan, 
  Eye, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  User, 
  Layers,
  Scale
} from 'lucide-react';

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onAcknowledge: (expenseId: string) => Promise<void>;
  onVerifyOcr: (data: { expenseId: string; verificationAction: 'VERIFY_CORRECT' | 'FLAG_DISCREPANCY'; remarks?: string }) => Promise<void>;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  isOpen,
  onClose,
  expense,
  onAcknowledge,
  onVerifyOcr,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !expense) return null;

  const hasOcr = !!expense.ocrResult;
  const isMismatch = expense.ocrResult?.isMismatch;

  const handleAcknowledge = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onAcknowledge(expense.id);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to acknowledge expense');
    }
  };

  const handleOcrVerification = async (action: 'VERIFY_CORRECT' | 'FLAG_DISCREPANCY') => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onVerifyOcr({
        expenseId: expense.id,
        verificationAction: action,
        remarks: action === 'FLAG_DISCREPANCY' ? 'Discrepancy noted during Level 3 review.' : 'OCR data verified against physical voucher.',
      });
      setIsSubmitting(false);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to update OCR verification');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Expense & Document #{expense.id}</h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    expense.documentType === 'VOUCHER'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {expense.documentType}
                </span>
                {expense.isAcknowledgedByL3 && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    L3 Acknowledged
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Supporting Document, OCR Verification & Source Traceability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        <div className="p-6 space-y-4 text-stone-800 max-h-[75vh] overflow-y-auto">
          {/* Main Info Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Expense Amount
              </span>
              <span className="text-2xl font-black font-mono text-stone-900">
                ₹{expense.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-stone-500 uppercase block">Doc Number & Date</span>
              <span className="text-xs font-mono font-bold text-stone-800 block">{expense.documentNumber}</span>
              <span className="text-[11px] text-stone-500">{expense.date}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-50/80 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Level 4 Spender</span>
              </div>
              <div className="font-bold text-stone-900">{expense.personL4Name}</div>
            </div>

            <div className="bg-stone-50/80 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                <span>Category</span>
              </div>
              <div className="font-bold text-stone-900">{expense.categoryName}</div>
            </div>

            <div className="bg-stone-50/80 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Event</span>
              </div>
              <div className="font-bold text-stone-900">{expense.eventName || 'No Specific Event'}</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-stone-50/80 p-3.5 rounded-lg border border-stone-200 text-xs">
            <span className="text-stone-500 font-semibold block mb-1">Expense Description</span>
            <p className="text-stone-800 font-medium leading-relaxed">{expense.description}</p>
          </div>

          {/* Source Allocation Breakdown (Preserved Sources) */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800 uppercase text-[10.5px]">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Source Allocation (Where the Rupee Came From)</span>
            </div>
            {expense.sourceAllocations.map((src, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11.5px] bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-700 font-medium">{src.sourceL3Name}</span>
                <span className="font-mono font-bold text-slate-900">₹{src.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Supporting Document & OCR Review Area */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
            <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <Scan className="w-4 h-4 text-teal-600" />
                <span>Supporting Document & OCR Extraction</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">Doc Type: {expense.documentType}</span>
            </div>

            <div className="p-4 space-y-3">
              {expense.documentType === 'VOUCHER' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Advance / Cash Voucher Applied: </strong>
                    <span>A formal bill does not exist for this advance. The voucher is linked authoritatively to this expense per Rule 22.</span>
                  </div>
                </div>
              )}

              {hasOcr && expense.ocrResult && (
                <div className="space-y-3">
                  {/* OCR Mismatch Alert Banner if mismatch exists */}
                  {isMismatch ? (
                    <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-lg flex items-start space-x-3 text-xs text-rose-950">
                      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-bounce" />
                      <div className="space-y-1">
                        <strong className="font-bold text-rose-900 text-sm block">
                          OCR Amount Mismatch Detected!
                        </strong>
                        <p className="text-rose-800">
                          Extracted Amount: <span className="font-mono font-bold">₹{expense.ocrResult.extractedAmount.toLocaleString('en-IN')}</span> vs Transaction Amount: <span className="font-mono font-bold">₹{expense.amount.toLocaleString('en-IN')}</span> (Difference: <span className="font-mono font-bold">₹{(expense.ocrResult.extractedAmount - expense.amount).toLocaleString('en-IN')}</span>).
                        </p>
                        <p className="text-[11px] text-rose-700 italic">
                          Per Rule 23: The mismatch remains visible. The system does not silently modify transactions or treat OCR as automated approval.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center space-x-2 text-xs text-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>OCR extracted amount matches the transaction amount (₹{expense.amount.toLocaleString('en-IN')}).</span>
                    </div>
                  )}

                  {/* OCR Extracted Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Vendor</span>
                      <span className="font-semibold text-stone-800">{expense.ocrResult.extractedVendor}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Extracted Amount</span>
                      <span className="font-mono font-bold text-stone-900">₹{expense.ocrResult.extractedAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Extracted Date</span>
                      <span className="font-mono text-stone-800">{expense.ocrResult.extractedDate}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Invoice #</span>
                      <span className="font-mono text-stone-800">{expense.ocrResult.extractedInvoiceNo}</span>
                    </div>
                  </div>

                  {/* OCR Raw Text Box */}
                  <div className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                    <span className="text-stone-400 text-[10px] block mb-1 font-sans uppercase tracking-wider">Raw OCR Output Preview:</span>
                    {expense.ocrResult.rawTextPreview}
                  </div>

                  {/* OCR Review Controls */}
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <span className="text-[11px] text-stone-500">OCR Status: <strong>{expense.ocrResult.reviewStatus}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleOcrVerification('FLAG_DISCREPANCY')}
                      disabled={isSubmitting}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded"
                    >
                      Flag Discrepancy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOcrVerification('VERIFY_CORRECT')}
                      disabled={isSubmitting}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                    >
                      Verify as Checked
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acknowledgement Status & Action */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <div>
              {expense.isAcknowledgedByL3 ? (
                <div className="text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Acknowledged by Level 3 Supervisor on {new Date(expense.acknowledgedAt || '').toLocaleDateString('en-IN')}</span>
                </div>
              ) : (
                <div className="text-xs text-amber-700 font-semibold flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pending Level 3 Acknowledgement</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Close
              </button>

              {!expense.isAcknowledgedByL3 && (
                <button
                  id="acknowledge-expense-btn"
                  type="button"
                  onClick={handleAcknowledge}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Acknowledging...' : 'Acknowledge Expense'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
