import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type MockCompany } from '@/constant/mock';
import {
  type CreateLoanRequestPayload,
  type CreditEligibility,
  type EligibilityMessage,
  type PlanCredit,
} from '@/features/credit/types';
import { dayjs, formatJalali, toPersianDigits } from '@/utils/date';
import { formatAmount } from '@/utils/number';

import { buildPlanOptions, db, nextId, primaryScheme, today } from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

/*
 * این فایل نقش بک‌اند را بازی می‌کند: همه قوانین تخصیص وام (مجاز بودن شرکت، روز انتقال،
 * اعتبار هر طرح، سقف اعتبار و تخصیص تکراری) اینجا محاسبه می‌شود و فرانت فقط نتیجه را نمایش می‌دهد.
 */

const notFound = () => json({ message: 'شرکت یافت نشد.' }, { status: 404 });

const findCompany = (id: unknown) => db.companies.find((item) => item.id === id && !item.deleted);

export const monthKey = (date: string) => {
  const { year, month } = dayjs(date).jalali();
  return `${year}/${month}`;
};

export const activeRequests = (companyId: string) =>
  db.loanRequests.filter(
    (item) =>
      item.companyId === companyId &&
      item.status !== 'rejected' &&
      item.status !== 'rejected_manager',
  );

const companyPlans = (company: MockCompany) =>
  buildPlanOptions().filter((plan) => company.planIds.includes(plan.id));

const planTitle = (plan: { typeTitle: string; rate: number; term: number }) =>
  toPersianDigits(`${plan.typeTitle} - ${plan.rate}٪ - ${plan.term} ماه`);

const usedPreviousMonth = (company: MockCompany, date: string) => {
  const previous = monthKey(dayjs(date).subtract(1, 'month').format('YYYY-MM-DD'));
  return activeRequests(company.id).some((item) => monthKey(item.createdAt) === previous);
};

const buildEligibility = (company: MockCompany, date: string): CreditEligibility => {
  const base = dayjs(date);
  const monthsSinceContract = base.diff(dayjs(company.contractDate), 'month');
  const eligible = monthsSinceContract >= primaryScheme().staffDelayMonths;
  const transferDayNumber = dayjs(company.accountOpenDate).jalali().day;
  const transferDay = base.jalali().day === transferDayNumber;
  const messages: EligibilityMessage[] = [];

  if (!eligible) {
    messages.push({
      type: 'error',
      text: toPersianDigits(
        `این شرکت هنوز مجاز به معرفی پرسنل برای دریافت وام نیست — مجاز شدن از ${primaryScheme().staffDelayMonths} ماه پس از تاریخ انعقاد قرارداد (${formatJalali(company.contractDate)}) خواهد بود.`,
      ),
    });
  } else if (!transferDay) {
    messages.push({
      type: 'error',
      text: toPersianDigits(
        `امروز روز مجاز انتقال اعتبار نیست. انتقال فقط در روز «${transferDayNumber}» هر ماه (مطابق روز افتتاح حساب سپرده) مجاز است.`,
      ),
    });
  } else {
    messages.push({ type: 'success', text: 'شرکت مجاز به ثبت درخواست وام در این ماه است.' });
  }

  if (usedPreviousMonth(company, date)) {
    messages.push({
      type: 'error',
      text: 'این شرکت در ماه گذشته از اعتبار خود استفاده کرده است؛ بنابراین در این ماه فقط اعتبار همین ماه قابل استفاده است و مانده انباشته ماه‌های قبل قابل استفاده نیست.',
    });
  }
  return { canAllocate: eligible && transferDay, messages };
};

export const buildPlanCredits = (company: MockCompany, date: string): PlanCredit[] => {
  const plans = companyPlans(company);
  const sharePercent = plans.length ? 100 / plans.length : 0;
  const multiplier =
    primaryScheme().sepahEnabled && company.sepahSalary ? primaryScheme().sepahMultiplier : 1;
  const filled = company.averages.filter((value): value is number => value !== null);
  const totalAverage = filled.reduce((sum, value) => sum + value, 0);
  const lastAverage = filled.at(-1) ?? 0;
  const onlyThisMonth = usedPreviousMonth(company, date);

  return plans.map((plan) => {
    const factor = (plan.usable / 100) * multiplier * (sharePercent / 100);
    const created = Math.round(factor * totalAverage);
    const disbursed = activeRequests(company.id)
      .filter((item) => item.planId === plan.id)
      .reduce((sum, item) => sum + item.amount, 0);
    const available = onlyThisMonth
      ? Math.round(factor * lastAverage)
      : Math.max(0, created - disbursed);
    return {
      planId: plan.id,
      typeTitle: plan.typeTitle,
      rate: plan.rate,
      term: plan.term,
      sharePercent,
      usable: plan.usable,
      created,
      disbursed,
      available,
    };
  });
};

const rial = (value: number) => `${toPersianDigits(formatAmount(value))} ریال`;

export const creditHandlers = [
  http.get(api(ENDPOINTS.CREDIT.ELIGIBILITY(':companyId')), async ({ params, request }) => {
    await delay(200);
    const company = findCompany(params.companyId);
    if (!company) return notFound();
    const date = new URL(request.url).searchParams.get('date') ?? today();
    return json(buildEligibility(company, date));
  }),

  http.get(api(ENDPOINTS.CREDIT.SUMMARY(':companyId')), async ({ params, request }) => {
    await delay(250);
    const company = findCompany(params.companyId);
    if (!company) return notFound();
    const date = new URL(request.url).searchParams.get('date') ?? today();
    const filled = company.averages.filter((value): value is number => value !== null);
    return json({
      totalAverage: filled.reduce((sum, value) => sum + value, 0),
      currentMonthAverage: filled.at(-1) ?? 0,
      plans: buildPlanCredits(company, date),
    });
  }),

  http.get(api(ENDPOINTS.CREDIT.LOAN_REQUESTS(':companyId')), async ({ params, request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const list = db.loanRequests
      .filter((item) => item.companyId === params.companyId)
      .slice()
      .reverse();
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),

  http.post(api(ENDPOINTS.CREDIT.LOAN_REQUESTS(':companyId')), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.companyId);
    if (!company) return notFound();
    const body = (await request.json()) as CreateLoanRequestPayload;

    if (!buildEligibility(company, body.date).canAllocate) {
      return json(
        { message: 'در تاریخ انتخاب‌شده امکان ثبت درخواست برای این شرکت وجود ندارد.' },
        { status: 422 },
      );
    }
    const plan = buildPlanCredits(company, body.date).find((item) => item.planId === body.planId);
    if (!plan) return json({ message: 'طرح انتخاب‌شده معتبر نیست.' }, { status: 422 });

    const total = body.items.reduce((sum, item) => sum + item.amount, 0);
    if (total > plan.available) {
      return json(
        {
          message: `مجموع مبلغ درخواستی (${rial(total)}) بیشتر از اعتبار باقی‌مانده این طرح (${rial(plan.available)}) است.`,
        },
        { status: 422 },
      );
    }

    const currentMonth = monthKey(body.date);
    const duplicates = body.items
      .map((item) =>
        activeRequests(company.id).find(
          (request) =>
            request.staffId === item.staffId && monthKey(request.createdAt) === currentMonth,
        ),
      )
      .filter((item) => item !== undefined);
    if (duplicates.length && !body.confirmDuplicates) {
      return json(
        {
          message: 'برای برخی از پرسنل در همین ماه وام تخصیص داده شده است.',
          duplicates: duplicates.map((item) => ({
            staffName: item.staffName,
            amount: item.amount,
            planTitle: item.planTitle,
          })),
        },
        { status: 409 },
      );
    }

    body.items.forEach((item) => {
      const staff = db.staff.find((entry) => entry.id === item.staffId);
      db.loanRequests.push({
        id: nextId('lr'),
        companyId: company.id,
        staffId: item.staffId,
        staffName: staff?.fullName ?? '—',
        planId: plan.planId,
        planTitle: planTitle(plan),
        amount: item.amount,
        paymentOrder: item.paymentOrder,
        createdAt: body.date,
        decidedAt: null,
        status: 'pending_manager',
      });
    });
    logAction(
      request,
      'loan',
      `ثبت درخواست وام جمعاً ${rial(total)} برای ${toPersianDigits(body.items.length)} نفر — شرکت: ${company.name}`,
    );
    return json({ created: body.items.length }, { status: 201 });
  }),
];
