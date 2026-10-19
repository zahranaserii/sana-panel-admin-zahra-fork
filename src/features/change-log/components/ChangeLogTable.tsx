import { DownloadOutlined, RollbackOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { SelectInput } from '@/component/input';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { ROLES } from '@/constant/roles';
import { useProfileStore } from '@/store/useProfileStore';
import { dayjs, toPersianDigits } from '@/utils/date';

import { exportAuditLogs, getAuditLogs, getAuditLogTypes, rollbackAuditLog } from '../api';
import { type AuditLog, type AuditLogType } from '../types';

const PAGE_SIZE = 20;
const ALL = 'all';

const toJalaliDateTime = (iso: string) =>
  toPersianDigits(dayjs(iso).formatJalali('YYYY/MM/DD HH:mm'));

export const ChangeLogTable = () => {
  const [type, setType] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { modal } = App.useApp();
  const canRollback = useProfileStore((state) => state.hasRole(ROLES.ADMIN));
  const typeParam = type === ALL ? undefined : (type as AuditLogType);

  const { data: types } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.AUDIT_LOG_TYPES,
    queryFn: getAuditLogTypes,
  });
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.AUDIT_LOGS.LIST(typeParam, page),
    queryFn: () => getAuditLogs({ type: typeParam, page, pageSize: PAGE_SIZE }),
  });

  const { mutate: rollback } = useMutation({
    mutationFn: rollbackAuditLog,
    onSuccess: () => {
      // موجودیت بازگردانی‌شده ممکن است در هر صفحه‌ای نمایش داده شود
      void queryClient.invalidateQueries();
      toast.success('بازگردانی با موفقیت انجام شد.');
    },
  });

  const { mutate: download, isPending: isExporting } = useMutation({ mutationFn: exportAuditLogs });

  const confirmRollback = (log: AuditLog) =>
    modal.confirm({
      title: 'بازگردانی تغییر به حالت قبل',
      content: log.details,
      okText: 'بازگردانی',
      cancelText: 'انصراف',
      onOk: () => rollback(log.id),
    });

  const renderRollback = (log: AuditLog) => {
    if (log.rolledBack) return <StatusChip tone="warning">بازگردانی‌شده</StatusChip>;
    if (canRollback && log.canRollback) {
      return (
        <Button
          variant="secondary"
          size="small"
          icon={<RollbackOutlined />}
          onClick={() => confirmRollback(log)}
        >
          بازگردانی
        </Button>
      );
    }
    return '—';
  };

  const columns: ColumnsType<AuditLog> = [
    { title: 'تاریخ و ساعت', dataIndex: 'createdAt', render: toJalaliDateTime, width: 150 },
    { title: 'کاربر', dataIndex: 'user', width: 190 },
    { title: 'نوع عملیات', dataIndex: 'typeTitle', width: 120 },
    { title: 'جزئیات', dataIndex: 'details', className: 'whitespace-normal' },
    {
      title: 'بازگردانی',
      key: 'rollback',
      width: 130,
      render: (_value, row) => renderRollback(row),
    },
  ];

  const changeType = (value: string) => {
    setType(value);
    setPage(1);
  };

  return (
    <PanelCard
      title="گزارش تغییرات سامانه"
      subtitle="هر ثبت، ویرایش، لغو یا حذف در سامانه همراه با نام کاربر و تاریخ در این فهرست ثبت می‌شود."
      extra={
        <>
          <SelectInput
            size="small"
            allowClear={false}
            style={{ minWidth: 200 }}
            aria-label="نوع عملیات"
            value={type}
            onChange={changeType}
            options={[
              { value: ALL, label: 'همه انواع عملیات' },
              ...(types ?? []).map((item) => ({ value: item.id, label: item.title })),
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
      <Table<AuditLog>
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
    </PanelCard>
  );
};
