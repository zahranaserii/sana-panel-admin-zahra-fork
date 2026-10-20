import { useDashboardGet } from '@/api/generated/facility';
import { KpiCard } from '@/component/card';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';
import { rialToTomanWords } from '@/utils/numberToWords';

export const SummaryKpis = () => {
  const { data: dashboard, isPending } = useDashboardGet();
  const data = dashboard?.kpis;

  return (
    <div className="mb-[18px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
      <KpiCard
        label="تعداد شرکت‌های فعال"
        value={toPersianDigits(data?.activeCompanies ?? 0)}
        loading={isPending}
      />
      <KpiCard
        label="تعداد کل درخواست‌ها"
        value={toPersianDigits(data?.totalRequests ?? 0)}
        loading={isPending}
      />
      <KpiCard
        label="جمع مبلغ تأییدشده"
        value={formatRial(data?.approvedAmount ?? 0)}
        footer={data ? rialToTomanWords(data.approvedAmount ?? 0) : undefined}
        loading={isPending}
      />
      <KpiCard
        label="جمع مبلغ در انتظار تأیید"
        value={formatRial(data?.pendingAmount ?? 0)}
        footer={data ? rialToTomanWords(data.pendingAmount ?? 0) : undefined}
        tone="amber"
        loading={isPending}
      />
    </div>
  );
};
