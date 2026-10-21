import { useDashboardGet } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { Skeleton } from '@/component/loading';
import { QueryState } from '@/component/retry';
import { useChartTheme } from '@/hooks/useChartTheme';

import { DonutChart } from './DonutChart';

const STATUSES = [
  { key: 'approved', title: 'تأییدشده' },
  { key: 'pending', title: 'در انتظار' },
  { key: 'rejected', title: 'ردشده' },
] as const;

export const RequestStatusChart = () => {
  const chart = useChartTheme();
  const query = useDashboardGet();
  const { data: dashboard, isPending } = query;
  const status = dashboard?.requestStatus;
  const data = status && STATUSES.map((item) => ({ ...item, count: status[item.key] ?? 0 }));

  return (
    <PanelCard title="وضعیت درخواست‌ها" subtitle="نسبت درخواست‌های تأییدشده، در انتظار و ردشده">
      <QueryState query={query}>
        {isPending || !data ? (
          <Skeleton variant="panel" rows={5} />
        ) : (
          <DonutChart data={data} colors={data.map((item) => chart.status[item.key])} />
        )}
      </QueryState>
    </PanelCard>
  );
};
