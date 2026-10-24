import { Column } from '@ant-design/charts';

import { useDashboardGet } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { Skeleton } from '@/component/loading';
import { QueryState } from '@/component/retry';
import { useChartTheme } from '@/hooks/useChartTheme';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';

import { ChartLegend } from './ChartLegend';

const SERIES = ['اعتبار ایجادشده', 'اعتبار تخصیص‌یافته'];

/** گروه‌بندی سرور (creditVsAllocatedGroupKind): ۱ شعبه (دید سراسری ادمین و شعبه دیجیتال)، ۲ شرکت */
const BY_BRANCH = 1;

/** نمایش فشرده محور (مثل «۲۱۴ م») */
const compact = (value: number) => {
  if (value >= 1e9) return toPersianDigits(`${Math.round(value / 1e8) / 10} میلیارد`);
  if (value >= 1e6) return toPersianDigits(`${Math.round(value / 1e6)} م`);
  return toPersianDigits(value);
};

export const CompanyCreditChart = () => {
  const chart = useChartTheme();
  const query = useDashboardGet();
  const { data, isPending } = query;
  const group = data?.creditVsAllocatedGroupKind === BY_BRANCH ? 'شعبه' : 'شرکت';

  // گروه‌بندی (شرکت/شعبه) از سرور می‌آید؛ عنوان هر گروه groupTitle است
  const rows = (data?.creditVsAllocated ?? []).flatMap((item) => [
    { companyName: item.groupTitle, series: SERIES[0], value: item.createdCredit ?? 0 },
    { companyName: item.groupTitle, series: SERIES[1], value: item.allocated ?? 0 },
  ]);

  const renderBody = () => {
    if (isPending) return <Skeleton variant="panel" rows={6} />;
    if (!rows.length) return <p className="text-xs text-ink-soft">هنوز شرکتی ثبت نشده است.</p>;
    return (
      <>
        <ChartLegend
          items={SERIES.map((label, index) => ({ label, color: chart.pair[index] ?? '' }))}
        />
        <Column
          data={rows}
          xField="companyName"
          yField="value"
          colorField="series"
          group
          height={340}
          theme={chart.theme}
          scale={{ color: { domain: SERIES, range: chart.pair } }}
          style={{
            radiusTopLeft: 4,
            radiusTopRight: 4,
            maxWidth: 32,
            stroke: chart.surface,
            lineWidth: 2,
          }}
          axis={{
            x: { labelFontFamily: chart.fontFamily, title: false },
            y: {
              labelFormatter: compact,
              labelFontFamily: chart.fontFamily,
              title: false,
              gridLineDash: [2, 4],
            },
          }}
          legend={false}
          tooltip={{ items: [{ channel: 'y', valueFormatter: (v: number) => formatRial(v) }] }}
        />
      </>
    );
  };

  return (
    <PanelCard
      title={`اعتبار ایجادشده در مقابل تخصیص‌یافته به تفکیک ${group}`}
      subtitle={`مقایسه اعتبار ایجادشده (تجمعی) و میزان تخصیص‌یافته هر ${group}`}
    >
      <QueryState query={query}>{renderBody()}</QueryState>
    </PanelCard>
  );
};
