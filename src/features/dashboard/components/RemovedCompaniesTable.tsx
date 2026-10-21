import { type ColumnsType } from 'antd/es/table';

import { useDashboardGet } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { useEnums } from '@/services/enums';
import { formatJalali, toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type RemovedCompany } from '../types';

/** وضعیت شرکت بک‌اند: ۳ حذف‌شده */
const DELETED = 3;

const rial = (value?: number | null) =>
  value === null || value === undefined ? '—' : formatRial(value);

export const RemovedCompaniesTable = () => {
  const { data, isFetching, isError, refetch } = useDashboardGet();
  const { title } = useEnums();

  const columns: ColumnsType<RemovedCompany> = [
    { title: 'شرکت', dataIndex: 'companyName' },
    {
      title: 'وضعیت',
      dataIndex: 'removalKind',
      render: (kind?: number) => (
        <StatusChip tone={kind === DELETED ? 'default' : 'error'}>
          {title('companyStatus', kind)}
        </StatusChip>
      ),
    },
    {
      title: 'تاریخ حذف/لغو',
      dataIndex: 'removedAt',
      render: (value?: string) =>
        value ? formatJalali(value, undefined, { persianDigits: true }) : '—',
    },
    { title: 'میانگین موجودی', dataIndex: 'averageBalance', render: rial },
    { title: 'مجموع وام تخصیص‌یافته', dataIndex: 'allocatedTotal', render: rial },
    {
      title: 'تعداد درخواست',
      dataIndex: 'requestCount',
      render: (value?: number) => toPersianDigits(value ?? 0),
    },
    {
      title: 'نرخ تأیید',
      dataIndex: 'approvalRate',
      // null یعنی درخواستی نداشته
      render: (value?: number | null) =>
        value === null || value === undefined ? '—' : toPersianDigits(`${value}٪`),
    },
  ];

  return (
    <PanelCard
      title="شرکت‌های حذف‌شده/لغوشده"
      subtitle="عملکرد شرکت‌هایی که از سامانه حذف یا قراردادشان لغو شده، برای ارزیابی اینکه همکاری خوبی بوده یا نه"
    >
      <Table<RemovedCompany>
        rowKey="companyId"
        columns={columns}
        dataSource={data?.removedCompanies}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'شرکت حذف‌شده‌ای وجود ندارد.' }}
      />
    </PanelCard>
  );
};
