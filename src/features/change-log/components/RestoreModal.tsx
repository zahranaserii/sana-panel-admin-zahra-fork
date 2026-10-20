import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useChangeLogsRestore } from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { TextAreaInput } from '@/component/input';
import { FormModal } from '@/component/modal';

import { type ChangeLogItem } from '../types';

interface RestoreModalProps {
  log: ChangeLogItem | null;
  onClose: () => void;
}

interface RestoreFormValues {
  description: string;
}

/** بازگردانی یک عملیات؛ بک‌اند توضیح را الزامی می‌خواهد */
export const RestoreModal = ({ log, onClose }: RestoreModalProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useChangeLogsRestore({
    mutation: {
      onSuccess: () => {
        // موجودیت بازگردانی‌شده ممکن است در هر صفحه‌ای نمایش داده شود
        void queryClient.invalidateQueries();
        toast.success('بازگردانی با موفقیت انجام شد.');
      },
    },
  });

  return (
    <FormModal<RestoreFormValues>
      title="بازگردانی تغییر به حالت قبل"
      okText="بازگردانی"
      open={Boolean(log)}
      onCancel={onClose}
      onSubmit={({ description }) =>
        mutateAsync({ id: log?.id ?? 0, data: { description: description.trim() } })
      }
    >
      <p className="mt-0 mb-4 text-[12.5px] text-ink-soft">{log?.details}</p>
      <FormItem name="description" label="توضیح بازگردانی" required>
        <TextAreaInput rows={3} />
      </FormItem>
    </FormModal>
  );
};
