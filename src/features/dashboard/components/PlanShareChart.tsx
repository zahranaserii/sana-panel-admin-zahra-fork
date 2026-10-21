import { useDashboardGet } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { Skeleton } from '@/component/loading';
import { QueryState } from '@/component/retry';
import { useChartTheme } from '@/hooks/useChartTheme';
import { CHART_MAX_CATEGORIES } from '@/theme/chartPalette';

import { type PlanShare } from '../types';

import { DonutChart, type DonutItem } from './DonutChart';

/** بیش از ۵ طرح در «سایر» جمع می‌شود تا رنگ‌ها چرخشی تکرار نشوند */
const foldOthers = (items: PlanShare[]): DonutItem[] => {
  const sorted = items
    .map((item) => ({ title: item.planTitle ?? '—', count: item.requestCount ?? 0 }))
    .sort((a, b) => b.count - a.count);
  if (sorted.length <= CHART_MAX_CATEGORIES) return sorted;
  const head = sorted.slice(0, CHART_MAX_CATEGORIES - 1);
  const others = sorted.slice(CHART_MAX_CATEGORIES - 1).reduce((sum, item) => sum + item.count, 0);
  return [...head, { title: 'سایر', count: others }];
};

export const PlanShareChart = () => {
  const chart = useChartTheme();
  const query = useDashboardGet();
  const { data: dashboard, isPending } = query;
  const data = dashboard?.planShare;

  const renderBody = () => {
    if (isPending) return <Skeleton variant="panel" rows={5} />;
    if (!data?.length) return <p className="text-xs text-ink-soft">هنوز درخواستی ثبت نشده است.</p>;
    return <DonutChart data={foldOthers(data)} colors={chart.categorical} />;
  };

  return (
    <PanelCard
      title="سهم هر طرح از تعداد درخواست‌ها"
      subtitle="محبوبیت هر یک از طرح‌های قرض‌الحسنه/مرابحه در میان درخواست‌ها"
    >
      <QueryState query={query}>{renderBody()}</QueryState>
    </PanelCard>
  );
};
