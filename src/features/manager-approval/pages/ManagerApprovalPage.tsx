import { PanelCard } from '@/component/card';
import { useQueryParams } from '@/hooks/useQueryParams';
import { CompanySelect } from '@/features/companies/components';

import { PendingRequestsTable } from '../components';

export const ManagerApprovalPage = () => {
  const { params, setParams } = useQueryParams();
  const companyId = params.companyId;

  return (
    <>
      <PanelCard>
        <CompanySelect value={companyId} onChange={(id) => setParams({ companyId: id })} />
        <p className="m-0 text-[12.5px] text-ink-soft">
          فقط درخواست‌هایی که اینجا تأیید شوند، برای بررسی به مرحله «تأیید اعتبارات» می‌روند.
        </p>
      </PanelCard>

      {companyId && (
        <PanelCard title="درخواست‌های در انتظار تأیید مدیر شرکت">
          {/* با تغییر شرکت، صفحه و انتخاب‌ها از نو شروع می‌شوند */}
          <PendingRequestsTable key={companyId} companyId={Number(companyId)} />
        </PanelCard>
      )}
    </>
  );
};
