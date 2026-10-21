import { useBasicInfoPlans } from '@/api/generated/facility';
import { type ReadModelsPlanDto } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { SelectInput, type SelectInputProps } from '@/component/input';
import { toPersianDigits } from '@/utils/date';

/** عنوان طرح + درصد اعتبار از میانگین ماهانه */
const planLabel = (plan: ReadModelsPlanDto) =>
  toPersianDigits(`${plan.title ?? ''} | اعتبار ${plan.usablePercent ?? 0}٪ میانگین ماهانه`);

interface PlanSelectProps extends SelectInputProps<number[]> {
  /** طرح‌ها و سقف تعداد آن‌ها به طرح کلان وابسته‌اند */
  schemeId?: number;
}

/** انتخاب چندتایی طرح‌های مندرج در قرارداد (حداکثر تعداد از سرور می‌آید) */
export const PlanSelect = ({ schemeId, ...props }: PlanSelectProps) => {
  const { data, isFetching, refetch } = useBasicInfoPlans(schemeId ?? 0, {
    query: { enabled: Boolean(schemeId) },
  });

  const placeholder = data
    ? `حداکثر ${toPersianDigits(data.maxPlansPerCompany ?? 0)} طرح قابل انتخاب است`
    : 'انتخاب طرح‌ها';

  return (
    <SelectInput<number[]>
      mode="multiple"
      disabled={!schemeId}
      loading={isFetching}
      onRetry={() => void refetch()}
      maxCount={data?.maxPlansPerCompany}
      placeholder={schemeId ? placeholder : 'ابتدا طرح کلان را انتخاب کنید'}
      options={data?.plans?.map((plan) => ({ value: plan.id, label: planLabel(plan) }))}
      {...props}
    />
  );
};
