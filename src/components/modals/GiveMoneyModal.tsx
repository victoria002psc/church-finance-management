import React, { useState } from 'react';
import { User, SourceBalance, ConfiguredEvent, ConfiguredCategory } from '../../types.ts';
import { X, Send, AlertCircle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

interface GiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  l4Users: User[];
  sourceBalances: SourceBalance[];
  events: ConfiguredEvent[];
  categories: ConfiguredCategory[];
  onGiveMoney: (data: {
    receiverL4Id: string;
    amount: number;
    sourceBalanceId: string;
    eventId?: string;
    categoryId: string;
    purpose?: string;
  }) => Promise<void>;
}

export const GiveMoneyModal: React.FC<GiveMoneyModalProps> = ({
  isOpen,
  onClose,
  l4Users,
  sourceBalances,
  events,
  categories,
  onGiveMoney,
}) => {
  const [receiverL4Id, setReceiverL4Id] = useState(l4Users[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [sourceBalanceId, setSourceBalanceId] = useState(sourceBalances[0]?.id || '');
  const [eventId, setEventId] = useState<string>('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const numAmount = Number(amount) || 0;
  const selectedSource = sourceBalances.find((s) => s.id === sourceBalanceId);
  const selectedReceiver = l4Users.find((u) => u.id === receiverL4Id);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedEvent = events.find((e) => e.id === eventId);

  const isOverdrawn = selectedSource ? numAmount > selectedSource.availableAmount : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!receiverL4Id) {
      setErrorMsg('Please select a recipient Level 4 person.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }
    if (!sourceBalanceId) {
      setErrorMsg('Please select a source balance.');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Please select an expense category.');
      return;
    }
    if (isOverdrawn) {
      setErrorMsg(
        `Amount ₹${numAmount.toLocaleString('en-IN')} exceeds available balance in ${selectedSource?.sourceL2Name} (₹${selectedSource?.availableAmount.toLocaleString('en-IN')}). Overdraft is not permitted without explicit business approval.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await onGiveMoney({
        receiverL4Id,
        amount: numAmount,
        sourceBalanceId,
        eventId: eventId || undefined,
        categoryId,
        purpose: purpose.trim() || `Allocation for ${selectedCategory?.name || 'field requirements'}`,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to disburse money');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Give Money (Level 3 &rarr; Level 4)</h3>
              <p className="text-xs text-slate-400">Authoritative disbursement with preserved source origin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-stone-800">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start space-x-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Transaction Error: </strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Recipient */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              1. Recipient (Level 4 Person) <span className="text-rose-500">*</span>
            </label>
            <select
              id="give-money-recipient"
              value={receiverL4Id}
              onChange={(e) => setReceiverL4Id(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
              required
            >
              {l4Users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} &bull; {u.designation} ({u.assignedArea})
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Source in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                2. Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-400 font-bold text-sm">₹</span>
                <input
                  id="give-money-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Source Balance */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                3. Source Balance (Level 2) <span className="text-rose-500">*</span>
              </label>
              <select
                id="give-money-source"
                value={sourceBalanceId}
                onChange={(e) => setSourceBalanceId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
                required
              >
                {sourceBalances.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fundName} (Avail: ₹{s.availableAmount.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source Balance Live Indicator */}
          {selectedSource && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                isOverdrawn
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              }`}
            >
              <div>
                <span className="font-semibold">{selectedSource.sourceL2Name}</span>
                <div className="text-[11px] text-stone-600">
                  Current Available: <span className="font-mono font-bold">₹{selectedSource.availableAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-stone-500 block">Balance After Transfer</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    isOverdrawn ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  ₹{(selectedSource.availableAmount - numAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Category & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                4. Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="give-money-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.parentGroup} &rarr; {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                5. Event (Optional)
              </label>
              <select
                id="give-money-event"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
              >
                <option value="">-- No Specific Event --</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose / Remarks */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              6. Purpose & Remarks
            </label>
            <textarea
              id="give-money-purpose"
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Advance for field inspection travel and vehicle maintenance"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Trace summary */}
          <div className="bg-stone-100 p-3 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              This movement will be logged in the immutable audit trail with source allocation retained.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-give-money-btn"
              type="submit"
              disabled={isSubmitting || isOverdrawn || numAmount <= 0}
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg flex items-center space-x-2 shadow-sm transition-all ${
                isOverdrawn || numAmount <= 0
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : `Disburse ₹${numAmount.toLocaleString('en-IN')}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
