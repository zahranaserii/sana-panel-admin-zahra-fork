import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Table, usePaging } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { useFetchBeforeOpen } from '@/hooks';
import { toPersianDigits } from '@/utils/date';

import { deleteUser, getUser, getUsers } from '../api';
import { type User } from '../types';

import { UserFormModal } from './UserFormModal';

export const UsersTable = () => {
  const { page, pageSize, onPageChange } = usePaging();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(page, pageSize),
    queryFn: () => getUsers({ page, pageSize: pageSize }),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      toast.success('کاربر حذف شد.');
    },
  });

  const openModal = (id: number | null) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const details = useFetchBeforeOpen<number>();

  /** ویرایش: جزئیات کاربر اول گرفته می‌شود؛ با خطا مودال باز نمی‌شود */
  const openEdit = (id: number) =>
    void details.open(
      id,
      (client) =>
        client.fetchQuery({
          queryKey: QUERY_KEYS.USERS.DETAIL(id),
          queryFn: () => getUser(id),
        }),
      () => openModal(id),
    );

  const confirmDelete = (user: User) =>
    modal.confirm({
      title: `حذف کاربر «${user.fullName}»`,
      content: `کاربر با نام کاربری «${user.userName}» حذف می‌شود و دیگر امکان ورود به سامانه را ندارد.`,
      okText: 'حذف',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: () => remove(user.id),
    });

  const columns: ColumnsType<User> = [
    { title: 'نام کاربری', dataIndex: 'userName' },
    { title: 'نام و نام خانوادگی', dataIndex: 'fullName' },
    { title: 'کد کاربر', dataIndex: 'userCode', render: (v: string) => toPersianDigits(v) },
    { title: 'شعبه', dataIndex: 'branchName' },
    { title: 'کد شعبه', dataIndex: 'branchCode', render: (v: string) => toPersianDigits(v) },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="small"
            icon={<EditOutlined />}
            loading={details.loadingKey === row.id}
            onClick={() => openEdit(row.id)}
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
      title="فهرست کاربران"
      subtitle="برای هر شعبه یک کاربر با نام کاربری و رمز عبور مجزا تعریف کنید. نام و کد شعبه هنگام ثبت شرکت به‌عنوان «ثبت‌کننده» ذخیره می‌شود."
      extra={
        <Button
          variant="outline"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => openModal(null)}
        >
          افزودن کاربر
        </Button>
      }
    >
      <Table<User>
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'کاربری ثبت نشده است.' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data?.totalCount ?? 0,
          onChange: onPageChange,
        }}
      />
      <UserFormModal open={modalOpen} userId={editingId} onClose={() => setModalOpen(false)} />
    </PanelCard>
  );
};
