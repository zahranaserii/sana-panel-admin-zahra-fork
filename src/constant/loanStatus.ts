import { type StatusTone } from '@/component/status-chip';

/** وضعیت درخواست وام بک‌اند (Lookups/Enums → loanRequestStatus) */
export const LOAN_STATUS = {
  PENDING_MANAGER: 1,
  REJECTED_MANAGER: 2,
  PENDING_CREDIT: 3,
  APPROVED: 4,
  REJECTED: 5,
  PENDING_DIGITAL: 6,
  REJECTED_DIGITAL: 7,
  CANCELLED: 8,
} as const;

/** رنگ هر وضعیت (عنوان از Lookups/Enums می‌آید) */
const TONES: Record<number, StatusTone> = {
  [LOAN_STATUS.PENDING_MANAGER]: 'warning',
  [LOAN_STATUS.REJECTED_MANAGER]: 'error',
  [LOAN_STATUS.PENDING_CREDIT]: 'warning',
  [LOAN_STATUS.APPROVED]: 'success',
  [LOAN_STATUS.REJECTED]: 'error',
  [LOAN_STATUS.PENDING_DIGITAL]: 'warning',
  [LOAN_STATUS.REJECTED_DIGITAL]: 'error',
  [LOAN_STATUS.CANCELLED]: 'default',
};

export const loanStatusTone = (status?: number) => TONES[status ?? 0] ?? 'default';
