import { type LoanStatus } from '@/constant/loanStatus';

export type {
  DecisionFormValues,
  DecisionRequestInfo,
  DecisionType,
} from '@/component/decision-modal';

/** درخواست در انتظار تأیید مدیر شرکت */
export interface PendingRequest {
  id: string;
  staffName: string;
  planTitle: string;
  amount: number;
  createdAt: string;
  note?: string;
  status: LoanStatus;
}

/** بدنه تأیید/رد (تکی یا گروهی) */
export interface DecisionPayload {
  requestIds: string[];
  note?: string;
  fileId?: string | null;
  /** دلیل رد (فقط در مرحله تأیید اعتبارات) */
  reasonId?: string;
  /** مرحله پس از تأیید (فقط در تأیید اعتبارات) */
  stageId?: string;
  /** علت عدم اعطای تسهیلات غیرحضوری (برای مرحله‌ای که علت می‌خواهد) */
  noGrantReasonId?: string;
}
