import { useCompaniesLookup } from '@/api/generated/facility';

/**
 * شرکت انتخاب‌شده فقط وقتی معتبر است که در کشویی شرکت‌های فعال باشد؛
 * اگر سرویس کشویی خطا بدهد یا خالی باشد، بخش‌های وابسته به شرکت نمایش داده نمی‌شوند.
 */
export const useSelectedCompany = (value?: string) => {
  const { data: companies } = useCompaniesLookup({ activeOnly: true });
  return companies?.some((item) => String(item.id) === value) ? Number(value) : undefined;
};
