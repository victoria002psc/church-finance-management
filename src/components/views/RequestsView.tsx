import React, { useState } from 'react';
import { MoneyRequest } from '../../types.ts';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Search, 
  AlertCircle, 
  FileText, 
  User, 
  Calendar,
  Layers
} from 'lucide-react';

interface RequestsViewProps {
  requests: MoneyRequest[];
  onOpenReviewRequest: (request: MoneyRequest) => void;
  onOpenTrace: (item: any, type: 'REQUEST') => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  onOpenReviewRequest,
  onOpenTrace,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'REQUESTED' | 'APPROVED' | 'MONEY_GIVEN' | 'REJECTED'>('ALL');

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === 'REQUESTED').length;
  const approvedNotGivenCount = requests.filter((r) => r.status === 'APPROVED').length;
  const givenCount = requests.filter((r) => r.status === 'MONEY_GIVEN').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Inbox className="w-4 h-4" />
          <span>Money Requests Inbox & Approvals</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900">
          Level 4 Money Requests Management
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Rule 9, 11 & 13: Request Money &ne; Expense. Approval &ne; Money Given. Level 3 may approve a request and disburse funds later when source balances are ready.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Requests ({requests.length})
          </button>

          <button
            onClick={() => setFilter('REQUESTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              filter === 'REQUESTED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              filter === 'APPROVED'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved &mdash; Awaiting Money ({approvedNotGivenCount})</span>
          </button>

          <button
            onClick={() => setFilter('MONEY_GIVEN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              filter === 'MONEY_GIVEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Money Given ({givenCount})</span>
          </button>

          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              filter === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:border-stone-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-stone-900">{req.requesterName}</span>
                <span className="text-xs text-stone-500 font-medium">({req.requesterDesignation})</span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    req.status === 'REQUESTED'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : req.status === 'APPROVED'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : req.status === 'MONEY_GIVEN'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {req.status === 'APPROVED' ? 'APPROVED — MONEY NOT YET GIVEN' : req.status}
                </span>
                <span className="text-xs font-mono text-stone-400">#{req.id}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                <span>Category: <strong className="text-stone-800">{req.categoryName}</strong></span>
                {req.eventName && <span>Event: <strong className="text-stone-800">{req.eventName}</strong></span>}
                <span>Requested: <strong>{new Date(req.requestedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs text-stone-700">
                <span className="text-stone-400 font-semibold uppercase text-[10px] block mb-0.5">Remarks:</span>
                "{req.remarks || 'No remarks specified.'}"
              </div>

              {/* Status specific context */}
              {req.status === 'APPROVED' && (
                <div className="text-[11.5px] text-sky-800 bg-sky-50 p-2 rounded border border-sky-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>Approved by {req.approvedByName} on {new Date(req.approvedAt || '').toLocaleDateString('en-IN')}. Actual money not yet given (balances untouched).</span>
                </div>
              )}

              {req.status === 'MONEY_GIVEN' && (
                <div className="text-[11.5px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Disbursed from <strong className="text-emerald-900">{req.sourceL2Name || 'Level 2 Source'}</strong> on {new Date(req.givenAt || '').toLocaleDateString('en-IN')}.</span>
                </div>
              )}

              {req.status === 'REJECTED' && (
                <div className="text-[11.5px] text-rose-800 bg-rose-50 p-2 rounded border border-rose-200 flex items-center space-x-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span>Rejection Reason: {req.rejectionReason}</span>
                </div>
              )}
            </div>

            {/* Right side amount & CTAs */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block text-left md:text-right">Requested</span>
                <span className="font-mono font-black text-2xl text-stone-900">
                  ₹{req.amount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenTrace(req, 'REQUEST')}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 border border-stone-200"
                  title="Trace (Rule 55)"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  id={`review-request-action-${req.id}`}
                  onClick={() => onOpenReviewRequest(req)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors ${
                    req.status === 'REQUESTED'
                      ? 'bg-stone-900 hover:bg-stone-800 text-white'
                      : req.status === 'APPROVED'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                  }`}
                >
                  <span>
                    {req.status === 'REQUESTED'
                      ? 'Review & Decide'
                      : req.status === 'APPROVED'
                      ? 'Disburse Money Now'
                      : 'View Request'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-stone-200 text-stone-400 text-xs">
            No money requests found in this filter category.
          </div>
        )}
      </div>
    </div>
  );
};
