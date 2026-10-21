import { Form, FormItem } from '@/component/form';
import { SelectInput } from '@/component/input';
import { useEnums } from '@/services/enums';
import { REASON_TYPE, useReasonOptions } from '@/services/reasons';

/** مرحله پس از تأیید؛ برای مرحله‌ای که علت می‌خواهد (عدم اعطای تسهیلات غیرحضوری) علت هم لازم است */
export const PostStageFields = () => {
  const postStage = Form.useWatch<number | undefined>('postStage');
  const enums = useEnums();
  const needsReason = enums.requiresReason('postApprovalStage', postStage);
  const reasons = useReasonOptions(REASON_TYPE.REMOTE_GRANT_DENIED, undefined, needsReason);

  return (
    <>
      <FormItem name="postStage" label="مرحله پس از تأیید" required>
        <SelectInput {...enums.selectProps} options={enums.options('postApprovalStage')} />
      </FormItem>
      {needsReason && (
        <FormItem
          name="postStageReasonId"
          label="علت عدم اعطای تسهیلات غیرحضوری"
          required
          requiredMessage="انتخاب علت اجباری است."
        >
          <SelectInput {...reasons.selectProps} options={reasons.options} />
        </FormItem>
      )}
    </>
  );
};
