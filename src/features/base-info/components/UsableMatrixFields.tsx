/* eslint-disable react/no-array-index-key -- خانه‌های جدول با جایگاه ردیف و ستون شناخته می‌شوند */
import { Form } from 'antd';

import { FormItem } from '@/component/form';
import { NumberInput } from '@/component/input';
import { toPersianDigits } from '@/utils/date';

import { SectionTitle } from './SectionTitle';

const label = (value: number | null | undefined, suffix: string) =>
  value === null || value === undefined ? '—' : toPersianDigits(value) + suffix;

/** جدول درصد قابل استفاده: ردیف = مدت بازپرداخت، ستون = نرخ تسهیلات */
export const UsableMatrixFields = () => {
  const terms = Form.useWatch<(number | null)[] | undefined>('repaymentTermsMonths') ?? [];
  const rates = Form.useWatch<(number | null)[] | undefined>('murabahaRates') ?? [];
  const qarzRate = Form.useWatch<number | undefined>('qardHasanRate');
  const headers = [
    'قرض‌الحسنه (' + label(qarzRate, '٪') + ')',
    ...rates.map((rate) => 'مرابحه ' + label(rate, '٪')),
  ];

  return (
    <>
      <SectionTitle
        title="درصد قابل استفاده از میانگین"
        subtitle="هر ردیف یک مدت بازپرداخت و هر ستون یک نرخ تسهیلات است؛ عدد داخل جدول، درصد قابل استفاده از مجموع میانگین حساب برای آن ترکیب است."
      />
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-[12.5px]">
          <thead className="bg-bg">
            <tr>
              <th className="p-2 text-start font-bold whitespace-nowrap">مدت \ نرخ</th>
              {headers.map((header, column) => (
                <th key={column} className="p-2 text-start font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {terms.map((term, row) => (
              <tr key={row} className="border-t border-line">
                <td className="p-2 font-medium whitespace-nowrap">{label(term, ' ماه')}</td>
                {headers.map((header, column) => (
                  <td key={column} className="p-1.5">
                    <FormItem
                      name={['usable', row, column]}
                      required
                      requiredMessage="الزامی"
                      className="mb-0"
                    >
                      <NumberInput
                        min={0}
                        max={100}
                        aria-label={`${label(term, ' ماه')} - ${header}`}
                      />
                    </FormItem>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
