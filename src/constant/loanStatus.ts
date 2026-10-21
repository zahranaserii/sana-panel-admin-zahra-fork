import { type StatusTone } from '@/component/status-chip';

/** وضعیت درخواست وام بک‌اند (Lookups/Enums → loanRequestStatus، LoanRequestStatus در FacilityEnums.cs) */
export const LOAN_STATUS = {
  PENDING_MANAGER: 1,
  REJECTED_MANAGER: 2,
  PENDING_CREDIT: 3,
  REJECTED: 4,
  PENDING_DIGITAL: 5,
  REJECTED_DIGITAL: 6,
  APPROVED: 7,
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
