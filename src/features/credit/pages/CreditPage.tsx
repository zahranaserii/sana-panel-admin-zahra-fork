import { useLoansCredit } from '@/api/generated/facility';
import { PanelCard } from '@/component/card';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useSelectedCompany } from '@/features/companies/components';
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
  const companyId = useSelectedCompany(params.companyId);
  const filters: StaffFilters = { q: params.q, hireFrom: params.hireFrom, hireTo: params.hireTo };

  // تاریخ مبنا اگر انتخاب نشده باشد، پیش‌فرض سرور (baseDateDefault) است
  const creditQuery = useLoansCredit(
    companyId ?? 0,
    params.date ? { baseDate: params.date } : undefined,
    { query: { enabled: Boolean(companyId) } },
  );
  const { data: credit, isFetching } = creditQuery;
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
          <CreditSummaryCard query={creditQuery} />
          {/* فرم ثبت به اعتبار شرکت وابسته است؛ بدون آن نمایش داده نمی‌شود. با تغییر شرکت، فرم از نو شروع می‌شود */}
          {credit && date && (
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
