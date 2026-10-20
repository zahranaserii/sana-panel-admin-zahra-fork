import { CheckOutlined, CloseOutlined, EditOutlined, PaperClipOutlined } from '@ant-design/icons';
import { type ColumnsType } from 'antd/es/table';

import { type CommonStoredFileDto } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { Button } from '@/component/button';
import { LoanStatusChip } from '@/component/loan-status';
import { FACILITY } from '@/constant/endpoints';
import { LOAN_STATUS } from '@/constant/loanStatus';
import { type DecisionType } from '@/features/manager-approval/types';
import { http } from '@/services/http';
import { formatJalali } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type CreditApprovalItem } from '../types';

const toJalali = (value?: string | null) =>
  value ? formatJalali(value, undefined, { persianDigits: true }) : '—';

/** سرویس تولیدشده نوع فایل را نمی‌شناسد؛ دانلود با http.download */
const download = (row: CreditApprovalItem, file: CommonStoredFileDto) =>
  http.download(`${FACILITY}/LoanRequests/${row.id}/Documents/${file.id}`, file.fileName);

const renderDocuments = (row: CreditApprovalItem) =>
  row.documents?.length ? (
    <div className="flex flex-col items-start gap-1">
      {row.documents.map((file) => (
        <Button
          key={file.id}
          variant="text"
          size="small"
          icon={<PaperClipOutlined />}
          onClick={() => void download(row, file)}
        >
          {file.fileName}
        </Button>
      ))}
    </div>
  ) : (
    '—'
  );

interface ColumnActions {
  onDecide: (type: DecisionType, row: CreditApprovalItem) => void;
  onChangeStage: (row: CreditApprovalItem) => void;
  stageTitle: (stage?: number) => string;
}

export const buildColumns = ({
  onDecide,
  onChangeStage,
  stageTitle,
}: ColumnActions): ColumnsType<CreditApprovalItem> => [
  { title: 'شرکت', dataIndex: 'companyName' },
  { title: 'پرسنل', dataIndex: 'personnelName' },
  { title: 'طرح', dataIndex: 'planTitle' },
  { title: 'مبلغ', dataIndex: 'amount', render: formatRial },
  { title: 'تاریخ ثبت', dataIndex: 'createdAt', render: toJalali },
  { title: 'تاریخ تأیید/رد', dataIndex: 'decidedAt', render: toJalali },
  {
    title: 'توضیحات',
    dataIndex: 'description',
    render: (value?: string | null) => value ?? '—',
  },
  { title: 'مستندات', key: 'documents', render: (_value, row) => renderDocuments(row) },
  {
    title: 'وضعیت',
    dataIndex: 'status',
    render: (status?: number) => <LoanStatusChip status={status} />,
  },
  {
    title: 'مرحله پس از تأیید',
    dataIndex: 'postStage',
    render: (value?: number) => (value ? stageTitle(value) : '—'),
  },
  {
    title: 'عملیات',
    key: 'actions',
    render: (_value, row) => {
      if (row.status === LOAN_STATUS.APPROVED) {
        return (
          <Button
            variant="outline"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onChangeStage(row)}
          >
            تغییر مرحله
          </Button>
        );
      }
      if (row.status !== LOAN_STATUS.PENDING_CREDIT) return '—';
      return (
        <div className="flex gap-1.5">
          <Button size="small" icon={<CheckOutlined />} onClick={() => onDecide('approve', row)}>
            تأیید
          </Button>
          <Button
            variant="danger"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => onDecide('reject', row)}
          >
            رد
          </Button>
        </div>
      );
    },
  },
];
