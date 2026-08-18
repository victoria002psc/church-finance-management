export type RoleLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleLevel;
  designation: string;
  phone: string;
  assignedArea: string;
  avatarUrl?: string;
  reportingToId?: string; // e.g. L3 reports to L2, L4 reports to L3
  createdById?: string;
  createdAt: string;
}

export interface SourceBalance {
  id: string;
  sourceL2Id: string;
  sourceL2Name: string;
  fundName: string;
  receivedAmount: number;
  availableAmount: number;
  allocatedAmount: number;
  lastReceivedDate: string;
  purpose: string;
}

export type RequestStatus = 
  | 'REQUESTED' 
  | 'APPROVED' // Approved - money not yet given
  | 'MONEY_GIVEN' 
  | 'REJECTED';

export interface MoneyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterDesignation: string;
  recipientL3Id: string;
  recipientL3Name: string;
  amount: number;
  eventId?: string;
  eventName?: string;
  categoryId: string;
  categoryName: string;
  remarks: string;
  requestedAt: string;
  status: RequestStatus;
  approvedAt?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAmount?: number;
  rejectedAt?: string;
  rejectedById?: string;
  rejectionReason?: string;
  givenAt?: string;
  givenById?: string;
  givenByName?: string;
  sourceBalanceId?: string;
  sourceL2Name?: string;
}

export interface MoneyGiven {
  id: string;
  giverL3Id: string;
  giverL3Name: string;
  receiverL4Id: string;
  receiverL4Name: string;
  amount: number;
  givenAt: string;
  sourceBalanceId: string;
  sourceL2Name: string;
  eventId?: string;
  eventName?: string;
  categoryId: string;
  categoryName: string;
  purpose: string;
  relatedRequestId?: string;
  status: 'COMPLETED' | 'ACKNOWLEDGED';
  acknowledgedAt?: string;
}

export interface MoneyReceived {
  id: string;
  fromL2Id: string;
  fromL2Name: string;
  toL3Id: string;
  toL3Name: string;
  amount: number;
  receivedAt: string;
  fundSource: string;
  sourceBalanceId: string;
  purpose: string;
  transactionRef: string;
  status: 'RECEIVED';
}

export type DocumentType = 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';

export interface OcrResult {
  extractedAmount: number;
  extractedVendor: string;
  extractedDate: string;
  extractedInvoiceNo: string;
  rawTextPreview: string;
  isMismatch: boolean; // True if extractedAmount !== transactionAmount
  mismatchDiff?: number;
  reviewStatus: 'PENDING_REVIEW' | 'FLAGGED_MISMATCH' | 'VERIFIED';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Expense {
  id: string;
  personL4Id: string;
  personL4Name: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  eventId?: string;
  eventName?: string;
  date: string;
  description: string;
  documentType: DocumentType;
  documentNumber: string;
  documentUrl?: string;
  ocrResult?: OcrResult;
  sourceAllocations: {
    sourceL3Id: string;
    sourceL3Name: string;
    amount: number;
  }[];
  isAcknowledgedByL3: boolean;
  acknowledgedAt?: string;
  acknowledgedById?: string;
  acknowledgedByName?: string;
  reconciliationStatus: 'MATCHED' | 'DIFFERENCE' | 'UNRECONCILED';
  bankDiffAmount?: number;
}

export interface L4ToL4Transaction {
  id: string;
  givingL4Id: string;
  givingL4Name: string;
  benefitingL4Id: string;
  benefitingL4Name: string;
  amount: number;
  eventId?: string;
  eventName?: string;
  categoryId: string;
  categoryName: string;
  remarks: string;
  date: string;
  managingL3Id: string;
  managingL3Name: string;
  status: 'PENDING_VALIDATION' | 'VALIDATED' | 'REJECTED';
  validatedAt?: string;
  validatedById?: string;
  validatedByName?: string;
  l3Remarks?: string;
}

export interface BankReconciliationItem {
  id: string;
  transactionDate: string;
  description: string;
  systemAmount: number;
  bankStatementAmount: number;
  difference: number;
  status: 'MATCHED' | 'DIFFERENCE';
  differenceReason?: string;
  referenceNo: string;
  bankAccount: string;
  lastCheckedDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: RoleLevel;
  action: string;
  entityType: 'REQUEST' | 'MONEY_GIVEN' | 'MONEY_RECEIVED' | 'EXPENSE' | 'L4_PERSON' | 'L4_TO_L4' | 'OCR_REVIEW' | 'RECONCILIATION' | 'CANCELLATION' | 'USER';
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  details: string;
}

export interface ConfiguredEvent {
  id: string;
  name: string;
  code: string;
  budgetAllocated: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface ConfiguredCategory {
  id: string;
  name: string;
  parentGroup: string; // Administration, Ministry, Meetings & Programs, Building & Maintenance, Vehicle, Charity / Social Service
}

export interface HierarchyRelationship {
  id: string;
  managerId: string;
  managerName: string;
  managerLevel: RoleLevel;
  managerDesignation: string;
  subordinateId: string;
  subordinateName: string;
  subordinateLevel: RoleLevel;
  subordinateDesignation: string;
  assignedScope: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface L2DirectPaymentToL4 {
  id: string;
  fromL2Id: string;
  fromL2Name: string;
  toL4Id: string;
  toL4Name: string;
  amount: number;
  givenAt: string;
  eventId?: string;
  eventName?: string;
  categoryId: string;
  categoryName: string;
  documentType?: DocumentType;
  documentNumber?: string;
  purpose: string;
  status: 'COMPLETED' | 'ACKNOWLEDGED';
}

export interface L1DirectPayment {
  id: string;
  fromL1Id: string;
  fromL1Name: string;
  toUserId: string;
  toUserName: string;
  toUserRole: 'LEVEL_3' | 'LEVEL_4';
  amount: number;
  date: string;
  purpose: string;
  isAcknowledgedByL2: boolean;
  acknowledgedAt?: string;
  acknowledgedById?: string;
  acknowledgedByName?: string;
  transactionRef: string;
}

export interface AdvanceRecord {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: RoleLevel;
  approverId?: string;
  approverName?: string;
  amount: number;
  purpose: string;
  categoryName: string;
  eventName?: string;
  date: string;
  status: 'OUTSTANDING' | 'SETTLED' | 'ADJUSTED';
  actualSpent?: number;
  returnedOrRefundedAmount?: number;
  settlementDate?: string;
  settlementRemarks?: string;
  voucherNo?: string;
}

export interface ExceptionIssue {
  id: string;
  financialYear: string;
  issueType: 'BANK_MISMATCH' | 'OCR_MISMATCH' | 'MISSING_BILL' | 'MISSING_VOUCHER' | 'MISSING_ACKNOWLEDGEMENT' | 'UNSETTLED_ADVANCE' | 'DUPLICATE_TRANSACTION' | 'BUDGET_OVERRUN';
  relatedTransactionId?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  expectedAmount?: number;
  actualAmount?: number;
  difference?: number;
  identifiedBy: string;
  identifiedDate: string;
  status: 'OPEN' | 'RESOLVED' | 'UNDER_REVIEW';
  resolvedBy?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
}

export interface L1DashboardData {
  currentL1User: User;
  availableL1Users: User[];
  allHierarchyPeople: User[];
  allRelationships: HierarchyRelationship[];
  organizationMetrics: {
    totalOrganizationControlledFunds: number;
    totalIncomeReceipts: number;
    totalL2BudgetsAllocated: number;
    totalL2AvailableBalances: number;
    totalL3AvailableBalances: number;
    totalL4AvailableBalances: number;
    totalDistributedToL3: number;
    totalDirectL4Disbursements: number;
    totalRecordedExpenses: number;
    totalOutstandingAdvances: number;
    pendingActionCount: number;
    pendingL1DirectAckCount: number;
    pendingRequestsAwaitingMoneyCount: number;
    unreconciledBankDifferencesCount: number;
    activeExceptionsCount: number;
  };
  financialOverview: {
    incomeReceipts: Array<{ id: string; source: string; category: string; amount: number; date: string; method: string; ref: string }>;
    fundAccounts: Array<{ id: string; fundName: string; totalReceived: number; totalDisbursed: number; remaining: number; departmentL2Name: string }>;
    l3SourceBalancesBreakdown: Array<{ l3Id: string; l3Name: string; sources: { sourceL2Name: string; received: number; spent: number; remaining: number }[]; totalRemaining: number }>;
  };
  level2Directors: Array<User & { allocatedBudget: number; availableBalance: number; disbursedToL3: number; directL4Paid: number; expensesPaid: number; supervisedOverseersCount: number }>;
  level3Overseers: Array<User & { reportingToL2Name: string; totalReceived: number; totalAvailable: number; teamCount: number; sources: { sourceL2Name: string; available: number }[] }>;
  level4Workers: Array<User & { managingL3Name: string; assignedArea: string; allocatedBalance: number; expensesCount: number; pendingRequestsCount: number }>;
  advancesAndSettlements: AdvanceRecord[];
  allRequests: MoneyRequest[];
  allExpenses: Expense[];
  allMoneyMovements: Array<{ id: string; type: 'L1_TO_L3' | 'L1_TO_L4' | 'L2_TO_L3' | 'L3_TO_L4' | 'L2_TO_L4' | 'L4_TO_L4'; fromName: string; toName: string; fromRole: string; toRole: string; amount: number; date: string; purpose: string; status: string; ref: string }>;
  bankReconciliations: BankReconciliationItem[];
  exceptionsAndIssues: ExceptionIssue[];
  auditLogs: AuditLog[];
  events: ConfiguredEvent[];
  categories: ConfiguredCategory[];
}

export interface L2DashboardData {
  currentL2User: User;
  availableL2Users: User[];
  allHierarchyPeople: User[];
  allRelationships: HierarchyRelationship[];
  centralAllocatedBudget: number;
  centralAvailableBalance: number;
  centralDisbursedToL3: number;
  centralDirectL4Paid: number;
  centralExpensesPaid: number;
  pendingL1AcknowledgementsCount: number;
  pendingRequestsCount: number;
  ocrMismatchesCount: number;
  bankDifferencesCount: number;
  supervisedL3Overseers: Array<User & { 
    currentOverseerBalance: number; 
    sourceAllocationsFromThisL2: number; 
    allSourcesBreakdown: { sourceL2Name: string; amount: number }[]; 
    recentTransactionsCount: number 
  }>;
  allL4Recipients: User[];
  disbursedToL3History: (MoneyReceived & { toL3Name: string })[];
  directL4Payments: L2DirectPaymentToL4[];
  l1DirectPayments: L1DirectPayment[];
  requests: MoneyRequest[];
  expenses: Expense[];
  bankReconciliations: BankReconciliationItem[];
  auditLogs: AuditLog[];
  events: ConfiguredEvent[];
  categories: ConfiguredCategory[];
}

export interface L3DashboardData {
  currentL3User: User;
  availableL3Users: User[];
  allHierarchyPeople: User[];
  allRelationships: HierarchyRelationship[];
  totalAvailable: number;
  sourceBalances: SourceBalance[];
  pendingActionsCount: number;
  pendingRequestsCount: number;
  unacknowledgedExpensesCount: number;
  ocrMismatchesCount: number;
  bankDifferencesCount: number;
  recentMoneyMovements: (MoneyGiven | MoneyReceived)[];
  recentExpenses: Expense[];
  requests: MoneyRequest[];
  l4People: (User & { currentAllocatedBalance: number; sourceBreakdown: { sourceName: string; amount: number }[] })[];
  l4ToL4Transactions: L4ToL4Transaction[];
  bankReconciliations: BankReconciliationItem[];
  auditLogs: AuditLog[];
  events: ConfiguredEvent[];
  categories: ConfiguredCategory[];
}

