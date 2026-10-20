import { ENDPOINTS } from '@/constant/endpoints';
import { type DecisionPayload, type DecisionType } from '@/features/manager-approval/types';
import { type DecisionResult } from '@/component/decision-modal';
import { http } from '@/services/http';
import { type PageParams, type PaginatedResponse } from '@/types/common';

import { type CreditApprovalFilters, type CreditApprovalItem } from './types';

export const getCreditApprovals = (params: CreditApprovalFilters & PageParams) =>
  http.get<PaginatedResponse<CreditApprovalItem>>(ENDPOINTS.CREDIT_APPROVALS.LIST, { params });

/** تأیید درخواست‌ها همراه با مرحله پس از تأیید (اجباری) */
export const approveCredit = (body: DecisionPayload) =>
  http.post<DecisionResult, DecisionPayload>(ENDPOINTS.CREDIT_APPROVALS.APPROVE, body);

/** رد درخواست‌ها؛ دلیل رد اجباری است */
export const rejectCredit = (body: DecisionPayload) =>
  http.post<DecisionResult, DecisionPayload>(ENDPOINTS.CREDIT_APPROVALS.REJECT, body);

export const submitCreditDecision = (type: DecisionType, body: DecisionPayload) =>
  type === 'approve' ? approveCredit(body) : rejectCredit(body);
