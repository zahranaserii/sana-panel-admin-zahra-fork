import { Pagination } from 'antd';

import { toPersianDigits } from '@/utils/date';

import { SelectInput } from '../input/SelectInput';

export interface TablePaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  /** نمایش تعداد کل رکوردها (سمت راست) */
  showTotal?: boolean;
  /** انتخاب تعداد ردیف در هر صفحه (سمت چپ؛ پیش‌فرض فعال) */
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

/**
 * پجینیشن اختصاصی جدول — هم‌عرض جدول:
 * راست: تعداد کل رکورد · وسط: صفحات (از راست به چپ) · چپ: تعداد در صفحه
 */
export const TablePagination = ({
  current,
  pageSize,
  total,
  onChange,
  showTotal = true,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  disabled,
}: TablePaginationProps) => (
  <div className="mt-3 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
    <div className="justify-self-start text-xs whitespace-nowrap text-ink-soft">
      {showTotal && (
        <>
          تعداد کل: <b className="text-heading">{toPersianDigits(total.toLocaleString('en-US'))}</b>{' '}
          رکورد
        </>
      )}
    </div>
    <Pagination
      className="justify-self-center"
      current={current}
      pageSize={pageSize}
      total={total}
      disabled={disabled}
      showSizeChanger={false}
      hideOnSinglePage={false}
      onChange={onChange}
    />
    <div className="justify-self-end">
      {showSizeChanger && (
        <SelectInput<number>
          size="small"
          value={pageSize}
          allowClear={false}
          showSearch={false}
          disabled={disabled}
          style={{ width: 120 }}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: `${toPersianDigits(size)} در صفحه`,
          }))}
          onChange={(size) => onChange(1, size)}
        />
      )}
    </div>
  </div>
);
