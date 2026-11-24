import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { FormItem } from '@/component/form';
import { PasswordInput } from '@/component/input';
import { FormModal } from '@/component/modal';

import { type ChangePasswordFormValues } from '../types';

interface ChangePasswordModalProps {
  onSubmit: (values: ChangePasswordFormValues) => Promise<void>;
  onCancel: () => void;
}

export const ChangePasswordModal = ({ onSubmit, onCancel }: ChangePasswordModalProps) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: onSubmit,
    onError: (error) => {
      if (!isAxiosError(error)) toast.error(error.message);
    },
  });

  return (
    <FormModal<ChangePasswordFormValues>
      open
      title="تغییر رمز عبور"
      okText="ثبت رمز جدید"
      cancelText="بازگشت به ورود"
      closable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      closeOnSuccess={false}
      onCancel={onCancel}
      onSubmit={mutateAsync}
    >
      <FormItem name="newPassword" label="رمز عبور جدید" required>
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
