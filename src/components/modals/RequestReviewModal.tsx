import React, { useState } from 'react';
import { MoneyRequest, SourceBalance } from '../../types.ts';
import { 
  X, 
  CheckCircle2, 
  Send, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Clock, 
  Info,
  Layers
} from 'lucide-react';

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MoneyRequest | null;
  sourceBalances: SourceBalance[];
  onApprove: (data: {
    requestId: string;
    actionType: 'APPROVE_ONLY' | 'APPROVE_AND_GIVE';
    sourceBalanceId?: string;
  }) => Promise<void>;
  onGiveLater: (data: { requestId: string; sourceBalanceId: string }) => Promise<void>;
  onReject: (data: { requestId: string; reason: string }) => Promise<void>;
}

export const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  isOpen,
  onClose,
  request,
  sourceBalances,
  onApprove,
  onGiveLater,
  onReject,
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState(sourceBalances[0]?.id || '');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !request) return null;

  const selectedSource = sourceBalances.find((s) => s.id === selectedSourceId);
  const isOverdrawn = selectedSource ? request.amount > selectedSource.availableAmount : false;

  const handleApproveOnly = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onApprove({
        requestId: request.id,
        actionType: 'APPROVE_ONLY',
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to approve request');
    }
  };

  const handleApproveAndGive = async () => {
    if (!selectedSourceId) {
      setErrorMsg('Please select a Level 2 source balance to disburse from.');
      return;
    }
    if (isOverdrawn) {
      setErrorMsg(`Insufficient funds in ${selectedSource?.fundName}. You can use 'Approve Only' to approve now and give money later when funds are available.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onApprove({
        requestId: request.id,
        actionType: 'APPROVE_AND_GIVE',
        sourceBalanceId: selectedSourceId,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to disburse request');
    }
  };

  const handleGiveLaterSubmit = async () => {
    if (!selectedSourceId) {
      setErrorMsg('Please select a Level 2 source balance.');
      return;
    }
    if (isOverdrawn) {
      setErrorMsg(`Insufficient funds in ${selectedSource?.fundName}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onGiveLater({
        requestId: request.id,
        sourceBalanceId: selectedSourceId,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to disburse approved request');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      setErrorMsg('Please provide a reason for rejecting the request.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onReject({
        requestId: request.id,
        reason: rejectReason.trim(),
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to reject request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Money Request #{request.id}</h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    request.status === 'REQUESTED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : request.status === 'APPROVED'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : request.status === 'MONEY_GIVEN'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {request.status === 'APPROVED' ? 'APPROVED — MONEY NOT YET GIVEN' : request.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Level 3 Single-Surface Request Review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Review Error: </strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Request Details Grid */}
        <div className="p-6 space-y-4 text-stone-800">
          {/* Main Amount Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Requested Amount
              </span>
              <span className="text-2xl font-black font-mono text-stone-900">
                ₹{request.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-stone-500 uppercase block">Submission Date</span>
              <span className="text-xs font-mono font-medium text-stone-700">
                {new Date(request.requestedAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50/80 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Level 4 Requester</span>
              </div>
              <div className="font-bold text-stone-900">{request.requesterName}</div>
              <div className="text-[11px] text-stone-600">{request.requesterDesignation}</div>
            </div>

            <div className="bg-stone-50/80 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                <span>Category & Event</span>
              </div>
              <div className="font-bold text-stone-900">{request.categoryName}</div>
              <div className="text-[11px] text-stone-600">
                {request.eventName ? `Event: ${request.eventName}` : 'No Specific Event'}
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-stone-50/80 p-3.5 rounded-lg border border-stone-200 text-xs">
            <div className="text-stone-500 font-semibold mb-1 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Requester Remarks / Justification</span>
            </div>
            <p className="text-stone-800 leading-relaxed font-medium">
              "{request.remarks || 'No remarks provided.'}"
            </p>
          </div>

          {/* If already Approved or Giving Now, Source Selection */}
          {(request.status === 'REQUESTED' || request.status === 'APPROVED') && !isRejecting && (
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Level 2 Source Balance for Disbursement
              </label>
              <select
                id="request-source-select"
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden font-medium"
              >
                {sourceBalances.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fundName} &bull; Available: ₹{s.availableAmount.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>

              {selectedSource && (
                <div className="text-[11px] flex items-center justify-between text-slate-600 pt-1">
                  <span>Available in Source: <strong className="font-mono">₹{selectedSource.availableAmount.toLocaleString('en-IN')}</strong></span>
                  <span>Balance after transfer: <strong className={`font-mono ${isOverdrawn ? 'text-rose-600' : 'text-emerald-700'}`}>₹{(selectedSource.availableAmount - request.amount).toLocaleString('en-IN')}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Undefined Partial Disbursement Explicit Rule Notice */}
          <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg text-[10.5px] text-amber-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Business Rule Discipline: </strong>
              <span>REQUEST MONEY &ne; EXPENSE &bull; APPROVAL &ne; MONEY GIVEN &bull; UNDEFINED — PARTIAL DISBURSEMENT BUSINESS RULE (Partial payments prohibited).</span>
            </div>
          </div>

          {/* Rejection Input Box if triggered */}
          {isRejecting && (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg space-y-2">
              <label className="block text-xs font-bold text-rose-900 uppercase tracking-wider">
                Rejection Reason (Recorded in Audit Log) <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="rejection-reason-input"
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State the financial or operational reason for rejection..."
                className="w-full bg-white border border-rose-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
              />
              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancel Rejection
                </button>
                <button
                  id="confirm-reject-request-btn"
                  type="button"
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting || !rejectReason.trim()}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          )}

          {/* Actions Footer */}
          {!isRejecting && (
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Request</span>
              </button>

              <div className="flex items-center space-x-2">
                {request.status === 'REQUESTED' && (
                  <>
                    {/* Approve Only (Money Not Yet Given) */}
                    <button
                      id="approve-only-btn"
                      type="button"
                      onClick={handleApproveOnly}
                      disabled={isSubmitting}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5"
                      title="Approves request without moving money. Balances remain untouched until disbursement."
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      <span>Approve Only (Give Later)</span>
                    </button>

                    {/* Approve & Give Immediately */}
                    <button
                      id="approve-and-give-btn"
                      type="button"
                      onClick={handleApproveAndGive}
                      disabled={isSubmitting || isOverdrawn}
                      className={`px-4 py-2 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 transition-colors ${
                        isOverdrawn
                          ? 'bg-stone-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                      title="Approves and executes immediate balance deduction from selected source"
                    >
                      <Send className="w-4 h-4" />
                      <span>Approve & Give Now</span>
                    </button>
                  </>
                )}

                {request.status === 'APPROVED' && (
                  <button
                    id="give-money-later-btn"
                    type="button"
                    onClick={handleGiveLaterSubmit}
                    disabled={isSubmitting || isOverdrawn}
                    className={`px-4 py-2 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 transition-colors ${
                      isOverdrawn
                        ? 'bg-stone-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Disburse Money Now</span>
                  </button>
                )}

                {request.status === 'MONEY_GIVEN' && (
                  <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Disbursed from {request.sourceL2Name || 'Level 2 Source'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
