import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { useDashboardMonths, useDashboardRanking } from '@/api/generated/facility';
import { type ReadModelsCompanyRankingSort } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { PanelCard } from '@/component/card';
import { SelectInput } from '@/component/input';
import { Table } from '@/component/table';
import { useEnums } from '@/services/enums';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type CompanyRank } from '../types';

const ALL_MONTHS = 'all';
/** مرتب‌سازی پیش‌فرض: میانگین موجودی */
const DEFAULT_SORT = 1;

const count = (value?: number) => toPersianDigits(value ?? 0);
const rial = (value?: number | null) =>
  value === null || value === undefined ? '—' : formatRial(value);

const columns: ColumnsType<CompanyRank> = [
  {
    title: 'رتبه',
    dataIndex: 'rank',
    align: 'center',
    render: (value?: number) => <b>{count(value)}</b>,
  },
  { title: 'شرکت', dataIndex: 'companyName' },
  { title: 'میانگین موجودی', dataIndex: 'averageBalance', render: rial },
  { title: 'مجموع وام تخصیص‌یافته', dataIndex: 'allocatedAmount', render: rial },
  { title: 'تعداد درخواست', dataIndex: 'requestCount', render: count },
  { title: 'تعداد پرسنل', dataIndex: 'personnelCount', render: count },
  { title: 'وضعیت', dataIndex: 'status' },
];

export const CompanyRanking = () => {
  const [month, setMonth] = useState<string>(ALL_MONTHS);
  const [sortBy, setSortBy] = useState<number>(DEFAULT_SORT);
  const enums = useEnums();

  const monthsQuery = useDashboardMonths();
  const months = monthsQuery.data;
  const { data, isFetching, isError, refetch } = useDashboardRanking({
    Month: month === ALL_MONTHS ? undefined : month,
    SortBy: sortBy as ReadModelsCompanyRankingSort,
  });

  return (
    <PanelCard
      title="رتبه‌بندی شرکت‌ها"
      subtitle="وقتی یک ماه خاص انتخاب شود، ستون‌های «وام تخصیص‌یافته» و «تعداد درخواست» فقط همان ماه را نشان می‌دهند."
      extra={
        <>
          <SelectInput
            size="small"
            allowClear={false}
            style={{ minWidth: 180 }}
            aria-label="ماه"
            loading={monthsQuery.isFetching}
            error={monthsQuery.isError}
            onRetry={() => void monthsQuery.refetch()}
            value={month}
            onChange={setMonth}
            options={[
              { value: ALL_MONTHS, label: 'همه ماه‌ها (تجمعی)' },
              ...(months ?? []).map((item) => ({ value: item.key, label: item.title })),
            ]}
          />
          <SelectInput<number>
            size="small"
            allowClear={false}
            showSearch={false}
            style={{ minWidth: 220 }}
            aria-label="مرتب‌سازی"
            {...enums.selectProps}
            value={sortBy}
            onChange={setSortBy}
            options={enums.options('companyRankingSort')}
          />
        </>
      }
    >
      <Table<CompanyRank>
        rowKey="companyId"
        columns={columns}
        dataSource={data ?? []}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'هنوز شرکتی ثبت نشده است.' }}
      />
    </PanelCard>
  );
};
