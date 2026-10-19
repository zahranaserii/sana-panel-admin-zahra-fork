import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { DecisionModal, type DecisionTarget } from '@/component/decision-modal';
import { SelectInput } from '@/component/input';
import { Table } from '@/component/table';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { type DecisionFormValues, type DecisionType } from '@/features/manager-approval/types';
import { resolveFile } from '@/services/file';
import { getAllCompanyOptions, getRejectReasons } from '@/services/lookup';
import { toPersianDigits } from '@/utils/date';

import { getCreditApprovals, submitCreditDecision } from '../api';
import { type CreditApprovalItem } from '../types';

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
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CreditApprovalItem[]>([]);
  const [target, setTarget] = useState<DecisionTarget | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.CREDIT_APPROVALS.LIST(companyId, page),
    queryFn: () => getCreditApprovals({ companyId, page, pageSize: PAGE_SIZE }),
  });
  const { data: companies } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.ALL_COMPANIES,
    queryFn: getAllCompanyOptions,
  });
  const { data: rejectReasons } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.REJECT_REASONS,
    queryFn: getRejectReasons,
  });

  const { mutateAsync: decide } = useMutation({
    mutationFn: async ({ file, ...values }: DecisionFormValues) => {
      const uploaded = await resolveFile(file);
      return submitCreditDecision(target?.type ?? 'approve', {
        ...values,
        requestIds: target?.requests.map((item) => item.id) ?? [],
        fileId: uploaded?.id ?? null,
      });
    },
    onSuccess: ({ updated }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CREDIT_APPROVALS.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CREDIT.ALL });
      setSelected([]);
      toast.success(
        `${toPersianDigits(updated)} درخواست ${target?.type === 'reject' ? 'رد' : 'تأیید'} شد.`,
      );
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
            value={companyId ?? ALL}
            onChange={changeCompany}
            options={[
              { value: ALL, label: 'همه شرکت‌ها' },
              ...(companies ?? []).map((item) => ({ value: item.id, label: item.title })),
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
        columns={buildColumns((type, row) => setTarget({ type, requests: [row] }))}
        dataSource={data?.items}
        loading={isFetching}
        locale={{ emptyText: 'درخواستی برای نمایش وجود ندارد.' }}
        rowSelection={{
          selectedRowKeys: selected.map((item) => item.id),
          onChange: (_keys, rows) => setSelected(rows),
          // فقط درخواست‌های «در انتظار» قابل انتخاب گروهی هستند
          getCheckboxProps: (row) => ({ disabled: row.status !== 'pending_credit' }),
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
        rejectReasons={rejectReasons ?? []}
        approveFields={<PostStageFields />}
        onSubmit={decide}
        onClose={() => setTarget(null)}
      />
    </PanelCard>
  );
};
