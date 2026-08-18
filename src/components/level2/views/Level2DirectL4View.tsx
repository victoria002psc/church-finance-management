import React, { useState } from 'react';
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  FileText,
  Building,
  UserCheck,
  AlertCircle,
  History,
  Tag,
  Calendar
} from 'lucide-react';
import { L2DashboardData, DocumentType } from '../../../types.ts';

interface Level2DirectL4ViewProps {
  data: L2DashboardData;
  onDirectL4Payment: (data: {
    toL4Id: string;
    amount: number;
    categoryId: string;
    eventId?: string;
    purpose?: string;
    documentType?: DocumentType;
    documentNumber?: string;
  }) => Promise<void>;
}

export const Level2DirectL4View: React.FC<Level2DirectL4ViewProps> = ({
  data,
  onDirectL4Payment,
}) => {
  const {
    currentL2User,
    centralAvailableBalance,
    allL4Recipients,
    directL4Payments,
    categories,
    events,
  } = data;

  const [toL4Id, setToL4Id] = useState<string>(allL4Recipients[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [eventId, setEventId] = useState<string>(events[0]?.id || '');
  const [purpose, setPurpose] = useState<string>('');
  const [documentType, setDocumentType] = useState<DocumentType>('INVOICE');
  const [documentNumber, setDocumentNumber] = useState<string>(`L2-INV-${Date.now().toString().slice(-4)}`);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedL4 = allL4Recipients.find((u) => u.id === toL4Id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const numAmount = Number(amount);
    if (!toL4Id) {
      setErrorMessage('Please select a Level 4 person.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive payment amount.');
      return;
    }
    if (numAmount > centralAvailableBalance) {
      setErrorMessage(`Payment amount exceeds central available balance (₹${centralAvailableBalance.toLocaleString('en-IN')}).`);
      return;
    }

    try {
      setLoading(true);
      await onDirectL4Payment({
        toL4Id,
        amount: numAmount,
        categoryId,
        eventId: eventId || undefined,
        purpose: purpose || `Direct central grant from ${currentL2User.name}`,
        documentType,
        documentNumber,
      });

      setSuccessMessage(`Successfully processed direct payment of ₹${numAmount.toLocaleString('en-IN')} to ${selectedL4?.name}. Actual giver is recorded as Level 2 Director ${currentL2User.name}.`);
      setAmount('');
      setPurpose('');
      setDocumentNumber(`L2-INV-${Date.now().toString().slice(-4)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process direct payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="level2-direct-l4-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              DIRECT CENTRAL DISBURSEMENT
            </span>
            <span className="text-xs text-slate-400">Level 2 → Level 4 Direct Grant</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Direct Central Payments to Level 4 Personnel
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Level 2 Directors can directly finance Level 4 activities without routing through Level 3, maintaining exact giver attribution.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-right">
          <div className="text-[11px] text-slate-400">Central Available Balance</div>
          <div className="text-lg font-bold text-emerald-400">
            ₹{centralAvailableBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Direct Payment Voucher Form</span>
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* L4 Target */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient Level 4 Worker *
              </label>
              <select
                id="direct-l4-target-select"
                value={toL4Id}
                onChange={(e) => setToL4Id(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              >
                {allL4Recipients.map((l4) => (
                  <option key={l4.id} value={l4.id}>
                    {l4.name} — {l4.designation} ({l4.assignedArea})
                  </option>
                ))}
              </select>
            </div>

            {/* Category & Event */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Budget Category *
                </label>
                <select
                  id="direct-l4-category-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Church Event / Mission (Optional)
                </label>
                <select
                  id="direct-l4-event-select"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- General Parish Mission --</option>
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount & Doc Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="direct-l4-amount-input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 15000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  id="direct-l4-doctype-select"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="INVOICE">INVOICE</option>
                  <option value="BILL">BILL</option>
                  <option value="VOUCHER">VOUCHER</option>
                  <option value="RECEIPT">RECEIPT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document / Voucher #
                </label>
                <input
                  id="direct-l4-docnum-input"
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Purpose & Description *
              </label>
              <textarea
                id="direct-l4-purpose-input"
                rows={2}
                placeholder="e.g., Central procurement of stage audio snake cable and mics for Synod conference."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                id="submit-direct-l4-btn"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing Payment...' : 'Execute Direct Payment to Level 4'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Attribution Logic
          </h3>

          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-200">Giver Identity:</div>
            <div className="text-indigo-300 font-medium">Level 2 — {currentL2User.name}</div>
            
            <div className="pt-2 text-slate-400">
              When Level 2 pays Level 4 directly, the transaction is permanently tagged with Level 2 as the actual payer. Level 3 overseer balances remain untouched and unburdened.
            </div>

            <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 block mb-0.5">Audit Compliance:</span>
              Includes invoice/bill reference and full timestamp in the immutable audit log.
            </div>
          </div>
        </div>

      </div>

      {/* History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Direct Level 4 Payments History</span>
        </h2>

        {directL4Payments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No direct Level 4 payments recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Level 4 Recipient</th>
                  <th className="py-2.5 px-3">Category & Event</th>
                  <th className="py-2.5 px-3">Document Details</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {directL4Payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(p.givenAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-100">
                      {p.toL4Name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{p.categoryName}</div>
                      <div className="text-[10px] text-slate-400">{p.eventName || 'Parish Mission'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <span className="font-mono text-[11px] text-indigo-300">{p.documentType} #{p.documentNumber}</span>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{p.purpose}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-indigo-300">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
