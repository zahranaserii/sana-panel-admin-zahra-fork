import { useQuery } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';

import { PanelCard } from '@/component/card';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { LOAN_STATUS } from '@/constant/loanStatus';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { formatJalali, toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { getLoanRequests } from '../api';
import { type LoanRequest } from '../types';

const PAGE_SIZE = 10;
const toJalali = (value: string | null) =>
  value ? formatJalali(value, undefined, { persianDigits: true }) : '—';

const columns: ColumnsType<LoanRequest> = [
  {
    title: 'پرسنل',
    key: 'staff',
    render: (_value, row) => (
      <>
        {row.staffName}{' '}
        <span className="text-xs text-ink-soft">
          (ترتیب پرداخت: {toPersianDigits(row.paymentOrder)})
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
    render: (status: LoanRequest['status']) => (
      <StatusChip tone={LOAN_STATUS[status].tone}>{LOAN_STATUS[status].title}</StatusChip>
    ),
  },
];

/** همه درخواست‌های وام ثبت‌شده برای شرکت */
export const CompanyLoanRequests = ({ companyId }: { companyId: string }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.CREDIT.LOAN_REQUESTS(companyId, page),
    queryFn: () => getLoanRequests(companyId, { page, pageSize: PAGE_SIZE }),
  });

  return (
    <PanelCard
      title="درخواست‌های وام این شرکت"
      subtitle="فهرست همه درخواست‌های ثبت‌شده برای شرکت انتخاب‌شده، با تاریخ ثبت، تاریخ تأیید/رد و وضعیت"
    >
      <Table<LoanRequest>
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        locale={{ emptyText: 'هنوز درخواستی برای این شرکت ثبت نشده است.' }}
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
