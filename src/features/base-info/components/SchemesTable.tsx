import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { ROUTES } from '@/constant/routes';
import { toPersianDigits } from '@/utils/date';

import { deleteScheme, getSchemes } from '../api';
import { type SchemeListItem } from '../types';

const PAGE_SIZE = 10;

const joinNumbers = (list: number[], suffix = '') =>
  list.map((value) => toPersianDigits(value) + suffix).join('، ');

export const SchemesTable = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.BASE_INFO.LIST(page),
    queryFn: () => getSchemes({ page, pageSize: PAGE_SIZE }),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteScheme,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BASE_INFO.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOKUPS.PLANS });
      toast.success('طرح حذف شد.');
    },
  });

  const confirmDelete = (scheme: SchemeListItem) =>
    modal.confirm({
      title: `حذف طرح «${scheme.name}»`,
      content: 'طرح با همه اطلاعات پایه آن (نرخ‌ها، مدت‌ها، دلایل و انواع مستند) حذف می‌شود.',
      okText: 'حذف',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: () => remove(scheme.id),
    });

  const columns: ColumnsType<SchemeListItem> = [
    { title: 'نام طرح', dataIndex: 'name' },
    {
      title: 'نرخ قرض‌الحسنه',
      dataIndex: 'qarzRate',
      render: (v: number) => toPersianDigits(v) + '٪',
    },
    {
      title: 'نرخ‌های مرابحه',
      dataIndex: 'murabahaRates',
      render: (v: number[]) => joinNumbers(v, '٪'),
    },
    {
      title: 'مدت‌های بازپرداخت (ماه)',
      dataIndex: 'terms',
      render: (v: number[]) => joinNumbers(v),
    },
    {
      title: 'مدت قرارداد',
      dataIndex: 'contractYears',
      render: (v: number) => toPersianDigits(v) + ' سال',
    },
    { title: 'حداکثر طرح', dataIndex: 'maxPlans', render: (v: number) => toPersianDigits(v) },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(generatePath(ROUTES.BASE_INFO_EDIT, { id: row.id }))}
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
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        showRowNumber
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
