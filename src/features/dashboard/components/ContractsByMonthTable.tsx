import { type ColumnsType } from 'antd/es/table';

import { useDashboardGet } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { Table } from '@/component/table';
import { toPersianDigits } from '@/utils/date';

import { type ContractsByMonth } from '../types';

const columns: ColumnsType<ContractsByMonth> = [
  {
    title: 'ماه انعقاد',
    dataIndex: 'month',
    render: (value?: string) => toPersianDigits(value ?? ''),
  },
  {
    title: 'تعداد شرکت',
    dataIndex: 'companyCount',
    render: (value?: number) => toPersianDigits(value ?? 0),
  },
  {
    title: 'نام شرکت‌ها',
    dataIndex: 'companyNames',
    render: (names?: string[]) => (names ?? []).join('، '),
  },
];

export const ContractsByMonthTable = () => {
  const { data, isFetching, isError, refetch } = useDashboardGet();

  return (
    <PanelCard
      title="تفاهم‌نامه‌های منعقدشده به تفکیک ماه"
      subtitle="برای سنجش عملکرد شعبه در جذب شرکت‌های جدید"
    >
      <Table<ContractsByMonth>
        rowKey="month"
        columns={columns}
        dataSource={data?.contractsByMonth}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'هنوز تفاهم‌نامه‌ای ثبت نشده است.' }}
      />
    </PanelCard>
  );
};
