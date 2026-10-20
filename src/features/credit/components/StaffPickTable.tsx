import { type ColumnsType } from 'antd/es/table';

import { usePersonnelSearch } from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { AmountInput, NumberInput } from '@/component/input';
import { Table } from '@/component/table';
import { type Staff, type StaffFilters, toSearchParams } from '@/features/staff/types';
import { toPersianDigits } from '@/utils/date';

interface StaffPickTableProps {
  companyId: number;
  filters: StaffFilters;
  variableAmount: boolean;
  disabled: boolean;
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

/** همه پرسنل قابل انتخاب برای وام (بدون صفحه‌بندی؛ حداکثر اندازه صفحه بک‌اند) */
const ALL = { Page: 1, PageSize: 100, OnlyAvailableForLoan: true };

export const StaffPickTable = ({
  companyId,
  filters,
  variableAmount,
  disabled,
  selectedIds,
  onSelect,
}: StaffPickTableProps) => {
  const { data, isFetching } = usePersonnelSearch(companyId, {
    ...toSearchParams(filters),
    ...ALL,
  });

  const columns: ColumnsType<Staff> = [
    {
      title: 'اولویت پرسنل',
      dataIndex: 'priority',
      align: 'center',
      render: (value: number) => <b>{toPersianDigits(value)}</b>,
    },
    { title: 'نام', dataIndex: 'fullName' },
    { title: 'کد پرسنلی', dataIndex: 'personnelCode' },
    {
      title: 'ترتیب پرداخت',
      key: 'paymentOrder',
      render: (_value, row, index) => (
        <FormItem name={['rows', String(row.id), 'paymentOrder']} initialValue={index + 1} noStyle>
          <NumberInput min={1} style={{ width: 80 }} />
        </FormItem>
      ),
    },
    ...(variableAmount
      ? [
          {
            title: 'مبلغ وام این نفر',
            key: 'amount',
            render: (_value: unknown, row: Staff) => (
              <FormItem name={['rows', String(row.id), 'amount']} noStyle>
                <AmountInput style={{ width: 200 }} />
              </FormItem>
            ),
          },
        ]
      : []),
  ];

  return (
    <Table<Staff>
      rowKey="id"
      columns={columns}
      dataSource={data?.items}
      loading={isFetching}
      maxHeight={300}
      locale={{ emptyText: 'پرسنلی با این شرایط یافت نشد.' }}
      rowSelection={{
        selectedRowKeys: selectedIds,
        onChange: (keys) => onSelect(keys.map(Number)),
        getCheckboxProps: () => ({ disabled }),
      }}
    />
  );
};
