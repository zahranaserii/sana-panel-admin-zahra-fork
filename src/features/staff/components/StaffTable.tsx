import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getPersonnelSearchQueryKey,
  usePersonnelDelete,
  usePersonnelSearch,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { DeleteReasonModal, type DeleteReasonValues } from '@/component/delete-modal';
import { StatusChip, type StatusTone } from '@/component/status-chip';
import { Table } from '@/component/table';
import { useEnums } from '@/services/enums';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { type Staff, type StaffFilters, toSearchParams } from '../types';

interface StaffTableProps {
  companyId: number;
  filters: StaffFilters;
  onEdit: (id: number) => void;
}

const PAGE_SIZE = 10;

/** رنگ وضعیت پرسنل (۱ در انتظار تأیید مدیر، ۲ تأییدشده، ۳ ردشده) */
const STATUS_TONE: Record<number, StatusTone> = { 1: 'warning', 2: 'success', 3: 'error' };

const LOCKED_TITLE = 'این پرسنل در وام استفاده شده و قابل ویرایش یا حذف نیست.';

export const StaffTable = ({ companyId, filters, onEdit }: StaffTableProps) => {
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Staff | null>(null);
  const queryClient = useQueryClient();
  const enums = useEnums();

  const { data, isFetching } = usePersonnelSearch(companyId, {
    ...toSearchParams(filters),
    Page: page,
    PageSize: PAGE_SIZE,
  });

  const { mutateAsync: deleteStaff } = usePersonnelDelete({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getPersonnelSearchQueryKey(companyId) });
        toast.success('پرسنل حذف شد.');
      },
    },
  });

  /** حذف با توضیح و فایل مستند (هر دو الزامی، multipart) */
  const remove = ({ description, file }: DeleteReasonValues) =>
    deleteStaff({
      id: deleting?.id ?? 0,
      data: { Description: description.trim(), file: file ?? undefined },
    });

  const columns: ColumnsType<Staff> = [
    {
      title: 'اولویت',
      dataIndex: 'priority',
      align: 'center',
      render: (value: number) => <b>{toPersianDigits(value)}</b>,
    },
    { title: 'نام', dataIndex: 'fullName' },
    { title: 'کد ملی', dataIndex: 'nationalCode' },
    { title: 'موبایل', dataIndex: 'mobile' },
    { title: 'کد پرسنلی', dataIndex: 'personnelCode' },
    {
      title: 'تاریخ استخدام',
      dataIndex: 'hireDate',
      render: (value: string) => formatJalali(value, undefined, { persianDigits: true }),
    },
    {
      title: 'وضعیت',
      key: 'status',
      render: (_value, row) => (
        <StatusChip tone={STATUS_TONE[row.status ?? 0] ?? 'default'}>
          {enums.title('personnelStatus', row.status)}
          {row.rejectReason ? ` (${row.rejectReason})` : ''}
        </StatusChip>
      ),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="small"
            icon={<EditOutlined />}
            disabled={row.isLocked}
            title={row.isLocked ? LOCKED_TITLE : undefined}
            onClick={() => onEdit(row.id ?? 0)}
          >
            ویرایش
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<DeleteOutlined />}
            disabled={row.isLocked}
            title={row.isLocked ? LOCKED_TITLE : undefined}
            onClick={() => setDeleting(row)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<Staff>
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        locale={{ emptyText: 'پرسنلی با این شرایط یافت نشد.' }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
      <DeleteReasonModal
        open={Boolean(deleting)}
        title={`حذف «${deleting?.fullName ?? ''}»`}
        message="این پرسنل از فهرست پرسنل شرکت حذف می‌شود."
        requireFile
        onSubmit={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
};
