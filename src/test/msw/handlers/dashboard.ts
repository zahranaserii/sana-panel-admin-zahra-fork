import ExcelJS from 'exceljs';
import { delay, http, HttpResponse } from 'msw';

import {
  type ReadModelsCompanyRankingDto,
  type ReadModelsDashboardDto,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import {
  COMPANY_STATUS,
  LOAN_REQUEST_STATUS,
  type MockCompany,
  PERSONNEL_STATUS,
} from '@/constant/mock';
import { MOCK_ENUMS } from '@/constant/mock/enums';
import { formatJalali, toPersianDigits } from '@/utils/date';

import { activeLoans, contractMonths, db, monthKey, today } from '../db';
import { api, json } from '../utils';

import { buildPlanCredits } from './credit';

/* شبیه‌ساز گزارش‌های بک‌اند: همه تجمیع‌ها اینجا محاسبه می‌شوند */

const DASHBOARD = `${FACILITY}/Dashboard`;

const sum = (values: (number | null | undefined)[]) =>
  values.reduce<number>((total, value) => total + (value ?? 0), 0);

const totalAverage = (company: MockCompany) => sum(company.balances);

const companyLoans = (companyId: number) =>
  db.loanRequests.filter((item) => item.companyId === companyId);

const allocated = (companyId: number, month?: string) =>
  sum(
    activeLoans(companyId)
      .filter((item) => !month || monthKey(item.baseDate) === month)
      .map((item) => item.amount),
  );

const visibleCompanies = () =>
  db.companies.filter((item) => item.status !== COMPANY_STATUS.DELETED);

const removedCompanies = () =>
  db.companies.filter(
    (item) => item.status === COMPANY_STATUS.DELETED || item.status === COMPANY_STATUS.CANCELLED,
  );

const countStatus = (status: number) =>
  db.loanRequests.filter((item) => item.status === status).length;

const amountOf = (status: number) =>
  sum(db.loanRequests.filter((item) => item.status === status).map((item) => item.amount));

const approvalRate = (companyId: number) => {
  const loans = companyLoans(companyId);
  const approved = loans.filter((item) => item.status === LOAN_REQUEST_STATUS.APPROVED).length;
  return loans.length ? Math.round((approved / loans.length) * 100) : null;
};

/** ماه‌های دارای داده؛ تازه‌ترین اول */
const loanMonths = () =>
  [...new Set(db.loanRequests.map((item) => monthKey(item.baseDate)))].sort((a, b) =>
    b.localeCompare(a),
  );

const buildDashboard = (): ReadModelsDashboardDto => {
  const companies = visibleCompanies();
  const contracts = new Map<string, string[]>();
  db.companies.forEach((company) => {
    const key = monthKey(company.contractDate);
    const name =
      company.status === COMPANY_STATUS.DELETED ? `${company.name} (حذف‌شده)` : company.name;
    contracts.set(key, [...(contracts.get(key) ?? []), name]);
  });
  const planCounts = new Map<string, number>();
  db.loanRequests.forEach((item) =>
    planCounts.set(item.planTitle, (planCounts.get(item.planTitle) ?? 0) + 1),
  );
  const months = loanMonths();

  return {
    kpis: {
      activeCompanies: companies.filter((item) => item.status === COMPANY_STATUS.ACTIVE).length,
      totalRequests: db.loanRequests.length,
      approvedAmount: amountOf(LOAN_REQUEST_STATUS.APPROVED),
      pendingAmount:
        amountOf(LOAN_REQUEST_STATUS.PENDING_MANAGER) +
        amountOf(LOAN_REQUEST_STATUS.PENDING_CREDIT),
    },
    requestStatus: {
      approved: countStatus(LOAN_REQUEST_STATUS.APPROVED),
      pending:
        countStatus(LOAN_REQUEST_STATUS.PENDING_MANAGER) +
        countStatus(LOAN_REQUEST_STATUS.PENDING_CREDIT),
      rejected:
        countStatus(LOAN_REQUEST_STATUS.REJECTED) +
        countStatus(LOAN_REQUEST_STATUS.REJECTED_MANAGER),
    },
    planShare: [...planCounts].map(([planTitle, requestCount]) => ({ planTitle, requestCount })),
    creditVsAllocatedGroupKind: 1,
    creditVsAllocated: companies.map((company) => ({
      groupId: String(company.id),
      groupTitle: company.name,
      createdCredit: sum(buildPlanCredits(company, today()).map((plan) => plan.createdCredit)),
      allocated: allocated(company.id),
    })),
    contractsByMonth: [...contracts]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, companyNames]) => ({
        month,
        companyCount: companyNames.length,
        companyNames,
      })),
    monthlyAllocation: companies.map((company) => ({
      companyId: company.id,
      companyName: company.name,
      amountByMonth: Object.fromEntries(
        months.map((month) => [month, allocated(company.id, month)]),
      ),
    })),
    removedCompanies: removedCompanies().map((company) => ({
      companyId: company.id,
      companyName: company.name,
      removedAt:
        company.status === COMPANY_STATUS.DELETED
          ? company.deletedAt
          : company.cancellation?.cancelDate,
      averageBalance: totalAverage(company) || null,
      allocatedTotal: allocated(company.id),
      requestCount: companyLoans(company.id).length,
      approvalRate: approvalRate(company.id),
      removalKind: company.status,
    })),
  };
};

/** مرتب‌سازی رتبه‌بندی بک‌اند (companyRankingSort) */
const SORT_FIELD: Record<number, keyof ReadModelsCompanyRankingDto> = {
  1: 'averageBalance',
  2: 'allocatedAmount',
  3: 'requestCount',
  4: 'personnelCount',
};

const statusTitle = (company: MockCompany) =>
  MOCK_ENUMS.companyStatus.find((item) => item.value === company.status)?.title ?? '—';

const buildRanking = (url: URL) => {
  const month = url.searchParams.get('Month') ?? undefined;
  const sortBy = Number(url.searchParams.get('SortBy')) || 1;
  const top = Number(url.searchParams.get('Top')) || 50;
  const rows: ReadModelsCompanyRankingDto[] = visibleCompanies().map((company) => ({
    rank: 0,
    companyId: company.id,
    companyName: company.name,
    averageBalance: month
      ? (company.balances[contractMonths(company.contractDate).indexOf(month)] ?? null)
      : totalAverage(company),
    allocatedAmount: allocated(company.id, month),
    requestCount: companyLoans(company.id).filter(
      (item) => !month || monthKey(item.baseDate) === month,
    ).length,
    personnelCount: db.staff.filter(
      (item) => item.companyId === company.id && item.status !== PERSONNEL_STATUS.DELETED,
    ).length,
    status: statusTitle(company),
  }));
  const field = SORT_FIELD[sortBy] ?? 'averageBalance';
  rows.sort((a, b) => Number(b[field] ?? 0) - Number(a[field] ?? 0));
  return rows.slice(0, top).map((row, index) => ({ ...row, rank: index + 1 }));
};

type Cell = string | number;

/** ساخت فایل اکسل راست‌به‌چپ با هدر پررنگ (کاری که بک‌اند انجام می‌دهد) */
const xlsx = async (fileName: string, headers: string[], rows: Cell[][]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('گزارش', { views: [{ rightToLeft: true }] });
  sheet.addRow(headers).font = { bold: true };
  rows.forEach((row) => sheet.addRow(row));
  sheet.columns.forEach((column) => {
    column.width = 22;
  });
  return new HttpResponse(await workbook.xlsx.writeBuffer(), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  });
};

const toman = (rial: number) => Math.round(rial / 10);
const jalali = (value?: string | null) => (value ? formatJalali(value) : '');
const companyName = (id: number) => db.companies.find((item) => item.id === id)?.name ?? '—';
const loanStatusTitle = (status: number) =>
  MOCK_ENUMS.loanRequestStatus.find((item) => item.value === status)?.title ?? '';

/** خروجی‌های اکسل به ازای dashboardExport (۱ شرکت‌ها، ۲ پرسنل، ۳ درخواست‌ها، ۴ میانگین‌ها، ۵ حذف‌شده‌ها) */
const EXPORTS: Record<number, () => Promise<Response>> = {
  1: () =>
    xlsx(
      'شرکت‌ها.xlsx',
      [
        'نام شرکت',
        'شناسه ملی',
        'شماره تفاهم‌نامه',
        'شماره حساب',
        'تاریخ قرارداد',
        'روز افتتاح حساب',
        'حقوق از بانک سپه',
        'تعداد طرح',
        'ثبت‌کننده',
        'وضعیت',
        'مجموع میانگین (تومان)',
        'مجموع وام تخصیص‌یافته (تومان)',
        'تعداد پرسنل',
        'تعداد درخواست',
      ],
      visibleCompanies().map((item) => [
        item.name,
        item.nationalId,
        item.agreementNumber,
        item.accountNumber,
        jalali(item.contractDate),
        jalali(item.accountOpeningDate),
        item.salaryFromSepah ? 'بله' : 'خیر',
        item.planIds.length,
        item.registrar.userName ?? '',
        statusTitle(item),
        toman(totalAverage(item)),
        toman(allocated(item.id)),
        db.staff.filter((staff) => staff.companyId === item.id).length,
        companyLoans(item.id).length,
      ]),
    ),
  2: () =>
    xlsx(
      'پرسنل.xlsx',
      ['شرکت', 'نام و نام خانوادگی', 'کد ملی', 'موبایل', 'کد پرسنلی', 'تاریخ استخدام', 'اولویت'],
      db.staff
        .filter((item) => item.status !== PERSONNEL_STATUS.DELETED)
        .map((item) => [
          companyName(item.companyId),
          item.fullName,
          item.nationalCode,
          item.mobile,
          item.personnelCode,
          jalali(item.hireDate),
          item.priority,
        ]),
    ),
  3: () =>
    xlsx(
      'درخواست‌های-وام.xlsx',
      ['شرکت', 'پرسنل', 'طرح', 'مبلغ (ریال)', 'تاریخ ثبت', 'تاریخ تأیید/رد', 'وضعیت', 'توضیحات'],
      db.loanRequests.map((item) => [
        companyName(item.companyId),
        item.personnelName,
        item.planTitle,
        item.amount,
        jalali(item.createdAt),
        jalali(item.decidedAt),
        loanStatusTitle(item.status),
        item.description ?? '',
      ]),
    ),
  4: () =>
    xlsx(
      'میانگین‌های-ماهانه.xlsx',
      ['شرکت', ...Array.from({ length: 12 }, (_, index) => `ماه ${index + 1}`)],
      visibleCompanies().map((item) => [item.name, ...item.balances.map((value) => value ?? '')]),
    ),
  5: () =>
    xlsx(
      'شرکت‌های-حذف‌شده.xlsx',
      ['شرکت', 'وضعیت', 'تاریخ حذف/لغو', 'مجموع وام (تومان)', 'تعداد درخواست', 'نرخ تأیید'],
      removedCompanies().map((item) => {
        const rate = approvalRate(item.id);
        return [
          item.name,
          statusTitle(item),
          jalali(
            item.status === COMPANY_STATUS.DELETED ? item.deletedAt : item.cancellation?.cancelDate,
          ),
          toman(allocated(item.id)),
          companyLoans(item.id).length,
          rate === null ? '' : `${rate}%`,
        ];
      }),
    ),
};

export const dashboardHandlers = [
  http.get(api(DASHBOARD), async () => {
    await delay(300);
    return json(buildDashboard());
  }),

  http.get(api(`${DASHBOARD}/CompanyRanking`), async ({ request }) => {
    await delay(250);
    return json(buildRanking(new URL(request.url)));
  }),

  http.get(api(`${DASHBOARD}/Months`), async () => {
    await delay(150);
    return json(loanMonths().map((key) => ({ key, title: toPersianDigits(key) })));
  }),

  http.get(api(`${DASHBOARD}/Exports/:report`), async ({ params }) => {
    await delay(300);
    const build = EXPORTS[Number(params.report)];
    return build ? build() : json({ message: 'گزارش یافت نشد.' }, { status: 404 });
  }),
];
