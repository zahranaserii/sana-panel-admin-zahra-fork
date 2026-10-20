import { useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useMemo } from 'react';
import { toast } from 'sonner';

import {
  getCompaniesLookupQueryKey,
  getCompaniesSearchQueryKey,
  useBasicInfoSchemes,
  useCompaniesCreate,
  useCompaniesGet,
  useCompaniesUpdate,
} from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { DateInput, FileInput, SelectInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { Switch } from '@/component/switch';

import { type CompanyDetail, type CompanyFormValues } from '../types';

import { AgreementDownload } from './AgreementDownload';
import { PlanSelect } from './PlanSelect';

interface CompanyFormModalProps {
  open: boolean;
  /** شناسه شرکت برای ویرایش؛ خالی = ثبت شرکت جدید */
  companyId?: number | null;
  onClose: () => void;
}

const EMPTY_VALUES: Partial<CompanyFormValues> = { salaryFromSepah: false, planIds: [] };

const toFormValues = (detail: CompanyDetail): CompanyFormValues => ({
  schemeId: detail.schemeId,
  name: detail.name ?? '',
  nationalId: detail.nationalId ?? '',
  agreementNumber: detail.agreementNumber ?? '',
  accountNumber: detail.accountNumber ?? '',
  contractDate: detail.contractDate ?? '',
  accountOpeningDate: detail.accountOpeningDate ?? '',
  salaryFromSepah: Boolean(detail.salaryFromSepah),
  planIds: (detail.plans ?? []).map((plan) => plan.planId ?? 0),
  agreementFile: detail.agreementFile
    ? { id: String(detail.agreementFile.id), name: detail.agreementFile.fileName ?? '' }
    : null,
});

/** فایل فقط وقتی فایل جدید انتخاب شده باشد ارسال می‌شود */
const newFile = (value: CompanyFormValues['agreementFile']) =>
  value instanceof File ? value : undefined;

export const CompanyFormModal = ({ open, companyId, onClose }: CompanyFormModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<CompanyFormValues>();
  const schemeId = Form.useWatch('schemeId', form);
  const isEdit = Boolean(companyId);

  const { data: schemes, isPending: schemesPending } = useBasicInfoSchemes({
    query: { enabled: open },
  });

  const { data: detail, isFetching } = useCompaniesGet(companyId ?? 0, {
    query: { enabled: open && isEdit, gcTime: 0 },
  });

  const onSaved = (saved: CompanyDetail) => {
    void queryClient.invalidateQueries({ queryKey: getCompaniesSearchQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getCompaniesLookupQueryKey() });
    toast.success(
      isEdit ? `اطلاعات «${saved.name}» به‌روزرسانی شد.` : `شرکت «${saved.name}» ثبت شد.`,
    );
  };

  const create = useCompaniesCreate({ mutation: { onSuccess: onSaved } });
  const update = useCompaniesUpdate({ mutation: { onSuccess: onSaved } });

  const submit = ({ agreementFile, schemeId: scheme, nationalId, ...values }: CompanyFormValues) =>
    companyId
      ? update.mutateAsync({
          id: companyId,
          data: {
            Name: values.name,
            AgreementNumber: values.agreementNumber,
            AccountNumber: values.accountNumber,
            ContractDate: values.contractDate,
            AccountOpeningDate: values.accountOpeningDate,
            SalaryFromSepah: values.salaryFromSepah,
            PlanIds: values.planIds,
            RowVersion: detail?.rowVersion ?? '',
            agreementFile: newFile(agreementFile),
          },
        })
      : create.mutateAsync({
          data: {
            SchemeId: scheme ?? 0,
            NationalId: nationalId,
            Name: values.name,
            AgreementNumber: values.agreementNumber,
            AccountNumber: values.accountNumber,
            ContractDate: values.contractDate,
            AccountOpeningDate: values.accountOpeningDate,
            SalaryFromSepah: values.salaryFromSepah,
            PlanIds: values.planIds,
            agreementFile: newFile(agreementFile),
          },
        });

  // باید memo شود تا با هر رندر، مقادیر در حال ویرایش فرم بازنویسی نشوند
  const initialValues = useMemo(
    () => (isEdit && detail ? toFormValues(detail) : EMPTY_VALUES),
    [isEdit, detail],
  );

  return (
    <FormModal<CompanyFormValues>
      form={form}
      title={isEdit ? 'ویرایش اطلاعات شرکت' : 'ثبت اطلاعات شرکت'}
      okText={isEdit ? 'ذخیره تغییرات' : 'ثبت شرکت'}
      open={open}
      width={860}
      columns={2}
      loading={isEdit && isFetching}
      initialValues={initialValues}
      onCancel={onClose}
      onSubmit={submit}
    >
      <FormItem
        name="schemeId"
        label="طرح کلان"
        required
        extra={isEdit ? 'طرح کلان بعد از ثبت شرکت قابل تغییر نیست.' : undefined}
      >
        <SelectInput
          disabled={isEdit}
          loading={schemesPending}
          options={schemes?.map((scheme) => ({ value: scheme.id, label: scheme.title }))}
          // با تغییر طرح کلان، طرح‌های انتخاب‌شده (که به طرح قبلی تعلق داشتند) پاک می‌شوند
          onChange={() => form.setFieldValue('planIds', [])}
        />
      </FormItem>
      <FormItem name="name" label="نام شرکت" required>
        <TextInput />
      </FormItem>
      <FormItem
        name="nationalId"
        label="شناسه ملی شرکت"
        required
        extra={isEdit ? 'شناسه ملی بعد از ثبت قابل ویرایش نیست.' : undefined}
      >
        <TextInput inputMode="numeric" maxLength={11} disabled={isEdit} />
      </FormItem>
      <FormItem name="agreementNumber" label="شماره تفاهم‌نامه منعقده" required>
        <TextInput />
      </FormItem>
      <FormItem name="accountNumber" label="شماره حساب شرکت" required>
        <TextInput inputMode="numeric" />
      </FormItem>
      <FormItem name="contractDate" label="تاریخ انعقاد قرارداد" required>
        <DateInput />
      </FormItem>
      <FormItem name="accountOpeningDate" label="روز افتتاح حساب سپرده" required>
        <DateInput />
      </FormItem>
      <FormItem name="salaryFromSepah" label="دریافت حقوق پرسنل از بانک سپه">
        <Switch checkedChildren="بله" unCheckedChildren="خیر" />
      </FormItem>
      <FormItem
        name="agreementFile"
        label="فایل تفاهم‌نامه"
        extra={detail?.agreementFile && <AgreementDownload companyId={companyId ?? 0} />}
      >
        <FileInput />
      </FormItem>
      <div className="md:col-span-2">
        <FormItem
          name="planIds"
          label="طرح‌های مندرج در قرارداد"
          required
          requiredMessage="حداقل یک طرح باید انتخاب شود."
        >
          <PlanSelect schemeId={schemeId} />
        </FormItem>
      </div>
    </FormModal>
  );
};
