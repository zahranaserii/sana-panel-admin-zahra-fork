import { normalizeText, searchRule } from '@/utils/inputRules';
import { type PersonnelSearchParams } from '@/api/generated/facility/facilityPanelAPI.schemas';

export type {
  CreatePersonnelCommand as StaffFormValues,
  ReadModelsPersonnelDetailsDto as StaffDetail,
  ReadModelsPersonnelImportResultDto as StaffImportResult,
  ReadModelsPersonnelListItemDto as Staff,
} from '@/api/generated/facility/facilityPanelAPI.schemas';

/** فیلترهای جستجوی پرسنل (از کوئری آدرس) */
export interface StaffFilters {
  q?: string;
  hireFrom?: string;
  hireTo?: string;
}

export const hireRangeMessage = 'تاریخ پایان باید برابر یا بعد از تاریخ شروع باشد.';

const isValidDate = (date?: string) => {
  if (!date) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

export const getStaffDateError = ({ hireFrom, hireTo }: StaffFilters) => {
  if (!isValidDate(hireFrom) || !isValidDate(hireTo)) return 'تاریخ استخدام معتبر نیست.';
  if (hireFrom && hireTo && hireFrom > hireTo) return hireRangeMessage;
};

export const validStaffFilters = (filters: StaffFilters) =>
  searchRule.pattern.test(normalizeText(filters.q ?? '')) && !getStaffDateError(filters);

/** فیلترهای آدرس → پارامترهای جستجوی بک‌اند */
export const toSearchParams = (filters: StaffFilters): PersonnelSearchParams => ({
  Term: normalizeText(filters.q ?? '').trim() || undefined,
  HireDateFrom: filters.hireFrom,
  HireDateTo: filters.hireTo,
});
