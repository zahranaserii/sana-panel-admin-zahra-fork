import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getCompaniesLookupQueryKey,
  getCompaniesSearchQueryKey,
  useCompaniesCancelContract,
} from '@/api/generated/facility';
import { FormItem } from '@/component/form';
import { DateInput, FileInput, SelectInput, TextAreaInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';
import { dayjs, ISO_DATE_FORMAT } from '@/utils/date';

import { type CancelContractFormValues, type CompanyListItem } from '../types';

interface CancelContractModalProps {
  company: CompanyListItem | null;
  onClose: () => void;
}

const INITIAL_VALUES = { cancelDate: dayjs().format(ISO_DATE_FORMAT) };

export const CancelContractModal = ({ company, onClose }: CancelContractModalProps) => {
  const queryClient = useQueryClient();
  const reasons = useReasonOptions(REASON_TYPE.CONTRACT_CANCEL, undefined, Boolean(company));

  const { mutateAsync } = useCompaniesCancelContract({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getCompaniesSearchQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getCompaniesLookupQueryKey() });
        toast.success(`قرارداد «${company?.name}» لغو شد.`);
      },
    },
  });

  const submit = ({ cancelDate, reasonId, description, file }: CancelContractFormValues) =>
    mutateAsync({
      id: company?.id ?? 0,
      data: {
        CancelDate: cancelDate,
        ReasonId: reasonId,
        Description: description.trim(),
        letterFile: file ?? undefined,
      },
    });

  return (
    <FormModal<CancelContractFormValues>
      title={`لغو قرارداد شرکت ${company?.name ?? ''}`}
      okText="ثبت لغو قرارداد"
      okButtonProps={{ danger: true }}
      open={Boolean(company)}
      initialValues={INITIAL_VALUES}
      onCancel={onClose}
      onSubmit={submit}
    >
      <FormItem name="cancelDate" label="تاریخ لغو" required>
        <DateInput />
      </FormItem>
      <FormItem name="reasonId" label="دلیل لغو" required>
        <SelectInput loading={reasons.isPending} options={reasons.options} />
      </FormItem>
      <FormItem
        name="description"
        label="توضیحات"
        required
        rules={[
          { whitespace: true, message: 'توضیحات الزامی است.' },
          { min: 5, message: 'توضیحات باید حداقل ۵ نویسه باشد.' },
        ]}
      >
        <TextAreaInput maxLength={1000} />
      </FormItem>
      <FormItem
        name="file"
        label="فایل نامه لغو"
        required
        requiredMessage="بارگذاری فایل نامه لغو الزامی است."
      >
        <FileInput />
      </FormItem>
    </FormModal>
  );
};
