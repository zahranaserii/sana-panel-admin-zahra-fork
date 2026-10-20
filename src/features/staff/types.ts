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

/** فیلترهای آدرس → پارامترهای جستجوی بک‌اند */
export const toSearchParams = (filters: StaffFilters): PersonnelSearchParams => ({
  Term: filters.q,
  HireDateFrom: filters.hireFrom,
  HireDateTo: filters.hireTo,
});
