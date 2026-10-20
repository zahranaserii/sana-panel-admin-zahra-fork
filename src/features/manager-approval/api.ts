import { ENDPOINTS } from '@/constant/endpoints';
import { type DecisionResult } from '@/component/decision-modal';
import { http } from '@/services/http';
import { type PageParams, type PaginatedResponse } from '@/types/common';

import { type DecisionPayload, type DecisionType, type PendingRequest } from './types';

export const getPendingRequests = (companyId: string, params: PageParams) =>
  http.get<PaginatedResponse<PendingRequest>>(ENDPOINTS.MANAGER_APPROVALS.LIST(companyId), {
    params,
  });

export const approveRequests = (companyId: string, body: DecisionPayload) =>
  http.post<DecisionResult, DecisionPayload>(ENDPOINTS.MANAGER_APPROVALS.APPROVE(companyId), body);

export const rejectRequests = (companyId: string, body: DecisionPayload) =>
  http.post<DecisionResult, DecisionPayload>(ENDPOINTS.MANAGER_APPROVALS.REJECT(companyId), body);

export const submitDecision = (type: DecisionType, companyId: string, body: DecisionPayload) =>
  type === 'approve' ? approveRequests(companyId, body) : rejectRequests(companyId, body);
