import React, { useState } from 'react';
import { 
  Send, 
  IndianRupee, 
  CheckCircle2, 
  Building2, 
  Users, 
  FileText, 
  History, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { L2DashboardData, User } from '../../../types.ts';

interface Level2DisburseViewProps {
  data: L2DashboardData;
  onDisburse: (data: { toL3Id: string; amount: number; purpose?: string; transactionRef?: string }) => Promise<void>;
}

export const Level2DisburseView: React.FC<Level2DisburseViewProps> = ({
  data,
  onDisburse,
}) => {
  const { currentL2User, centralAvailableBalance, supervisedL3Overseers, disbursedToL3History } = data;

  const [selectedL3Id, setSelectedL3Id] = useState<string>(supervisedL3Overseers[0]?.id || '');
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [customRef, setCustomRef] = useState<string>(`CHU-L2-DISB-${Date.now().toString().slice(-4)}`);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedL3 = supervisedL3Overseers.find((u) => u.id === selectedL3Id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const numAmount = Number(amount);
    if (!selectedL3Id) {
      setErrorMessage('Please select a Level 3 Overseer.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive disbursement amount.');
      return;
    }
    if (numAmount > centralAvailableBalance) {
      setErrorMessage(`Disbursement amount exceeds central available balance (₹${centralAvailableBalance.toLocaleString('en-IN')}).`);
      return;
    }

    try {
      setLoading(true);
      await onDisburse({
        toL3Id: selectedL3Id,
        amount: numAmount,
        purpose: purpose || `Central fund allocation for ${selectedL3?.assignedArea || 'Parish Operations'}`,
        transactionRef: customRef,
      });

      setSuccessMessage(`Successfully disbursed ₹${numAmount.toLocaleString('en-IN')} to ${selectedL3?.name}. The recipient now has this amount in their dedicated Level 3 source balance.`);
      setAmount('');
      setPurpose('');
      setCustomRef(`CHU-L2-DISB-${Date.now().toString().slice(-4)}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to disburse funds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="level2-disburse-view" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
              INTER-TIER DISBURSEMENT
            </span>
            <span className="text-xs text-slate-400">Level 2 → Level 3 Allocation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Disburse Funds to Level 3 Field Overseers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Disbursements transfer central budget into dedicated, isolated source balances managed by each Level 3 Overseer.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-right">
          <div className="text-[11px] text-slate-400">Central Available Balance</div>
          <div className="text-lg font-bold text-emerald-400">
            ₹{centralAvailableBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Overseer Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>New Central Fund Disbursement</span>
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
            
            {/* Overseer Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Level 3 Field Overseer *
              </label>
              <select
                id="disburse-l3-target-select"
                value={selectedL3Id}
                onChange={(e) => setSelectedL3Id(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                required
              >
                {supervisedL3Overseers.map((l3) => (
                  <option key={l3.id} value={l3.id}>
                    {l3.name} — {l3.designation} ({l3.assignedArea})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount and Ref Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Disbursement Amount (₹) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                  <input
                    id="disburse-amount-input"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction / Banking Reference *
                </label>
                <input
                  id="disburse-ref-input"
                  type="text"
                  value={customRef}
                  onChange={(e) => setCustomRef(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Disbursement Purpose / Diocesan Mandate
              </label>
              <textarea
                id="disburse-purpose-input"
                rows={2}
                placeholder="e.g., Zonal parish outreach operations and pastoral support for August 2026."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-disburse-btn"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Processing Transfer...' : 'Authorize & Disburse Funds to Level 3'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right 1 Col: Recipient Snapshot */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Recipient Snapshot
          </h3>

          {selectedL3 ? (
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700/40 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-200">
                  {selectedL3.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{selectedL3.name}</h4>
                  <p className="text-[11px] text-slate-400">{selectedL3.designation}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-700/80">
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Jurisdiction:</span>
                  <span className="font-medium text-slate-200">{selectedL3.assignedArea}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phone:</span>
                  <span className="font-medium text-slate-200">{selectedL3.phone}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Funds Received:</span>
                  <span className="font-bold text-emerald-400">
                    ₹{selectedL3.currentOverseerBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>From You ({currentL2User.name.split(' ')[0]}):</span>
                  <span className="font-bold text-sky-400">
                    ₹{selectedL3.sourceAllocationsFromThisL2.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />
                This money will be stored under an isolated source balance tied to your Level 2 identity, strictly preventing co-mingling.
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select an overseer to view profile details.</p>
          )}
        </div>

      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <History className="w-4 h-4 text-sky-400" />
          <span>Disbursement Audit History</span>
        </h2>

        {disbursedToL3History.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No disbursements recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Recipient Overseer</th>
                  <th className="py-2.5 px-3">Fund / Scope</th>
                  <th className="py-2.5 px-3">Reference No</th>
                  <th className="py-2.5 px-3 text-right">Amount Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {disbursedToL3History.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(item.receivedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-100">
                      {item.toL3Name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{item.fundSource}</div>
                      <div className="text-[10px] text-slate-400">{item.purpose}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {item.transactionRef}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      ₹{item.amount.toLocaleString('en-IN')}
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
