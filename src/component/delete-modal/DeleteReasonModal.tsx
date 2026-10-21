import { FormItem } from '../form';
import { FileInput, TextAreaInput } from '../input';
import { FormModal } from '../modal';

export interface DeleteReasonValues {
  description: string;
  file?: File | null;
}

export interface DeleteReasonModalProps {
  open: boolean;
  title: string;
  /** توضیح پیامد حذف بالای فرم */
  message?: string;
  /** فایل مستند حذف هم الزامی است */
  requireFile?: boolean;
  onSubmit: (values: DeleteReasonValues) => Promise<unknown>;
  onClose: () => void;
}

/** تأیید حذف با توضیح الزامی (و در صورت نیاز فایل مستند) */
export const DeleteReasonModal = ({
  open,
  title,
  message,
  requireFile,
  onSubmit,
  onClose,
}: DeleteReasonModalProps) => (
  <FormModal<DeleteReasonValues>
    title={title}
    okText="حذف"
    okButtonProps={{ danger: true }}
    open={open}
    onCancel={onClose}
    onSubmit={onSubmit}
  >
    {message && <p className="mt-0 mb-4 text-[12.5px] text-ink-soft">{message}</p>}
    <FormItem
      name="description"
      label="توضیحات حذف"
      required
      rules={[
        { whitespace: true, message: 'توضیحات حذف الزامی است.' },
        { min: 5, message: 'توضیحات حذف باید حداقل ۵ نویسه باشد.' },
      ]}
    >
      <TextAreaInput rows={3} maxLength={500} />
    </FormItem>
    {requireFile && (
      <FormItem
        name="file"
        label="فایل مستند حذف"
        required
        requiredMessage="بارگذاری فایل مستند حذف الزامی است."
      >
        <FileInput />
      </FormItem>
    )}
  </FormModal>
);
