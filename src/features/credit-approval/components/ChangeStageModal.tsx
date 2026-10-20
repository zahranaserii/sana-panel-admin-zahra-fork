import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApprovalsCreditQueueQueryKey, useApprovalsPostStage } from '@/api/generated/facility';
import { FormModal } from '@/component/modal';
import { type DecisionFormValues } from '@/features/manager-approval/types';

import { type CreditApprovalItem } from '../types';

import { PostStageFields } from './PostStageFields';

interface ChangeStageModalProps {
  request: CreditApprovalItem | null;
  onClose: () => void;
}

/** تغییر مرحله پس از تأیید برای درخواست تأییدشده */
export const ChangeStageModal = ({ request, onClose }: ChangeStageModalProps) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useApprovalsPostStage({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getApprovalsCreditQueueQueryKey() });
        toast.success('مرحله پس از تأیید به‌روزرسانی شد.');
      },
    },
  });

  return (
    <FormModal<DecisionFormValues>
      title={`مرحله پس از تأیید — ${request?.personnelName ?? ''}`}
      okText="ثبت مرحله"
      open={Boolean(request)}
      initialValues={{ postStage: request?.postStage }}
      onCancel={onClose}
      onSubmit={({ postStage, postStageReasonId }) =>
        mutateAsync({
          requestId: request?.id ?? 0,
          data: { stage: postStage ?? 1, reasonId: postStageReasonId ?? null },
        })
      }
    >
      <PostStageFields />
    </FormModal>
  );
};
