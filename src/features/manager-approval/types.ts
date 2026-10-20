export type {
  DecisionFormValues,
  DecisionRequestInfo,
  DecisionType,
} from '@/component/decision-modal';

/** درخواست در صف تأیید (مدیر شرکت و تأیید اعتبارات) */
export type { CommandResponsesLoanRequestListItemDto as PendingRequest } from '@/api/generated/facility/facilityPanelAPI.schemas';

/** نوع تصمیم بک‌اند (decisionType): ۱ تأیید، ۲ رد */
export const DECISION = { approve: 1, reject: 2 } as const;
