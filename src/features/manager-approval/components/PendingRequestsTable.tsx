import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getApprovalsCreditQueueQueryKey,
  getApprovalsManagerQueueQueryKey,
  getApprovalsPendingCountsQueryKey,
  getLoansSearchQueryKey,
  useApprovalsManagerDecide,
  useApprovalsManagerQueue,
  useApprovalsPendingCounts,
} from '@/api/generated/facility';
import { type LoanRequestStatus } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { DecisionModal, showDecisionResult, type DecisionTarget } from '@/component/decision-modal';
import { Table } from '@/component/table';
import { LOAN_STATUS } from '@/constant/loanStatus';
import { useDebouncedValue } from '@/hooks';
import {
  MIXED_SCHEMES_MESSAGE,
  REASON_TYPE,
  schemeOfRequests,
  useReasonOptions,
} from '@/services/reasons';
import { toPersianDigits } from '@/utils/date';

import {
  DECISION,
  type DecisionFormValues,
  type DecisionType,
  type PendingRequest,
} from '../types';

import { ApprovalFilters } from './ApprovalFilters';
import { buildColumns } from './columns';

interface PendingRequestsTableProps {
  /** خالی = همه شرکت‌ها */
  companyId?: string;
  onCompanyChange: (companyId: string | undefined) => void;
}

const PAGE_SIZE = 10;
/** انتهای کلید سرویس اعتبار شرکت (getLoansCreditQueryKey → Companies/{id}/Credit) */
const CREDIT_KEY_SUFFIX = '/Credit';

export const PendingRequestsTable = ({ companyId, onCompanyChange }: PendingRequestsTableProps) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LoanRequestStatus>(LOAN_STATUS.PENDING_MANAGER);
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState<PendingRequest[]>([]);
  const [target, setTarget] = useState<DecisionTarget | null>(null);
  const debouncedTerm = useDebouncedValue(term.trim());
  const isPending = status === LOAN_STATUS.PENDING_MANAGER;

  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { data, isFetching, isError, refetch } = useApprovalsManagerQueue({
    CompanyId: companyId ? Number(companyId) : undefined,
    Status: isPending ? undefined : status,
    Term: debouncedTerm || undefined,
    Page: page,
    PageSize: PAGE_SIZE,
  });
  // تعداد کل در انتظار (همه شرکت‌های دامنه کاربر)؛ خطا پیام نشان نمی‌دهد
  const { data: counts } = useApprovalsPendingCounts({ request: { silent: true } });

  const { mutateAsync } = useApprovalsManagerDecide({
    mutation: {
      onSuccess: (result) => {
        void queryClient.invalidateQueries({ queryKey: getApprovalsManagerQueueQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getApprovalsCreditQueueQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getApprovalsPendingCountsQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getLoansSearchQueryKey() });
        // مانده اعتبار شرکت‌های این درخواست‌ها (با «همه شرکت‌ها» ممکن است چند شرکت باشد)
        void queryClient.invalidateQueries({
          predicate: ({ queryKey }) => String(queryKey[0]).endsWith(CREDIT_KEY_SUFFIX),
        });
        setSelected([]);
        const doneText =
          target?.type === 'reject' ? 'رد شد' : 'تأیید و به مرحله تأیید اعتبارات ارسال شد';
        showDecisionResult(modal, result, target?.requests ?? [], doneText);
      },
    },
  });

  // رد: دلیل (از «دلایل رد درخواست وام»، همان فهرست اعتبارات) و توضیح الزامی
  const targetScheme = target ? schemeOfRequests(target.requests) : undefined;
  const rejectReasons = useReasonOptions(
    REASON_TYPE.LOAN_REJECT,
    targetScheme === 'mixed' ? undefined : targetScheme,
    target?.type === 'reject',
  );

  /** multipart با پیوست اختیاری */
  const decide = ({ description, reasonId, file }: DecisionFormValues) =>
    mutateAsync({
      data: {
        RequestIds: target?.requests.map((item) => item.id ?? 0) ?? [],
        Decision: DECISION[target?.type ?? 'approve'],
        ReasonId: target?.type === 'reject' ? (reasonId ?? undefined) : undefined,
        Description: description?.trim() || undefined,
        attachment: file ?? undefined,
      },
    });

  const openBulk = (type: DecisionType) => {
    if (!selected.length) {
      toast.error('حداقل یک درخواست را انتخاب کنید.');
      return;
    }
    if (schemeOfRequests(selected) === 'mixed') {
      toast.error(MIXED_SCHEMES_MESSAGE);
      return;
    }
    setTarget({ type, requests: selected });
  };

  /** با تغییر هر فیلتر، صفحه و انتخاب‌ها از نو شروع می‌شوند */
  const withReset =
    <T,>(apply: (value: T) => void) =>
    (value: T) => {
      setPage(1);
      setSelected([]);
      apply(value);
    };

  const pendingCount = counts?.managerApproval;

  return (
    <PanelCard
      title={
        pendingCount
          ? `درخواست‌های تأیید مدیر شرکت (${toPersianDigits(pendingCount)} در انتظار)`
          : 'درخواست‌های تأیید مدیر شرکت'
      }
      subtitle="فقط درخواست‌هایی که اینجا تأیید شوند، برای بررسی به مرحله «تأیید اعتبارات» می‌روند."
      extra={
        <>
          <ApprovalFilters
            term={term}
            onTermChange={withReset(setTerm)}
            companyId={companyId}
            onCompanyChange={withReset(onCompanyChange)}
            status={status}
            onStatusChange={withReset(setStatus)}
          />
          {isPending && (
            <>
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
            </>
          )}
        </>
      }
    >
      <Table<PendingRequest>
        rowKey="id"
        columns={buildColumns({
          showCompany: !companyId,
          onDecide: isPending ? (type, row) => setTarget({ type, requests: [row] }) : undefined,
        })}
        dataSource={data?.items}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{
          emptyText: isPending
            ? 'درخواستی در انتظار تأیید مدیر شرکت نیست.'
            : 'درخواست ردشده‌ای وجود ندارد.',
        }}
        rowSelection={
          isPending
            ? {
                selectedRowKeys: selected.map((item) => item.id ?? 0),
                onChange: (_keys, rows) => setSelected(rows),
              }
            : undefined
        }
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.totalCount ?? 0,
          onChange: setPage,
        }}
      />
      <DecisionModal
        target={target}
        rejectReasons={rejectReasons.options}
        rejectReasonsProps={rejectReasons.selectProps}
        requireRejectNote
        onSubmit={decide}
        onClose={() => setTarget(null)}
      />
    </PanelCard>
  );
};
