import React, { useState } from 'react';
import {
  Receipt,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  Plus,
  ShieldCheck,
  Search,
  Building
} from 'lucide-react';
import { L2DashboardData, DocumentType } from '../../../types.ts';

interface Level2ExpensesViewProps {
  data: L2DashboardData;
  onRecordExpense: (data: {
    amount: number;
    categoryId: string;
    eventId?: string;
    description?: string;
    documentType?: DocumentType;
    documentNumber?: string;
  }) => Promise<void>;
}

export const Level2ExpensesView: React.FC<Level2ExpensesViewProps> = ({
  data,
  onRecordExpense,
}) => {
  const { currentL2User, expenses, categories, events, centralAvailableBalance } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [eventId, setEventId] = useState(events[0]?.id || '');
  const [documentType, setDocumentType] = useState<DocumentType>('BILL');
  const [documentNumber, setDocumentNumber] = useState(`PRNT-BLR-${Date.now().toString().slice(-4)}`);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid positive expense amount.');
      return;
    }
    if (numAmount > centralAvailableBalance) {
      setErrorMsg(`Amount exceeds central available balance (₹${centralAvailableBalance.toLocaleString('en-IN')}).`);
      return;
    }

    try {
      setLoading(true);
      await onRecordExpense({
        amount: numAmount,
        categoryId,
        eventId: eventId || undefined,
        description: description || `Central administrative expenditure for ${categories.find(c => c.id === categoryId)?.name}`,
        documentType,
        documentNumber,
      });

      setSuccessMsg(`Successfully recorded central expense of ₹${numAmount.toLocaleString('en-IN')}.`);
      setAmount('');
      setDescription('');
      setDocumentNumber(`PRNT-BLR-${Date.now().toString().slice(-4)}`);
      setModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="level2-expenses-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              CENTRAL EXPENDITURES
            </span>
            <span className="text-xs text-slate-400">Diocesan Central Office & Event Expenses</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Central Directorate Expenses & OCR Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Record direct administrative expenses, printings, conference logistics, and OCR bill verifications.
          </p>
        </div>

        <button
          id="open-record-expense-btn"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Central Expense</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>Central Expenses Ledger ({expenses.length})</span>
        </h2>

        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No central expenses recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category & Event</th>
                  <th className="py-2.5 px-3">Description & Bill</th>
                  <th className="py-2.5 px-3">OCR Status</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div className="font-semibold text-slate-100">{exp.categoryName}</div>
                      <div className="text-[10px] text-slate-400">{exp.eventName || 'Central Administration'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <div>{exp.description}</div>
                      <div className="text-[10px] font-mono text-amber-300/80">
                        {exp.documentType} #{exp.documentNumber}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {exp.ocrResult ? (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          exp.ocrResult.isMismatch 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {exp.ocrResult.isMismatch ? 'MISMATCH FLAGGED' : 'OCR VERIFIED'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Manual Entry</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Record Central Expense */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Record Central Expense</h3>
                  <p className="text-xs text-slate-400">Diocesan Central Operations Expenditure</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Budget Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Event / Synod Mission
                  </label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- General Central Operations --</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 12000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="BILL">BILL</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="RECEIPT">RECEIPT</option>
                    <option value="VOUCHER">VOUCHER</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Bill / Voucher #
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Description / Itemization *
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Printing Synod delegate folders and pastoral handbook..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-all"
                >
                  {loading ? 'Recording...' : 'Record Central Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
