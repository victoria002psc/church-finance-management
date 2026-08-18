import { L3DashboardData, L2DashboardData, L1DashboardData, Expense, MoneyRequest, User, L4ToL4Transaction, L1DirectPayment, AdvanceRecord, ExceptionIssue, RoleLevel } from '../types.ts';

export async function fetchL3DashboardState(): Promise<L3DashboardData> {
  const response = await fetch('/api/l3/state');
  if (!response.ok) {
    throw new Error(`Failed to fetch L3 state: ${response.statusText}`);
  }
  return response.json();
}

export async function giveMoneyDirect(data: {
  receiverL4Id: string;
  amount: number;
  sourceBalanceId: string;
  eventId?: string;
  categoryId: string;
  purpose?: string;
}): Promise<{ success: boolean; state: L3DashboardData }> {
  const response = await fetch('/api/l3/give-money', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to disburse money');
  }
  return resData;
}

export async function approveRequest(data: {
  requestId: string;
  actionType: 'APPROVE_ONLY' | 'APPROVE_AND_GIVE';
  sourceBalanceId?: string;
}): Promise<{ success: boolean; request: MoneyRequest; state: L3DashboardData }> {
  const response = await fetch('/api/l3/requests/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to approve request');
  }
  return resData;
}

export async function giveMoneyLater(data: {
  requestId: string;
  sourceBalanceId: string;
}): Promise<{ success: boolean; request: MoneyRequest; state: L3DashboardData }> {
  const response = await fetch('/api/l3/requests/give-later', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to give money for approved request');
  }
  return resData;
}

export async function rejectRequest(data: {
  requestId: string;
  reason: string;
}): Promise<{ success: boolean; request: MoneyRequest; state: L3DashboardData }> {
  const response = await fetch('/api/l3/requests/reject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to reject request');
  }
  return resData;
}

export async function acknowledgeExpense(expenseId: string): Promise<{ success: boolean; expense: Expense; state: L3DashboardData }> {
  const response = await fetch('/api/l3/expenses/acknowledge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenseId }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to acknowledge expense');
  }
  return resData;
}

export async function verifyOcr(data: {
  expenseId: string;
  verificationAction: 'VERIFY_CORRECT' | 'FLAG_DISCREPANCY';
  remarks?: string;
}): Promise<{ success: boolean; expense: Expense; state: L3DashboardData }> {
  const response = await fetch('/api/l3/expenses/ocr-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to verify OCR');
  }
  return resData;
}

export async function validateL4ToL4(data: {
  transactionId: string;
  action: 'ACCEPT' | 'REJECT';
  l3Remarks?: string;
}): Promise<{ success: boolean; transaction: L4ToL4Transaction; state: L3DashboardData }> {
  const response = await fetch('/api/l3/l4-to-l4/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to validate L4->L4 transaction');
  }
  return resData;
}

export async function createL4User(data: {
  name: string;
  email?: string;
  phone: string;
  designation: string;
  assignedArea?: string;
}): Promise<{ success: boolean; user: User; state: L3DashboardData }> {
  const response = await fetch('/api/l3/l4-users/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to create Level 4 user');
  }
  return resData;
}

export async function recordMultiSourceExpense(data: {
  personL4Id: string;
  amount: number;
  categoryId: string;
  eventId?: string;
  description?: string;
  documentType?: 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';
  documentNumber?: string;
}): Promise<{ success: boolean; expense: Expense; state: L3DashboardData }> {
  const response = await fetch('/api/l3/expenses/record-multi-source', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to record multi-source expense');
  }
  return resData;
}

export async function switchActiveUser(userId: string): Promise<L3DashboardData> {
  const response = await fetch('/api/l3/switch-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to switch user');
  }
  return resData;
}

// ==========================================
// LEVEL 2 API CLIENT FUNCTIONS (NEW MODULE)
// ==========================================

export async function fetchL2DashboardState(): Promise<L2DashboardData> {
  const response = await fetch('/api/l2/state');
  if (!response.ok) {
    throw new Error('Failed to fetch Level 2 authoritative dashboard state');
  }
  return response.json();
}

export async function switchActiveL2User(userId: string): Promise<L2DashboardData> {
  const response = await fetch('/api/l2/switch-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to switch Level 2 active director');
  }
  return resData;
}

export async function disburseToL3(data: {
  toL3Id: string;
  amount: number;
  purpose?: string;
  transactionRef?: string;
}): Promise<{ success: boolean; state: L2DashboardData }> {
  const response = await fetch('/api/l2/disburse-to-l3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to disburse funds to Level 3');
  }
  return resData;
}

export async function directL4Payment(data: {
  toL4Id: string;
  amount: number;
  categoryId: string;
  eventId?: string;
  purpose?: string;
  documentType?: 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';
  documentNumber?: string;
}): Promise<{ success: boolean; state: L2DashboardData }> {
  const response = await fetch('/api/l2/direct-l4-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to execute direct Level 4 payment');
  }
  return resData;
}

export async function acknowledgeL1Payment(paymentId: string): Promise<{ success: boolean; state: L2DashboardData }> {
  const response = await fetch('/api/l2/acknowledge-l1-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to acknowledge Level 1 direct payment');
  }
  return resData;
}

export async function createL3User(data: {
  name: string;
  email?: string;
  phone: string;
  designation: string;
  assignedArea?: string;
}): Promise<{ success: boolean; user: User; state: L2DashboardData }> {
  const response = await fetch('/api/l2/create-l3-person', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to create Level 3 person');
  }
  return resData;
}

export async function loginLevel2User(credentials: {
  emailOrUsername: string;
  password: string;
}): Promise<{ success: boolean; token: string; user: User; state: L2DashboardData }> {
  const response = await fetch('/api/auth/level2/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Authentication failed');
  }
  return resData;
}

export async function logoutLevel2User(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/level2/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

export async function recordL2Expense(data: {
  amount: number;
  categoryId: string;
  eventId?: string;
  description?: string;
  documentType?: 'BILL' | 'INVOICE' | 'RECEIPT' | 'VOUCHER';
  documentNumber?: string;
}): Promise<{ success: boolean; expense: Expense; state: L2DashboardData }> {
  const response = await fetch('/api/l2/record-expense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to record Level 2 central expense');
  }
  return resData;
}

// ==========================================
// UNIVERSAL AUTHENTICATION & SIGN UP
// ==========================================

export async function registerAccount(data: {
  name: string;
  email: string;
  password: string;
  role: RoleLevel;
  designation: string;
  phone?: string;
  assignedArea?: string;
  reportingToId?: string;
}): Promise<{ success: boolean; token: string; user: User; state?: any }> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Registration failed');
  }
  return resData;
}

// ==========================================
// LEVEL 1 AUTHENTICATION & OPERATIONS
// ==========================================

export async function loginLevel1User(credentials: {
  emailOrUsername: string;
  password: string;
}): Promise<{ success: boolean; token: string; user: User; state: L1DashboardData }> {
  const response = await fetch('/api/auth/level1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Authentication failed');
  }
  return resData;
}

export async function logoutLevel1User(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/level1/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

export async function fetchL1DashboardState(): Promise<L1DashboardData> {
  const response = await fetch('/api/l1/state');
  if (!response.ok) {
    throw new Error(`Failed to fetch Level 1 state: ${response.statusText}`);
  }
  return response.json();
}

export async function switchActiveL1User(userId: string): Promise<L1DashboardData> {
  const response = await fetch('/api/l1/switch-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error(`Failed to switch L1 user`);
  }
  return response.json();
}

export async function createL1Subordinate(data: {
  role: 'LEVEL_2' | 'LEVEL_3';
  name: string;
  email?: string;
  phone: string;
  designation: string;
  assignedArea?: string;
  reportingToId?: string;
}): Promise<{ success: boolean; user: User; state: L1DashboardData }> {
  const response = await fetch('/api/l1/create-subordinate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to create subordinate user');
  }
  return resData;
}

export async function recordL1DirectPayment(data: {
  toUserId: string;
  toUserRole: 'LEVEL_3' | 'LEVEL_4';
  amount: number;
  purpose: string;
  transactionRef?: string;
}): Promise<{ success: boolean; payment: L1DirectPayment; state: L1DashboardData }> {
  const response = await fetch('/api/l1/direct-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to record Level 1 direct payment');
  }
  return resData;
}

export async function resolveL1Exception(data: {
  issueId: string;
  resolutionNotes: string;
}): Promise<{ success: boolean; issue: ExceptionIssue; state: L1DashboardData }> {
  const response = await fetch('/api/l1/resolve-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to resolve exception');
  }
  return resData;
}

export async function settleL1Advance(data: {
  advanceId: string;
  actualSpent: number;
  returnedOrRefundedAmount: number;
  voucherNo?: string;
  settlementRemarks?: string;
}): Promise<{ success: boolean; advance: AdvanceRecord; state: L1DashboardData }> {
  const response = await fetch('/api/l1/settle-advance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Failed to settle advance');
  }
  return resData;
}

// ==========================================
// LEVEL 3 AUTHENTICATION
// ==========================================

export async function loginLevel3User(credentials: {
  emailOrUsername: string;
  password: string;
}): Promise<{ success: boolean; token: string; user: User; state: L3DashboardData }> {
  const response = await fetch('/api/auth/level3/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error || 'Authentication failed');
  }
  return resData;
}

export async function logoutLevel3User(): Promise<{ success: boolean }> {
  const response = await fetch('/api/auth/level3/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

