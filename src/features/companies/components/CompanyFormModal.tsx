import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { FormItem } from '@/component/form';
import { DateInput, FileInput, SelectInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { Switch } from '@/component/switch';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { resolveFile } from '@/services/file';
import { getSchemeOptions } from '@/services/lookup';

import { createCompany, getCompany, updateCompany } from '../api';
import { type CompanyDetail, type CompanyFormValues } from '../types';

import { PlanSelect } from './PlanSelect';

interface CompanyFormModalProps {
  open: boolean;
  /** شناسه شرکت برای ویرایش؛ خالی = ثبت شرکت جدید */
  companyId?: string | null;
  onClose: () => void;
}

const EMPTY_VALUES: Partial<CompanyFormValues> = { sepahSalary: false, planIds: [] };

const toFormValues = ({ id: _id, ...detail }: CompanyDetail): CompanyFormValues => detail;

export const CompanyFormModal = ({ open, companyId, onClose }: CompanyFormModalProps) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm<CompanyFormValues>();
  const schemeId = Form.useWatch('schemeId', form);
  const isEdit = Boolean(companyId);

  const { data: schemes, isPending: schemesPending } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.SCHEMES,
    queryFn: getSchemeOptions,
    enabled: open,
  });

  const { data: detail, isFetching } = useQuery({
    queryKey: QUERY_KEYS.COMPANIES.DETAIL(companyId ?? ''),
    queryFn: () => getCompany(companyId ?? ''),
    enabled: open && isEdit,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ agreementFile, ...values }: CompanyFormValues) => {
      const file = await resolveFile(agreementFile);
      const payload = { ...values, agreementFileId: file?.id ?? null };
      return companyId ? updateCompany(companyId, payload) : createCompany(payload);
    },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOKUPS.COMPANIES });
      toast.success(
        isEdit ? `اطلاعات «${saved.name}» به‌روزرسانی شد.` : `شرکت «${saved.name}» ثبت شد.`,
      );
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
      onSubmit={mutateAsync}
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
      <FormItem name="agreementNo" label="شماره تفاهم‌نامه منعقده" required>
        <TextInput />
      </FormItem>
      <FormItem name="accountNo" label="شماره حساب شرکت" required>
        <TextInput inputMode="numeric" />
      </FormItem>
      <FormItem name="contractDate" label="تاریخ انعقاد قرارداد" required>
        <DateInput />
      </FormItem>
      <FormItem name="accountOpenDate" label="روز افتتاح حساب سپرده" required>
        <DateInput />
      </FormItem>
      <FormItem name="sepahSalary" label="دریافت حقوق پرسنل از بانک سپه">
        <Switch checkedChildren="بله" unCheckedChildren="خیر" />
      </FormItem>
      <FormItem name="agreementFile" label="فایل تفاهم‌نامه">
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
