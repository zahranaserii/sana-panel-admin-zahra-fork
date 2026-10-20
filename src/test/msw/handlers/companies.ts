import { delay, http } from 'msw';

import { ENDPOINTS } from '@/constant/endpoints';
import { type MockCompany } from '@/constant/mock';
import {
  type CancelContractPayload,
  type DeleteCompanyPayload,
  type CompanyDetail,
  type CompanyListItem,
  type CompanyPayload,
  type MonthlyAverage,
  type SaveAveragesPayload,
} from '@/features/companies/types';

import {
  buildPlanOptions,
  db,
  fileOf,
  findUserByToken,
  lookupTitle,
  nextId,
  schemeOf,
  today,
} from '../db';
import { api, json } from '../utils';
import { logAction } from '../audit';

/** پسوند توضیحات برای متن لاگ */
const noteSuffix = (note?: string) => (note ? ' — توضیحات: ' + note : '');

const notFound = () => json({ message: 'شرکت یافت نشد.' }, { status: 404 });

const findCompany = (id: unknown) => db.companies.find((item) => item.id === id && !item.deleted);

const toListItem = (company: MockCompany): CompanyListItem => ({
  id: company.id,
  name: company.name,
  nationalId: company.nationalId,
  agreementNo: company.agreementNo,
  contractDate: company.contractDate,
  planCount: company.planIds.length,
  registeredBy: company.registeredBy,
  status: company.status,
  cancelDate: company.cancelDate,
  cancelReason: company.cancelReason,
});

const toDetail = (company: MockCompany): CompanyDetail => ({
  id: company.id,
  schemeId: company.schemeId,
  name: company.name,
  nationalId: company.nationalId,
  agreementNo: company.agreementNo,
  accountNo: company.accountNo,
  contractDate: company.contractDate,
  accountOpenDate: company.accountOpenDate,
  sepahSalary: company.sepahSalary,
  agreementFile: company.agreementFile,
  planIds: company.planIds,
});

/** محاسبه ساده مانده اعتبار (در بک‌اند واقعی بر اساس وام‌های تخصیص‌یافته محاسبه می‌شود) */
const buildAverages = (company: MockCompany): MonthlyAverage[] => {
  const plans = buildPlanOptions(schemeOf(company.schemeId)).filter((plan) =>
    company.planIds.includes(plan.id),
  );
  const usablePercent = plans.length
    ? plans.reduce((sum, plan) => sum + plan.usable, 0) / plans.length
    : 0;
  const scheme = schemeOf(company.schemeId);
  const multiplier = scheme.sepahEnabled && company.sepahSalary ? scheme.sepahMultiplier : 1;

  let cumulative = 0;
  return company.averages.map((average, index) => {
    cumulative += average ?? 0;
    return {
      month: index + 1,
      average,
      remainingCredit:
        average === null ? null : Math.round((cumulative * usablePercent * multiplier) / 100),
    };
  });
};

const userName = (request: Request) =>
  findUserByToken(request.headers.get('Authorization'))?.profile.fullName ?? '—';

export const companyHandlers = [
  http.get(api(ENDPOINTS.COMPANIES.LIST), async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
    const list = db.companies.filter((item) => !item.deleted);
    const start = (page - 1) * pageSize;
    return json({
      items: list.slice(start, start + pageSize).map(toListItem),
      totalCount: list.length,
      page,
      pageSize,
    });
  }),

  http.post(api(ENDPOINTS.COMPANIES.LIST), async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as CompanyPayload;
    if (!body.schemeId) return json({ message: 'انتخاب طرح کلان الزامی است.' }, { status: 400 });
    const user = findUserByToken(request.headers.get('Authorization'));
    const company: MockCompany = {
      ...body,
      id: nextId('c'),
      agreementFile: body.agreementFileId ? fileOf(body.agreementFileId) : null,
      registeredBy: user ? `${user.profile.branch ?? ''} — ${user.profile.fullName}` : '—',
      status: 'active',
      deleted: false,
      averages: Array.from({ length: 12 }, () => null),
      averageDocs: [],
    };
    db.companies.unshift(company);
    logAction(request, 'company', `ثبت شرکت جدید: ${company.name}`);
    return json(toDetail(company), { status: 201 });
  }),

  http.get(api(ENDPOINTS.COMPANIES.DETAIL(':id')), async ({ params }) => {
    await delay(250);
    const company = findCompany(params.id);
    return company ? json(toDetail(company)) : notFound();
  }),

  http.put(api(ENDPOINTS.COMPANIES.DETAIL(':id')), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.id);
    if (!company) return notFound();
    // طرح کلان و شناسه ملی در ویرایش قابل تغییر نیستند (مثل بک‌اند)
    const { agreementFileId, ...payload } = (await request.json()) as CompanyPayload;
    const body = { ...payload, schemeId: company.schemeId, nationalId: company.nationalId };
    const before = structuredClone(company);
    Object.assign(company, body);
    if (agreementFileId && agreementFileId !== company.agreementFile?.id) {
      company.agreementFile = fileOf(agreementFileId);
    }
    logAction(request, 'company', `ویرایش اطلاعات شرکت: ${company.name}`, {
      entity: 'company',
      id: company.id,
      before,
    });
    return json(toDetail(company));
  }),

  http.delete(api(ENDPOINTS.COMPANIES.DETAIL(':id')), async ({ params, request }) => {
    await delay(300);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const { description } = ((await request.json()) ?? {}) as Partial<DeleteCompanyPayload>;
    if (!description?.trim()) return json({ message: 'توضیحات حذف الزامی است.' }, { status: 400 });
    company.deleted = true;
    company.deletedAt = today();
    logAction(request, 'company', `حذف شرکت: ${company.name} — ${description.trim()}`);
    return json(null);
  }),

  http.post(api(ENDPOINTS.COMPANIES.CANCEL(':id')), async ({ params, request }) => {
    await delay(300);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const body = (await request.json()) as CancelContractPayload;
    if ((body.note?.trim().length ?? 0) < 5 || !body.fileId) {
      return json({ message: 'توضیحات (حداقل ۵ نویسه) و فایل نامه الزامی است.' }, { status: 400 });
    }
    company.status = 'cancelled';
    company.cancelDate = body.cancelDate;
    company.cancelReason = lookupTitle('cancelReasons', body.reasonId);
    logAction(
      request,
      'company',
      `لغو قرارداد شرکت: ${company.name} — دلیل: ${company.cancelReason ?? '—'}${noteSuffix(body.note)}`,
    );
    return json(null);
  }),

  http.get(api(ENDPOINTS.COMPANIES.AVERAGES(':id')), async ({ params }) => {
    await delay(250);
    const company = findCompany(params.id);
    return company ? json(buildAverages(company)) : notFound();
  }),

  http.post(api(ENDPOINTS.COMPANIES.AVERAGES(':id')), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const body = (await request.json()) as SaveAveragesPayload;
    body.items.forEach((item) => {
      company.averages[item.month - 1] = item.average;
    });
    company.averageDocs.unshift({
      id: nextId('d'),
      createdAt: today(),
      months: body.items.map((item) => item.month),
      docType: lookupTitle('avgDocTypes', body.docTypeId) ?? '—',
      file: fileOf(body.fileId),
      note: body.note,
      createdBy: userName(request),
    });
    logAction(
      request,
      'company',
      `ثبت/ویرایش میانگین موجودی (ماه‌های ${body.items.map((item) => item.month).join('، ')}): ${company.name}`,
    );
    return json(buildAverages(company));
  }),

  http.get(api(ENDPOINTS.COMPANIES.AVERAGE_DOCS(':id')), async ({ params }) => {
    await delay(200);
    const company = findCompany(params.id);
    return company ? json(company.averageDocs) : notFound();
  }),
];
