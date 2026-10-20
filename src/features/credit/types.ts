import { type AllocationMode } from '@/api/generated/facility/facilityPanelAPI.schemas';

export type {
  CommandResponsesLoanRequestListItemDto as LoanRequest,
  ReadModelsCompanyCreditDto as CompanyCredit,
  ReadModelsHintDto as Hint,
  ReadModelsLoanRequestPreviewDto as LoanPreview,
  ReadModelsPlanCreditDto as PlanCredit,
  ReadModelsRepeatAllocationDto as RepeatAllocation,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** مقادیر فرم ثبت درخواست */
export interface LoanRequestFormValues {
  planId?: number;
  /** حالت تخصیص بک‌اند: ۱ مبلغ یکسان، ۲ مبلغ متفاوت */
  mode: AllocationMode;
  fixedAmount?: string;
  /** مبلغ و ترتیب پرداخت هر پرسنل؛ کلید = شناسه پرسنل */
  rows?: Record<string, { amount?: string; paymentOrder?: number }>;
}
