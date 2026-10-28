import { SafetyCertificateOutlined, SendOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  getLoansCreditQueryKey,
  getLoansPreviewQueryOptions,
  getLoansSearchQueryKey,
  useLoansCreate,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Form, FormItem } from '@/component/form';
import { SelectInput } from '@/component/input';
import { RadioGroup } from '@/component/radio';
import { Typography } from '@/component/typography';
import { StaffSearch } from '@/features/staff/components';
import { type StaffFilters } from '@/features/staff/types';
import { toPersianDigits } from '@/utils/date';

import {
  type CompanyCredit,
  type LoanPreview,
  type LoanRequestFormValues,
  type PlanCredit,
} from '../types';
import { ALLOCATION_MODE, buildLoanBody, repeatList } from '../utils';

import { FixedAmountField } from './FixedAmountField';
import { PreviewNotices } from './PreviewNotices';
import { StaffPickTable } from './StaffPickTable';

interface LoanRequestCardProps {
  companyId: number;
  date: string;
  credit?: CompanyCredit;
  filters: StaffFilters;
}

const INITIAL_VALUES: LoanRequestFormValues = { mode: ALLOCATION_MODE.FIXED };

const AMOUNT_MODES = [
  { value: ALLOCATION_MODE.FIXED, label: 'مبلغ یکسان برای همه' },
  { value: ALLOCATION_MODE.VARIABLE, label: 'مبلغ متفاوت برای هرکس' },
];

/** مبلغ ردیف در حالت مبلغ متفاوت وارد شده است؟ */
const hasAmount = (rows: LoanRequestFormValues['rows'], id: number) =>
  Number(rows?.[String(id)]?.amount ?? 0) > 0;

const planOption = (plan: PlanCredit) => ({
  value: plan.planId,
  label: toPersianDigits(`${plan.contractType} - نرخ ${plan.rate}٪ - مدت ${plan.termMonths} ماه`),
});

/** ثبت درخواست تخصیص وام به پرسنل؛ اول «بررسی اعتبار» (سرویس پیش‌نمایش)، بعد ثبت */
export const LoanRequestCard = ({ companyId, date, credit, filters }: LoanRequestCardProps) => {
  const [form] = Form.useForm<LoanRequestFormValues>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // نتیجه «بررسی اعتبار» (Preview)؛ فقط با دکمه گرفته می‌شود و با هر تغییر فرم پاک می‌شود
  const [checked, setChecked] = useState<LoanPreview>();
  const [checking, setChecking] = useState(false);
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const plans = useMemo(() => credit?.plans ?? [], [credit]);
  const canAllocate = Boolean(credit?.banner?.canRegisterLoan);
  const values = Form.useWatch([], form) ?? INITIAL_VALUES;
  const plan = plans.find((item) => item.planId === values.planId);
  const isVariable = values.mode === ALLOCATION_MODE.VARIABLE;

  // اگر طرحی انتخاب نشده یا طرح انتخاب‌شده دیگر وجود ندارد، اولین طرح انتخاب می‌شود
  useEffect(() => {
    const current = form.getFieldValue('planId') as number | undefined;
    if (!plans.some((item) => item.planId === current)) {
      form.setFieldValue('planId', plans[0]?.planId);
    }
  }, [plans, form]);

  const { mutate, isPending } = useLoansCreate({
    mutation: {
      onSuccess: (batch) => {
        void queryClient.invalidateQueries({ queryKey: getLoansCreditQueryKey(companyId) });
        void queryClient.invalidateQueries({ queryKey: getLoansSearchQueryKey() });
        // بعد از ثبت، مبالغ و انتخاب‌ها پاک می‌شوند ولی ترتیب پرداخت هر ردیف می‌ماند
        const rows = (form.getFieldValue('rows') ?? {}) as NonNullable<
          LoanRequestFormValues['rows']
        >;
        form.setFieldsValue({
          fixedAmount: undefined,
          rows: Object.fromEntries(
            Object.entries(rows).map(([id, row]) => [id, { ...row, amount: undefined }]),
          ),
        });
        setSelectedIds([]);
        setChecked(undefined);
        toast.success(
          `درخواست وام برای ${toPersianDigits(batch.requests?.length ?? 0)} نفر با موفقیت ثبت شد.`,
        );
      },
    },
  });

  /** بررسی اعتبار برای پرسنل انتخاب‌شده (Preview؛ هر بار از سرور) */
  const handleCheck = async () => {
    setChecking(true);
    try {
      const data = buildLoanBody(form.getFieldsValue(true), selectedIds, date);
      setChecked(
        await queryClient.fetchQuery(
          getLoansPreviewQueryOptions(companyId, data, { query: { staleTime: 0 } }),
        ),
      );
    } finally {
      setChecking(false);
    }
  };

  /** ثبت با همان بدنه‌ای که بررسی شد (بعد از بررسی فرم تغییری نکرده است) */
  const handleFinish = (formValues: LoanRequestFormValues) => {
    if (!checked?.isAllowed) return;
    const data = buildLoanBody(formValues, selectedIds, date);
    const submit = () => mutate({ companyId, data });
    const repeats = checked.repeatAllocations ?? [];
    if (!repeats.length) {
      submit();
      return;
    }
    modal.confirm({
      title: 'هشدار تخصیص مجدد در همین ماه',
      width: 520,
      content: repeatList(repeats),
      okText: 'تخصیص مجدد',
      cancelText: 'انصراف',
      onOk: submit,
    });
  };

  return (
    <PanelCard
      title="ثبت درخواست تخصیص وام به پرسنل"
      subtitle="ابتدا طرح این ماه را انتخاب کنید، سپس پرسنل و مبلغ وام را مشخص کنید. فقط طرح‌های مندرج در تفاهم‌نامه این شرکت قابل انتخاب است."
    >
      {/* component={false}: تگ form ساخته نمی‌شود تا فرم جستجوی داخل آن تودرتو نشود */}
      <Form<LoanRequestFormValues>
        form={form}
        component={false}
        initialValues={INITIAL_VALUES}
        disabled={!canAllocate}
        onFinish={handleFinish}
        onValuesChange={(_changed, all) => {
          // نتیجه بررسی قبلی با تغییر فرم دیگر معتبر نیست
          setChecked(undefined);
          // مبلغ متفاوت: ردیفی که مبلغش خالی شد از انتخاب خارج می‌شود
          if (all.mode === ALLOCATION_MODE.VARIABLE) {
            setSelectedIds((ids) => ids.filter((id) => hasAmount(all.rows, id)));
          }
        }}
      >
        <div className="max-w-[480px]">
          <FormItem name="planId" label="طرح این ماه (طبق تفاهم‌نامه)" required>
            <SelectInput
              allowClear={false}
              placeholder="این شرکت هنوز طرحی ندارد"
              options={plans.map(planOption)}
            />
          </FormItem>
        </div>
        <FormItem name="mode">
          <RadioGroup options={AMOUNT_MODES} />
        </FormItem>

        <Typography as="title" level={3} size="md" color="heading" className="mb-3">
          انتخاب پرسنل{' '}
          {selectedIds.length > 0 && (
            <span className="text-xs font-normal text-ink-soft">
              ({toPersianDigits(selectedIds.length)} نفر انتخاب‌شده)
            </span>
          )}
        </Typography>
        <StaffSearch />
        <p className="mt-0 mb-2 text-xs text-ink-soft">
          فهرست بر اساس اولویت ثبت‌شده پرسنل مرتب شده؛ ستون «ترتیب پرداخت» را می‌توانید برای همین
          تخصیص دستی تغییر دهید.
        </p>
        <StaffPickTable
          companyId={companyId}
          filters={filters}
          variableAmount={isVariable}
          canSelect={(id) => !isVariable || hasAmount(values.rows, id)}
          disabled={!canAllocate}
          selectedIds={selectedIds}
          onSelect={(ids) => {
            setSelectedIds(ids);
            setChecked(undefined);
          }}
        />
        {!isVariable && <FixedAmountField amount={Number(values.fixedAmount ?? 0)} />}
      </Form>

      <PreviewNotices preview={checked} />
      {!canAllocate && (
        <p className="mt-2 text-xs text-danger">
          تا رسیدن تاریخ و شرایط مجاز (طبق پیام بالا)، امکان انتخاب پرسنل و ثبت درخواست وجود ندارد.
        </p>
      )}
      {/* بررسی سمت راست و ثبت سمت چپ، هم‌عرض */}
      <div className="mt-2 flex flex-wrap justify-between gap-2">
        <Button
          variant="secondary"
          icon={<SafetyCertificateOutlined />}
          disabled={!canAllocate || !plan || !selectedIds.length}
          loading={checking}
          onClick={() => void handleCheck()}
          className="w-full sm:w-[300px]"
        >
          بررسی اعتبار برای پرسنل انتخاب‌شده
        </Button>
        <Button
          variant="primary"
          icon={<SendOutlined />}
          // فقط بعد از بررسی موفق (مجاز) و بدون تغییر بعدی فرم
          disabled={!canAllocate || !checked?.isAllowed}
          loading={isPending}
          onClick={() => form.submit()}
          className="w-full sm:w-[300px]"
        >
          ثبت درخواست برای پرسنل انتخاب‌شده
        </Button>
      </div>
    </PanelCard>
  );
};
