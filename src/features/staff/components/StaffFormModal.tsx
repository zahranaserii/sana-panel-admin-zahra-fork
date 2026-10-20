import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { FormItem } from '@/component/form';
import { DateInput, NumberInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { QUERY_KEYS } from '@/constant/queryKeys';

import { createStaff, getStaff, updateStaff } from '../api';
import { type Staff, type StaffPayload } from '../types';

interface StaffFormModalProps {
  open: boolean;
  companyId: string;
  /** شناسه پرسنل برای ویرایش؛ خالی = افزودن */
  staffId?: string | null;
  onClose: () => void;
}

const toFormValues = ({ id: _id, ...staff }: Staff): StaffPayload => staff;

export const StaffFormModal = ({ open, companyId, staffId, onClose }: StaffFormModalProps) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(staffId);

  const { data: detail, isFetching } = useQuery({
    queryKey: QUERY_KEYS.STAFF.DETAIL(companyId, staffId ?? ''),
    queryFn: () => getStaff(companyId, staffId ?? ''),
    enabled: open && isEdit,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (values: StaffPayload) =>
      staffId ? updateStaff(companyId, staffId, values) : createStaff(companyId, values),
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STAFF.ALL });
      toast.success(
        isEdit ? `اطلاعات «${saved.fullName}» ویرایش شد.` : `«${saved.fullName}» ثبت شد.`,
      );
    },
  });

  const initialValues = useMemo(
    () => (isEdit && detail ? toFormValues(detail) : undefined),
    [isEdit, detail],
  );

  return (
    <FormModal<StaffPayload>
      title={isEdit ? 'ویرایش پرسنل' : 'افزودن پرسنل'}
      okText={isEdit ? 'ذخیره تغییرات' : 'ثبت پرسنل'}
      open={open}
      width={760}
      columns={2}
      loading={isEdit && isFetching}
      initialValues={initialValues}
      onCancel={onClose}
      onSubmit={mutateAsync}
    >
      <FormItem name="fullName" label="نام و نام خانوادگی" required>
        <TextInput />
      </FormItem>
      <FormItem
        name="nationalId"
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
