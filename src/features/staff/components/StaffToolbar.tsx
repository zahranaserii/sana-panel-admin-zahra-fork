import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { createElement } from 'react';
import { toast } from 'sonner';

import { getPersonnelSearchQueryKey, usePersonnelImport } from '@/api/generated/facility';
import { Button } from '@/component/button';
import { UploadButton } from '@/component/upload-button';
import { FACILITY } from '@/constant/endpoints';
import { http } from '@/services/http';
import { toPersianDigits } from '@/utils/date';

import { type StaffImportResult } from '../types';

interface StaffToolbarProps {
  companyId: number;
  onCreate: () => void;
}

/** سرویس تولیدشده نوع فایل را نمی‌شناسد؛ دانلود فایل نمونه با http.download */
const downloadTemplate = () =>
  http.download(`${FACILITY}/Personnel/Import/Template`, 'نمونه-فایل-پرسنل.xlsx');

/** دکمه‌های افزودن، دانلود فایل نمونه و بارگذاری گروهی پرسنل */
export const StaffToolbar = ({ companyId, onCreate }: StaffToolbarProps) => {
  const queryClient = useQueryClient();
  const { modal } = App.useApp();

  const { mutate: download, isPending: isDownloading } = useMutation({
    mutationFn: downloadTemplate,
  });

  /** ردیف‌های ردشده با شماره ردیف و دلیل در مودال نمایش داده می‌شوند */
  const showResult = ({ accepted = 0, errors = [] }: StaffImportResult) => {
    void queryClient.invalidateQueries({ queryKey: getPersonnelSearchQueryKey(companyId) });
    if (accepted) toast.success(`${toPersianDigits(accepted)} نفر اضافه شد.`);
    if (!errors.length) return;
    modal.warning({
      title: `${toPersianDigits(errors.length)} ردیف ثبت نشد`,
      width: 520,
      okText: 'متوجه شدم',
      content: createElement(
        'ul',
        { className: 'm-0 ps-5 text-[13px] leading-8' },
        errors.map((item) =>
          createElement(
            'li',
            { key: `${item.row}-${item.message}` },
            toPersianDigits(`ردیف ${item.row ?? '—'}: ${item.message ?? ''}`),
          ),
        ),
      ),
    });
  };

  const { mutate: upload, isPending: isUploading } = usePersonnelImport({
    mutation: { onSuccess: showResult },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="small" icon={<PlusOutlined />} onClick={onCreate}>
        افزودن پرسنل
      </Button>
      <Button
        variant="secondary"
        size="small"
        icon={<DownloadOutlined />}
        loading={isDownloading}
        onClick={() => download()}
      >
        دانلود نمونه فایل
      </Button>
      <UploadButton
        size="small"
        accept=".xlsx"
        loading={isUploading}
        onSelect={(file) => upload({ companyId, data: { file } })}
      >
        آپلود فایل اکسل پرسنل
      </UploadButton>
    </div>
  );
};
