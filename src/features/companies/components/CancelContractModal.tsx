import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { FormItem } from '@/component/form';
import { DateInput, FileInput, SelectInput, TextAreaInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { resolveFile } from '@/services/file';
import { getCancelReasons } from '@/services/lookup';
import { dayjs, ISO_DATE_FORMAT } from '@/utils/date';

import { cancelContract } from '../api';
import { type CancelContractFormValues, type CompanyListItem } from '../types';

interface CancelContractModalProps {
  company: CompanyListItem | null;
  onClose: () => void;
}

const INITIAL_VALUES = { cancelDate: dayjs().format(ISO_DATE_FORMAT) };

export const CancelContractModal = ({ company, onClose }: CancelContractModalProps) => {
  const queryClient = useQueryClient();

  const { data: reasons, isPending } = useQuery({
    queryKey: QUERY_KEYS.LOOKUPS.CANCEL_REASONS,
    queryFn: getCancelReasons,
    enabled: Boolean(company),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ file, ...values }: CancelContractFormValues) => {
      const uploaded = await resolveFile(file);
      return cancelContract(company?.id ?? '', {
        ...values,
        note: values.note.trim(),
        fileId: uploaded?.id ?? '',
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPANIES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOOKUPS.COMPANIES });
      toast.success(`قرارداد «${company?.name}» لغو شد.`);
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
      onSubmit={mutateAsync}
    >
      <FormItem name="cancelDate" label="تاریخ لغو" required>
        <DateInput />
      </FormItem>
      <FormItem name="reasonId" label="دلیل لغو" required>
        <SelectInput
          loading={isPending}
          options={reasons?.map((reason) => ({ value: reason.id, label: reason.title }))}
        />
      </FormItem>
      <FormItem
        name="note"
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
