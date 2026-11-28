import {
  normalizeLetters,
  normalizeText,
  personnelCodeRule,
  fullNameRule,
} from '@/utils/inputRules';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import {
  getPersonnelSearchQueryKey,
  usePersonnelCreate,
  usePersonnelGet,
  usePersonnelUpdate,
} from '@/api/generated/facility';
import { Form, FormItem } from '@/component/form';
import { DateInput, NumberInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';

import { nationalCodeRule } from '@/utils/validation';
import { toEnglishDigits } from '@/utils/date';

import { type StaffDetail, type StaffFormValues } from '../types';

const PERSONNEL_CODE_MAX = 10;

interface StaffFormModalProps {
  open: boolean;
  companyId: number;
  /** شناسه پرسنل برای ویرایش؛ خالی = افزودن */
  staffId?: number | null;
  onClose: () => void;
}

const toFormValues = (staff: StaffDetail): StaffFormValues => ({
  fullName: normalizeLetters(staff.fullName ?? ''),
  nationalCode: toEnglishDigits(staff.nationalCode ?? ''),
  mobile: normalizeText(staff.mobile ?? ''),
  personnelCode: normalizeText(staff.personnelCode ?? ''),
  hireDate: staff.hireDate ?? '',
  priority: staff.priority,
});

export const StaffFormModal = ({ open, companyId, staffId, onClose }: StaffFormModalProps) => {
  const [form] = Form.useForm<StaffFormValues>();
  const fullName = Form.useWatch('fullName', form);
  const queryClient = useQueryClient();
  const isEdit = Boolean(staffId);

  const { data: detail, isFetching } = usePersonnelGet(staffId ?? 0, {
    query: { enabled: open && isEdit, gcTime: 0 },
  });

  const onSaved = (saved: StaffDetail) => {
    void queryClient.invalidateQueries({ queryKey: getPersonnelSearchQueryKey(companyId) });
    toast.success(
      isEdit ? `اطلاعات «${saved.fullName}» ویرایش شد.` : `«${saved.fullName}» ثبت شد.`,
    );
  };

  const create = usePersonnelCreate({ mutation: { onSuccess: onSaved } });
  const update = usePersonnelUpdate({ mutation: { onSuccess: onSaved } });

  // اولویت اختیاری است؛ خالی = آخرین اولویت (سمت سرور)
  const submit = ({ priority, ...values }: StaffFormValues) => {
    const data = { ...values, priority: priority ?? undefined };
    return staffId
      ? update.mutateAsync({ id: staffId, data: { ...data, rowVersion: detail?.rowVersion ?? '' } })
      : create.mutateAsync({ companyId, data });
  };

  const initialValues = useMemo(
    () => (isEdit && detail ? toFormValues(detail) : undefined),
    [isEdit, detail],
  );

  return (
    <FormModal<StaffFormValues>
      form={form}
      okButtonProps={{ disabled: Boolean(fullName && !fullNameRule.pattern.test(fullName)) }}
      title={isEdit ? 'ویرایش پرسنل' : 'افزودن پرسنل'}
      okText={isEdit ? 'ذخیره تغییرات' : 'ثبت پرسنل'}
      open={open}
      width={760}
      columns={2}
      loading={isEdit && isFetching}
      initialValues={initialValues}
      onCancel={onClose}
      onSubmit={submit}
    >
      <FormItem
        name="fullName"
        normalize={normalizeLetters}
        rules={[fullNameRule]}
        label="نام و نام خانوادگی"
        required
      >
        <TextInput maxLength={51} />
      </FormItem>
      <FormItem
        name="nationalCode"
        label="کد ملی"
        required
        normalize={toEnglishDigits}
        rules={[nationalCodeRule]}
      >
        <TextInput inputMode="numeric" maxLength={10} />
      </FormItem>
      <FormItem
        name="mobile"
        normalize={toEnglishDigits}
        label="شماره موبایل"
        required
        rules={[{ pattern: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست (مثل ۰۹۱۲۱۲۳۴۵۶۷).' }]}
      >
        <TextInput inputMode="numeric" maxLength={11} />
      </FormItem>
      <FormItem
        name="personnelCode"
        normalize={normalizeText}
        label="کد پرسنلی (حداکثر ۱۰ کاراکتر)"
        required
        rules={[
          personnelCodeRule,
          { max: PERSONNEL_CODE_MAX, message: 'کد پرسنلی حداکثر ۱۰ کاراکتر است.' },
        ]}
      >
        <TextInput maxLength={PERSONNEL_CODE_MAX} />
      </FormItem>
      <FormItem name="hireDate" label="تاریخ استخدام" required>
        <DateInput />
      </FormItem>
      <FormItem name="priority" label="اولویت تخصیص (اختیاری؛ عدد کوچک‌تر = اولویت بالاتر)">
        <NumberInput precision={0} min={1} placeholder="خالی = آخرین اولویت" />
      </FormItem>
    </FormModal>
  );
};
