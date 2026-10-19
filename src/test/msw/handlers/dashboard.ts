import { delay, http, type JsonBodyType } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type MockCompany } from '@/constant/mock';
import {
  type CompanyRank,
  type RankingSort,
  type RemovedCompany,
} from '@/features/dashboard/types';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { db, today } from '../db';
import { api, json } from '../utils';

import { activeRequests, buildPlanCredits, monthKey } from './credit';

/* شبیه‌ساز گزارش‌های بک‌اند: همه تجمیع‌ها اینجا محاسبه می‌شوند */

const pad = (key: string) => {
  const [year, month] = key.split('/');
  return `${year}/${(month ?? '').padStart(2, '0')}`;
};

const byText = (a: string, b: string) => a.localeCompare(b);

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const totalAverage = (company: MockCompany) =>
  sum(company.averages.filter((value): value is number => value !== null));

const companyRequests = (companyId: string) =>
  db.loanRequests.filter((item) => item.companyId === companyId);

const disbursed = (companyId: string, month?: string) =>
  sum(
    activeRequests(companyId)
      .filter((item) => !month || pad(monthKey(item.createdAt)) === month)
      .map((item) => item.amount),
  );

const statusTitle = (company: MockCompany) =>
  company.status === 'active'
    ? 'فعال (تمدید خودکار فعال)'
    : `لغوشده در ${formatJalali(company.cancelDate, undefined, { persianDigits: true })} (${company.cancelReason ?? '—'})`;

const visibleCompanies = () => db.companies.filter((item) => !item.deleted);

const SORT_FIELD: Record<RankingSort, keyof CompanyRank> = {
  avg: 'totalAverage',
  loan: 'disbursed',
  count: 'requestCount',
  staff: 'staffCount',
};

const respond = async (data: JsonBodyType) => {
  await delay(250);
  return json(data);
};

export const dashboardHandlers = [
  http.get(api(ENDPOINTS.DASHBOARD.SUMMARY), () =>
    respond({
      activeCompanies: visibleCompanies().length,
      totalRequests: db.loanRequests.length,
      approvedAmount: sum(
        db.loanRequests.filter((r) => r.status === 'approved').map((r) => r.amount),
      ),
      pendingAmount: sum(
        db.loanRequests.filter((r) => r.status === 'pending_credit').map((r) => r.amount),
      ),
    }),
  ),

  http.get(api(ENDPOINTS.DASHBOARD.REQUEST_STATUS), () => {
    const count = (status: string) => db.loanRequests.filter((r) => r.status === status).length;
    return respond([
      { key: 'approved', title: 'تأییدشده', count: count('approved') },
      { key: 'pending', title: 'در انتظار', count: count('pending_credit') },
      { key: 'rejected', title: 'ردشده', count: count('rejected') },
    ]);
  }),

  http.get(api(ENDPOINTS.DASHBOARD.PLAN_SHARE), () => {
    const counts = new Map<string, number>();
    db.loanRequests.forEach((r) => counts.set(r.planTitle, (counts.get(r.planTitle) ?? 0) + 1));
    return respond([...counts].map(([planTitle, count]) => ({ planTitle, count })));
  }),

  http.get(api(ENDPOINTS.DASHBOARD.COMPANY_CREDIT), () =>
    respond(
      visibleCompanies().map((company) => ({
        companyName: company.name,
        created: sum(buildPlanCredits(company, today()).map((plan) => plan.created)),
        disbursed: disbursed(company.id),
      })),
    ),
  ),

  http.get(api(ENDPOINTS.DASHBOARD.MONTHS), () => {
    const months = [...new Set(db.loanRequests.map((r) => pad(monthKey(r.createdAt))))].sort(
      byText,
    );
    return respond(months.map((id) => ({ id, title: toPersianDigits(id) })));
  }),

  http.get(api(ENDPOINTS.DASHBOARD.RANKING), ({ request }) => {
    const url = new URL(request.url);
    const month = url.searchParams.get('month') ?? undefined;
    const sortBy = (url.searchParams.get('sortBy') ?? 'avg') as RankingSort;
    const rows = visibleCompanies().map((company) => ({
      rank: 0,
      companyName: company.name,
      totalAverage: totalAverage(company),
      disbursed: disbursed(company.id, month),
      requestCount: companyRequests(company.id).filter(
        (r) => !month || pad(monthKey(r.createdAt)) === month,
      ).length,
      staffCount: db.staff.filter((s) => s.companyId === company.id).length,
      status: company.status,
      statusTitle: statusTitle(company),
    }));
    const field = SORT_FIELD[sortBy];
    rows.sort((a, b) => Number(b[field]) - Number(a[field]));
    return respond(rows.map((row, index) => ({ ...row, rank: index + 1 })));
  }),

  http.get(api(ENDPOINTS.DASHBOARD.CONTRACTS_BY_MONTH), () => {
    const groups = new Map<string, string[]>();
    db.companies.forEach((company) => {
      const key = pad(monthKey(company.contractDate));
      const name = company.deleted ? `${company.name} (حذف‌شده)` : company.name;
      groups.set(key, [...(groups.get(key) ?? []), name]);
    });
    return respond(
      [...groups]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, companies]) => ({
          month: toPersianDigits(month),
          count: companies.length,
          companies,
        })),
    );
  }),

  http.get(api(ENDPOINTS.DASHBOARD.MONTHLY_PERFORMANCE), () => {
    const companies = visibleCompanies();
    const months = [
      ...new Set(
        companies.flatMap((c) => companyRequests(c.id).map((r) => pad(monthKey(r.createdAt)))),
      ),
    ].sort(byText);
    return respond({
      months,
      rows: companies.map((company) => ({
        companyName: company.name,
        amounts: Object.fromEntries(months.map((month) => [month, disbursed(company.id, month)])),
      })),
    });
  }),

  http.get(api(ENDPOINTS.DASHBOARD.REMOVED_COMPANIES), () => {
    const rows: RemovedCompany[] = db.companies
      .filter((company) => company.deleted || company.status === 'cancelled')
      .map((company) => {
        const requests = companyRequests(company.id);
        const approved = requests.filter((r) => r.status === 'approved').length;
        return {
          companyName: company.name,
          reason: company.deleted ? 'deleted' : 'cancelled',
          removedAt: (company.deleted ? company.deletedAt : company.cancelDate) ?? null,
          totalAverage: totalAverage(company),
          disbursed: disbursed(company.id),
          requestCount: requests.length,
          approvalRate: requests.length ? Math.round((approved / requests.length) * 100) : null,
        };
      });
    return respond(rows);
  }),
];
