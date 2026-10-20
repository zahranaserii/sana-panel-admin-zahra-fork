import { type ColumnsType } from 'antd/es/table';

import { KpiCard, PanelCard } from '@/component/card';
import { Table } from '@/component/table';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';
import { rialToTomanWords } from '@/utils/numberToWords';

import { type CompanyCredit, type PlanCredit } from '../types';

const percent = (value?: number) => toPersianDigits(`${Number((value ?? 0).toFixed(1))}٪`);

const columns: ColumnsType<PlanCredit> = [
  { title: 'نوع تسهیلات', dataIndex: 'contractType' },
  { title: 'نرخ', dataIndex: 'rate', render: percent },
  {
    title: 'مدت',
    dataIndex: 'termMonths',
    render: (value?: number) => toPersianDigits(`${value ?? 0} ماه`),
  },
  // مبلغ سهم این طرح از مجموع میانگین (ریال)
  { title: 'سهم از میانگین', dataIndex: 'shareOfAverage', render: formatRial },
  { title: 'درصد قابل‌استفاده', dataIndex: 'usablePercent', render: percent },
  { title: 'اعتبار ایجادشده (تجمعی)', dataIndex: 'createdCredit', render: formatRial },
  { title: 'تخصیص‌یافته', dataIndex: 'allocated', render: formatRial },
  {
    title: 'مانده اعتبار ماه',
    dataIndex: 'remainingThisMonth',
    render: (value: number) => <b>{formatRial(value)}</b>,
  },
];

interface CreditSummaryCardProps {
  credit?: CompanyCredit;
  loading: boolean;
}

/** مانده اعتبار ماه: میانگین‌ها و اعتبار هر طرح شرکت */
export const CreditSummaryCard = ({ credit, loading }: CreditSummaryCardProps) => (
  <PanelCard
    title="مانده اعتبار ماه"
    subtitle="میانگین موجودی از صفحه «مدیریت شرکت‌ها» ثبت می‌شود."
  >
    <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
      <KpiCard
        label="مجموع میانگین مبنای محاسبه اعتبار"
        value={formatRial(credit?.totalAverageBase ?? 0)}
        footer={credit ? rialToTomanWords(credit.totalAverageBase ?? 0) : undefined}
        loading={loading}
      />
      <KpiCard
        label="میانگین ماه جاری"
        value={formatRial(credit?.currentMonthAverage ?? 0)}
        footer={credit ? rialToTomanWords(credit.currentMonthAverage ?? 0) : undefined}
        loading={loading}
      />
      <KpiCard
        label="مانده اعتبار همه طرح‌ها در این ماه"
        value={formatRial(credit?.monthRemainingCredit ?? 0)}
        footer={credit ? rialToTomanWords(credit.monthRemainingCredit ?? 0) : undefined}
        loading={loading}
      />
    </div>
    <Table<PlanCredit>
      rowKey="planId"
      columns={columns}
      dataSource={credit?.plans}
      loading={loading}
      locale={{ emptyText: 'این شرکت هنوز طرحی ندارد.' }}
    />
  </PanelCard>
);
