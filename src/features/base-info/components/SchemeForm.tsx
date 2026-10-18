import { ArrowRightOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Form } from '@/component/form';
import { Skeleton } from '@/component/loading';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { removeEmpty } from '@/utils/object';

import { createScheme, getScheme, updateScheme } from '../api';
import { type Scheme, type SchemePayload, type SchemeTextList } from '../types';

import { GeneralFields } from './GeneralFields';
import { NumberListFields } from './NumberListFields';
import { TextListsSection } from './TextListsSection';
import { UsableMatrixFields } from './UsableMatrixFields';

interface SchemeFormProps {
  /** شناسه طرح برای ویرایش؛ خالی = افزودن */
  schemeId: string | null;
  /** بازگشت به لیست طرح‌ها (بعد از ثبت یا انصراف) */
  onBack: () => void;
}

/** فرم خالی طرح جدید: هر لیست یک ردیف خالی دارد */
const EMPTY_VALUES: Partial<SchemePayload> = {
  sepahEnabled: false,
  murabahaRates: [null as never],
  terms: [null as never],
  usable: [],
  cancelReasons: [''],
  rejectReasons: [''],
  noGrantReasons: [''],
  avgDocTypes: [''],
};

/** لیست خالی در ویرایش هم یک ردیف خالی نمایش می‌دهد */
const withRow = (list: string[]) => (list.length ? list : ['']);

const toFormValues = ({ id: _id, ...scheme }: Scheme): SchemePayload => ({
  ...scheme,
  cancelReasons: withRow(scheme.cancelReasons),
  rejectReasons: withRow(scheme.rejectReasons),
  noGrantReasons: withRow(scheme.noGrantReasons),
  avgDocTypes: withRow(scheme.avgDocTypes),
});

const TEXT_LISTS: SchemeTextList[] = [
  'cancelReasons',
  'rejectReasons',
  'noGrantReasons',
  'avgDocTypes',
];

/**
 * مقادیر خالی فرستاده نمی‌شوند؛ ردیف‌های خالی لیست‌های متنی حذف می‌شوند (لیست خالی = []).
 * ضریب سپه فقط وقتی «حقوق‌بگیر بانک سپه» روشن است فرستاده می‌شود.
 */
const toPayload = ({ sepahMultiplier, ...values }: SchemePayload) =>
  ({
    ...removeEmpty(values.sepahEnabled ? { ...values, sepahMultiplier } : values),
    ...Object.fromEntries(
      TEXT_LISTS.map((key) => [
        key,
        (values[key] ?? []).map((item) => item?.trim()).filter(Boolean),
      ]),
    ),
  }) as SchemePayload;

const LOOKUP_KEYS = [
  QUERY_KEYS.LOOKUPS.PLANS,
  QUERY_KEYS.LOOKUPS.CANCEL_REASONS,
  QUERY_KEYS.LOOKUPS.REJECT_REASONS,
  QUERY_KEYS.LOOKUPS.NO_GRANT_REASONS,
  QUERY_KEYS.LOOKUPS.AVG_DOC_TYPES,
];

/** فرم افزودن/ویرایش طرح */
export const SchemeForm = ({ schemeId, onBack }: SchemeFormProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<SchemePayload>();
  const isEdit = Boolean(schemeId);

  const { data: detail, isFetching } = useQuery({
    queryKey: QUERY_KEYS.BASE_INFO.DETAIL(schemeId ?? ''),
    queryFn: () => getScheme(schemeId ?? ''),
    enabled: isEdit,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SchemePayload) =>
      schemeId ? updateScheme(schemeId, values) : createScheme(values),
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BASE_INFO.ALL });
      LOOKUP_KEYS.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
      toast.success(isEdit ? `طرح «${saved.name}» ویرایش شد.` : `طرح «${saved.name}» ثبت شد.`);
      onBack();
    },
  });

  const initialValues = useMemo(
    () => (isEdit ? detail && toFormValues(detail) : EMPTY_VALUES),
    [isEdit, detail],
  );

  const loading = isEdit && (isFetching || !detail);

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
        <Form<SchemePayload>
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={(values) => mutate(toPayload(values))}
        >
          <GeneralFields />
          <NumberListFields
            name="murabahaRates"
            title="نرخ‌های مرابحه قابل انتخاب (درصد)"
            itemLabel="نرخ مرابحه"
            addText="افزودن نرخ"
            step={0.1}
            onRemove={removeUsableColumn}
          />
          <NumberListFields
            name="terms"
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
