import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { type ColumnsType } from 'antd/es/table';

import { Button } from '@/component/button';
import { LoanStatusChip } from '@/component/loan-status';
import { formatJalali, toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { type DecisionType, type PendingRequest } from '../types';

interface ColumnOptions {
  /** با فیلتر یک شرکت، ستون شرکت تکراری است */
  showCompany: boolean;
  /** فقط برای درخواست‌های منتظر تصمیم */
  onDecide?: (type: DecisionType, row: PendingRequest) => void;
}

export const buildColumns = ({
  showCompany,
  onDecide,
}: ColumnOptions): ColumnsType<PendingRequest> => [
  ...(showCompany ? [{ title: 'شرکت', dataIndex: 'companyName' }] : []),
  { title: 'پرسنل', dataIndex: 'personnelName' },
  { title: 'کد پرسنلی', dataIndex: 'personnelCode' },
  { title: 'طرح', dataIndex: 'planTitle' },
  { title: 'مبلغ', dataIndex: 'amount', render: formatRial },
  {
    title: 'ترتیب پرداخت',
    dataIndex: 'paymentOrder',
    align: 'center',
    render: (value?: number) => (value ? toPersianDigits(value) : '—'),
  },
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
  ...(onDecide
    ? [
        {
          title: 'عملیات',
          key: 'actions',
          render: (_value: unknown, row: PendingRequest) => (
            <div className="flex gap-1.5">
              <Button
                size="small"
                icon={<CheckOutlined />}
                onClick={() => onDecide('approve', row)}
              >
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
          ),
        },
      ]
    : []),
];
