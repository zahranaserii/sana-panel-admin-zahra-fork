import { type ReactNode } from 'react';

import { type LookupItem } from '@/types/common';
import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';
import { rialToTomanWords } from '@/utils/numberToWords';

import { FormItem } from '../form';
import { FileInput, SelectInput, TextAreaInput } from '../input';
import { FormModal } from '../modal';

export type DecisionType = 'approve' | 'reject';

export interface DecisionFormValues {
  note?: string;
  file?: File | null;
  reasonId?: string;
  stageId?: string;
  noGrantReasonId?: string;
}

/** حداقل اطلاعات درخواست برای نمایش در مودال تصمیم */
export interface DecisionRequestInfo {
  id: string;
  staffName: string;
  planTitle: string;
  amount: number;
}

export interface DecisionTarget {
  type: DecisionType;
  requests: DecisionRequestInfo[];
}

export interface DecisionModalProps {
  target: DecisionTarget | null;
  /** اگر داده شود، در حالت رد انتخاب دلیل اجباری است */
  rejectReasons?: LookupItem[];
  /** در حالت رد، توضیحات اجباری است (تأیید اعتبارات) */
  requireRejectNote?: boolean;
  /** فیلدهای اضافه در حالت تأیید (مثل مرحله پس از تأیید) */
  approveFields?: ReactNode;
  onSubmit: (values: DecisionFormValues) => Promise<unknown>;
  onClose: () => void;
}

const describe = (requests: DecisionRequestInfo[]) => {
  const [first] = requests;
  if (requests.length > 1 || !first)
    return `${toPersianDigits(requests.length)} درخواست انتخاب‌شده`;
  return `${first.staffName} — ${first.planTitle} — ${formatRial(first.amount)} (${rialToTomanWords(first.amount)})`;
};

/** مودال ثبت تصمیم (تأیید / رد) برای یک یا چند درخواست */
export const DecisionModal = ({
  target,
  rejectReasons,
  requireRejectNote,
  approveFields,
  onSubmit,
  onClose,
}: DecisionModalProps) => {
  const isReject = target?.type === 'reject';
  const noteRequired = isReject && Boolean(requireRejectNote);
  const isGroup = (target?.requests.length ?? 0) > 1;

  return (
    <FormModal<DecisionFormValues>
      title={`${isReject ? 'رد' : 'تأیید'} ${isGroup ? 'گروهی درخواست‌ها' : 'درخواست'}`}
      okText="ثبت تصمیم"
      okButtonProps={{ danger: isReject }}
      open={Boolean(target)}
      onCancel={onClose}
      onSubmit={onSubmit}
    >
      <p className="mt-0 mb-4 text-[12.5px] text-ink-soft">
        {target ? describe(target.requests) : ''}
      </p>
      {isReject && rejectReasons && (
        <FormItem
          name="reasonId"
          label="دلیل رد (اجباری)"
          required
          requiredMessage="انتخاب دلیل رد اجباری است."
        >
          <SelectInput
            options={rejectReasons.map((reason) => ({ value: reason.id, label: reason.title }))}
          />
        </FormItem>
      )}
      {!isReject && approveFields}
      <FormItem
        name="note"
        label={noteRequired ? 'توضیحات' : 'توضیحات (اختیاری)'}
        required={noteRequired}
        requiredMessage="توضیحات رد الزامی است."
        rules={[{ whitespace: true, message: 'توضیحات رد الزامی است.' }]}
      >
        <TextAreaInput maxLength={500} />
      </FormItem>
      <FormItem name="file" label="الصاق مستندات (اختیاری)">
        <FileInput />
      </FormItem>
    </FormModal>
  );
};
