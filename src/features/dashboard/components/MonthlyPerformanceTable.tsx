import { type ColumnsType } from 'antd/es/table';

import { useDashboardGet, useDashboardMonths } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { Table } from '@/component/table';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type MonthlyAllocation } from '../types';

/** ستون‌ها از ماه‌هایی که سرویس برمی‌گرداند ساخته می‌شوند */
const buildColumns = (months: string[]): ColumnsType<MonthlyAllocation> => [
  { title: 'شرکت', dataIndex: 'companyName', fixed: 'start' },
  ...months.map((month) => ({
    title: toPersianDigits(month),
    key: month,
    render: (_value: unknown, row: MonthlyAllocation) => {
      const amount = row.amountByMonth?.[month] ?? 0;
      return amount ? formatRial(amount) : '—';
    },
  })),
];

export const MonthlyPerformanceTable = () => {
  const dashboard = useDashboardGet();
  // ترتیب ستون‌ها از سرویس ماه‌ها (تازه‌ترین اول)
  const monthsQuery = useDashboardMonths();
  const { data } = dashboard;
  const monthOptions = monthsQuery.data;
  const isFetching = dashboard.isFetching || monthsQuery.isFetching;
  const rows = data?.monthlyAllocation ?? [];
  const months = (monthOptions ?? []).map((item) => item.key ?? '');

  return (
    <PanelCard
      title="عملکرد ماهانه شرکت‌ها (مبلغ وام تخصیص‌یافته)"
      subtitle="مجموع مبلغ وام تخصیص‌یافته هر شرکت در هر ماه شمسی"
    >
      <Table<MonthlyAllocation>
        rowKey="companyId"
        columns={buildColumns(months)}
        dataSource={months.length ? rows : []}
        loading={isFetching}
        error={dashboard.isError || monthsQuery.isError}
        onRetry={() => {
          if (dashboard.isError) void dashboard.refetch();
          if (monthsQuery.isError) void monthsQuery.refetch();
        }}
        locale={{ emptyText: 'هنوز داده کافی برای این گزارش وجود ندارد.' }}
      />
    </PanelCard>
  );
};
