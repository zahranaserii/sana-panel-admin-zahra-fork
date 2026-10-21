import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getApprovalsCreditQueueQueryKey,
  getLoansSearchQueryKey,
  useApprovalsCreditDecide,
  useApprovalsCreditQueue,
  useCompaniesLookup,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { DecisionModal, showDecisionResult, type DecisionTarget } from '@/component/decision-modal';
import { SelectInput } from '@/component/input';
import { Table } from '@/component/table';
import { LOAN_STATUS } from '@/constant/loanStatus';
import {
  DECISION,
  type DecisionFormValues,
  type DecisionType,
} from '@/features/manager-approval/types';
import { useEnums } from '@/services/enums';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';

import { type CreditApprovalItem } from '../types';

import { ChangeStageModal } from './ChangeStageModal';
import { buildColumns } from './columns';
import { PostStageFields } from './PostStageFields';

interface CreditApprovalCardProps {
  /** خالی = همه شرکت‌ها */
  companyId?: string;
  onCompanyChange: (companyId: string | undefined) => void;
}

const PAGE_SIZE = 10;
const ALL = 'all';

/** درخواست‌های ثبت‌شده در مرحله تأیید اعتبارات */
export const CreditApprovalCard = ({ companyId, onCompanyChange }: CreditApprovalCardProps) => {
  const queryClient = useQueryClient();
  const { modal } = App.useApp();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CreditApprovalItem[]>([]);
  const [target, setTarget] = useState<DecisionTarget | null>(null);
  const [changingStage, setChangingStage] = useState<CreditApprovalItem | null>(null);
  const enums = useEnums();

  const { data, isFetching, isError, refetch } = useApprovalsCreditQueue({
    CompanyId: companyId ? Number(companyId) : undefined,
    Page: page,
    PageSize: PAGE_SIZE,
  });
  // همه شرکت‌ها، شامل قراردادهای لغوشده
  const companiesQuery = useCompaniesLookup({ activeOnly: false });
  const companies = companiesQuery.data;
  const rejectReasons = useReasonOptions(REASON_TYPE.LOAN_REJECT);

  const { mutateAsync } = useApprovalsCreditDecide({
    mutation: {
      onSuccess: (result) => {
        void queryClient.invalidateQueries({ queryKey: getApprovalsCreditQueueQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getLoansSearchQueryKey() });
        setSelected([]);
        showDecisionResult(
          modal,
          result,
          target?.requests ?? [],
          target?.type === 'reject' ? 'رد شد' : 'تأیید شد',
        );
      },
    },
  });

  /** تأیید همراه با مرحله پس از تأیید؛ رد با دلیل و توضیحات (multipart) */
  const decide = ({ file, description, ...values }: DecisionFormValues) =>
    mutateAsync({
      data: {
        RequestIds: target?.requests.map((item) => item.id ?? 0) ?? [],
        Decision: DECISION[target?.type ?? 'approve'],
        ReasonId: values.reasonId,
        Description: description?.trim() ? description.trim() : undefined,
        PostStage: values.postStage,
        PostStageReasonId: values.postStageReasonId,
        attachment: file ?? undefined,
      },
    });

  const openBulk = (type: DecisionType) => {
    if (!selected.length) {
      toast.error('حداقل یک درخواست را انتخاب کنید.');
      return;
    }
    setTarget({ type, requests: selected });
  };

  const changeCompany = (value: string) => {
    setPage(1);
    setSelected([]);
    onCompanyChange(value === ALL ? undefined : value);
  };

  return (
    <PanelCard
      title="درخواست‌های ثبت‌شده"
      extra={
        <>
          <SelectInput
            size="small"
            allowClear={false}
            style={{ minWidth: 200 }}
            loading={companiesQuery.isFetching}
            error={companiesQuery.isError}
            onRetry={() => void companiesQuery.refetch()}
            value={companyId ?? ALL}
            onChange={changeCompany}
            options={[
              { value: ALL, label: 'همه شرکت‌ها' },
              ...(companies ?? []).map((item) => ({ value: String(item.id), label: item.title })),
            ]}
          />
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
      }
    >
      <Table<CreditApprovalItem>
        rowKey="id"
        columns={buildColumns({
          onDecide: (type, row) => setTarget({ type, requests: [row] }),
          onChangeStage: setChangingStage,
          stageTitle: (stage) => enums.title('postApprovalStage', stage),
        })}
        dataSource={data?.items}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'درخواستی برای نمایش وجود ندارد.' }}
        rowSelection={{
          selectedRowKeys: selected.map((item) => item.id ?? 0),
          onChange: (_keys, rows) => setSelected(rows),
          // فقط درخواست‌های «در انتظار» قابل انتخاب گروهی هستند
          getCheckboxProps: (row) => ({ disabled: row.status !== LOAN_STATUS.PENDING_CREDIT }),
        }}
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
        approveFields={<PostStageFields />}
        onSubmit={decide}
        onClose={() => setTarget(null)}
      />
      <ChangeStageModal request={changingStage} onClose={() => setChangingStage(null)} />
    </PanelCard>
  );
};
