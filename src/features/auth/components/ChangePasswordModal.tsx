import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { authenticationMyPasswordPost } from '@/api/generated/admin';
import { FormItem } from '@/component/form';
import { PasswordInput } from '@/component/input';
import { FormModal } from '@/component/modal';

import { newPasswordRule } from '@/utils/validation';

import { type ChangePasswordFormValues } from '../types';

type ChangePasswordModalProps = {
  onCancel: () => void;
} & (
  | { mode?: 'login'; onSubmit: (values: ChangePasswordFormValues) => Promise<void> }
  | { mode: 'account' }
);

export const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const isAccount = props.mode === 'account';
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: ChangePasswordFormValues & { currentPassword?: string }) => {
      if (props.mode !== 'account') return props.onSubmit(values);
      await authenticationMyPasswordPost({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('رمز عبور شما تغییر کرد.');
      props.onCancel();
    },
    onError: (error) => {
      if (!isAxiosError(error)) toast.error(error.message);
    },
  });

  return (
    <FormModal<ChangePasswordFormValues>
      open
      title="تغییر رمز عبور"
      okText="ثبت رمز جدید"
      cancelText={isAccount ? 'انصراف' : 'بازگشت به ورود'}
      closable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      closeOnSuccess={false}
      onCancel={props.onCancel}
      onSubmit={mutateAsync}
    >
      {isAccount && (
        <FormItem name="currentPassword" label="رمز عبور فعلی" required>
          <PasswordInput autoComplete="current-password" />
        </FormItem>
      )}
      <FormItem
        name="newPassword"
        label="رمز عبور جدید"
        required
        dependencies={isAccount ? ['currentPassword'] : undefined}
        rules={[
          ({ getFieldValue }) =>
            newPasswordRule(isAccount ? getFieldValue('currentPassword') : undefined),
        ]}
      >
        <PasswordInput autoComplete="new-password" />
      </FormItem>
      <FormItem
        name="confirmNewPassword"
        label="تکرار رمز عبور جدید"
        required
        dependencies={['newPassword']}
        rules={[
          ({ getFieldValue }) => ({
            validator: async (_, value: string) => {
              if (value !== getFieldValue('newPassword')) {
                throw new Error('تکرار رمز عبور با رمز جدید یکسان نیست.');
              }
            },
          }),
        ]}
      >
        <PasswordInput autoComplete="new-password" />
      </FormItem>
    </FormModal>
  );
};
