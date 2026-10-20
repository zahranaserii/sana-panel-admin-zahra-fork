import {
  MOCK_AUDIT_LOGS,
  MOCK_COMPANIES,
  MOCK_LOAN_REQUESTS,
  MOCK_MANAGED_USERS,
  MOCK_POST_APPROVAL_STAGES,
  MOCK_SCHEMES,
  MOCK_STAFF,
  MOCK_USERS,
} from '@/constant/mock';
import type { Scheme, SchemePayload, SchemeTextList } from '@/features/base-info/types';
import type { PlanOption } from '@/services/lookup/types';

/**
 * دیتابیس ماک در حافظه — شبیه‌ساز بک‌اند.
 * با رفرش صفحه به مقادیر اولیه constant/mock برمی‌گردد.
 */
export const db = {
  schemes: structuredClone(MOCK_SCHEMES),
  postApprovalStages: structuredClone(MOCK_POST_APPROVAL_STAGES),
  companies: structuredClone(MOCK_COMPANIES),
  staff: structuredClone(MOCK_STAFF),
  users: structuredClone(MOCK_MANAGED_USERS),
  loanRequests: structuredClone(MOCK_LOAN_REQUESTS),
  auditLogs: structuredClone(MOCK_AUDIT_LOGS),
  /** نام فایل‌های آپلودشده بر اساس شناسه */
  files: new Map<string, string>(),
  sequence: 100,
};

export const nextId = (prefix: string) => {
  db.sequence += 1;
  return `${prefix}-${db.sequence}`;
};

export const fileOf = (id: string) => ({ id, name: db.files.get(id) ?? id });

export const today = () => new Date().toISOString().slice(0, 10);

export const findUserByToken = (authorization: string | null) => {
  const token = authorization?.replace('Bearer ', '');
  return MOCK_USERS.find((user) => user.token === token);
};

/** طرح بدون اطلاعات (وقتی همه طرح‌ها حذف شده‌اند) */
const EMPTY_SCHEME: Scheme = {
  id: '',
  name: '',
  qarzRate: 0,
  sepahEnabled: false,
  sepahMultiplier: 1,
  contractYears: 1,
  graceMonths: 0,
  maxPlans: 0,
  staffDelayMonths: 0,
  murabahaRates: [],
  terms: [],
  usable: [],
  cancelReasons: [],
  rejectReasons: [],
  noGrantReasons: [],
  avgDocTypes: [],
};

/** محاسبات شرکت‌ها و وام‌ها فعلاً از اولین طرح خوانده می‌شود */
export const primaryScheme = () => db.schemes[0] ?? EMPTY_SCHEME;

/** لیست‌های کشویی (دلایل و انواع مستند) از اطلاعات پایه طرح خوانده می‌شوند */
export const lookupItems = (name: SchemeTextList) =>
  primaryScheme()[name].map((title, index) => ({ id: String(index), title }));

export const lookupTitle = (name: SchemeTextList, id: string) =>
  lookupItems(name).find((item) => item.id === id)?.title;

/** اندازه جدول درصد قابل استفاده را با تعداد مدت‌ها و نرخ‌ها هماهنگ می‌کند */
export const resizeUsable = (scheme: SchemePayload): SchemePayload => ({
  ...scheme,
  usable: scheme.terms.map((_term, row) =>
    Array.from(
      { length: scheme.murabahaRates.length + 1 },
      (_value, column) => scheme.usable[row]?.[column] ?? 0,
    ),
  ),
});

/** طرح‌های قابل انتخاب از روی اطلاعات پایه ساخته می‌شوند (همان کاری که بک‌اند انجام می‌دهد) */
/** طرح کلان یک شرکت (شرکت‌های قدیمی بدون طرح = طرح اول) */
export const schemeOf = (schemeId?: string) =>
  db.schemes.find((scheme) => scheme.id === schemeId) ?? primaryScheme();

export const buildPlanOptions = (scheme: Scheme = primaryScheme()): PlanOption[] => {
  const { terms, murabahaRates, usable, qarzRate } = scheme;
  const qarz = terms.map((term, termIndex) => ({
    id: `qarz-${termIndex}`,
    type: 'qarz' as const,
    typeTitle: 'قرض‌الحسنه',
    rate: qarzRate,
    term,
    usable: usable[termIndex]?.[0] ?? 0,
  }));
  const murabaha = murabahaRates.flatMap((rate, rateIndex) =>
    terms.map((term, termIndex) => ({
      id: `mur-${rateIndex}-${termIndex}`,
      type: 'murabaha' as const,
      typeTitle: 'مرابحه',
      rate,
      term,
      usable: usable[termIndex]?.[rateIndex + 1] ?? 0,
    })),
  );
  return [...qarz, ...murabaha];
};
