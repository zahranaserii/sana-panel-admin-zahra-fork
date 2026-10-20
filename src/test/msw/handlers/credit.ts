import { delay, http } from 'msw';

import {
  type CancelLoanRequestCommand,
  type CreateLoanRequestsCommand,
  type EligibilityStatus,
  type ReadModelsCompanyCreditDto,
  type ReadModelsEligibilityBannerDto,
  type ReadModelsHintDto,
  type ReadModelsLoanRequestPreviewDto,
  type ReadModelsPlanCreditDto,
  type ReadModelsRepeatAllocationDto,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { COMPANY_STATUS, LOAN_REQUEST_STATUS, type MockCompany } from '@/constant/mock';
import { dayjs, formatJalali, toPersianDigits } from '@/utils/date';
import { formatAmount } from '@/utils/number';

import { logAction } from '../audit';
import {
  activeLoans,
  db,
  monthKey,
  nextId,
  paginate,
  reasonTitle,
  schemeOf,
  schemePlans,
  sepahMultiplier,
  toLoanItem,
  today,
} from '../db';
import { api, fileResponse, json } from '../utils';

/*
 * این فایل نقش بک‌اند را بازی می‌کند: همه قوانین تخصیص وام (مجاز بودن شرکت، روز انتقال،
 * اعتبار هر طرح، سقف اعتبار و تخصیص تکراری) اینجا محاسبه می‌شود و فرانت فقط نتیجه را نمایش می‌دهد.
 */

const notFound = () => json({ message: 'شرکت یافت نشد.' }, { status: 404 });

const findCompany = (id: unknown) =>
  db.companies.find((item) => String(item.id) === id && item.status !== COMPANY_STATUS.DELETED);

/** حالت تخصیص بک‌اند: ۱ مبلغ یکسان، ۲ مبلغ متفاوت */
const FIXED_MODE = 1;

/** سطح پیام بک‌اند (hintLevel) */
const HINT = { INFO: 1, SUCCESS: 2, WARNING: 3, ERROR: 4 } as const;

/** وضعیت مجاز بودن بک‌اند (eligibilityStatus) */
const ELIGIBILITY: Record<string, EligibilityStatus> = {
  ALLOWED: 1,
  DELAY: 2,
  NOT_TRANSFER_DAY: 3,
  INACTIVE: 4,
};

const rial = (value: number) => `${toPersianDigits(formatAmount(value))} ریال`;

const usedPreviousMonth = (company: MockCompany, date: string) => {
  const previous = monthKey(dayjs(date).subtract(1, 'month'));
  return activeLoans(company.id).some((item) => monthKey(item.baseDate) === previous);
};

const buildBanner = (company: MockCompany, date: string): ReadModelsEligibilityBannerDto => {
  const base = dayjs(date);
  const delayMonths = schemeOf(company.schemeId).settings.personnelIntroductionDelayMonths;
  const transferDay = dayjs(company.accountOpeningDate).jalali().day;
  const messages = usedPreviousMonth(company, date)
    ? [
        'این شرکت در ماه گذشته از اعتبار خود استفاده کرده است؛ بنابراین در این ماه فقط اعتبار همین ماه قابل استفاده است و مانده انباشته ماه‌های قبل قابل استفاده نیست.',
      ]
    : [];
  const banner = (status: EligibilityStatus, message: string) => ({
    status,
    message: toPersianDigits(message),
    allowedDayOfMonth: transferDay,
    canRegisterLoan: status === ELIGIBILITY.ALLOWED,
    messages,
  });

  if (company.status !== COMPANY_STATUS.ACTIVE) {
    return banner(ELIGIBILITY.INACTIVE, 'قرارداد این شرکت فعال نیست.');
  }
  if (base.diff(dayjs(company.contractDate), 'month') < delayMonths) {
    return banner(
      ELIGIBILITY.DELAY,
      `این شرکت هنوز مجاز به معرفی پرسنل برای دریافت وام نیست — مجاز شدن از ${delayMonths} ماه پس از تاریخ انعقاد قرارداد (${formatJalali(company.contractDate)}) خواهد بود.`,
    );
  }
  if (base.jalali().day !== transferDay) {
    return banner(
      ELIGIBILITY.NOT_TRANSFER_DAY,
      `امروز روز مجاز انتقال اعتبار نیست. انتقال فقط در روز «${transferDay}» هر ماه (مطابق روز افتتاح حساب سپرده) مجاز است.`,
    );
  }
  return banner(ELIGIBILITY.ALLOWED, 'شرکت مجاز به ثبت درخواست وام در این ماه است.');
};

const filledBalances = (company: MockCompany) =>
  company.balances.filter((value): value is number => value !== null);

export const buildPlanCredits = (company: MockCompany, date: string): ReadModelsPlanCreditDto[] => {
  const scheme = schemeOf(company.schemeId);
  const plans = schemePlans(scheme).filter((plan) => company.planIds.includes(plan.id ?? 0));
  const sharePercent = plans.length ? 100 / plans.length : 0;
  const multiplier = sepahMultiplier(scheme, company.salaryFromSepah);
  const filled = filledBalances(company);
  const totalAverage = filled.reduce((sum, value) => sum + value, 0);
  const lastAverage = filled.at(-1) ?? 0;
  const onlyThisMonth = usedPreviousMonth(company, date);

  return plans.map((plan) => {
    const factor = ((plan.usablePercent ?? 0) / 100) * multiplier * (sharePercent / 100);
    const createdCredit = Math.round(factor * totalAverage);
    const allocated = activeLoans(company.id)
      .filter((item) => item.planId === plan.id)
      .reduce((sum, item) => sum + item.amount, 0);
    return {
      planId: plan.id,
      title: plan.title,
      contractType: plan.contractType === 1 ? 'قرض‌الحسنه' : 'مرابحه',
      rate: plan.rate,
      termMonths: plan.termMonths,
      // مبلغ سهم این طرح از مجموع میانگین
      shareOfAverage: Math.round((totalAverage * sharePercent) / 100),
      usablePercent: plan.usablePercent,
      createdCredit,
      allocated,
      remainingThisMonth: onlyThisMonth
        ? Math.round(factor * lastAverage)
        : Math.max(0, createdCredit - allocated),
    };
  });
};

const buildCredit = (company: MockCompany, date: string): ReadModelsCompanyCreditDto => {
  const plans = buildPlanCredits(company, date);
  const filled = filledBalances(company);
  return {
    companyId: company.id,
    baseDate: date,
    banner: buildBanner(company, date),
    monthRemainingCredit: plans.reduce((sum, plan) => sum + (plan.remainingThisMonth ?? 0), 0),
    totalAverageBase: filled.reduce((sum, value) => sum + value, 0),
    currentMonthAverage: filled.at(-1) ?? null,
    plans,
    baseDateDefault: today(),
    baseDateMin: company.contractDate,
    baseDateMax: today(),
  };
};

type LoanBody = Pick<
  CreateLoanRequestsCommand,
  'planId' | 'baseDate' | 'mode' | 'amount' | 'items'
>;

const itemAmounts = (body: LoanBody) =>
  body.items.map((item) => (body.mode === FIXED_MODE ? (body.amount ?? 0) : (item.amount ?? 0)));

/** پرسنلی که در همان ماه قبلاً وام گرفته‌اند */
const repeatAllocations = (company: MockCompany, body: LoanBody) => {
  const month = monthKey(body.baseDate);
  return body.items.flatMap((item): ReadModelsRepeatAllocationDto[] => {
    const previous = activeLoans(company.id).find(
      (loan) => loan.personnelId === item.personnelId && monthKey(loan.baseDate) === month,
    );
    return previous
      ? [
          {
            personnelId: previous.personnelId,
            personnelName: previous.personnelName,
            personnelCode: previous.personnelCode,
            month,
            previousAmount: previous.amount,
          },
        ]
      : [];
  });
};

const hint = (level: ReadModelsHintDto['level'], text: string) => ({
  level,
  text: toPersianDigits(text),
});

const buildPreview = (company: MockCompany, body: LoanBody): ReadModelsLoanRequestPreviewDto => {
  const plan = buildPlanCredits(company, body.baseDate).find((item) => item.planId === body.planId);
  const remainingCredit = plan?.remainingThisMonth ?? 0;
  const amounts = itemAmounts(body);
  const total = amounts.reduce((sum, value) => sum + value, 0);
  const messages: ReadModelsHintDto[] = [];
  const fixed = body.mode === FIXED_MODE ? (body.amount ?? 0) : 0;
  const maxCoverablePeople = fixed ? Math.floor(remainingCredit / fixed) : null;

  if (!plan) messages.push(hint(HINT.ERROR, 'طرح انتخاب‌شده معتبر نیست.'));
  else if (amounts.some((value) => !value)) {
    messages.push(hint(HINT.INFO, 'برای همه پرسنل انتخاب‌شده، مبلغ وام را وارد کنید.'));
  } else if (total > remainingCredit) {
    messages.push(
      hint(
        HINT.ERROR,
        `مجموع مبالغ (${rial(total)}) بیشتر از اعتبار باقی‌مانده این طرح (${rial(remainingCredit)}) است.`,
      ),
    );
  } else if (body.items.length) {
    messages.push(
      hint(HINT.SUCCESS, `مجموع مبلغ برای ${body.items.length} نفر: ${rial(total)} — مجاز است.`),
    );
  } else {
    messages.push(
      hint(HINT.INFO, `اعتبار قابل استفاده این طرح در این ماه: ${rial(remainingCredit)}`),
    );
  }
  if (maxCoverablePeople !== null) {
    messages.push(hint(HINT.INFO, `با این مبلغ حداکثر ${maxCoverablePeople} نفر قابل پوشش است.`));
  }

  return {
    selectedCount: body.items.length,
    total,
    remainingCredit,
    isAllowed:
      Boolean(plan) &&
      body.items.length > 0 &&
      amounts.every(Boolean) &&
      total <= remainingCredit &&
      Boolean(buildBanner(company, body.baseDate).canRegisterLoan),
    maxCoverablePeople,
    suggestedMaxAmount: body.items.length ? Math.floor(remainingCredit / body.items.length) : null,
    messages,
    repeatAllocations: repeatAllocations(company, body),
  };
};

const findLoan = (id: unknown) => db.loanRequests.find((item) => String(item.id) === id);

export const creditHandlers = [
  http.get(api(`${FACILITY}/Companies/:companyId/Credit`), async ({ params, request }) => {
    await delay(250);
    const company = findCompany(params.companyId);
    if (!company) return notFound();
    const date = new URL(request.url).searchParams.get('baseDate') ?? today();
    return json(buildCredit(company, date));
  }),

  http.post(
    api(`${FACILITY}/Companies/:companyId/LoanRequests/Preview`),
    async ({ params, request }) => {
      await delay(200);
      const company = findCompany(params.companyId);
      if (!company) return notFound();
      const body = (await request.json()) as LoanBody;
      return json(buildPreview(company, { ...body, items: body.items ?? [] }));
    },
  ),

  http.post(api(`${FACILITY}/Companies/:companyId/LoanRequests`), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.companyId);
    if (!company) return notFound();
    const body = (await request.json()) as CreateLoanRequestsCommand;
    const preview = buildPreview(company, body);
    if (!preview.isAllowed) {
      const error = preview.messages?.find((item) => item.level === HINT.ERROR)?.text;
      return json(
        { message: error ?? 'در تاریخ انتخاب‌شده امکان ثبت این درخواست وجود ندارد.' },
        { status: 422 },
      );
    }
    const plan = schemePlans(schemeOf(company.schemeId)).find((item) => item.id === body.planId);
    const batchId = nextId();
    const amounts = itemAmounts(body);
    const created = body.items.map((item, index) => {
      const staff = db.staff.find((entry) => entry.id === item.personnelId);
      const loan = {
        id: nextId(),
        batchId,
        companyId: company.id,
        personnelId: item.personnelId,
        personnelName: staff?.fullName ?? '—',
        personnelCode: staff?.personnelCode ?? '',
        planId: body.planId,
        planTitle: plan?.title ?? '—',
        amount: amounts[index] ?? 0,
        paymentOrder: item.paymentOrder ?? index + 1,
        baseDate: body.baseDate,
        createdAt: new Date().toISOString(),
        decidedAt: null,
        status: LOAN_REQUEST_STATUS.PENDING_MANAGER,
        description: body.description ?? null,
        documents: [],
      };
      db.loanRequests.push(loan);
      return loan;
    });
    logAction(
      request,
      'loan',
      `ثبت درخواست وام جمعاً ${rial(preview.total ?? 0)} برای ${toPersianDigits(created.length)} نفر — شرکت: ${company.name}`,
    );
    return json({
      batchId,
      companyId: company.id,
      planId: body.planId,
      mode: body.mode,
      total: preview.total,
      requests: created.map(toLoanItem),
    });
  }),

  http.get(api(`${FACILITY}/LoanRequests`), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const companyId = Number(url.searchParams.get('CompanyId')) || undefined;
    const status = Number(url.searchParams.get('Status')) || undefined;
    const list = db.loanRequests
      .filter(
        (item) =>
          (!companyId || item.companyId === companyId) && (!status || item.status === status),
      )
      .slice()
      .reverse();
    const page = paginate(list, url);
    return json({ ...page, items: page.items.map(toLoanItem) });
  }),

  http.get(api(`${FACILITY}/LoanRequests/:id`), async ({ params }) => {
    await delay(200);
    const loan = findLoan(params.id);
    if (!loan) return json({ message: 'درخواست یافت نشد.' }, { status: 404 });
    return json({ summary: toLoanItem(loan), history: [], documents: loan.documents });
  }),

  http.get(api(`${FACILITY}/LoanRequests/:id/Documents/:fileId`), async ({ params }) => {
    await delay(200);
    const file = findLoan(params.id)?.documents.find((item) => String(item.id) === params.fileId);
    return file
      ? fileResponse(file.fileName)
      : json({ message: 'فایل یافت نشد.' }, { status: 404 });
  }),

  http.post(api(`${FACILITY}/LoanRequests/:id/Cancel`), async ({ params, request }) => {
    await delay(300);
    const loan = findLoan(params.id);
    if (!loan) return json({ message: 'درخواست یافت نشد.' }, { status: 404 });
    if (!toLoanItem(loan).canCancel) {
      return json({ message: 'این درخواست قابل لغو نیست.' }, { status: 422 });
    }
    const body = (await request.json()) as CancelLoanRequestCommand;
    const reason = reasonTitle('loanCancel', body.reasonId);
    if (!reason || (body.description?.trim().length ?? 0) < 5) {
      return json({ message: 'دلیل و توضیحات (حداقل ۵ نویسه) الزامی است.' }, { status: 400 });
    }
    loan.status = LOAN_REQUEST_STATUS.CANCELLED;
    loan.description = `${reason} — ${body.description.trim()}`;
    loan.decidedAt = new Date().toISOString();
    logAction(request, 'loan', `لغو درخواست وام ${loan.personnelName} — ${loan.description}`);
    return json(toLoanItem(loan));
  }),
];
