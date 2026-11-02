import { StopOutlined } from '@ant-design/icons';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { useLoansSearch } from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { LoanStatusChip } from '@/component/loan-status';
import { Table, usePaging } from '@/component/table';
import { formatJalali, toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type LoanRequest } from '../types';

import { CancelLoanModal } from './CancelLoanModal';

const toJalali = (value?: string | null) =>
  value ? formatJalali(value, undefined, { persianDigits: true }) : '—';

/** همه درخواست‌های وام ثبت‌شده برای شرکت */
export const CompanyLoanRequests = ({ companyId }: { companyId: number }) => {
  const { page, pageSize, onPageChange } = usePaging();
  const [cancelling, setCancelling] = useState<LoanRequest | null>(null);
  const { data, isFetching, isError, refetch } = useLoansSearch({
    CompanyId: companyId,
    Page: page,
    PageSize: pageSize,
  });

  const columns: ColumnsType<LoanRequest> = [
    {
      title: 'پرسنل',
      key: 'personnel',
      render: (_value, row) => (
        <>
          {row.personnelName}{' '}
          <span className="text-xs text-ink-soft">
            (ترتیب پرداخت: {toPersianDigits(row.paymentOrder ?? 0)})
          </span>
        </>
      ),
    },
    { title: 'طرح', dataIndex: 'planTitle' },
    { title: 'مبلغ', dataIndex: 'amount', render: formatRial },
    { title: 'تاریخ ثبت', dataIndex: 'createdAt', render: toJalali },
    { title: 'تاریخ تأیید/رد', dataIndex: 'decidedAt', render: toJalali },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      render: (status?: number) => <LoanStatusChip status={status} />,
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) =>
        row.canCancel ? (
          <Button
            variant="secondary"
            size="small"
            icon={<StopOutlined />}
            onClick={() => setCancelling(row)}
          >
            لغو
          </Button>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <PanelCard
      title="درخواست‌های وام این شرکت"
      subtitle="فهرست همه درخواست‌های ثبت‌شده برای شرکت انتخاب‌شده، با تاریخ ثبت، تاریخ تأیید/رد و وضعیت"
    >
      <Table<LoanRequest>
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'هنوز درخواستی برای این شرکت ثبت نشده است.' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data?.totalCount ?? 0,
          onChange: onPageChange,
        }}
      />
      <CancelLoanModal request={cancelling} onClose={() => setCancelling(null)} />
    </PanelCard>
  );
};
