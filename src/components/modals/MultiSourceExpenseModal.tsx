import React, { useState } from 'react';
import { User, SourceBalance, ConfiguredCategory, ConfiguredEvent } from '../../types.ts';
import { X, Layers, AlertCircle, CheckCircle, Calculator } from 'lucide-react';

interface MultiSourceExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  l4Users: User[];
  sourceBalances: SourceBalance[];
  categories: ConfiguredCategory[];
  events: ConfiguredEvent[];
  onRecordMultiSource: (data: {
    personL4Id: string;
    amount: number;
    categoryId: string;
    eventId?: string;
    description?: string;
    documentType?: 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';
    documentNumber?: string;
  }) => Promise<void>;
}

export const MultiSourceExpenseModal: React.FC<MultiSourceExpenseModalProps> = ({
  isOpen,
  onClose,
  l4Users,
  sourceBalances,
  categories,
  events,
  onRecordMultiSource,
}) => {
  const [personL4Id, setPersonL4Id] = useState(l4Users[0]?.id || '');
  const [amount, setAmount] = useState<string>('9000'); // Default matching the master prompt example!
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [eventId, setEventId] = useState('');
  const [description, setDescription] = useState('Convention logistical supplies purchased across zonal sources');
  const [documentType, setDocumentType] = useState<'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER'>('BILL');
  const [documentNumber, setDocumentNumber] = useState('TAX-INV-2026-991');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const totalAvailable = sourceBalances.reduce((sum, s) => sum + s.availableAmount, 0);

  // Compute live simulated allocation using "HIGHER AVAILABLE SOURCE FIRST"
  const sortedSources = [...sourceBalances].sort((a, b) => b.availableAmount - a.availableAmount);
  let simulatedRemaining = numAmount;
  const simulatedAllocations = sortedSources.map((src) => {
    if (simulatedRemaining <= 0) return { ...src, usedAmount: 0, newAvailable: src.availableAmount };
    const used = Math.min(src.availableAmount, simulatedRemaining);
    simulatedRemaining -= used;
    return {
      ...src,
      usedAmount: used,
      newAvailable: src.availableAmount - used,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    if (numAmount > totalAvailable) {
      setErrorMsg(`Amount ₹${numAmount.toLocaleString('en-IN')} exceeds total available across all sources (₹${totalAvailable.toLocaleString('en-IN')}).`);
      return;
    }

    try {
      setIsSubmitting(true);
      await onRecordMultiSource({
        personL4Id,
        amount: numAmount,
        categoryId,
        eventId: eventId || undefined,
        description,
        documentType,
        documentNumber,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to record expense');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Multi-Source Expense Allocation</h3>
              <p className="text-xs text-slate-400">Expense split across sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Level 4 Person
              </label>
              <select
                value={personL4Id}
                onChange={(e) => setPersonL4Id(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {l4Users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Total Expense Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Higher Available Source First Live Allocation Simulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Source Allocation</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                Higher Source First
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              {simulatedAllocations.map((src) => (
                <div key={src.id} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11.5px]">{src.fundName}</span>
                    <span className="text-[10.5px] text-slate-500">
                      Available: ₹{src.availableAmount.toLocaleString('en-IN')} → After: <strong className="font-mono text-slate-700">₹{src.newAvailable.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">Allocated</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      -₹{src.usedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {simulatedRemaining > 0 && (
              <div className="text-[11px] text-rose-600 font-semibold">
                Shortfall across all sources: ₹{simulatedRemaining.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parentGroup} &rarr; {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Event
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900"
              >
                <option value="">-- No Event --</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Description / Voucher Details
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || numAmount > totalAvailable || numAmount <= 0}
              className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors ${
                numAmount > totalAvailable || numAmount <= 0
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSubmitting ? 'Recording...' : `Record Expense ₹${numAmount.toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
