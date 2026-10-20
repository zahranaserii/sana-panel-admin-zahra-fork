import { DownloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

import { useChangeLogsSearch } from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { SelectInput } from '@/component/input';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { ROLES } from '@/constant/roles';
import { useProfileStore } from '@/store/useProfileStore';
import { dayjs, toPersianDigits } from '@/utils/date';

import { exportChangeLogs, getChangeLogCategories } from '../api';
import { type ChangeLogCategory, type ChangeLogItem } from '../types';

import { RestoreModal } from './RestoreModal';

const PAGE_SIZE = 20;
const ALL = 0;

const toJalaliDateTime = (iso?: string) =>
  iso ? toPersianDigits(dayjs(iso).formatJalali('YYYY/MM/DD HH:mm')) : '—';

const userLabel = ({ user }: ChangeLogItem) =>
  [user?.userName, user?.branchName].filter(Boolean).join(' — ') || '—';

export const ChangeLogTable = () => {
  const [category, setCategory] = useState<number>(ALL);
  const [page, setPage] = useState(1);
  const [restoring, setRestoring] = useState<ChangeLogItem | null>(null);
  const isAdmin = useProfileStore((state) => state.hasRole(ROLES.ADMIN));

  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.AUDIT_LOG_TYPES,
    queryFn: getChangeLogCategories,
  });
  const categoryTitle = useMemo(
    () => new Map((categories ?? []).map((item) => [item.id, item.title])),
    [categories],
  );

  const filters = { Category: category === ALL ? undefined : (category as ChangeLogCategory) };
  const { data, isFetching } = useChangeLogsSearch({ ...filters, Page: page, PageSize: PAGE_SIZE });

  const { mutate: download, isPending: isExporting } = useMutation({
    mutationFn: () => exportChangeLogs(filters),
  });

  const renderRestore = (log: ChangeLogItem) => {
    if (log.restoredAt) return <StatusChip tone="warning">بازگردانی‌شده</StatusChip>;
    if (isAdmin && log.canRestore) {
      return (
        <Button
          variant="secondary"
          size="small"
          icon={<RollbackOutlined />}
          onClick={() => setRestoring(log)}
        >
          بازگردانی
        </Button>
      );
    }
    return '—';
  };

  const columns: ColumnsType<ChangeLogItem> = [
    { title: 'تاریخ و ساعت', dataIndex: 'at', render: toJalaliDateTime, width: 150 },
    { title: 'کاربر', key: 'user', render: (_value, row) => userLabel(row), width: 190 },
    {
      title: 'نوع عملیات',
      dataIndex: 'category',
      render: (value?: number) => (value ? (categoryTitle.get(value) ?? '—') : '—'),
      width: 130,
    },
    { title: 'جزئیات', dataIndex: 'details', className: 'whitespace-normal' },
    { title: 'بازگردانی', key: 'restore', width: 130, render: (_value, row) => renderRestore(row) },
  ];

  const changeCategory = (value: number) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <PanelCard
      title="گزارش تغییرات سامانه"
      subtitle="هر ثبت، ویرایش، لغو یا حذف در سامانه همراه با نام کاربر و تاریخ در این فهرست ثبت می‌شود."
      extra={
        <>
          <SelectInput<number>
            size="small"
            allowClear={false}
            style={{ minWidth: 200 }}
            aria-label="نوع عملیات"
            value={category}
            onChange={changeCategory}
            options={[
              { value: ALL, label: 'همه انواع عملیات' },
              ...(categories ?? []).map((item) => ({ value: item.id, label: item.title })),
            ]}
          />
          <Button
            size="small"
            icon={<DownloadOutlined />}
            loading={isExporting}
            onClick={() => download()}
          >
            خروجی اکسل گزارش
          </Button>
        </>
      }
    >
      <Table<ChangeLogItem>
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        maxHeight={600}
        // عرض ثابت تا ستون جزئیات چندخطی شود و ستون بازگردانی دیده شود
        scroll={{ x: 1000 }}
        locale={{ emptyText: 'هنوز رویدادی ثبت نشده است.' }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
      <RestoreModal log={restoring} onClose={() => setRestoring(null)} />
    </PanelCard>
  );
};
