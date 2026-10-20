import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getLoansCreditQueryKey,
  getLoansSearchQueryKey,
  useLoansCancel,
} from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { SelectInput, TextAreaInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';

import { type LoanRequest } from '../types';

interface CancelLoanFormValues {
  reasonId: number;
  description: string;
}

interface CancelLoanModalProps {
  request: LoanRequest | null;
  onClose: () => void;
}

/** لغو درخواست وام در انتظار تأیید؛ دلیل و توضیحات الزامی */
export const CancelLoanModal = ({ request, onClose }: CancelLoanModalProps) => {
  const queryClient = useQueryClient();
  const reasons = useReasonOptions(REASON_TYPE.LOAN_CANCEL, undefined, Boolean(request));

  const { mutateAsync } = useLoansCancel({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getLoansSearchQueryKey() });
        void queryClient.invalidateQueries({
          queryKey: getLoansCreditQueryKey(request?.companyId ?? 0),
        });
        toast.success(`درخواست وام «${request?.personnelName}» لغو شد.`);
      },
    },
  });

  return (
    <FormModal<CancelLoanFormValues>
      title={`لغو درخواست وام ${request?.personnelName ?? ''}`}
      okText="لغو درخواست"
      okButtonProps={{ danger: true }}
      open={Boolean(request)}
      onCancel={onClose}
      onSubmit={({ reasonId, description }) =>
        mutateAsync({ id: request?.id ?? 0, data: { reasonId, description: description.trim() } })
      }
    >
      <FormItem name="reasonId" label="دلیل لغو" required>
        <SelectInput loading={reasons.isPending} options={reasons.options} />
      </FormItem>
      <FormItem
        name="description"
        label="توضیحات"
        required
        rules={[{ min: 5, message: 'توضیحات باید حداقل ۵ نویسه باشد.' }]}
      >
        <TextAreaInput maxLength={500} />
      </FormItem>
    </FormModal>
  );
};
