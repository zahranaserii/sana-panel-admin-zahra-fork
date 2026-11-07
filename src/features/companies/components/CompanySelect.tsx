import { useEffect } from 'react';

import { useCompaniesLookup } from '@/api/generated/facility';
import { SelectInput } from '@/component/input';

interface CompanySelectProps {
  value?: string;
  onChange: (companyId: string) => void;
}

/**
 * انتخاب شرکت فعال (Companies/Lookup).
 * اگر فقط یک شرکت باشد خودکار انتخاب می‌شود؛ با بیشتر از یک شرکت کاربر خودش انتخاب می‌کند.
 * شرکت انتخاب‌شده‌ای که دیگر فعال نیست پاک می‌شود.
 */
export const CompanySelect = ({ value, onChange }: CompanySelectProps) => {
  const { data: companies, isFetching, refetch } = useCompaniesLookup({ activeOnly: true });

  // شناسه عددی است؛ مقدار انتخاب در آدرس صفحه به‌صورت رشته نگه داشته می‌شود
  useEffect(() => {
    if (!companies || companies.some((item) => String(item.id) === value)) return;
    const only = companies.length === 1 ? companies[0]?.id : undefined;
    if (only) onChange(String(only));
    else if (value) onChange('');
  }, [companies, value, onChange]);

  return (
    <div className="mb-3.5 max-w-[360px]">
      <label
        htmlFor="company-select"
        className="mb-[7px] block text-[12.5px] font-semibold text-label"
      >
        انتخاب شرکت
      </label>
      <SelectInput
        id="company-select"
        className="w-full"
        allowClear={false}
        loading={isFetching}
        onRetry={() => void refetch()}
        value={value || undefined}
        onChange={onChange}
        placeholder={companies?.length ? 'انتخاب شرکت' : 'ابتدا یک شرکت ثبت کنید'}
        options={companies?.map((item) => ({ value: String(item.id), label: item.title }))}
      />
    </div>
  );
};
