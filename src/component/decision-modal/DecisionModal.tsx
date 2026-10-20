import { type ReactNode } from 'react';

import { type PostApprovalStage } from '@/api/generated/facility/facilityPanelAPI.schemas';

import { toPersianDigits } from '@/utils/date';
import { formatRial } from '@/utils/number';
import { rialToTomanWords } from '@/utils/numberToWords';

import { FormItem } from '../form';
import { FileInput, SelectInput, TextAreaInput } from '../input';
import { FormModal } from '../modal';

export type DecisionType = 'approve' | 'reject';

/** مقادیر فرم تصمیم (نام فیلدها مثل بدنه بک‌اند) */
export interface DecisionFormValues {
  description?: string;
  file?: File | null;
  /** دلیل رد */
  reasonId?: number;
  /** مرحله پس از تأیید (تأیید اعتبارات) */
  postStage?: PostApprovalStage;
  /** علت مرحله‌ای که علت می‌خواهد (عدم اعطای تسهیلات غیرحضوری) */
  postStageReasonId?: number;
}

/** حداقل اطلاعات درخواست برای نمایش در مودال تصمیم */
export interface DecisionRequestInfo {
  id?: number;
  personnelName?: string;
  planTitle?: string;
  amount?: number;
}

export interface DecisionTarget {
  type: DecisionType;
  requests: DecisionRequestInfo[];
}

export interface DecisionModalProps {
  target: DecisionTarget | null;
  /** اگر داده شود، در حالت رد انتخاب دلیل اجباری است */
  rejectReasons?: { value: number; label: string }[];
  /** امکان الصاق مستندات (پیش‌فرض: دارد) */
  allowFile?: boolean;
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
  const amount = first.amount ?? 0;
  return `${first.personnelName} — ${first.planTitle} — ${formatRial(amount)} (${rialToTomanWords(amount)})`;
};

/** مودال ثبت تصمیم (تأیید / رد) برای یک یا چند درخواست */
export const DecisionModal = ({
  target,
  rejectReasons,
  allowFile = true,
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
          <SelectInput options={rejectReasons} />
        </FormItem>
      )}
      {!isReject && approveFields}
      <FormItem
        name="description"
        label={noteRequired ? 'توضیحات' : 'توضیحات (اختیاری)'}
        required={noteRequired}
        requiredMessage="توضیحات رد الزامی است."
        rules={[
          { whitespace: true, message: 'توضیحات رد الزامی است.' },
          ...(noteRequired ? [{ min: 5, message: 'توضیحات باید حداقل ۵ نویسه باشد.' }] : []),
        ]}
      >
        <TextAreaInput maxLength={500} />
      </FormItem>
      {allowFile && (
        <FormItem name="file" label="الصاق مستندات (اختیاری)">
          <FileInput />
        </FormItem>
      )}
    </FormModal>
  );
};
