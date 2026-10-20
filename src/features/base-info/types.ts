import { type SaveSchemeCommand } from '@/api/generated/facility/facilityPanelAPI.schemas';

export type {
  ReadModelsSchemeFormDto as SchemeDetail,
  ReadModelsSchemeListItemDto as SchemeListItem,
  SaveSchemeCommand,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** نام لیست‌های متنی هر طرح (دلایل و انواع مستند) */
export type SchemeTextList =
  | 'contractCancelReasons'
  | 'loanRejectReasons'
  | 'remoteGrantDeniedReasons'
  | 'documentTypes'
  | 'loanCancelReasons'
  | 'personnelRejectReasons';

/**
 * مقادیر فرم طرح: همان SaveSchemeCommand،
 * فقط جدول درصد قابل استفاده در فرم به شکل ماتریس است
 * (ردیف = مدت، ستون اول قرض‌الحسنه و بقیه نرخ‌های مرابحه) و هنگام ارسال به usableTable تبدیل می‌شود.
 */
export type SchemeFormValues = Omit<SaveSchemeCommand, 'usableTable'> & {
  usable?: (number | null)[][];
};
