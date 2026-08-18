import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  Clock,
  UserCheck,
  FileCheck
} from 'lucide-react';
import { L2DashboardData, L1DirectPayment } from '../../../types.ts';

interface Level2L1PaymentsViewProps {
  data: L2DashboardData;
  onAcknowledgeL1: (paymentId: string) => Promise<void>;
}

export const Level2L1PaymentsView: React.FC<Level2L1PaymentsViewProps> = ({
  data,
  onAcknowledgeL1,
}) => {
  const { currentL2User, l1DirectPayments } = data;

  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAcknowledge = async (paymentId: string) => {
    try {
      setAcknowledgingId(paymentId);
      setErrorMsg(null);
      setSuccessMsg(null);
      await onAcknowledgeL1(paymentId);
      setSuccessMsg('Successfully acknowledged Level 1 direct grant. Accountability record has been saved.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to acknowledge grant.');
    } finally {
      setAcknowledgingId(null);
    }
  };

  const pendingPayments = l1DirectPayments.filter((p) => !p.isAcknowledgedByL2);
  const acknowledgedPayments = l1DirectPayments.filter((p) => p.isAcknowledgedByL2);

  return (
    <div id="level2-l1-payments-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              LEVEL 1 DIRECT GRANTS
            </span>
            <span className="text-xs text-slate-400">Governance & Acknowledgement Center</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Level 1 Direct Payments & Acknowledgements
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            When Senior Bishops (Level 1) pay Level 3 or Level 4 directly, the payer remains Level 1. Level 2 reviews and acknowledges the grant.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-lg p-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Pending Acks</div>
            <div className="text-lg font-bold text-amber-400">
              {pendingPayments.length} Grant{pendingPayments.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pending Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Level 2 Acknowledgements ({pendingPayments.length})</span>
        </h2>

        {pendingPayments.length === 0 ? (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200">All Level 1 Grants Acknowledged</p>
            <p className="text-xs text-slate-400 mt-1">There are no outstanding Level 1 direct payments awaiting Level 2 acknowledgement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingPayments.map((pay) => (
              <div
                key={pay.id}
                className="bg-amber-950/20 border border-amber-800/60 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                      AWAITING ACKNOWLEDGEMENT
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">Ref: {pay.transactionRef}</span>
                  </div>

                  <div className="text-sm font-bold text-slate-100">
                    {pay.fromL1Name} → <span className="text-emerald-400">{pay.toUserName}</span>
                  </div>

                  <p className="text-slate-300 max-w-xl">{pay.purpose}</p>

                  <div className="text-[11px] text-slate-400">
                    Disbursed on {new Date(pay.date).toLocaleDateString('en-IN')} • Recipient Tier: {pay.toUserRole}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                  <div className="text-xl font-bold text-amber-400">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </div>
                  <button
                    id={`ack-l1-btn-${pay.id}`}
                    onClick={() => handleAcknowledge(pay.id)}
                    disabled={acknowledgingId === pay.id}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{acknowledgingId === pay.id ? 'Saving...' : 'Acknowledge Grant'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acknowledged History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Acknowledged Level 1 Grants Archive</span>
        </h2>

        {acknowledgedPayments.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No acknowledged grants in archive.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Level 1 Giver</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Acknowledged By</th>
                  <th className="py-2.5 px-3">Purpose & Ref</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {acknowledgedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(p.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-100">
                      {p.fromL1Name}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-emerald-400">
                      {p.toUserName} ({p.toUserRole})
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div className="font-semibold text-slate-200">{p.acknowledgedByName || currentL2User.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.acknowledgedAt ? new Date(p.acknowledgedAt).toLocaleDateString('en-IN') : 'Verified'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <div>{p.purpose}</div>
                      <div className="text-[10px] font-mono text-slate-500">{p.transactionRef}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-400">
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
