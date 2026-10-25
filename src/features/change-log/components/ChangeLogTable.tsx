import { DownloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { useChangeLogsSearch, useChangeLogsUsers } from '@/api/generated/facility';
import { type CommonRegistrarDto } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { SelectInput } from '@/component/input';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { useEnums } from '@/services/enums';
import { dayjs, toPersianDigits } from '@/utils/date';

import { exportChangeLogs } from '../api';
import { type ChangeLogCategory, type ChangeLogItem } from '../types';

import { RestoreModal } from './RestoreModal';

const PAGE_SIZE = 20;
const ALL = 0;

const toJalaliDateTime = (iso?: string) =>
  iso ? toPersianDigits(dayjs(iso).formatJalali('YYYY/MM/DD HH:mm')) : '—';

const userLabel = (user?: CommonRegistrarDto | null) =>
  [user?.userName, user?.branchName].filter(Boolean).join(' — ') || '—';

export const ChangeLogTable = () => {
  const [category, setCategory] = useState<number>(ALL);
  const [panelUserId, setPanelUserId] = useState<number>(ALL);
  const [page, setPage] = useState(1);
  const [restoring, setRestoring] = useState<ChangeLogItem | null>(null);

  const enums = useEnums();
  const usersQuery = useChangeLogsUsers();
  const users = usersQuery.data;

  const filters = {
    Category: category === ALL ? undefined : (category as ChangeLogCategory),
    PanelUserId: panelUserId === ALL ? undefined : panelUserId,
  };
  const { data, isFetching, isError, refetch } = useChangeLogsSearch({
    ...filters,
    Page: page,
    PageSize: PAGE_SIZE,
  });

  const { mutate: download, isPending: isExporting } = useMutation({
    mutationFn: () => exportChangeLogs(filters),
  });

  const renderRestore = (log: ChangeLogItem) => {
    if (log.restoredAt) return <StatusChip tone="warning">بازگردانی‌شده</StatusChip>;
    if (log.canRestore) {
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
    { title: 'کاربر', key: 'user', render: (_value, row) => userLabel(row.user), width: 190 },
    {
      title: 'نوع عملیات',
      dataIndex: 'category',
      render: (value?: number) => enums.title('changeLogCategory', value),
      width: 130,
    },
    { title: 'جزئیات', dataIndex: 'details', className: 'whitespace-normal' },
    { title: 'بازگردانی', key: 'restore', width: 130, render: (_value, row) => renderRestore(row) },
  ];

  const changeCategory = (value: number) => {
    setCategory(value);
    setPage(1);
  };

  const changeUser = (value: number) => {
    setPanelUserId(value);
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
            {...enums.selectProps}
            error={!enums.catalog}
            value={category}
            onChange={changeCategory}
            options={[
              { value: ALL, label: 'همه انواع عملیات' },
              ...enums.options('changeLogCategory'),
            ]}
          />
          <SelectInput<number>
            size="small"
            allowClear={false}
            style={{ minWidth: 200 }}
            aria-label="کاربر"
            loading={usersQuery.isFetching}
            error={usersQuery.isError}
            onRetry={() => void usersQuery.refetch()}
            value={panelUserId}
            onChange={changeUser}
            options={[
              { value: ALL, label: 'همه کاربران' },
              ...(users ?? []).map((user) => ({
                value: user.panelUserId ?? 0,
                label: userLabel(user),
              })),
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
        error={isError}
        onRetry={() => void refetch()}
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
