import { DateInput } from '@/component/input';
import { CompanySelect } from '@/features/companies/components';

import { type CompanyCredit } from '../types';

interface CreditFiltersProps {
  companyId?: string;
  date?: string;
  /** محدوده مجاز تاریخ مبنا از سرور */
  credit?: CompanyCredit;
  onCompanyChange: (companyId: string) => void;
  onDateChange: (date: string) => void;
}

/** انتخاب شرکت و تاریخ مبنای محاسبه اعتبار */
export const CreditFilters = ({
  companyId,
  date,
  credit,
  onCompanyChange,
  onDateChange,
}: CreditFiltersProps) => (
  <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
    <CompanySelect value={companyId} onChange={onCompanyChange} />
    <div className="mb-3.5 max-w-[360px]">
      <label
        htmlFor="credit-date"
        className="mb-[7px] block text-[12.5px] font-semibold text-label"
      >
        تاریخ مبنای محاسبه اعتبار شرکت
      </label>
      <DateInput
        id="credit-date"
        value={date}
        minDate={credit?.baseDateMin}
        maxDate={credit?.baseDateMax}
        onChange={(value) => typeof value === 'string' && onDateChange(value)}
      />
    </div>
  </div>
);
