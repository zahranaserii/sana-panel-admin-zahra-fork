import { useLoansCredit } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { useQueryParams } from '@/hooks/useQueryParams';
import { type StaffFilters } from '@/features/staff/types';

import {
  CompanyLoanRequests,
  CreditFilters,
  CreditSummaryCard,
  EligibilityNotices,
  LoanRequestCard,
} from '../components';

export const CreditPage = () => {
  const { params, setParams } = useQueryParams();
  const companyId = params.companyId ? Number(params.companyId) : undefined;
  const filters: StaffFilters = { q: params.q, hireFrom: params.hireFrom, hireTo: params.hireTo };

  // تاریخ مبنا اگر انتخاب نشده باشد، پیش‌فرض سرور (baseDateDefault) است
  const { data: credit, isFetching } = useLoansCredit(
    companyId ?? 0,
    params.date ? { baseDate: params.date } : undefined,
    { query: { enabled: Boolean(companyId) } },
  );
  const date = params.date ?? credit?.baseDate;

  return (
    <>
      <PanelCard>
        <CreditFilters
          companyId={params.companyId}
          date={date}
          credit={credit}
          onCompanyChange={(id) => setParams({ companyId: id })}
          onDateChange={(value) => setParams({ date: value })}
        />
        {companyId && <EligibilityNotices credit={credit} loading={isFetching} />}
      </PanelCard>

      {companyId && (
        <>
          <CreditSummaryCard credit={credit} loading={isFetching} />
          {/* با تغییر شرکت، فرم و انتخاب‌ها از نو شروع می‌شوند */}
          {date && (
            <LoanRequestCard
              key={companyId}
              companyId={companyId}
              date={date}
              credit={credit}
              filters={filters}
            />
          )}
          <CompanyLoanRequests key={`requests-${companyId}`} companyId={companyId} />
        </>
      )}
    </>
  );
};
