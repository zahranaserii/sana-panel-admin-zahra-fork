import { delay, http } from 'msw';

import {
  type CommonFacilityPagedResponseOfSchemeListItemDto,
  type ReadModelsReasonDto,
  type ReadModelsSchemeFormDto,
  type ReadModelsSchemeListItemDto,
  type SaveSchemeCommand,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import { FACILITY } from '@/constant/endpoints';
import { COMPANY_STATUS, type MockReasonKind, type MockScheme, toReasons } from '@/constant/mock';

import { removeEmpty } from '@/utils/object';

import { logAction } from '../audit';
import { db, primaryScheme, schemePlans } from '../db';
import { api, json } from '../utils';

const SCHEMES = `${FACILITY}/BasicInfo/Schemes`;

const companyCount = (scheme: MockScheme) =>
  db.companies.filter(
    (company) => company.schemeId === scheme.id && company.status !== COMPANY_STATUS.DELETED,
  ).length;

/** دلایل یک طرح؛ با type فقط همان نوع */
const reasonList = (scheme: MockScheme, url: URL) => {
  const type = Number(url.searchParams.get('type')) || undefined;
  const includeInactive = url.searchParams.get('includeInactive') === 'true';
  return Object.values(scheme.reasons)
    .flat()
    .filter((reason) => (!type || reason.type === type) && (includeInactive || reason.isActive));
};

const toListItem = (scheme: MockScheme): ReadModelsSchemeListItemDto => ({
  id: scheme.id,
  code: scheme.code,
  title: scheme.title,
  qardHasanRate: scheme.settings.qardHasanRate,
  murabahaRates: scheme.settings.murabahaRates,
  repaymentTermsMonths: scheme.settings.repaymentTermsMonths,
  contractDurationMonths: scheme.settings.contractDurationMonths,
  maxPlansPerCompany: scheme.settings.maxPlansPerCompany,
  isActive: scheme.isActive,
  companyCount: companyCount(scheme),
});

const toForm = (scheme: MockScheme): ReadModelsSchemeFormDto => ({
  ...scheme,
  companyCount: companyCount(scheme),
});

const notFound = () => json({ message: 'طرح یافت نشد.' }, { status: 404 });

const findScheme = (id: unknown) => db.schemes.find((item) => String(item.id) === id);

/** لیست متنی فرم → دلایل؛ دلیل هم‌عنوان قبلی شناسه‌اش را نگه می‌دارد */
const toReasonList = (
  kind: MockReasonKind,
  titles: string[] | null | undefined,
  previous: ReadModelsReasonDto[] = [],
) =>
  (titles ?? [])
    .map((title) => title.trim())
    .filter(Boolean)
    .map(
      (title, index) =>
        previous.find((reason) => reason.title === title) ?? {
          ...toReasons(kind, [title])[0],
          sortOrder: index + 1,
        },
    );

type Settings = MockScheme['settings'];

/** مقدار پیش‌فرض تنظیماتی که در درخواست نیامده‌اند */
const SETTING_DEFAULTS: Omit<Settings, 'schemeId' | 'rowVersion'> = {
  contractTypes: [],
  qardHasanRate: 0,
  murabahaRates: [],
  repaymentTermsMonths: [],
  salaryFromSepahMultiplierYes: 1,
  salaryFromSepahMultiplierNo: 1,
  contractDurationMonths: 12,
  graceMonthsAfterExpiry: 0,
  maxPlansPerCompany: 1,
  personnelIntroductionDelayMonths: 0,
  waitingPeriodDays: 0,
  usableTable: [],
  digitalApprovalEnabled: false,
};

/** فیلد لیست متنی درخواست به ازای هر نوع دلیل */
const REASON_FIELDS: Record<MockReasonKind, keyof SaveSchemeCommand> = {
  contractCancel: 'contractCancelReasons',
  loanReject: 'loanRejectReasons',
  remoteGrantDenied: 'remoteGrantDeniedReasons',
  documentType: 'documentTypes',
  loanCancel: 'loanCancelReasons',
  personnelReject: 'personnelRejectReasons',
};

const toSettings = (id: number, body: SaveSchemeCommand): Settings => ({
  ...SETTING_DEFAULTS,
  ...removeEmpty(
    Object.fromEntries(
      Object.keys(SETTING_DEFAULTS).map((key) => [key, body[key as keyof SaveSchemeCommand]]),
    ),
  ),
  schemeId: id,
  rowVersion: crypto.randomUUID(),
});

const toScheme = (id: number, body: SaveSchemeCommand, previous?: MockScheme): MockScheme => ({
  id,
  code: body.code ?? '',
  title: body.title.trim(),
  isActive: body.isActive ?? true,
  settings: toSettings(id, body),
  reasons: Object.fromEntries(
    (Object.keys(REASON_FIELDS) as MockReasonKind[]).map((kind) => [
      kind,
      toReasonList(kind, body[REASON_FIELDS[kind]] as string[] | null, previous?.reasons[kind]),
    ]),
  ) as MockScheme['reasons'],
});

const invalid = (body: SaveSchemeCommand) => {
  if ((body.title ?? '').trim().length < 3) return 'نام طرح باید حداقل ۳ حرف باشد.';
  if (!body.repaymentTermsMonths?.length) return 'حداقل یک مدت بازپرداخت لازم است.';
  return null;
};

export const baseInfoHandlers = [
  /** کشویی طرح‌های کلان (فرم شرکت) */
  http.get(api(SCHEMES), async () => {
    await delay(150);
    return json(
      db.schemes
        .filter((scheme) => scheme.isActive)
        .map(({ id, code, title, isActive }) => ({ id, code, title, isActive })),
    );
  }),

  /** طرح‌های قابل انتخاب یک طرح کلان + سقف تعداد طرح هر شرکت */
  http.get(api(`${FACILITY}/BasicInfo/:schemeId/Plans`), async ({ params }) => {
    await delay(200);
    const scheme = findScheme(params.schemeId);
    if (!scheme) return notFound();
    return json({
      maxPlansPerCompany: scheme.settings.maxPlansPerCompany,
      plans: schemePlans(scheme),
    });
  }),

  http.get(api(`${SCHEMES}/:schemeId/Reasons`), async ({ params, request }) => {
    await delay(150);
    const scheme = findScheme(params.schemeId);
    return scheme ? json(reasonList(scheme, new URL(request.url))) : notFound();
  }),

  /** دلایل بدون طرح مشخص (طرح اصلی) */
  http.get(api(`${FACILITY}/BasicInfo/Reasons`), async ({ request }) => {
    await delay(150);
    return json(reasonList(primaryScheme(), new URL(request.url)));
  }),

  http.get(api(`${SCHEMES}/Search`), async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('Page') ?? 1);
    const pageSize = Number(url.searchParams.get('PageSize') ?? 10);
    const includeInactive = url.searchParams.get('IncludeInactive') === 'true';
    const term = url.searchParams.get('Term')?.trim() ?? '';
    const list = db.schemes.filter(
      (scheme) =>
        (includeInactive || scheme.isActive) &&
        (!term || scheme.title.includes(term) || scheme.code.includes(term)),
    );
    const start = (page - 1) * pageSize;
    const response: CommonFacilityPagedResponseOfSchemeListItemDto = {
      items: list.slice(start, start + pageSize).map(toListItem),
      totalCount: list.length,
      page,
      pageSize,
    };
    return json(response);
  }),

  http.get(api(`${SCHEMES}/:schemeId`), async ({ params }) => {
    await delay(250);
    const scheme = findScheme(params.schemeId);
    return scheme ? json(toForm(scheme)) : notFound();
  }),

  http.post(api(SCHEMES), async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as SaveSchemeCommand;
    const error = invalid(body);
    if (error) return json({ message: error }, { status: 400 });
    // کد الزامی و یکتاست
    const code = body.code?.trim() ?? '';
    if (code.length < 2) return json({ message: 'کد طرح الزامی است.' }, { status: 400 });
    if (db.schemes.some((item) => item.code === code)) {
      return json({ message: 'طرحی با این کد قبلاً ثبت شده است.' }, { status: 400 });
    }
    const id = Math.max(0, ...db.schemes.map((item) => item.id)) + 1;
    const scheme = toScheme(id, body);
    db.schemes.push(scheme);
    logAction(request, 'base', `ثبت طرح جدید: ${scheme.title}`);
    return json(toForm(scheme));
  }),

  http.put(api(`${SCHEMES}/:schemeId`), async ({ params, request }) => {
    await delay(300);
    const index = db.schemes.findIndex((item) => String(item.id) === params.schemeId);
    const previous = db.schemes[index];
    if (!previous) return notFound();
    const body = (await request.json()) as SaveSchemeCommand;
    const error = invalid(body);
    if (error) return json({ message: error }, { status: 400 });
    if (body.rowVersion && body.rowVersion !== previous.settings.rowVersion) {
      return json(
        { message: 'این طرح هم‌زمان توسط کاربر دیگری ویرایش شده است؛ صفحه را دوباره باز کنید.' },
        { status: 409 },
      );
    }
    // کد طرح در ویرایش نادیده گرفته می‌شود
    const scheme = toScheme(previous.id, { ...body, code: previous.code }, previous);
    logAction(request, 'base', `ویرایش طرح: ${scheme.title}`, {
      entity: 'scheme',
      id: String(scheme.id),
      before: previous,
    });
    db.schemes[index] = scheme;
    return json(toForm(scheme));
  }),

  http.delete(api(`${SCHEMES}/:schemeId`), async ({ params, request }) => {
    await delay(250);
    const removed = findScheme(params.schemeId);
    if (!removed) return notFound();
    if (removed.isActive && db.schemes.filter((item) => item.isActive).length === 1) {
      return json({ message: 'حداقل یک طرح فعال باید در سامانه باقی بماند.' }, { status: 400 });
    }
    if (companyCount(removed)) {
      return json({ message: 'این طرح شرکت فعال دارد.' }, { status: 400 });
    }
    logAction(request, 'base', `حذف طرح: ${removed.title}`);
    db.schemes = db.schemes.filter((item) => item.id !== removed.id);
    return json(true);
  }),
];
