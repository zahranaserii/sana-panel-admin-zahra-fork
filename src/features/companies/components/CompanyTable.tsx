import { DeleteOutlined, EditOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { DeleteReasonModal, type DeleteReasonValues } from '@/component/delete-modal';
import { PanelCard } from '@/component/card';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { deleteCompany, getCompanies } from '../api';
import { type CompanyListItem } from '../types';

interface CompanyTableProps {
  onCreate: () => void;
  onEdit: (id: string) => void;
  onCancelContract: (company: CompanyListItem) => void;
}

const PAGE_SIZE = 10;

const renderStatus = (company: CompanyListItem) =>
  company.status === 'active' ? (
    <StatusChip tone="success">فعال (تمدید خودکار فعال)</StatusChip>
  ) : (
    <StatusChip tone="error">
      لغوشده در {formatJalali(company.cancelDate, undefined, { persianDigits: true })} (
      {company.cancelReason ?? '—'})
    </StatusChip>
  );

export const CompanyTable = ({ onCreate, onEdit, onCancelContract }: CompanyTableProps) => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<CompanyListItem | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.COMPANIES.LIST(page, PAGE_SIZE),
    queryFn: () => getCompanies({ page, pageSize: PAGE_SIZE }),
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: ({ description }: DeleteReasonValues) =>
      deleteCompany(deleting?.id ?? '', { description: description.trim() }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOKUPS.COMPANIES });
      toast.success('شرکت حذف شد.');
    },
  });

  const columns: ColumnsType<CompanyListItem> = [
    { title: 'نام شرکت', dataIndex: 'name' },
    { title: 'شناسه ملی', dataIndex: 'nationalId' },
    { title: 'شماره تفاهم‌نامه', dataIndex: 'agreementNo' },
    {
      title: 'تاریخ قرارداد',
      dataIndex: 'contractDate',
      render: (value: string) => formatJalali(value, undefined, { persianDigits: true }),
    },
    {
      title: 'تعداد طرح',
      dataIndex: 'planCount',
      align: 'center',
      render: (value: number) => toPersianDigits(value),
    },
    { title: 'ثبت‌کننده', dataIndex: 'registeredBy', className: 'text-[11.5px]' },
    { title: 'وضعیت قرارداد', key: 'status', render: (_value, row) => renderStatus(row) },
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
          {row.status === 'active' && (
            <Button
              variant="secondary"
              size="small"
              icon={<StopOutlined />}
              onClick={() => onCancelContract(row)}
            >
              لغو قرارداد
            </Button>
          )}
          <Button
            variant="secondary"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => setDeleting(row)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PanelCard
      title="فهرست شرکت‌های ثبت‌شده"
      extra={
        <Button variant="outline" size="small" icon={<PlusOutlined />} onClick={onCreate}>
          ثبت شرکت
        </Button>
      }
    >
      <Table<CompanyListItem>
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        showRowNumber
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
      <DeleteReasonModal
        open={Boolean(deleting)}
        title={`حذف شرکت «${deleting?.name ?? ''}»`}
        message="اطلاعات این شرکت برای گزارش‌گیری نگه داشته می‌شود و در لیست‌های فعال دیگر نمایش داده نمی‌شود."
        onSubmit={remove}
        onClose={() => setDeleting(null)}
      />
    </PanelCard>
  );
};
