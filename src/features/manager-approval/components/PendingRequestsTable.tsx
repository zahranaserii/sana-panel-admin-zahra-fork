import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getApprovalsCreditQueueQueryKey,
  getApprovalsManagerQueueQueryKey,
  getLoansCreditQueryKey,
  getLoansSearchQueryKey,
  useApprovalsManagerDecide,
  useApprovalsManagerQueue,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { DecisionModal, showDecisionResult, type DecisionTarget } from '@/component/decision-modal';
import { LoanStatusChip } from '@/component/loan-status';
import { Table } from '@/component/table';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';
import { formatJalali } from '@/utils/date';
import { formatRial } from '@/utils/number';

import {
  DECISION,
  type DecisionFormValues,
  type DecisionType,
  type PendingRequest,
} from '../types';

const PAGE_SIZE = 10;

export const PendingRequestsTable = ({ companyId }: { companyId: number }) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PendingRequest[]>([]);
  const [target, setTarget] = useState<DecisionTarget | null>(null);

  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching } = useApprovalsManagerQueue({
    CompanyId: companyId,
    Page: page,
    PageSize: PAGE_SIZE,
  });

  const { mutateAsync } = useApprovalsManagerDecide({
    mutation: {
      onSuccess: (result) => {
        void queryClient.invalidateQueries({ queryKey: getApprovalsManagerQueueQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getApprovalsCreditQueueQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getLoansSearchQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getLoansCreditQueryKey(companyId) });
        setSelected([]);
        const doneText =
          target?.type === 'reject' ? 'رد شد' : 'تأیید و به مرحله تأیید اعتبارات ارسال شد';
        showDecisionResult(modal, result, target?.requests ?? [], doneText);
      },
    },
  });

  // رد: دلیل (از «دلایل رد درخواست وام»، همان فهرست اعتبارات) و توضیح الزامی
  const rejectReasons = useReasonOptions(REASON_TYPE.LOAN_REJECT);

  const decide = ({ description, reasonId }: DecisionFormValues) =>
    mutateAsync({
      data: {
        reasonId: target?.type === 'reject' ? reasonId : null,
        requestIds: target?.requests.map((item) => item.id ?? 0) ?? [],
        decision: DECISION[target?.type ?? 'approve'],
        description: description?.trim() ? description.trim() : null,
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
    { title: 'پرسنل', dataIndex: 'personnelName' },
    { title: 'طرح', dataIndex: 'planTitle' },
    { title: 'مبلغ', dataIndex: 'amount', render: formatRial },
    {
      title: 'تاریخ ثبت',
      dataIndex: 'createdAt',
      render: (value: string) => formatJalali(value, undefined, { persianDigits: true }),
    },
    {
      title: 'توضیحات',
      dataIndex: 'description',
      render: (value?: string | null) => value ?? '—',
    },
    {
      title: 'وضعیت',
      dataIndex: 'status',
      render: (status?: number) => <LoanStatusChip status={status} />,
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
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        locale={{ emptyText: 'درخواستی در انتظار تأیید مدیر شرکت نیست.' }}
        rowSelection={{
          selectedRowKeys: selected.map((item) => item.id ?? 0),
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
      <DecisionModal
        target={target}
        allowFile={false}
        rejectReasons={rejectReasons.options}
        requireRejectNote
        onSubmit={decide}
        onClose={() => setTarget(null)}
      />
    </>
  );
};
