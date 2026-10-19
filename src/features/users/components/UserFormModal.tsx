import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Form, FormItem } from '@/component/form';
import { PasswordInput, SelectInput, TextInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { type ApiErrorBody } from '@/types/common';

import { createUser, getRoles, getUser, updateUser } from '../api';
import { type User, type UserPayload } from '../types';

interface UserFormModalProps {
  open: boolean;
  /** شناسه کاربر برای ویرایش؛ خالی = افزودن */
  userId?: number | null;
  onClose: () => void;
}

const toFormValues = ({ id: _id, isActive: _isActive, ...user }: User): UserPayload => user;

/** همه نقش‌ها برای سلکت (تعداد نقش‌ها کم است) */
const ROLE_PARAMS = { page: 1, pageSize: 100 };

/** ۴۰۹ (نام کاربری تکراری) به‌جای توست، کنار همان فیلد نمایش داده می‌شود */
const DUPLICATE_HANDLED = { onError: { 409: () => undefined } };

export const UserFormModal = ({ open, userId, onClose }: UserFormModalProps) => {
  const [form] = Form.useForm<UserPayload>();
  const queryClient = useQueryClient();
  const isEdit = Boolean(userId);

  const { data: detail, isFetching } = useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(userId ?? 0),
    queryFn: () => getUser(userId ?? 0),
    enabled: open && isEdit,
  });

  const { data: roles, isPending: rolesPending } = useQuery({
    queryKey: QUERY_KEYS.USERS.ROLES,
    queryFn: () => getRoles(ROLE_PARAMS),
    enabled: open,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (values: UserPayload) =>
      userId
        ? updateUser(userId, values, DUPLICATE_HANDLED)
        : createUser(values, DUPLICATE_HANDLED),
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL });
      toast.success(
        isEdit ? `کاربر «${saved.fullName}» ویرایش شد.` : `کاربر «${saved.fullName}» ثبت شد.`,
      );
    },
    onError: (error) => {
      if (isAxiosError<ApiErrorBody>(error) && error.response?.status === 409) {
        form.setFields([
          { name: 'username', errors: error.response.data.errors?.username ?? ['تکراری است.'] },
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
      <FormItem name="username" label="نام کاربری" required>
        <TextInput autoComplete="off" dir="ltr" />
      </FormItem>
      <FormItem
        name="password"
        label="رمز عبور"
        required={!isEdit}
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
      <FormItem name="branchName" label="نام شعبه" required>
        <TextInput placeholder="مثلاً شعبه بازار تهران" />
      </FormItem>
      <FormItem name="branchCode" label="کد شعبه" required>
        <TextInput inputMode="numeric" placeholder="مثلاً ۱۵۰۰۰۲" />
      </FormItem>
      <FormItem name="roleId" label="نقش کاربر" required requiredMessage="انتخاب نقش الزامی است.">
        <SelectInput
          loading={rolesPending}
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
