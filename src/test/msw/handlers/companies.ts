import { delay, http } from 'msw';

import {
  type CommonFacilityPagedResponseOfCompanyListItemDto,
  type ReadModelsCompanyBalancesDto,
  type ReadModelsCompanyDetailsDto,
  type ReadModelsCompanyListItemDto,
  type ReadModelsCompanySearchResultDto,
  type ReadModelsMonthlyBalanceInput,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { COMPANY_STATUS, LOAN_REQUEST_STATUS, type MockCompany } from '@/constant/mock';
import { dayjs } from '@/utils/date';

import { logAction } from '../audit';
import {
  contractMonths,
  db,
  monthKey,
  nextId,
  reasonTitle,
  registrarOf,
  schemeOf,
  schemePlans,
  sepahMultiplier,
  storeFile,
} from '../db';
import { api, fileResponse, formNumbers, formText, json } from '../utils';

const COMPANIES = `${FACILITY}/Companies`;

const notFound = () => json({ message: 'شرکت یافت نشد.' }, { status: 404 });

const findCompany = (id: unknown) =>
  db.companies.find((item) => String(item.id) === id && item.status !== COMPANY_STATUS.DELETED);

const toListItem = (company: MockCompany): ReadModelsCompanyListItemDto => ({
  id: company.id,
  name: company.name,
  nationalId: company.nationalId,
  agreementNumber: company.agreementNumber,
  contractDate: company.contractDate,
  planCount: company.planIds.length,
  registrar: company.registrar,
  status: company.status,
  branchCode: company.branchCode,
  cancelDate: company.cancellation?.cancelDate ?? null,
  cancelReasonTitle: company.cancellation?.reason ?? null,
});

const toDetail = (company: MockCompany): ReadModelsCompanyDetailsDto => {
  const plans = schemePlans(schemeOf(company.schemeId));
  return {
    id: company.id,
    schemeId: company.schemeId,
    name: company.name,
    nationalId: company.nationalId,
    agreementNumber: company.agreementNumber,
    accountNumber: company.accountNumber,
    contractDate: company.contractDate,
    accountOpeningDate: company.accountOpeningDate,
    accountOpeningDayOfMonth: dayjs(company.accountOpeningDate).jalali().day,
    salaryFromSepah: company.salaryFromSepah,
    plans: company.planIds.map((planId) => ({
      planId,
      title: plans.find((plan) => plan.id === planId)?.title,
    })),
    agreementFile: company.agreementFile ?? undefined,
    registrar: company.registrar,
    createdAt: company.createdAt,
    status: company.status,
    cancellation: company.cancellation ?? undefined,
    branchCode: company.branchCode,
    rowVersion: company.rowVersion,
  };
};

/** میانگین‌ها و مانده اعتبار ماه‌های سال جاری قرارداد (در بک‌اند واقعی بر اساس وام‌ها محاسبه می‌شود) */
const buildBalances = (company: MockCompany): ReadModelsCompanyBalancesDto => {
  const scheme = schemeOf(company.schemeId);
  const plans = schemePlans(scheme).filter((plan) => company.planIds.includes(plan.id ?? 0));
  const usablePercent = plans.length
    ? plans.reduce((sum, plan) => sum + (plan.usablePercent ?? 0), 0) / plans.length
    : 0;
  const multiplier = sepahMultiplier(scheme, company.salaryFromSepah);
  const months = contractMonths(company.contractDate);
  const loans = db.loanRequests.filter(
    (item) => item.companyId === company.id && item.status !== LOAN_REQUEST_STATUS.CANCELLED,
  );

  let cumulative = 0;
  return {
    companyId: company.id,
    rowVersion: company.balancesRowVersion,
    months: months.map((month, index) => {
      const averageBalance = company.balances[index] ?? null;
      cumulative += averageBalance ?? 0;
      const documents = company.balanceDocuments.filter((doc) => doc.month === month);
      return {
        month,
        averageBalance,
        remainingCredit:
          averageBalance === null
            ? null
            : Math.round((cumulative * usablePercent * multiplier) / 100),
        documentCount: documents.length,
        hasDocuments: documents.length > 0,
        usedCredit: loans
          .filter((item) => monthKey(item.baseDate) === month)
          .reduce((sum, item) => sum + item.amount, 0),
      };
    }),
  };
};

/** فیلدهای مشترک ثبت و ویرایش (multipart) */
const readCompanyForm = (form: FormData) => ({
  name: formText(form, 'Name'),
  agreementNumber: formText(form, 'AgreementNumber'),
  accountNumber: formText(form, 'AccountNumber'),
  contractDate: formText(form, 'ContractDate'),
  accountOpeningDate: formText(form, 'AccountOpeningDate'),
  salaryFromSepah: formText(form, 'SalaryFromSepah') === 'true',
  planIds: formNumbers(form, 'PlanIds'),
});

const invalidCompany = (values: ReturnType<typeof readCompanyForm>, company: MockCompany) => {
  if (!values.name) return 'نام شرکت الزامی است.';
  if (!values.planIds.length) return 'حداقل یک طرح باید انتخاب شود.';
  const max = schemeOf(company.schemeId).settings.maxPlansPerCompany;
  if (values.planIds.length > max) return `حداکثر ${max} طرح قابل انتخاب است.`;
  return null;
};

const searchCompanies = (url: URL): ReadModelsCompanySearchResultDto => {
  const page = Number(url.searchParams.get('Page') ?? 1);
  const pageSize = Number(url.searchParams.get('PageSize') ?? 10);
  const status = Number(url.searchParams.get('Status')) || undefined;
  const term = url.searchParams.get('Term')?.trim() ?? '';
  const visible = db.companies.filter((item) => item.status !== COMPANY_STATUS.DELETED);
  const list = visible.filter(
    (item) =>
      (!status || item.status === status) &&
      (!term || item.name.includes(term) || item.nationalId.includes(term)),
  );
  const start = (page - 1) * pageSize;
  const result: CommonFacilityPagedResponseOfCompanyListItemDto = {
    items: list.slice(start, start + pageSize).map(toListItem),
    totalCount: list.length,
    page,
    pageSize,
  };
  return {
    page: result,
    activeCount: visible.filter((item) => item.status === COMPANY_STATUS.ACTIVE).length,
    registeredCount: visible.length,
  };
};

export const companyHandlers = [
  http.get(api(COMPANIES), async ({ request }) => {
    await delay(300);
    return json(searchCompanies(new URL(request.url)));
  }),

  /** کشویی شرکت‌ها (activeOnly = فقط قرارداد فعال) */
  http.get(api(`${COMPANIES}/Lookup`), async ({ request }) => {
    await delay(150);
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get('activeOnly') !== 'false';
    const term = url.searchParams.get('term')?.trim() ?? '';
    const list = db.companies.filter(
      (item) =>
        item.status !== COMPANY_STATUS.DELETED &&
        (!activeOnly || item.status === COMPANY_STATUS.ACTIVE) &&
        (!term || item.name.includes(term)),
    );
    return json(list.map((item) => ({ id: item.id, title: item.name })));
  }),

  http.post(api(COMPANIES), async ({ request }) => {
    await delay(400);
    const form = await request.formData();
    const schemeId = Number(form.get('SchemeId'));
    if (!schemeId) return json({ message: 'انتخاب طرح کلان الزامی است.' }, { status: 400 });
    const nationalId = formText(form, 'NationalId');
    if (db.companies.some((item) => item.nationalId === nationalId)) {
      return json({ message: 'شرکتی با این شناسه ملی قبلاً ثبت شده است.' }, { status: 409 });
    }
    const registrar = registrarOf(request);
    const company: MockCompany = {
      ...readCompanyForm(form),
      id: nextId(),
      schemeId,
      nationalId,
      branchCode: formText(form, 'BranchCode') || (registrar.branchCode ?? ''),
      agreementFile: storeFile(form.get('agreementFile'), request),
      registrar,
      createdAt: new Date().toISOString(),
      status: COMPANY_STATUS.ACTIVE,
      cancellation: null,
      rowVersion: crypto.randomUUID(),
      balances: Array.from({ length: 12 }, () => null),
      balancesRowVersion: crypto.randomUUID(),
      balanceDocuments: [],
    };
    const error = invalidCompany(readCompanyForm(form), company);
    if (error) return json({ message: error }, { status: 400 });
    db.companies.unshift(company);
    logAction(request, 'company', `ثبت شرکت جدید: ${company.name}`);
    return json(toDetail(company));
  }),

  http.get(api(`${COMPANIES}/:id`), async ({ params }) => {
    await delay(250);
    const company = findCompany(params.id);
    return company ? json(toDetail(company)) : notFound();
  }),

  http.put(api(`${COMPANIES}/:id`), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const form = await request.formData();
    if (formText(form, 'RowVersion') !== company.rowVersion) {
      return json(
        { message: 'اطلاعات این شرکت هم‌زمان توسط کاربر دیگری تغییر کرده است.' },
        { status: 409 },
      );
    }
    // طرح کلان و شناسه ملی در ویرایش قابل تغییر نیستند
    const values = readCompanyForm(form);
    const error = invalidCompany(values, company);
    if (error) return json({ message: error }, { status: 400 });
    const before = structuredClone(company);
    Object.assign(company, values, { rowVersion: crypto.randomUUID() });
    company.agreementFile = storeFile(form.get('agreementFile'), request) ?? company.agreementFile;
    logAction(request, 'company', `ویرایش اطلاعات شرکت: ${company.name}`, {
      entity: 'company',
      id: String(company.id),
      before,
    });
    return json(toDetail(company));
  }),

  http.delete(api(`${COMPANIES}/:id`), async ({ params, request }) => {
    await delay(300);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const { description } = ((await request.json()) ?? {}) as { description?: string };
    if ((description?.trim().length ?? 0) < 5) {
      return json({ message: 'توضیحات حذف (حداقل ۵ نویسه) الزامی است.' }, { status: 400 });
    }
    company.status = COMPANY_STATUS.DELETED;
    company.deleteDescription = description?.trim();
    company.deletedAt = new Date().toISOString();
    logAction(request, 'company', `حذف شرکت: ${company.name} — ${company.deleteDescription}`);
    return json(true);
  }),

  http.post(api(`${COMPANIES}/:id/Cancel`), async ({ params, request }) => {
    await delay(300);
    const company = findCompany(params.id);
    if (!company) return notFound();
    if (company.status !== COMPANY_STATUS.ACTIVE) {
      return json({ message: 'قرارداد این شرکت فعال نیست.' }, { status: 422 });
    }
    const form = await request.formData();
    const description = formText(form, 'Description');
    const reason = reasonTitle('contractCancel', form.get('ReasonId'), schemeOf(company.schemeId));
    const file = storeFile(form.get('letterFile'), request);
    if (!reason || description.length < 5 || !file) {
      return json(
        { message: 'دلیل، توضیحات (حداقل ۵ نویسه) و فایل نامه لغو الزامی است.' },
        { status: 400 },
      );
    }
    company.status = COMPANY_STATUS.CANCELLED;
    company.cancellation = {
      cancelDate: formText(form, 'CancelDate'),
      reason,
      description,
      file,
      cancelledBy: registrarOf(request),
      cancelledAt: new Date().toISOString(),
    };
    logAction(
      request,
      'company',
      `لغو قرارداد شرکت: ${company.name} — دلیل: ${reason} — توضیحات: ${description}`,
    );
    return json(toDetail(company));
  }),

  http.get(api(`${COMPANIES}/:id/AgreementFile`), async ({ params }) => {
    await delay(200);
    const company = findCompany(params.id);
    if (!company?.agreementFile) return json({ message: 'فایل یافت نشد.' }, { status: 404 });
    return fileResponse(company.agreementFile.fileName);
  }),

  http.get(api(`${COMPANIES}/:id/Balances`), async ({ params }) => {
    await delay(250);
    const company = findCompany(params.id);
    return company ? json(buildBalances(company)) : notFound();
  }),

  http.put(api(`${COMPANIES}/:id/Balances`), async ({ params, request }) => {
    await delay(400);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const form = await request.formData();
    if (formText(form, 'RowVersion') !== company.balancesRowVersion) {
      return json(
        { message: 'میانگین‌ها هم‌زمان توسط کاربر دیگری تغییر کرده است.' },
        { status: 409 },
      );
    }
    const items = form
      .getAll('Months')
      .map((value) => JSON.parse(String(value)) as ReadModelsMonthlyBalanceInput);
    const scheme = schemeOf(company.schemeId);
    const documentType = reasonTitle('documentType', form.get('DocumentTypeId'), scheme);
    const files = form.getAll('files');
    if (!items.length) return json({ message: 'ماهی برای ثبت ارسال نشده است.' }, { status: 400 });
    if (!documentType || !files.length) {
      return json({ message: 'انتخاب نوع مستند و بارگذاری فایل آن اجباری است.' }, { status: 400 });
    }
    const months = contractMonths(company.contractDate);
    items.forEach((item) => {
      const index = months.indexOf(item.month);
      if (index >= 0) company.balances[index] = item.averageBalance ?? null;
    });
    const description = formText(form, 'DocumentDescription') || null;
    items.forEach((item) =>
      files.forEach((value) => {
        const file = storeFile(value, request);
        if (file) {
          company.balanceDocuments.unshift({
            id: nextId(),
            month: item.month,
            documentType,
            description,
            file,
          });
        }
      }),
    );
    company.balancesRowVersion = crypto.randomUUID();
    logAction(
      request,
      'company',
      `ثبت/ویرایش میانگین موجودی (ماه‌های ${items.map((item) => item.month).join('، ')}): ${company.name}`,
    );
    return json(buildBalances(company));
  }),

  http.get(api(`${COMPANIES}/:id/Balances/Documents`), async ({ params, request }) => {
    await delay(200);
    const company = findCompany(params.id);
    if (!company) return notFound();
    const month = new URL(request.url).searchParams.get('month');
    return json(company.balanceDocuments.filter((doc) => !month || doc.month === month));
  }),

  http.get(api(`${COMPANIES}/:id/Balances/Documents/:documentId`), async ({ params }) => {
    await delay(200);
    const doc = findCompany(params.id)?.balanceDocuments.find(
      (item) => String(item.id) === params.documentId,
    );
    return doc ? fileResponse(doc.file?.fileName) : notFound();
  }),

  http.delete(api(`${COMPANIES}/:id/Balances/Documents/:documentId`), async ({ params }) => {
    await delay(200);
    const company = findCompany(params.id);
    if (!company) return notFound();
    company.balanceDocuments = company.balanceDocuments.filter(
      (item) => String(item.id) !== params.documentId,
    );
    return json(true);
  }),
];
