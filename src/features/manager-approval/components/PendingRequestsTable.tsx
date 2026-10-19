import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { DecisionModal, type DecisionTarget } from '@/component/decision-modal';
import { StatusChip } from '@/component/status-chip';
import { Table } from '@/component/table';
import { LOAN_STATUS } from '@/constant/loanStatus';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { resolveFile } from '@/services/file';
import { formatJalali, toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { getPendingRequests, submitDecision } from '../api';
import { type DecisionFormValues, type DecisionType, type PendingRequest } from '../types';

const PAGE_SIZE = 10;

export const PendingRequestsTable = ({ companyId }: { companyId: string }) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PendingRequest[]>([]);
  const [target, setTarget] = useState<DecisionTarget | null>(null);

  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.MANAGER_APPROVALS.LIST(companyId, page),
    queryFn: () => getPendingRequests(companyId, { page, pageSize: PAGE_SIZE }),
  });

  const { mutateAsync: decide } = useMutation({
    mutationFn: async ({ file, note }: DecisionFormValues) => {
      const uploaded = await resolveFile(file);
      return submitDecision(target?.type ?? 'approve', companyId, {
        requestIds: target?.requests.map((item) => item.id) ?? [],
        note,
        fileId: uploaded?.id ?? null,
      });
    },
    onSuccess: ({ updated }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MANAGER_APPROVALS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CREDIT.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CREDIT_APPROVALS.ALL });
      setSelected([]);
      const result =
        target?.type === 'reject' ? 'رد شد' : 'تأیید و به مرحله تأیید اعتبارات ارسال شد';
      toast.success(`${toPersianDigits(updated)} درخواست ${result}.`);
    },
  });

  const openBulk = (type: DecisionType) => {
    if (!selected.length) {
      toast.error('حداقل یک درخواست را انتخاب کنید.');
      return;
    }
    setTarget({ type, requests: selected });
  };

  const columns: ColumnsType<PendingRequest> = [
    { title: 'پرسنل', dataIndex: 'staffName' },
    { title: 'طرح', dataIndex: 'planTitle' },
    { title: 'مبلغ', dataIndex: 'amount', render: formatRial },
    {
      title: 'تاریخ ثبت',
      dataIndex: 'createdAt',
      render: (value: string) => formatJalali(value, undefined, { persianDigits: true }),
    },
    { title: 'توضیحات', dataIndex: 'note', render: (value?: string) => value ?? '—' },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      render: (status: PendingRequest['status']) => (
        <StatusChip tone={LOAN_STATUS[status].tone}>{LOAN_STATUS[status].title}</StatusChip>
      ),
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            size="small"
            icon={<CheckOutlined />}
            onClick={() => setTarget({ type: 'approve', requests: [row] })}
          >
            تأیید
          </Button>
          <Button
            variant="danger"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => setTarget({ type: 'reject', requests: [row] })}
          >
            رد
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table<PendingRequest>
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        locale={{ emptyText: 'درخواستی در انتظار تأیید مدیر شرکت نیست.' }}
        rowSelection={{
          selectedRowKeys: selected.map((item) => item.id),
          onChange: (_keys, rows) => setSelected(rows),
        }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
      <div className="mt-3 flex gap-2">
        <Button size="small" icon={<CheckOutlined />} onClick={() => openBulk('approve')}>
          تأیید گروهی
        </Button>
        <Button
          variant="danger"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => openBulk('reject')}
        >
          رد گروهی
        </Button>
      </div>
      <DecisionModal target={target} onSubmit={decide} onClose={() => setTarget(null)} />
    </>
  );
};
