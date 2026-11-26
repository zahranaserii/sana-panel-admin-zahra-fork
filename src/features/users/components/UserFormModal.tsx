import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useMemo } from 'react';

import { Form, FormItem } from '@/component/form';
import { PasswordInput, SelectInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { nationalCodeRule, newPasswordRule } from '@/utils/validation';
import { type ApiErrorBody } from '@/types/common';
import { toEnglishDigits } from '@/utils/date';

import { createUser, getRoles, getUser, updateUser } from '../api';
import { type User, type UserPayload } from '../types';
import { mobileNumberRule } from '../validation';

interface UserFormModalProps {
  open: boolean;
  /** شناسه کاربر برای ویرایش؛ خالی = افزودن */
  userId?: number | null;
  onClose: () => void;
}

/** نقش فعلی کاربر = اولین مورد roles */
const toFormValues = (user: User): UserPayload => ({
  userName: user.userName,
  fullName: user.fullName,
  userCode: user.userCode,
  mobileNumber: toEnglishDigits(user.mobileNumber ?? ''),
  nationalCode: toEnglishDigits(user.nationalCode ?? ''),
  branchName: user.branchName,
  branchCode: user.branchCode,
  roleId: user.roles[0]?.roleId ?? null,
});

/** همه نقش‌ها برای سلکت (تعداد نقش‌ها کم است) */
const ROLE_PARAMS = { page: 1, pageSize: 100 };

/** پیام موفقیت همان پیام بک‌اند است؛ ۴۰۹ (نام کاربری تکراری) به‌جای توست، کنار همان فیلد نمایش داده می‌شود */
const SAVE_CONFIG = { successToast: true, onError: { 409: () => undefined } };

export const UserFormModal = ({ open, userId, onClose }: UserFormModalProps) => {
  const [form] = Form.useForm<UserPayload>();
  const queryClient = useQueryClient();
  const isEdit = Boolean(userId);

  const { data: detail, isFetching } = useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(userId ?? 0),
    queryFn: () => getUser(userId ?? 0),
    enabled: open && isEdit,
  });

  const {
    data: roles,
    isFetching: rolesFetching,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: QUERY_KEYS.USERS.ROLES,
    queryFn: () => getRoles(ROLE_PARAMS),
    enabled: open,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (values: UserPayload) => {
      if (!userId) return createUser(values, SAVE_CONFIG);
      if (!detail) throw new Error('اطلاعات کاربر دریافت نشد.');
      return updateUser(detail, values, SAVE_CONFIG);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorBody>(error) && error.response?.status === 409) {
        form.setFields([
          { name: 'userName', errors: error.response.data.errors?.userName ?? ['تکراری است.'] },
        ]);
      }
    },
  });

  const initialValues = useMemo(
    () => (isEdit && detail ? toFormValues(detail) : undefined),
    [isEdit, detail],
  );

  return (
    <FormModal<UserPayload>
      form={form}
      title={isEdit ? 'ویرایش کاربر' : 'افزودن کاربر'}
      okText={isEdit ? 'ذخیره تغییرات' : 'ثبت کاربر'}
      open={open}
      width={760}
      columns={2}
      loading={isEdit && isFetching}
      initialValues={initialValues}
      onCancel={onClose}
      onSubmit={mutateAsync}
    >
      <FormItem name="userName" label="نام کاربری" required>
        <TextInput autoComplete="off" dir="ltr" />
      </FormItem>
      <FormItem
        name="password"
        label="رمز عبور"
        required={!isEdit}
        rules={[newPasswordRule()]}
        extra={isEdit ? 'برای تغییر نکردن رمز، این فیلد را خالی بگذارید.' : undefined}
      >
        <PasswordInput
          autoComplete="new-password"
          placeholder={isEdit ? 'بدون تغییر' : 'رمز عبور'}
        />
      </FormItem>
      <FormItem name="fullName" label="نام و نام خانوادگی کاربر" required>
        <TextInput />
      </FormItem>
      <FormItem name="userCode" label="کد کاربر" required>
        <TextInput inputMode="numeric" placeholder="مثلاً ۳۹۹" />
      </FormItem>
      <FormItem
        name="mobileNumber"
        label="شماره موبایل"
        required
        normalize={toEnglishDigits}
        rules={[mobileNumberRule]}
      >
        <TextInput dir="ltr" inputMode="tel" maxLength={11} />
      </FormItem>
      <FormItem
        name="nationalCode"
        label="کد ملی"
        required
        normalize={toEnglishDigits}
        rules={[nationalCodeRule]}
      >
        <TextInput dir="ltr" inputMode="numeric" maxLength={10} />
      </FormItem>
      <FormItem name="branchName" label="نام شعبه" required>
        <TextInput placeholder="مثلاً شعبه بازار تهران" />
      </FormItem>
      <FormItem name="branchCode" label="کد شعبه" required>
        <TextInput inputMode="numeric" placeholder="مثلاً ۱۵۰۰۰۲" />
      </FormItem>
      <FormItem name="roleId" label="نقش کاربر" required requiredMessage="انتخاب نقش الزامی است.">
        <SelectInput
          loading={rolesFetching}
          onRetry={() => void refetchRoles()}
          placeholder="انتخاب نقش"
          options={roles?.items.map((role) => ({
            value: role.id,
            label: role.persianTitle ?? role.title,
          }))}
        />
      </FormItem>
    </FormModal>
  );
};
