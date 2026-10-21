import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useBasicInfoSchemeDelete, useBasicInfoSchemeSearch } from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { ROUTES } from '@/constant/routes';
import { toPersianDigits } from '@/utils/date';

import { type SchemeListItem } from '../types';
import { invalidateBasicInfo } from '../utils';

const PAGE_SIZE = 10;

const joinNumbers = (list: number[] = [], suffix = '') =>
  list.map((value) => toPersianDigits(value) + suffix).join('، ') || '—';

const number = (value?: number, suffix = '') =>
  value === undefined ? '—' : toPersianDigits(value) + suffix;

const DATA_COLUMNS: ColumnsType<SchemeListItem> = [
  { title: 'نام طرح', dataIndex: 'title' },
  { title: 'کد', dataIndex: 'code', render: (value?: string) => value ?? '—' },
  {
    title: 'نرخ قرض‌الحسنه',
    dataIndex: 'qardHasanRate',
    render: (value?: number) => number(value, '٪'),
  },
  {
    title: 'نرخ‌های مرابحه',
    dataIndex: 'murabahaRates',
    render: (value?: number[]) => joinNumbers(value, '٪'),
  },
  {
    title: 'مدت‌های بازپرداخت (ماه)',
    dataIndex: 'repaymentTermsMonths',
    render: (value?: number[]) => joinNumbers(value),
  },
  {
    title: 'مدت قرارداد',
    dataIndex: 'contractDurationMonths',
    render: (value?: number) => number(value, ' ماه'),
  },
  {
    title: 'حداکثر طرح',
    dataIndex: 'maxPlansPerCompany',
    render: (value?: number) => number(value),
  },
  { title: 'تعداد شرکت', dataIndex: 'companyCount', render: (value?: number) => number(value) },
  {
    title: 'وضعیت',
    dataIndex: 'isActive',
    render: (value?: boolean) =>
      value ? (
        <StatusChip tone="success">فعال</StatusChip>
      ) : (
        <StatusChip tone="default">غیرفعال</StatusChip>
      ),
  },
];

export const SchemesTable = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching, isError, refetch } = useBasicInfoSchemeSearch({
    IncludeInactive: true,
    Page: page,
    PageSize: PAGE_SIZE,
  });

  const { mutateAsync: remove } = useBasicInfoSchemeDelete({
    mutation: {
      onSuccess: () => {
        void invalidateBasicInfo(queryClient);
        toast.success('طرح حذف شد.');
      },
    },
  });

  const confirmDelete = (scheme: SchemeListItem) =>
    modal.confirm({
      title: `حذف طرح «${scheme.title}»`,
      content: 'طرح با همه اطلاعات پایه آن (نرخ‌ها، مدت‌ها، دلایل و انواع مستند) حذف می‌شود.',
      okText: 'حذف',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: () => remove({ schemeId: scheme.id ?? 0 }),
    });

  const columns: ColumnsType<SchemeListItem> = [
    ...DATA_COLUMNS,
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(generatePath(ROUTES.BASE_INFO_EDIT, { id: String(row.id) }))}
          >
            ویرایش
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(row)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PanelCard
      title="طرح‌ها"
      subtitle="اطلاعات پایه هر طرح (نرخ‌ها، مدت‌ها، درصد قابل استفاده، دلایل و انواع مستند) در صفحه افزودن و ویرایش طرح تعریف می‌شود."
      extra={
        <Button
          variant="outline"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.BASE_INFO_NEW)}
        >
          افزودن طرح
        </Button>
      }
    >
      <Table<SchemeListItem>
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        showRowNumber
        scroll={{ x: 1100 }}
        locale={{ emptyText: 'طرحی ثبت نشده است.' }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
    </PanelCard>
  );
};
