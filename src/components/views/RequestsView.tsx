import React, { useState } from 'react';
import { MoneyRequest } from '../../types.ts';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Eye, 
  Send,
  PlusCircle
} from 'lucide-react';
import { DetailDrawer } from '../common/DetailDrawer.tsx';

interface RequestsViewProps {
  requests: MoneyRequest[];
  onOpenReviewRequest: (request: MoneyRequest) => void;
  onOpenTrace: (item: any, type: 'REQUEST') => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests = [],
  onOpenReviewRequest,
  onOpenTrace,
}) => {
  const [selectedRequestDrawer, setSelectedRequestDrawer] = useState<MoneyRequest | null>(null);

  const totalRequested = (requests || []).reduce((sum, r) => sum + (r.amount || 0), 0);
  const pendingCount = (requests || []).filter(r => r.status === 'REQUESTED').length;
  const approvedCount = (requests || []).filter(r => r.status === 'APPROVED').length;
  const moneyGivenCount = (requests || []).filter(r => r.status === 'MONEY_GIVEN').length;

  return (
    <div id="level3-requests-view" className="space-y-4 animate-in fade-in duration-150">
      
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#171717] tracking-tight">
            Money Requests
          </h1>
          <p className="text-xs text-[#5F6368] font-medium mt-0.5">
            Approvals & disbursements
          </p>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Total Requested</div>
          <div className="text-base font-extrabold text-[#171717] font-mono mt-0.5 tabular-nums">
            ₹{totalRequested.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Pending Approval</div>
          <div className="text-base font-extrabold text-[#2563EB] mt-0.5">
            {pendingCount}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Approved</div>
          <div className="text-base font-extrabold text-[#F59E0B] mt-0.5">
            {approvedCount}
          </div>
        </div>

        <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl text-center shadow-2xs">
          <div className="text-[10px] font-bold text-[#5F6368] uppercase">Money Given</div>
          <div className="text-base font-extrabold text-[#009E68] mt-0.5">
            {moneyGivenCount}
          </div>
        </div>
      </div>

      {/* REQUESTS LIST WITH STAGE STEPPERS */}
      <div className="bg-white border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
        <h2 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
          <Inbox className="w-4 h-4 text-[#009E68]" />
          <span>All Requests</span>
        </h2>

        <div className="space-y-2.5">
          {(requests || []).map((req) => (
            <div key={req.id} className="p-3.5 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-[#171717] truncate">{req.purpose || req.remarks || 'Field Request'}</div>
                  <div className="text-[10px] text-[#5F6368]">
                    Submitted by <strong>{req.requesterName || 'Field Worker'}</strong> &bull; {req.requestedAt || req.date}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 font-mono tabular-nums">
                  <div className="font-extrabold text-sm text-[#171717]">₹{(req.amount || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Connected Stage Stepper Pipeline */}
              <div className="pt-2 border-t border-[#EBE6DD] flex items-center justify-between text-[10px]">
                <div className="flex items-center space-x-1 font-bold text-[#2563EB]">
                  <span>1. Requested</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#7A7A7A]" />
                <div className={`flex items-center space-x-1 font-bold ${
                  req.status === 'APPROVED' || req.status === 'MONEY_GIVEN' ? 'text-[#F59E0B]' : 'text-[#7A7A7A]'
                }`}>
                  <span>2. Approved</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#7A7A7A]" />
                <div className={`flex items-center space-x-1 font-bold ${
                  req.status === 'MONEY_GIVEN' ? 'text-[#009E68]' : 'text-[#7A7A7A]'
                }`}>
                  <span>3. Money Given</span>
                </div>

                <div className="flex items-center space-x-1.5 ml-2">
                  <button
                    onClick={() => onOpenReviewRequest(req)}
                    className="px-2.5 py-1 bg-[#24152F] hover:bg-[#30203D] text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => setSelectedRequestDrawer(req)}
                    className="px-2 py-1 bg-white border border-[#E7E2D8] hover:bg-[#F7F5F0] rounded text-[10px] font-bold text-[#171717] cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-[#5F6368]" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUEST DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedRequestDrawer}
        onClose={() => setSelectedRequestDrawer(null)}
        title={selectedRequestDrawer?.purpose || 'Request Details'}
        subtitle={`Request ID: ${selectedRequestDrawer?.id || ''}`}
      >
        {selectedRequestDrawer && (
          <div className="space-y-5 text-xs text-[#171717]">
            <div className="p-4 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-xl space-y-1">
              <div className="text-[10px] font-bold text-[#2563EB] uppercase">Requested Amount</div>
              <div className="text-xl font-extrabold text-[#171717] font-mono tabular-nums">
                ₹{(selectedRequestDrawer.amount || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-1.5 p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl">
              <div><span className="font-semibold">Requester:</span> {selectedRequestDrawer.requesterName}</div>
              <div><span className="font-semibold">Status:</span> <strong className="text-[#2563EB]">{selectedRequestDrawer.status}</strong></div>
              <div><span className="font-semibold">Date Submitted:</span> {selectedRequestDrawer.requestedAt || selectedRequestDrawer.date}</div>
              {selectedRequestDrawer.categoryName && <div><span className="font-semibold">Category:</span> {selectedRequestDrawer.categoryName}</div>}
              {selectedRequestDrawer.eventName && <div><span className="font-semibold">Event:</span> {selectedRequestDrawer.eventName}</div>}
            </div>

            <button
              onClick={() => {
                const r = selectedRequestDrawer;
                setSelectedRequestDrawer(null);
                onOpenReviewRequest(r);
              }}
              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Review Request
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
