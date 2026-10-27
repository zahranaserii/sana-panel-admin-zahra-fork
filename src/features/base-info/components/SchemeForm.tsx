import { ArrowRightOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import {
  useBasicInfoSchemeCreate,
  useBasicInfoSchemeGet,
  useBasicInfoSchemeUpdate,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Form } from '@/component/form';
import { Skeleton } from '@/component/loading';
import { Retry } from '@/component/retry';

import { type SchemeDetail, type SchemeFormValues } from '../types';
import { EMPTY_VALUES, invalidateBasicInfo, toFormValues, toPayload } from '../utils';

import { GeneralFields } from './GeneralFields';
import { NumberListFields } from './NumberListFields';
import { TextListsSection } from './TextListsSection';
import { UsableMatrixFields } from './UsableMatrixFields';

interface SchemeFormProps {
  /** شناسه طرح برای ویرایش؛ خالی = افزودن */
  schemeId: number | null;
  /** بازگشت به لیست طرح‌ها (بعد از ثبت یا انصراف) */
  onBack: () => void;
}

/** فرم افزودن/ویرایش طرح (یک سرویس برای کل فرم: BasicInfo/Schemes) */
export const SchemeForm = ({ schemeId, onBack }: SchemeFormProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<SchemeFormValues>();
  const isEdit = schemeId !== null;

  const {
    data: detail,
    isFetching,
    isError,
    refetch,
  } = useBasicInfoSchemeGet(schemeId ?? 0, {
    query: { enabled: isEdit, gcTime: 0 },
  });

  const onSaved = (saved: SchemeDetail) => {
    void invalidateBasicInfo(queryClient);
    toast.success(isEdit ? `طرح «${saved.title}» ویرایش شد.` : `طرح «${saved.title}» ثبت شد.`);
    onBack();
  };

  const create = useBasicInfoSchemeCreate({ mutation: { onSuccess: onSaved } });
  const update = useBasicInfoSchemeUpdate({ mutation: { onSuccess: onSaved } });

  const submit = (values: SchemeFormValues) => {
    if (isEdit) {
      update.mutate({ schemeId, data: toPayload(values, detail?.settings?.rowVersion) });
    } else {
      create.mutate({ data: toPayload(values) });
    }
  };

  const initialValues = useMemo(
    () => (isEdit ? detail && toFormValues(detail) : EMPTY_VALUES),
    [isEdit, detail],
  );

  const loading = isEdit && (isFetching || !detail);
  const isPending = create.isPending || update.isPending;

  /** با حذف یک مدت، ردیف متناظرش از جدول درصد قابل استفاده حذف می‌شود */
  const removeUsableRow = (row: number) =>
    form.setFieldValue(
      'usable',
      (form.getFieldValue('usable') as number[][] | undefined)?.filter((_r, i) => i !== row),
    );

  /** با حذف یک نرخ مرابحه، ستون متناظرش (بعد از ستون قرض‌الحسنه) حذف می‌شود */
  const removeUsableColumn = (index: number) =>
    form.setFieldValue(
      'usable',
      (form.getFieldValue('usable') as number[][] | undefined)?.map((cells) =>
        cells.filter((_c, column) => column !== index + 1),
      ),
    );

  // ویرایش بدون جزئیات طرح معنی ندارد: به‌جای کل صفحه فقط تلاش مجدد
  if (isEdit && isError) return <Retry loading={isFetching} onRetry={() => void refetch()} />;

  return (
    <PanelCard
      title={isEdit ? 'ویرایش طرح' : 'افزودن طرح'}
      subtitle="همه اطلاعات پایه طرح در این صفحه تعریف می‌شود؛ بعد از ثبت به لیست طرح‌ها برمی‌گردید."
      extra={
        <Button variant="outline" size="small" icon={<ArrowRightOutlined />} onClick={onBack}>
          بازگشت به لیست
        </Button>
      }
    >
      {loading ? (
        <Skeleton variant="form" rows={8} />
      ) : (
        <Form<SchemeFormValues>
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={submit}
        >
          <GeneralFields isEdit={isEdit} />
          <NumberListFields
            name="murabahaRates"
            title="نرخ‌های مرابحه قابل انتخاب (درصد)"
            itemLabel="نرخ مرابحه"
            addText="افزودن نرخ"
            step={0.1}
            onRemove={removeUsableColumn}
          />
          <NumberListFields
            name="repaymentTermsMonths"
            title="مدت‌های بازپرداخت قابل انتخاب (ماه)"
            itemLabel="مدت"
            addText="افزودن مدت"
            onRemove={removeUsableRow}
          />
          <UsableMatrixFields />
          <TextListsSection />
          <div className="mt-6 flex gap-2 border-t border-line pt-4">
            <Button variant="primary" htmlType="submit" loading={isPending}>
              {isEdit ? 'ذخیره تغییرات' : 'ثبت طرح'}
            </Button>
            <Button variant="secondary" onClick={onBack} disabled={isPending}>
              انصراف
            </Button>
          </div>
        </Form>
      )}
    </PanelCard>
  );
};
