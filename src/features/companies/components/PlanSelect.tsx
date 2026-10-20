import { useQuery } from '@tanstack/react-query';

import { SelectInput, type SelectInputProps } from '@/component/input';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { getPlanOptions, type PlanOption } from '@/services/lookup';
import { toPersianDigits } from '@/utils/date';

/** همه ستون‌های جدول طرح‌ها در یک عنوان کنار هم */
const planLabel = (plan: PlanOption) =>
  toPersianDigits(
    `${plan.typeTitle} | نرخ ${plan.rate}٪ | ${plan.term} ماه | اعتبار ${plan.usable}٪ میانگین ماهانه`,
  );

interface PlanSelectProps extends SelectInputProps<string[]> {
  /** طرح‌ها و سقف تعداد آن‌ها به طرح کلان وابسته‌اند */
  schemeId?: string;
}

/** انتخاب چندتایی طرح‌های مندرج در قرارداد (حداکثر تعداد از سرور می‌آید) */
export const PlanSelect = ({ schemeId, ...props }: PlanSelectProps) => {
  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.PLANS_OF(schemeId ?? ''),
    queryFn: () => getPlanOptions(schemeId ?? ''),
    enabled: Boolean(schemeId),
  });

  const placeholder = data
    ? `حداکثر ${toPersianDigits(data.maxPlans)} طرح قابل انتخاب است`
    : 'انتخاب طرح‌ها';

  return (
    <SelectInput<string[]>
      mode="multiple"
      disabled={!schemeId}
      loading={isFetching}
      maxCount={data?.maxPlans}
      placeholder={schemeId ? placeholder : 'ابتدا طرح کلان را انتخاب کنید'}
      options={data?.items.map((plan) => ({ value: plan.id, label: planLabel(plan) }))}
      {...props}
    />
  );
};
