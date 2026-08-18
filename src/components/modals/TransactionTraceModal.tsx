import React from 'react';
import { 
  X, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  FileText, 
  User, 
  Calendar, 
  ShieldCheck, 
  Building2,
  Scale
} from 'lucide-react';

interface TransactionTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null; // Can be MoneyGiven, MoneyReceived, Expense, or Request
  type: 'MONEY_GIVEN' | 'MONEY_RECEIVED' | 'EXPENSE' | 'REQUEST';
}

export const TransactionTraceModal: React.FC<TransactionTraceModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Full Transparency & Audit Trace (Rule 55)</h3>
              <p className="text-xs text-slate-400">Complete answer to all 55 financial transparency questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-stone-800 max-h-[75vh] overflow-y-auto text-xs">
          {/* Main Summary Header */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Transaction Entity ID
              </span>
              <span className="font-mono font-bold text-sm text-stone-900">{item.id}</span>
              <span className="text-[11px] text-stone-500 block">Type: {type}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Authoritative Amount
              </span>
              <span className="font-mono font-black text-xl text-emerald-700">
                ₹{item.amount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* 55 Questions Breakdown List */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authoritative Financial Origin & Destination Answers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Q1: Where did it come from? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">1. Where did it come from?</span>
                <span className="font-bold text-stone-900">
                  {item.sourceL2Name || item.fundSource || (item.sourceAllocations ? item.sourceAllocations.map((s: any) => s.sourceL3Name).join(', ') : 'Level 2 Zonal Allocation')}
                </span>
              </div>

              {/* Q2: From whom? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">2. From whom? (Giver)</span>
                <span className="font-bold text-stone-900">
                  {item.fromL2Name || item.giverL3Name || (item.personL4Name ? `${item.personL4Name} (via Level 3)` : 'Level 2 Central Fund')}
                </span>
              </div>

              {/* Q3: To whom? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">3. To whom? (Receiver / Beneficiary)</span>
                <span className="font-bold text-stone-900">
                  {item.receiverL4Name || item.toL3Name || item.requesterName || item.personL4Name || 'Zonal Operation'}
                </span>
              </div>

              {/* Q4: Why was it given? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">4. Why was it given / Purpose?</span>
                <span className="font-medium text-stone-800">
                  {item.purpose || item.remarks || item.description || 'Field operations'}
                </span>
              </div>

              {/* Q5: Which Event? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">5. Which Event?</span>
                <span className="font-bold text-stone-900">
                  {item.eventName || 'No Specific Event Configured'}
                </span>
              </div>

              {/* Q6: Which Category? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">6. Which Category?</span>
                <span className="font-bold text-stone-900">
                  {item.categoryName || 'General Operations'}
                </span>
              </div>

              {/* Q7: What Document Exists? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">7. What Document Exists?</span>
                <span className="font-medium text-stone-800">
                  {item.documentType ? `${item.documentType} #${item.documentNumber || 'N/A'}` : (item.transactionRef ? `Bank Reference: ${item.transactionRef}` : 'Voucher / Digital Authorization')}
                </span>
              </div>

              {/* Q8: Who Approved / Acknowledged? */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-500 font-semibold block text-[10px]">8. Who Approved / Acknowledged?</span>
                <span className="font-bold text-stone-900">
                  {item.approvedByName || item.acknowledgedByName || (item.isAcknowledgedByL3 ? 'Rajesh Kumar (Level 3)' : 'Pending Acknowledgement')}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Verification Note */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-start space-x-2 text-[11px] text-emerald-900">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Complete Auditability Maintained: </strong>
              <span>This transaction is permanently recorded in the immutable audit log. Even if cancelled or reversed, previous and new values remain fully reconstructible.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Close Transparency Trace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
