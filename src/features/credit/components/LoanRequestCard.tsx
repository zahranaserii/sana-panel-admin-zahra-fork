import { SendOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  getLoansCreditQueryKey,
  getLoansSearchQueryKey,
  useLoansCreate,
  useLoansPreview,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { Form, FormItem } from '@/component/form';
import { SelectInput } from '@/component/input';
import { RadioGroup } from '@/component/radio';
import { Typography } from '@/component/typography';
import { StaffSearch } from '@/features/staff/components';
import { type StaffFilters } from '@/features/staff/types';
import { useDebouncedValue } from '@/hooks';
import { toPersianDigits } from '@/utils/date';

import { type CompanyCredit, type LoanRequestFormValues, type PlanCredit } from '../types';
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

const planOption = (plan: PlanCredit) => ({
  value: plan.planId,
  label: toPersianDigits(`${plan.contractType} - نرخ ${plan.rate}٪ - مدت ${plan.termMonths} ماه`),
});

/** ثبت درخواست تخصیص وام به پرسنل (بررسی اعتبار و تخصیص تکراری با سرویس پیش‌نمایش) */
export const LoanRequestCard = ({ companyId, date, credit, filters }: LoanRequestCardProps) => {
  const [form] = Form.useForm<LoanRequestFormValues>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const plans = useMemo(() => credit?.plans ?? [], [credit]);
  const canAllocate = Boolean(credit?.banner?.canRegisterLoan);
  const values = Form.useWatch([], form) ?? INITIAL_VALUES;
  const plan = plans.find((item) => item.planId === values.planId);

  // اگر طرحی انتخاب نشده یا طرح انتخاب‌شده دیگر وجود ندارد، اولین طرح انتخاب می‌شود
  useEffect(() => {
    const current = form.getFieldValue('planId') as number | undefined;
    if (!plans.some((item) => item.planId === current)) {
      form.setFieldValue('planId', plans[0]?.planId);
    }
  }, [plans, form]);

  // پیش‌نمایش (مجموع، مجاز بودن، پیام‌ها و تخصیص تکراری) بعد از توقف تایپ از سرور گرفته می‌شود
  const body = useDebouncedValue(buildLoanBody(values, selectedIds, date));
  const { data: preview, isError: previewFailed } = useLoansPreview(companyId, body, {
    query: { enabled: Boolean(plan) && canAllocate },
  });

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
        toast.success(
          `درخواست وام برای ${toPersianDigits(batch.requests?.length ?? 0)} نفر با موفقیت ثبت شد.`,
        );
      },
    },
  });

  const handleFinish = (formValues: LoanRequestFormValues) => {
    if (!plan) return;
    if (!selectedIds.length) {
      toast.error('حداقل یک پرسنل را از جدول انتخاب کنید.');
      return;
    }
    const submit = () => mutate({ companyId, data: buildLoanBody(formValues, selectedIds, date) });
    const repeats = preview?.repeatAllocations ?? [];
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

  const isVariable = values.mode === ALLOCATION_MODE.VARIABLE;

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
          disabled={!canAllocate}
          selectedIds={selectedIds}
          onSelect={setSelectedIds}
        />
        {!isVariable && <FixedAmountField amount={Number(values.fixedAmount ?? 0)} />}
      </Form>

      <PreviewNotices preview={preview} />
      {!canAllocate && (
        <p className="mt-2 text-xs text-danger">
          تا رسیدن تاریخ و شرایط مجاز (طبق پیام بالا)، امکان انتخاب پرسنل و ثبت درخواست وجود ندارد.
        </p>
      )}
      <Button
        variant="primary"
        icon={<SendOutlined />}
        // بدون نتیجه پیش‌نمایش (خطا) ثبت غیرفعال است
        disabled={!canAllocate || !plan || previewFailed || preview?.isAllowed === false}
        loading={isPending}
        onClick={() => form.submit()}
        className="mt-2"
      >
        ثبت درخواست برای پرسنل انتخاب‌شده
      </Button>
    </PanelCard>
  );
};
