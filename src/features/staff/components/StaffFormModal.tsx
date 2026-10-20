import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import {
  getPersonnelSearchQueryKey,
  usePersonnelCreate,
  usePersonnelGet,
  usePersonnelUpdate,
} from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { DateInput, NumberInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';

import { type StaffDetail, type StaffFormValues } from '../types';

interface StaffFormModalProps {
  open: boolean;
  companyId: number;
  /** شناسه پرسنل برای ویرایش؛ خالی = افزودن */
  staffId?: number | null;
  onClose: () => void;
}

const toFormValues = (staff: StaffDetail): StaffFormValues => ({
  fullName: staff.fullName ?? '',
  nationalCode: staff.nationalCode ?? '',
  mobile: staff.mobile ?? '',
  personnelCode: staff.personnelCode ?? '',
  hireDate: staff.hireDate ?? '',
  priority: staff.priority,
});

export const StaffFormModal = ({ open, companyId, staffId, onClose }: StaffFormModalProps) => {
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
      <FormItem name="fullName" label="نام و نام خانوادگی" required>
        <TextInput />
      </FormItem>
      <FormItem
        name="nationalCode"
        label="کد ملی"
        required
        rules={[{ pattern: /^\d{10}$/, message: 'کد ملی باید ۱۰ رقم باشد.' }]}
      >
        <TextInput inputMode="numeric" maxLength={10} />
      </FormItem>
      <FormItem
        name="mobile"
        label="شماره موبایل"
        required
        rules={[{ pattern: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست (مثل ۰۹۱۲۱۲۳۴۵۶۷).' }]}
      >
        <TextInput inputMode="numeric" maxLength={11} />
      </FormItem>
      <FormItem name="personnelCode" label="کد پرسنلی" required>
        <TextInput />
      </FormItem>
      <FormItem name="hireDate" label="تاریخ استخدام" required>
        <DateInput />
      </FormItem>
      <FormItem name="priority" label="اولویت تخصیص (اختیاری؛ عدد کوچک‌تر = اولویت بالاتر)">
        <NumberInput min={1} placeholder="خالی = آخرین اولویت" />
      </FormItem>
    </FormModal>
  );
};
