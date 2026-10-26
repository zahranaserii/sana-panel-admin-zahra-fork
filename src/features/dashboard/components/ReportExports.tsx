import { DownloadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/component/button';
import { PanelCard } from '@/component/card';
import { FACILITY } from '@/constant/endpoints';
import { useEnums } from '@/services/enums';
import { http } from '@/services/http';

interface ExportOption {
  value: number;
  label: string;
}

/** دانلود از لینک موقتی که بک‌اند می‌دهد (http.download، نام فایل از سرور) */
const ExportButton = ({ report }: { report: ExportOption }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => http.download(`${FACILITY}/Dashboard/Exports/${report.value}`),
  });

  return (
    <Button size="small" icon={<DownloadOutlined />} loading={isPending} onClick={() => mutate()}>
      {report.label}
    </Button>
  );
};

/** خروجی‌ها از enum بک‌اند (dashboardExport) ساخته می‌شوند */
export const ReportExports = () => {
  const { options } = useEnums();

  return (
    <PanelCard
      title="گزارش‌های خروجی (اکسل)"
      subtitle="هر فایل شامل جزئیات کامل آن بخش از سامانه است و مستقیماً در Excel باز می‌شود."
    >
      <div className="flex flex-wrap gap-2.5">
        {options('dashboardExport').map((report) => (
          <ExportButton key={report.value} report={report} />
        ))}
      </div>
    </PanelCard>
  );
};
