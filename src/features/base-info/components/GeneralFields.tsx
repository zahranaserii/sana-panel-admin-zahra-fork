import { normalizeLetters, normalizeText, titleRule, schemeCodeRule } from '@/utils/inputRules';
import { Form } from 'antd';

import { FormItem } from '@/component/form';
import { NumberInput, TextInput } from '@/component/input';
import { Switch } from '@/component/switch';

import { type SchemeFormValues } from '../types';

import { SectionTitle } from './SectionTitle';

/** نام طرح و تنظیمات عمومی */
/** isEdit: کد طرح بعد از ثبت قابل تغییر نیست */
export const GeneralFields = ({ isEdit }: { isEdit: boolean }) => {
  const isActive = Form.useWatch<boolean | undefined>('isActive');

  return (
    <>
      <SectionTitle title="تنظیمات عمومی" />
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 xl:grid-cols-3">
        <FormItem<SchemeFormValues>
          name="title"
          normalize={normalizeLetters}
          label="نام طرح"
          required
          rules={[titleRule, { min: 3, max: 50, message: 'نام طرح باید بین ۳ تا ۵۰ حرف باشد.' }]}
        >
          <TextInput maxLength={50} placeholder="مثلاً نگین میثاق" />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="code"
          normalize={normalizeText}
          label="کد طرح"
          required
          rules={[
            schemeCodeRule,
            { min: 2, max: 30, message: 'کد طرح باید بین ۲ تا ۳۰ حرف باشد.' },
          ]}
          extra={isEdit ? 'کد طرح بعد از ثبت قابل تغییر نیست.' : undefined}
        >
          <TextInput maxLength={30} placeholder="مثلاً NM-01" disabled={isEdit} />
        </FormItem>
        <FormItem<SchemeFormValues> name="isActive" label="وضعیت طرح">
          <Switch label={isActive ? 'فعال' : 'غیرفعال'} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="qardHasanRate"
          label="نرخ تسهیلات قرض‌الحسنه (درصد - ثابت)"
          required
        >
          <NumberInput min={0} max={4} step={0.1} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="salaryFromSepahMultiplierYes"
          label="ضریب حقوق‌بگیر بانک سپه"
          required
        >
          <NumberInput min={0.01} max={10} step={0.01} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="salaryFromSepahMultiplierNo"
          label="ضریب غیر حقوق‌بگیر بانک سپه"
          required
        >
          <NumberInput min={0.01} max={10} step={0.01} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="contractDurationMonths"
          label="مدت قرارداد (ماه)"
          required
        >
          <NumberInput precision={0} min={1} max={120} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="graceMonthsAfterExpiry"
          label="مهلت استفاده از مانده اعتبار پس از انقضا (ماه)"
          required
        >
          <NumberInput precision={0} min={0} max={120} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="maxPlansPerCompany"
          label="حداکثر تعداد طرح قابل انتخاب برای هر شرکت"
          required
        >
          <NumberInput precision={0} min={1} max={10} />
        </FormItem>
        <FormItem<SchemeFormValues>
          name="personnelIntroductionDelayMonths"
          label="مهلت مجاز شدن معرفی پرسنل پس از انعقاد قرارداد (ماه)"
          required
        >
          <NumberInput precision={0} min={0} max={120} />
        </FormItem>
        <FormItem<SchemeFormValues> name="waitingPeriodDays" label="دوره انتظار (روز)">
          <NumberInput precision={0} min={0} max={180} />
        </FormItem>
      </div>
    </>
  );
};
