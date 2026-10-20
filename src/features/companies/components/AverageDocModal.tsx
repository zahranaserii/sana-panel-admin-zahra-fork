import { FormItem } from '@/component/form';
import { FileInput, SelectInput, TextAreaInput } from '@/component/input';
import { FormModal } from '@/component/modal';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';
import { toPersianDigits } from '@/utils/date';

import { type BalanceDocFormValues } from '../types';

interface AverageDocModalProps {
  open: boolean;
  /** ماه‌هایی که تغییر کرده‌اند (YYYY/MM) */
  months: string[];
  onSubmit: (values: BalanceDocFormValues) => Promise<unknown>;
  onClose: () => void;
}

/** برای ثبت میانگین، انتخاب نوع مستند و بارگذاری فایل آن اجباری است */
export const AverageDocModal = ({ open, months, onSubmit, onClose }: AverageDocModalProps) => {
  const docTypes = useReasonOptions(REASON_TYPE.DOCUMENT_TYPE, undefined, open);

  return (
    <FormModal<BalanceDocFormValues>
      title="مستند میانگین موجودی"
      okText="ثبت میانگین و مستند"
      open={open}
      onCancel={onClose}
      onSubmit={onSubmit}
    >
      <p className="mt-0 mb-4 text-[12.5px] text-ink-soft">
        ماه‌های تغییر یافته: {toPersianDigits(months.join('، '))}
      </p>
      <FormItem name="documentTypeId" label="نوع مستند" required>
        <SelectInput loading={docTypes.isPending} options={docTypes.options} />
      </FormItem>
      <FormItem
        name="file"
        label="فایل مستند"
        required
        requiredMessage="بارگذاری فایل مستند اجباری است."
      >
        <FileInput />
      </FormItem>
      <FormItem name="description" label="توضیحات (اختیاری)">
        <TextAreaInput maxLength={500} />
      </FormItem>
    </FormModal>
  );
};
