import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  Send, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  FileText, 
  LogOut, 
  PlusCircle, 
  Upload, 
  AlertCircle,
  Eye,
  ShieldCheck,
  ArrowRight,
  ArrowDownLeft,
  ChevronRight,
  FileCheck,
  Layers,
  Sparkles,
  HelpCircle,
  Info
} from 'lucide-react';
import { User, MoneyRequest, Expense } from '../../types.ts';
import { DetailDrawer } from '../common/DetailDrawer.tsx';
import { Level4Sidebar, Level4Tab } from './Level4Sidebar.tsx';

interface Level4AppProps {
  initialUser?: User;
  onLogout: () => void;
}

export const Level4App: React.FC<Level4AppProps> = ({
  initialUser = {
    id: 'usr-l4-worker1',
    name: 'Pastor John Miller',
    role: 'LEVEL_4',
    designation: 'Parish Field Worker',
    email: 'pastor.john@gracechurch.org',
    phone: '+91 98401 22334',
    assignedArea: 'Grace Parish & Project Outreach',
    createdAt: '2026-01-01',
  },
  onLogout,
}) => {
  const [currentUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<Level4Tab>('workspace');

  // Hierarchy Scope: Available L3 Overseers for Request & Acknowledgement
  const availableL3Overseers = [
    { id: 'usr-l3-overseer1', name: 'Rev. Dr. Thomas Vance', designation: 'Diocesan Regional Overseer - Region A' },
    { id: 'usr-l3-overseer2', name: 'Rev. Sarah Jenkins', designation: 'Senior Overseer - Mission & Youth Affairs' },
  ];

  // Configured Categories (Documented Financial Expense Heads)
  const configuredCategories = [
    { id: 'cat-youth', name: 'Youth Ministry & Training' },
    { id: 'cat-maint', name: 'Building & Maintenance Supplies' },
    { id: 'cat-outreach', name: 'Community Feeding & Social Service' },
    { id: 'cat-vehicle', name: 'Vehicle Running & Fuel' },
    { id: 'cat-evangelism', name: 'Evangelism & Parish Programs' },
    { id: 'cat-admin', name: 'Parish Administration & Office' },
  ];

  // Configured Events (Optional Event Context)
  const configuredEvents = [
    { id: 'none', name: 'No Event (General Parish Expense)' },
    { id: 'evt-camp-2026', name: 'Parish Youth Camp 2026' },
    { id: 'evt-convention', name: 'Diocesan Annual Convention' },
    { id: 'evt-feeding-mission', name: 'Community Feeding Mission' },
  ];

  // Financial Metrics & Multi-Source Balances
  const [sourceBalances] = useState([
    { id: 'src-l3a', l3Name: 'Rev. Dr. Thomas Vance', treasuryName: 'Region A Treasury', amount: 12000, lastDisbursed: '2026-08-10' },
    { id: 'src-l3b', l3Name: 'Rev. Sarah Jenkins', treasuryName: 'Central Mission Fund', amount: 6500, lastDisbursed: '2026-08-14' },
  ]);

  const myAvailableBalance = sourceBalances.reduce((sum, s) => sum + s.amount, 0); // ₹18,500
  const myTotalReceived = 45000;
  const myTotalSpent = 26500;

  // Proactive Work Assignments Initiated directly by L3 (Path B: L3 -> L4 Direct Work Allocation)
  const [proactiveWorkAssignments] = useState([
    {
      id: 'assign-l3-901',
      assignedByL3Name: 'Rev. Dr. Thomas Vance',
      taskTitle: 'Parish Sanitation & Water Supply Restoration',
      allocatedAmount: 8500,
      instructions: 'Procure water purification units and hire plumbing technicians for parish hall sanitation.',
      assignedDate: '2026-08-15',
      status: 'IN_PROGRESS',
    },
    {
      id: 'assign-l3-902',
      assignedByL3Name: 'Rev. Sarah Jenkins',
      taskTitle: 'Youth Camp Medical First-Aid Kit Assembly',
      allocatedAmount: 4000,
      instructions: 'Purchase certified medical kits and emergency supplies for incoming camp delegates.',
      assignedDate: '2026-08-12',
      status: 'COMPLETED',
    },
  ]);

  // L4 Money Requests (Path A: L4 -> L3 Request)
  const [requests, setRequests] = useState<MoneyRequest[]>([
    {
      id: 'req-l4-101',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: 'LEVEL_4',
      targetL3Id: 'usr-l3-overseer1',
      recipientL3Name: 'Rev. Dr. Thomas Vance',
      amount: 15000,
      purpose: 'Parish Youth Camp Equipment & Tent Supplies',
      categoryName: 'Youth Ministry & Training',
      eventId: 'evt-camp-2026',
      eventName: 'Parish Youth Camp 2026',
      status: 'MONEY_GIVEN',
      requestedAt: '2026-08-10',
      date: '2026-08-10',
      createdAt: '2026-08-10T10:00:00Z',
    },
    {
      id: 'req-l4-102',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: 'LEVEL_4',
      targetL3Id: 'usr-l3-overseer2',
      recipientL3Name: 'Rev. Sarah Jenkins',
      amount: 10000,
      purpose: 'Community Feeding Outreach Supplies',
      categoryName: 'Community Feeding & Social Service',
      status: 'APPROVED',
      requestedAt: '2026-08-14',
      date: '2026-08-14',
      createdAt: '2026-08-14T14:30:00Z',
    },
    {
      id: 'req-l4-103',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: 'LEVEL_4',
      targetL3Id: 'usr-l3-overseer1',
      recipientL3Name: 'Rev. Dr. Thomas Vance',
      amount: 5000,
      purpose: 'Emergency Sanitation Maintenance',
      categoryName: 'Building & Maintenance Supplies',
      status: 'REQUESTED',
      requestedAt: '2026-08-17',
      date: '2026-08-17',
      createdAt: '2026-08-17T09:15:00Z',
    },
  ]);

  // Expenses & Vouchers
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 'exp-l4-501',
      personL4Id: currentUser.id,
      personL4Name: currentUser.name,
      submittedByL4Id: currentUser.id,
      submittedByL4Name: currentUser.name,
      toL3Id: 'usr-l3-overseer1',
      amount: 12500,
      purpose: 'Camp Sound Equipment & Tent Rentals',
      description: 'Camp Sound Equipment & Tent Rentals',
      categoryId: 'cat-youth',
      categoryName: 'Youth Ministry & Training',
      voucherNumber: 'VOUCH-2026-88',
      documentType: 'VOUCHER',
      documentNumber: 'VOUCH-2026-88',
      receiptUrl: 'https://example.com/receipt.pdf',
      ocrResult: {
        extractedAmount: 12500,
        extractedVendor: 'Soundcraft Rentals & Tent Supplies',
        extractedDate: '2026-08-12',
        extractedInvoiceNo: 'INV-88902',
        rawTextPreview: 'INVOICE INV-88902 - Soundcraft Rentals - Total: ₹12,500',
        isMismatch: false,
        reviewStatus: 'VERIFIED',
      },
      ocrParsed: true,
      ocrMatchStatus: 'MATCHED',
      acknowledgedByL3: true,
      isAcknowledgedByL3: true,
      acknowledgedByName: 'Rev. Dr. Thomas Vance',
      date: '2026-08-12',
      sourceAllocations: [
        { sourceL3Id: 'src-l3a', sourceL3Name: 'Rev. Dr. Thomas Vance (Region A Treasury)', amount: 12500 },
      ],
      reconciliationStatus: 'MATCHED',
    },
    {
      id: 'exp-l4-502',
      personL4Id: currentUser.id,
      personL4Name: currentUser.name,
      submittedByL4Id: currentUser.id,
      submittedByL4Name: currentUser.name,
      toL3Id: 'usr-l3-overseer2',
      amount: 14000,
      purpose: 'Outreach Catering & Transportation',
      description: 'Outreach Catering & Transportation',
      categoryId: 'cat-outreach',
      categoryName: 'Community Feeding & Social Service',
      voucherNumber: 'VOUCH-2026-92',
      documentType: 'BILL',
      documentNumber: 'VOUCH-2026-92',
      receiptUrl: 'https://example.com/receipt2.pdf',
      ocrResult: {
        extractedAmount: 14000,
        extractedVendor: 'City Caterers & Bus Transport',
        extractedDate: '2026-08-16',
        extractedInvoiceNo: 'BILL-4410',
        rawTextPreview: 'BILL-4410 - City Caterers - Amount Paid: ₹14,000',
        isMismatch: false,
        reviewStatus: 'VERIFIED',
      },
      ocrParsed: true,
      ocrMatchStatus: 'MATCHED',
      acknowledgedByL3: false,
      isAcknowledgedByL3: false,
      date: '2026-08-16',
      sourceAllocations: [
        { sourceL3Id: 'src-l3b', sourceL3Name: 'Rev. Sarah Jenkins (Central Mission Fund)', amount: 14000 },
      ],
      reconciliationStatus: 'MATCHED',
    },
  ]);

  // Modals & Drawers
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [showAllocationPolicy, setShowAllocationPolicy] = useState<boolean>(false);
  const [selectedRequestDrawer, setSelectedRequestDrawer] = useState<MoneyRequest | null>(null);

  // Request Form States
  const [requestTargetL3, setRequestTargetL3] = useState<string>('usr-l3-overseer1');
  const [requestEvent, setRequestEvent] = useState<string>('none');
  const [requestCategory, setRequestCategory] = useState<string>('Youth Ministry & Training');
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [requestPurpose, setRequestPurpose] = useState<string>('');

  // 1-Screen Expense Form States
  const [expensePerson, setExpensePerson] = useState<string>(currentUser.id);
  const [expenseEvent, setExpenseEvent] = useState<string>('none');
  const [expenseCategory, setExpenseCategory] = useState<string>('cat-youth');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expensePurpose, setExpensePurpose] = useState<string>('');
  const [expenseVoucher, setExpenseVoucher] = useState<string>('');
  const [expenseAckTo, setExpenseAckTo] = useState<string>('usr-l3-overseer1');
  const [expenseRemarks, setExpenseRemarks] = useState<string>('');
  const [expenseDocAttached, setExpenseDocAttached] = useState<boolean>(true);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestAmount || Number(requestAmount) <= 0 || !requestPurpose.trim()) return;

    const targetL3Obj = availableL3Overseers.find(l => l.id === requestTargetL3);
    const eventObj = configuredEvents.find(ev => ev.id === requestEvent);

    const newReq: MoneyRequest = {
      id: `req-l4-${Date.now()}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: 'LEVEL_4',
      targetL3Id: requestTargetL3,
      recipientL3Id: requestTargetL3,
      recipientL3Name: targetL3Obj?.name || 'Level 3 Overseer',
      amount: Number(requestAmount),
      purpose: requestPurpose.trim(),
      categoryId: requestCategory,
      categoryName: requestCategory,
      eventId: requestEvent !== 'none' ? requestEvent : undefined,
      eventName: eventObj && eventObj.id !== 'none' ? eventObj.name : undefined,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setRequests([newReq, ...requests]);
    setShowRequestModal(false);
    setRequestAmount('');
    setRequestPurpose('');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0 || !expensePurpose.trim()) return;

    const catObj = configuredCategories.find(c => c.id === expenseCategory);
    const ackObj = availableL3Overseers.find(a => a.id === expenseAckTo);
    const eventObj = configuredEvents.find(ev => ev.id === expenseEvent);

    const amountNum = Number(expenseAmount);

    const newExp: Expense = {
      id: `exp-l4-${Date.now()}`,
      personL4Id: expensePerson,
      personL4Name: currentUser.name,
      submittedByL4Id: currentUser.id,
      submittedByL4Name: currentUser.name,
      toL3Id: expenseAckTo,
      amount: amountNum,
      purpose: expensePurpose.trim(),
      description: expenseRemarks.trim() || expensePurpose.trim(),
      categoryId: expenseCategory,
      categoryName: catObj?.name || 'Parish Expense',
      eventId: expenseEvent !== 'none' ? expenseEvent : undefined,
      eventName: eventObj && eventObj.id !== 'none' ? eventObj.name : undefined,
      voucherNumber: expenseVoucher.trim() || `VOUCH-${Date.now()}`,
      documentType: 'BILL',
      documentNumber: expenseVoucher.trim() || `VOUCH-${Date.now()}`,
      receiptUrl: expenseDocAttached ? 'https://example.com/uploaded-receipt.pdf' : undefined,
      ocrResult: expenseDocAttached ? {
        extractedAmount: amountNum,
        extractedVendor: 'Parish Field Vendor',
        extractedDate: new Date().toISOString().split('T')[0],
        extractedInvoiceNo: expenseVoucher.trim() || `INV-${Date.now()}`,
        rawTextPreview: `Parsed Bill - Amount: ₹${amountNum.toLocaleString('en-IN')}`,
        isMismatch: false,
        reviewStatus: 'VERIFIED',
      } : undefined,
      ocrParsed: expenseDocAttached,
      ocrMatchStatus: 'MATCHED',
      acknowledgedByL3: false,
      isAcknowledgedByL3: false,
      acknowledgedByName: ackObj?.name,
      date: new Date().toISOString().split('T')[0],
      sourceAllocations: [
        { sourceL3Id: 'src-l3a', sourceL3Name: sourceBalances[0]?.l3Name || 'Level 3 Source', amount: amountNum },
      ],
      reconciliationStatus: 'MATCHED',
    };

    setExpenses([newExp, ...expenses]);
    setShowExpenseModal(false);
    setExpenseAmount('');
    setExpensePurpose('');
    setExpenseVoucher('');
    setExpenseRemarks('');
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'REQUESTED' || r.status === 'APPROVED').length;

  return (
    <div id="level4-app-root" className="min-h-screen bg-[#F7F5F0] text-[#171717] flex flex-col font-sans">
      
      {/* HEADER BAR (Compact Header with 16px Icons) */}
      <header className="border-b border-[#30203D] bg-[#24152F] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#30203D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold">
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs tracking-tight">Parish Field Operations Workspace</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#D4AF37] text-[#24152F] rounded">
                LEVEL 4 PARISH WORKER
              </span>
            </div>
            <p className="text-[11px] text-[#F4E7B5] font-medium leading-none mt-0.5">
              {currentUser.assignedArea} &bull; <strong className="text-white">{currentUser.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="l4-new-expense-cta"
            onClick={() => setShowExpenseModal(true)}
            className="px-3 py-1.5 bg-[#009E68] hover:bg-[#009E68]/90 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Record Expense</span>
          </button>

          <button
            id="l4-request-money-cta"
            onClick={() => setShowRequestModal(true)}
            className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Request Money</span>
          </button>

          {onLogout && (
            <button
              id="l4-signout-btn"
              onClick={onLogout}
              className="flex items-center space-x-1 bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/40 text-[#E11D48] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* BODY: SIDEBAR + WORKSPACE */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left Sidebar */}
        <Level4Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingRequestsCount={pendingRequestsCount}
          onLogout={onLogout}
        />

        {/* MAIN WORKSPACE VIEW ROUTING */}
        <main className="flex-1 p-4 sm:p-5 min-w-0 overflow-y-auto bg-[#F7F5F0] space-y-4">
        
        {/* VIEW 1: WALLET & WORKSPACE OVERVIEW */}
        {activeTab === 'workspace' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            
            {/* SECTION 1 — FINANCIAL SUMMARY METRICS (Compact Height) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Available Funds</span>
                  <button
                    onClick={() => setActiveTab('sources')}
                    className="text-[10px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>{sourceBalances.length} Sources</span>
                  </button>
                </div>
                <div className="text-2xl font-extrabold text-[#009E68] font-mono mt-1">
                  ₹{myAvailableBalance.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Received</span>
                <div className="text-2xl font-extrabold text-[#009E68] font-mono mt-1">
                  ₹{myTotalReceived.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Total Spent</span>
                <div className="text-2xl font-extrabold text-[#171717] font-mono mt-1">
                  ₹{myTotalSpent.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* SECTION 2 — WORK & PROJECT ASSIGNMENTS (Ultra-Compact Operational Module) */}
            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-3.5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Work & Project Assignments</span>
                </h3>
                <span className="text-[10px] font-bold text-[#24152F] bg-[#D4AF37]/20 px-2 py-0.5 rounded-md">
                  {proactiveWorkAssignments.length} Active Tasks
                </span>
              </div>

              <div className="divide-y divide-[#E7E2D8] border border-[#E7E2D8] rounded-lg overflow-hidden bg-[#F7F5F0]">
                {proactiveWorkAssignments.map((task) => (
                  <div key={task.id} className="p-2.5 hover:bg-[#FFFDF8] transition-colors flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-[#171717] truncate">{task.taskTitle}</div>
                      <div className="text-[10px] text-[#5F6368] truncate">
                        {task.assignedByL3Name} &bull; {task.assignedDate}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="font-extrabold text-xs text-[#009E68] font-mono">
                        ₹{task.allocatedAmount.toLocaleString('en-IN')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center space-x-1 ${
                        task.status === 'COMPLETED' ? 'bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30' : 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{task.status === 'COMPLETED' ? 'Completed' : 'In Progress'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 — QUICK WORKER ACTIONS (Compact Cards, Small 18px Icons) */}
            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-3.5 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Quick Worker Actions</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl text-left flex items-center space-x-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#171717] leading-tight truncate">Request Money</div>
                    <div className="text-[9px] text-[#5F6368] truncate">Submit request</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl text-left flex items-center space-x-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#009E68]/10 text-[#009E68] flex items-center justify-center font-bold flex-shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#171717] leading-tight truncate">Record Expense</div>
                    <div className="text-[9px] text-[#5F6368] truncate">Log expenditure</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl text-left flex items-center space-x-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold flex-shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#171717] leading-tight truncate">Upload Receipt</div>
                    <div className="text-[9px] text-[#5F6368] truncate">Attach receipt</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('sources')}
                  className="p-2.5 bg-[#FFFDF8] hover:bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl text-left flex items-center space-x-2.5 transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#24152F]/10 text-[#24152F] flex items-center justify-center font-bold flex-shrink-0">
                    <Layers className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#171717] leading-tight truncate">My Sources</div>
                    <div className="text-[9px] text-[#5F6368] truncate">View sources</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REQUEST MONEY (Path A) */}
        {activeTab === 'requests' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#E7E2D8] p-4 rounded-xl shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-[#171717]">Money Requests</h3>
                <p className="text-[11px] text-[#5F6368]">Funding requests submitted to supervising overseers</p>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Request Money</span>
              </button>
            </div>

            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
              <h4 className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Active & Recent Requests</h4>
              <div className="space-y-2.5">
                {requests.map((req) => (
                  <div key={req.id} className="p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-[#171717]">{req.purpose}</div>
                        <div className="text-[10px] text-[#5F6368]">
                          Target: <strong>{req.recipientL3Name || 'L3 Overseer'}</strong> &bull; {req.categoryName || 'Field Operations'} &bull; {req.date}
                        </div>
                      </div>
                      <div className="font-extrabold text-sm text-[#171717] font-mono">₹{req.amount.toLocaleString('en-IN')}</div>
                    </div>

                    {/* Compact Stepper Timeline */}
                    <div className="pt-2 border-t border-[#E7E2D8] flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-1 font-bold text-[#2563EB]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>1. Requested</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#7A7A7A]" />
                      <div className={`flex items-center space-x-1 font-bold ${
                        req.status === 'APPROVED' || req.status === 'MONEY_GIVEN' ? 'text-[#F59E0B]' : 'text-[#7A7A7A]'
                      }`}>
                        {req.status === 'APPROVED' || req.status === 'MONEY_GIVEN' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>2. Approved (Pending Cash)</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#7A7A7A]" />
                      <div className={`flex items-center space-x-1 font-bold ${
                        req.status === 'MONEY_GIVEN' ? 'text-[#009E68]' : 'text-[#7A7A7A]'
                      }`}>
                        {req.status === 'MONEY_GIVEN' ? <CheckCircle2 className="w-3 h-3 text-[#009E68]" /> : <Clock className="w-3 h-3" />}
                        <span>3. Money Given</span>
                      </div>
                      <button
                        onClick={() => setSelectedRequestDrawer(req)}
                        className="ml-2 px-2 py-0.5 bg-[#FFFDF8] border border-[#E7E2D8] hover:bg-[#F7F5F0] rounded text-[9px] font-bold text-[#171717] cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: RECORD EXPENSE */}
        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#E7E2D8] p-4 rounded-xl shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-[#171717]">Record Expense & Upload Receipts</h3>
                <p className="text-[11px] text-[#5F6368]">Log parish expenditures, attach vouchers, and track overseer review</p>
              </div>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="px-3 py-1.5 bg-[#009E68] hover:bg-[#009E68]/90 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Record Expense</span>
              </button>
            </div>

            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
              <h4 className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider">Submitted Expense Vouchers</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E2D8] text-[#5F6368] font-semibold uppercase text-[9px] tracking-wider">
                      <th className="py-2 px-2.5">Date</th>
                      <th className="py-2 px-2.5">Purpose</th>
                      <th className="py-2 px-2.5">Category</th>
                      <th className="py-2 px-2.5 text-right">Amount</th>
                      <th className="py-2 px-2.5 text-center">OCR Document</th>
                      <th className="py-2 px-2.5 text-center">Overseer Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8]">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-[#F7F5F0] transition-colors">
                        <td className="py-2.5 px-2.5 text-[#5F6368] font-mono text-[11px]">{exp.date}</td>
                        <td className="py-2.5 px-2.5 font-bold text-[#171717]">{exp.purpose}</td>
                        <td className="py-2.5 px-2.5 text-[#5F6368]">{exp.categoryName}</td>
                        <td className="py-2.5 px-2.5 text-right font-mono font-bold text-[#171717]">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-2.5 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30">
                            OCR Parsed
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            exp.acknowledgedByL3 
                              ? 'bg-[#009E68]/10 text-[#009E68] border border-[#009E68]/30' 
                              : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                          }`}>
                            {exp.acknowledgedByL3 ? 'Acknowledged' : 'Pending Review'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MONEY STATUS TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#FFFDF8] border border-[#E7E2D8] p-4 rounded-xl shadow-2xs">
              <h3 className="font-bold text-sm text-[#171717]">Money Status & Audit Log</h3>
              <p className="text-[11px] text-[#5F6368]">Chronological audit log of requests, disbursements, and expenses</p>
            </div>

            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
              <div className="space-y-2">
                {requests.map(req => (
                  <div key={`tl-${req.id}`} className="p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#171717]">{req.purpose}</span>
                      <span className="font-bold text-xs text-[#009E68] font-mono">₹{req.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-[#5F6368]">
                      Status: <strong className="text-[#2563EB]">{req.status}</strong> &bull; Date: {req.date} &bull; Target: {req.recipientL3Name || 'L3 Overseer'}
                    </div>
                  </div>
                ))}

                {expenses.map(exp => (
                  <div key={`tl-exp-${exp.id}`} className="p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#171717]">Expense: {exp.purpose}</span>
                      <span className="font-bold text-xs text-[#171717] font-mono">₹{exp.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-[#5F6368]">
                      Review: <strong className={exp.acknowledgedByL3 ? "text-[#009E68]" : "text-[#F59E0B]"}>{exp.acknowledgedByL3 ? 'ACKNOWLEDGED' : 'PENDING REVIEW'}</strong> &bull; Date: {exp.date} &bull; Voucher: {exp.voucherNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: MY SOURCES (Compact Provider Cards & Info Button for Policy) */}
        {activeTab === 'sources' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-[#FFFDF8] border border-[#E7E2D8] p-4 rounded-xl shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#171717]">My Sources</h3>
                <p className="text-[11px] text-[#5F6368]">Available balances categorized by supervising Level 3 provider source</p>
              </div>
              <button
                onClick={() => setShowAllocationPolicy(!showAllocationPolicy)}
                className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showAllocationPolicy ? 'Hide Policy' : 'Allocation Policy'}</span>
              </button>
            </div>

            {showAllocationPolicy && (
              <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs text-[#171717] font-medium leading-relaxed">
                <strong>Allocation Policy:</strong> Expenses deduct from the highest-balance Level 3 provider source first. Source-level balances remain strictly isolated and auditable.
              </div>
            )}

            <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-xl p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sourceBalances.map(src => (
                  <div key={src.id} className="p-3.5 bg-[#F7F5F0] border border-[#E7E2D8] rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#171717]">{src.l3Name}</div>
                        <div className="text-[10px] text-[#5F6368]">{src.treasuryName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-[#5F6368]">Available</div>
                        <div className="text-base font-extrabold text-[#009E68] font-mono">₹{src.amount.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-[#E7E2D8] text-[10px] text-[#5F6368]">
                      Last Disbursement: {src.lastDisbursed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        </main>
      </div>

      {/* REQUEST DETAIL DRAWER */}
      <DetailDrawer
        isOpen={!!selectedRequestDrawer}
        onClose={() => setSelectedRequestDrawer(null)}
        title={selectedRequestDrawer?.purpose || 'Request Details'}
        subtitle={`Request ID: ${selectedRequestDrawer?.id || ''}`}
      >
        {selectedRequestDrawer && (
          <div className="space-y-6">
            <div className="p-4 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-[#2563EB] uppercase">Request Summary</div>
              <div className="text-2xl font-bold text-[#171717] font-mono">₹{selectedRequestDrawer.amount.toLocaleString('en-IN')}</div>
              <div className="text-xs text-[#5F6368] font-medium">{selectedRequestDrawer.purpose}</div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#171717] text-xs uppercase tracking-wider">Workflow Breakdown</h4>
              <div className="p-3 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-2 text-xs text-[#171717]">
                <div><span className="font-semibold">Requester:</span> {selectedRequestDrawer.requesterName}</div>
                <div><span className="font-semibold">Target Level 3 Overseer:</span> {selectedRequestDrawer.recipientL3Name || 'Rev. Dr. Thomas Vance'}</div>
                <div><span className="font-semibold">Current Status:</span> <strong className="text-[#2563EB]">{selectedRequestDrawer.status}</strong></div>
                <div><span className="font-semibold">Submitted Date:</span> {selectedRequestDrawer.requestedAt || selectedRequestDrawer.date}</div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* REQUEST MONEY MODAL (Path A) */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-[#24152F]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
              <h3 className="font-bold text-base text-[#171717]">Request Money from Level 3</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-[#7A7A7A] hover:text-[#171717] font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Select Level 3 Person *</label>
                <select
                  value={requestTargetL3}
                  onChange={(e) => setRequestTargetL3(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-medium text-[#171717]"
                  required
                >
                  {availableL3Overseers.map(l3 => (
                    <option key={l3.id} value={l3.id}>{l3.name} ({l3.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Event (Optional)</label>
                <select
                  value={requestEvent}
                  onChange={(e) => setRequestEvent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                >
                  {configuredEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Category *</label>
                <select
                  value={requestCategory}
                  onChange={(e) => setRequestCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                  required
                >
                  {configuredCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Amount Required (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Why do you need the money? *</label>
                <input
                  type="text"
                  required
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  placeholder="e.g. Youth Camp Advance & Supplies"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2.5 bg-[#F7F5F0] hover:bg-[#EFE7D8] text-[#171717] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#F4E7B5] text-[#24152F] text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ONE SIMPLE NEW EXPENSE SCREEN */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-[#24152F]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#FFFDF8] border border-[#E7E2D8] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#171717]">Record Parish Field Expense</h3>
                <p className="text-[11px] text-[#5F6368]">Enter expenditure details & voucher receipt</p>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="text-[#7A7A7A] hover:text-[#171717] font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Person *</label>
                <select
                  value={expensePerson}
                  onChange={(e) => setExpensePerson(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-medium text-[#171717]"
                  required
                >
                  <option value={currentUser.id}>{currentUser.name} ({currentUser.designation})</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Event (Optional)</label>
                <select
                  value={expenseEvent}
                  onChange={(e) => setExpenseEvent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                >
                  {configuredEvents.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Category *</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                  required
                >
                  {configuredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Spent Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="2500"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Expense Purpose *</label>
                <input
                  type="text"
                  required
                  value={expensePurpose}
                  onChange={(e) => setExpensePurpose(e.target.value)}
                  placeholder="e.g. Tent & Catering Expense"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Voucher Number</label>
                <input
                  type="text"
                  value={expenseVoucher}
                  onChange={(e) => setExpenseVoucher(e.target.value)}
                  placeholder="VOUCH-2026-99"
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div className="p-3.5 bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#171717]">Supporting Document / Bill Photo</span>
                  <label className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input type="file" className="hidden" onChange={() => setExpenseDocAttached(true)} />
                  </label>
                </div>
                {expenseDocAttached && (
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#009E68]/40 rounded-lg text-xs text-[#009E68] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 flex-shrink-0" />
                      <span className="font-semibold">Voucher_Scan_2026.pdf (OCR Processed)</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#009E68]/10 rounded">VERIFIED</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Acknowledge To (Designated Overseer) *</label>
                <select
                  value={expenseAckTo}
                  onChange={(e) => setExpenseAckTo(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs font-medium text-[#171717]"
                  required
                >
                  {availableL3Overseers.map(l3 => (
                    <option key={l3.id} value={l3.id}>{l3.name} ({l3.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Remarks (Optional)</label>
                <input
                  type="text"
                  value={expenseRemarks}
                  onChange={(e) => setExpenseRemarks(e.target.value)}
                  placeholder="Additional notes for overseer review..."
                  className="w-full p-2.5 bg-white border border-[#E7E2D8] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 bg-[#F7F5F0] hover:bg-[#EFE7D8] text-[#171717] text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#009E68] hover:bg-[#009E68]/90 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#E7E2D8] bg-[#FFFDF8] py-3 text-center text-[11px] text-[#5F6368] font-medium">
        Church Financial Management Platform &bull; Level 4 Task-First Field Operations Workspace
      </footer>
    </div>
  );
};
