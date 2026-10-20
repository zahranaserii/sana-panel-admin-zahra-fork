import { DeleteOutlined, EditOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getCompaniesLookupQueryKey,
  getCompaniesSearchQueryKey,
  useCompaniesDelete,
  useCompaniesSearch,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { DeleteReasonModal, type DeleteReasonValues } from '@/component/delete-modal';
import { PanelCard } from '@/component/card';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { useEnums } from '@/services/enums';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { type CompanyListItem } from '../types';

interface CompanyTableProps {
  onCreate: () => void;
  onEdit: (id: number) => void;
  onCancelContract: (company: CompanyListItem) => void;
}

const PAGE_SIZE = 10;

/** وضعیت شرکت بک‌اند: ۱ فعال، ۲ لغوشده */
const ACTIVE = 1;
const CANCELLED = 2;

const registrarLabel = ({ registrar }: CompanyListItem) =>
  [registrar?.branchName, registrar?.userName].filter(Boolean).join(' — ') || '—';

export const CompanyTable = ({ onCreate, onEdit, onCancelContract }: CompanyTableProps) => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<CompanyListItem | null>(null);

  const enums = useEnums();

  const { data, isFetching } = useCompaniesSearch({ Page: page, PageSize: PAGE_SIZE });

  const { mutateAsync: deleteCompany } = useCompaniesDelete({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getCompaniesSearchQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getCompaniesLookupQueryKey() });
        toast.success('شرکت حذف شد.');
      },
    },
  });

  const remove = ({ description }: DeleteReasonValues) =>
    deleteCompany({ id: deleting?.id ?? 0, data: { description: description.trim() } });

  const renderStatus = (company: CompanyListItem) => {
    if (company.status === ACTIVE) {
      return <StatusChip tone="success">فعال (تمدید خودکار فعال)</StatusChip>;
    }
    if (company.status === CANCELLED) {
      return (
        <StatusChip tone="error">
          لغوشده در {formatJalali(company.cancelDate, undefined, { persianDigits: true })} (
          {company.cancelReasonTitle ?? '—'})
        </StatusChip>
      );
    }
    return <StatusChip tone="default">{enums.title('companyStatus', company.status)}</StatusChip>;
  };

  const columns: ColumnsType<CompanyListItem> = [
    { title: 'نام شرکت', dataIndex: 'name' },
    { title: 'شناسه ملی', dataIndex: 'nationalId' },
    { title: 'شماره تفاهم‌نامه', dataIndex: 'agreementNumber' },
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
    {
      title: 'ثبت‌کننده',
      key: 'registrar',
      className: 'text-[11.5px]',
      render: (_value, row) => registrarLabel(row),
    },
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
            onClick={() => onEdit(row.id ?? 0)}
          >
            ویرایش
          </Button>
          {row.status === ACTIVE && (
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
        rowKey="id"
        columns={columns}
        dataSource={data?.page?.items}
        loading={isFetching}
        showRowNumber
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.page?.totalCount ?? 0,
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
