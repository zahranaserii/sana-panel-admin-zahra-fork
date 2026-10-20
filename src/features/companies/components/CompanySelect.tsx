import { useEffect } from 'react';

import { useCompaniesLookup } from '@/api/generated/facility';
import { SelectInput } from '@/component/input';

interface CompanySelectProps {
  value?: string;
  onChange: (companyId: string) => void;
}

/**
 * انتخاب شرکت فعال (Companies/Lookup).
 * اگر مقداری انتخاب نشده یا شرکت انتخاب‌شده دیگر فعال نیست، اولین شرکت انتخاب می‌شود.
 */
export const CompanySelect = ({ value, onChange }: CompanySelectProps) => {
  const { data: companies, isPending } = useCompaniesLookup({ activeOnly: true });

  // شناسه عددی است؛ مقدار انتخاب در آدرس صفحه به‌صورت رشته نگه داشته می‌شود
  useEffect(() => {
    const first = companies?.[0]?.id;
    if (first && !companies.some((item) => String(item.id) === value)) onChange(String(first));
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
        loading={isPending}
        value={value}
        onChange={onChange}
        placeholder="ابتدا یک شرکت ثبت کنید"
        options={companies?.map((item) => ({ value: String(item.id), label: item.title }))}
      />
    </div>
  );
};
