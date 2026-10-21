import { useQueryParams } from '@/hooks/useQueryParams';

import { PendingRequestsTable } from '../components';

export const ManagerApprovalPage = () => {
  const { params, setParams } = useQueryParams();

  return (
    <PendingRequestsTable
      companyId={params.companyId}
      onCompanyChange={(companyId) => setParams({ companyId })}
    />
  );
};
