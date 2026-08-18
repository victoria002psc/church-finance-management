import React, { useState } from 'react';
import {
  IndianRupee,
  Send,
  Building,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  PlusCircle,
  CreditCard
} from 'lucide-react';
import { L2DashboardData } from '../../../types.ts';
import { Level2Tab } from '../Level2Sidebar.tsx';
import { DetailDrawer } from '../../common/DetailDrawer.tsx';

interface Level2OverviewViewProps {
  data: L2DashboardData;
  onNavigateTab: (tab: Level2Tab) => void;
  onOpenDisburseModal: () => void;
  onOpenDirectL4Modal: () => void;
  onOpenCreateL3Modal: () => void;
}

export const Level2OverviewView: React.FC<Level2OverviewViewProps> = ({
  data,
  onNavigateTab,
  onOpenDisburseModal,
  onOpenDirectL4Modal,
  onOpenCreateL3Modal,
}) => {
  const {
    currentL2User,
    centralAllocatedBudget = 0,
    centralAvailableBalance = 0,
    centralDisbursedToL3 = 0,
    centralDirectL4Paid = 0,
    centralExpensesPaid = 0,
    pendingL1AcknowledgementsCount = 0,
    ocrMismatchesCount = 0,
    supervisedL3Overseers = [],
    disbursedToL3History = [],
  } = data || {};

  const [selectedL3Drawer, setSelectedL3Drawer] = useState<any | null>(null);

  const totalSpent = (centralDirectL4Paid || 0) + (centralExpensesPaid || 0);
  const totalReceivedFromL1 = centralAllocatedBudget || 0;

  return (
    <div id="level2-overview-view" className="space-y-6 animate-in fade-in duration-200">
      
      {/* SECTION 1 — MONEY POSITION (EXACTLY 4 METRICS MAXIMUM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Available */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Balance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
            ₹{(centralAvailableBalance || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Controlled L2 liquidity
          </div>
        </div>

        {/* Metric 2: Received */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Received from L1</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2 font-mono">
            ₹{(totalReceivedFromL1 || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Approved L1 Synod budget
          </div>
        </div>

        {/* Metric 3: Allocated */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allocated to L3</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 font-mono">
            ₹{(centralDisbursedToL3 || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Disbursed to field overseers
          </div>
        </div>

        {/* Metric 4: Spent */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Spent</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            ₹{(totalSpent || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-medium">
            Direct L4 & department expenses
          </div>
        </div>

      </div>

      {/* SECTION 2 — NEEDS ACTION (Compact Action List) */}
      {(pendingL1AcknowledgementsCount || 0) > 0 || (ocrMismatchesCount || 0) > 0 ? (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Needs Action</h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                {(pendingL1AcknowledgementsCount || 0) > 0 && `${pendingL1AcknowledgementsCount} Level 1 grant(s) pending formal acknowledgement. `}
                {(ocrMismatchesCount || 0) > 0 && `${ocrMismatchesCount} OCR receipt mismatch alert(s) requiring verification.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab(pendingL1AcknowledgementsCount > 0 ? 'l1-payments' : 'expenses')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <span>Review Actions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>All Level 2 allocations and acknowledgements are up to date. No pending actions.</span>
        </div>
      )}

      {/* SECTION 3 — LEVEL 3 FUNDING (Compact Table) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Level 3 Overseer Funding</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Supervising {(supervisedL3Overseers || []).length} active Level 3 Field Overseers
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              id="l2-disburse-to-l3-btn"
              onClick={onOpenDisburseModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Disburse to Level 3</span>
            </button>
            <button
              onClick={onOpenCreateL3Modal}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Level 3 Overseer / Department</th>
                <th className="py-2.5 px-3 text-right">Allocated Budget</th>
                <th className="py-2.5 px-3 text-right">Disbursed (Money Given)</th>
                <th className="py-2.5 px-3 text-right">Available Balance</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(supervisedL3Overseers || []).map((l3: any) => (
                <tr key={l3.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{l3.name || 'Overseer'}</div>
                    <div className="text-[11px] text-slate-500">{l3.assignedArea || 'Jurisdiction'}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 font-semibold">
                    ₹{(l3.totalAllocatedFromL2 ?? l3.sourceAllocationsFromThisL2 ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-emerald-600 font-semibold">
                    ₹{(l3.totalGivenFromL2 ?? l3.sourceAllocationsFromThisL2 ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-900 font-bold">
                    ₹{(l3.currentAvailableBalance ?? l3.currentOverseerBalance ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedL3Drawer(l3)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 — MONEY FLOW (Visual 4-Step Flow) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <span>Division Money Flow Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-blue-700 uppercase">Received from L1</div>
            <div className="text-base font-bold text-blue-600 font-mono">₹{totalReceivedFromL1.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-emerald-700 uppercase">Available</div>
            <div className="text-base font-bold text-emerald-600 font-mono">₹{centralAvailableBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-amber-700 uppercase">Allocated to L3</div>
            <div className="text-base font-bold text-amber-600 font-mono">₹{centralDisbursedToL3.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-slate-700 uppercase">Direct Paid</div>
            <div className="text-base font-bold text-slate-900 font-mono">₹{totalSpent.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* SECTION 5 — RECENT FINANCIAL ACTIVITY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Financial Movements</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {(disbursedToL3History || []).slice(0, 5).map((disb: any) => (
            <div key={disb.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">Disbursed to {disb.toL3Name || 'Overseer'}</span>
                <span className="text-slate-500 ml-2 font-medium">{disb.purpose || disb.remarks || ''}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600 font-mono">₹{(disb.amount || 0).toLocaleString('en-IN')}</span>
                <div className="text-[10px] text-slate-400 font-mono">{disb.timestamp || disb.date || ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEVEL 3 OVERSEER DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedL3Drawer}
        onClose={() => setSelectedL3Drawer(null)}
        title={selectedL3Drawer?.name || 'Overseer Details'}
        subtitle={`Jurisdiction: ${selectedL3Drawer?.assignedArea || ''}`}
      >
        {selectedL3Drawer && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-emerald-800 uppercase">Fund Allocation Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Total Allocated</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    ₹{(selectedL3Drawer.totalAllocatedFromL2 ?? selectedL3Drawer.sourceAllocationsFromThisL2 ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Money Given</div>
                  <div className="text-sm font-bold text-emerald-600 font-mono">
                    ₹{(selectedL3Drawer.totalGivenFromL2 ?? selectedL3Drawer.sourceAllocationsFromThisL2 ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Available</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    ₹{(selectedL3Drawer.currentAvailableBalance ?? selectedL3Drawer.currentOverseerBalance ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Overseer Identity</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 font-medium">
                <div><span className="font-semibold text-slate-900">Name:</span> {selectedL3Drawer.name}</div>
                <div><span className="font-semibold text-slate-900">Email:</span> {selectedL3Drawer.email}</div>
                <div><span className="font-semibold text-slate-900">Designation:</span> {selectedL3Drawer.designation}</div>
                <div><span className="font-semibold text-slate-900">Area:</span> {selectedL3Drawer.assignedArea}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedL3Drawer(null);
                onOpenDisburseModal();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Disburse Funds to {selectedL3Drawer.name}
            </button>
          </div>
        )}
      </DetailDrawer>

    </div>
  );
};
