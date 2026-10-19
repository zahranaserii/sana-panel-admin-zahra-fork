import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { deleteStaff, getStaffList } from '../api';
import { type Staff, type StaffFilters } from '../types';

interface StaffTableProps {
  companyId: string;
  filters: StaffFilters;
  onEdit: (id: string) => void;
}

const PAGE_SIZE = 10;

export const StaffTable = ({ companyId, filters, onEdit }: StaffTableProps) => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.STAFF.LIST(companyId, filters, page),
    queryFn: () => getStaffList(companyId, { ...filters, page, pageSize: PAGE_SIZE }),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteStaff(companyId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF.ALL });
      toast.success('پرسنل حذف شد.');
    },
  });

  const confirmDelete = (staff: Staff) =>
    modal.confirm({
      title: `حذف «${staff.fullName}»`,
      content: 'این پرسنل از فهرست پرسنل شرکت حذف می‌شود. آیا مطمئن هستید؟',
      okText: 'حذف',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: () => remove(staff.id),
    });

  const columns: ColumnsType<Staff> = [
    {
      title: 'اولویت',
      dataIndex: 'priority',
      align: 'center',
      render: (value: number) => <b>{toPersianDigits(value)}</b>,
    },
    { title: 'نام', dataIndex: 'fullName' },
    { title: 'کد ملی', dataIndex: 'nationalId' },
    { title: 'موبایل', dataIndex: 'mobile' },
    { title: 'کد پرسنلی', dataIndex: 'personnelCode' },
    {
      title: 'تاریخ استخدام',
      dataIndex: 'hireDate',
      render: (value: string) => formatJalali(value, undefined, { persianDigits: true }),
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
            onClick={() => onEdit(row.id)}
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
    <Table<Staff>
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
  );
};
