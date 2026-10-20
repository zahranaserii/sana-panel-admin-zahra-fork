import { ENDPOINTS } from '@/constant/endpoints';
import { type LookupItem } from '@/types/common';

import { http } from '../http';

import { type PlanOptionsResponse, type PostApprovalStage } from './types';

/** لیست‌های ساده (دلایل، انواع مستند) که در اطلاعات پایه هر طرح تعریف می‌شوند */
export const getCancelReasons = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.CANCEL_REASONS);
export const getRejectReasons = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.REJECT_REASONS);
export const getNoGrantReasons = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.NO_GRANT_REASONS);
export const getAvgDocTypes = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.AVG_DOC_TYPES);

/** طرح‌های قابل انتخاب در قرارداد شرکت */
export const getPlanOptions = (schemeId: string) =>
  http.get<PlanOptionsResponse>(ENDPOINTS.LOOKUPS.PLANS, { params: { schemeId } });

/** کشویی طرح‌های کلان (نگین میثاق، …) برای فرم شرکت */
export const getSchemeOptions = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.SCHEMES);

/** شرکت‌های فعال (برای سلکت انتخاب شرکت) */
export const getCompanyOptions = () => http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.COMPANIES);

/** همه شرکت‌ها، شامل قراردادهای لغوشده (برای فیلتر گزارش‌ها و تأیید اعتبارات) */
export const getAllCompanyOptions = () =>
  http.get<LookupItem[]>(ENDPOINTS.LOOKUPS.COMPANIES, { params: { includeInactive: true } });

export const getPostApprovalStages = () =>
  http.get<PostApprovalStage[]>(ENDPOINTS.LOOKUPS.POST_APPROVAL_STAGES);
