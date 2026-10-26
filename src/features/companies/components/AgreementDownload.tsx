import { DownloadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/component/button';
import { FACILITY } from '@/constant/endpoints';
import { http } from '@/services/http';

/** دانلود فایل تفاهم‌نامه فعلی شرکت (از لینک موقت بک‌اند، با http.download) */
export const AgreementDownload = ({ companyId }: { companyId: number }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => http.download(`${FACILITY}/Companies/${companyId}/AgreementFile`),
  });

  return (
    <Button
      variant="text"
      size="small"
      icon={<DownloadOutlined />}
      loading={isPending}
      onClick={() => mutate()}
    >
      دانلود فایل فعلی
    </Button>
  );
};
