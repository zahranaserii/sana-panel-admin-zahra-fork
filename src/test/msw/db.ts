import {
  type CommandResponsesLoanRequestListItemDto,
  type CommonRegistrarDto,
  type CommonStoredFileDto,
  type ReadModelsPlanDto,
} from '@/api/generated/facility/facilityPanelAPI.schemas';
import {
  LOAN_REQUEST_STATUS,
  MOCK_AUDIT_LOGS,
  MOCK_COMPANIES,
  MOCK_LOAN_REQUESTS,
  MOCK_MANAGED_USERS,
  MOCK_SCHEMES,
  MOCK_STAFF,
  MOCK_USERS,
  type MockLoanRequest,
  type MockReasonKind,
  type MockScheme,
} from '@/constant/mock';
import { dayjs, toPersianDigits } from '@/utils/date';

/**
 * دیتابیس ماک در حافظه — شبیه‌ساز بک‌اند.
 * با رفرش صفحه به مقادیر اولیه constant/mock برمی‌گردد.
 */
export const db = {
  schemes: structuredClone(MOCK_SCHEMES),
  companies: structuredClone(MOCK_COMPANIES),
  staff: structuredClone(MOCK_STAFF),
  users: structuredClone(MOCK_MANAGED_USERS),
  loanRequests: structuredClone(MOCK_LOAN_REQUESTS),
  auditLogs: structuredClone(MOCK_AUDIT_LOGS),
  /** فایل‌های آپلودشده بر اساس شناسه */
  files: new Map<number, CommonStoredFileDto>(),
  sequence: 100,
};

/** شناسه عددی یکتا (مثل identity دیتابیس) */
export const nextId = () => {
  db.sequence += 1;
  return db.sequence;
};

export const today = () => new Date().toISOString().slice(0, 10);

export const findUserByToken = (authorization: string | null) => {
  const token = authorization?.replace('Bearer ', '');
  return MOCK_USERS.find((user) => user.token === token);
};

/** کاربر ثبت‌کننده درخواست (از روی توکن) */
export const registrarOf = (request: Request): CommonRegistrarDto => {
  const username = findUserByToken(request.headers.get('Authorization'))?.username;
  const panelUser = db.users.find((item) => item.username === username);
  return {
    panelUserId: panelUser?.id,
    userName: username ?? 'نامشخص',
    userCode: panelUser?.userCode ?? null,
    branchName: panelUser?.branchName ?? null,
    branchCode: panelUser?.branchCode ?? null,
  };
};

/** ذخیره فایل multipart و برگرداندن مشخصات آن */
export const storeFile = (value: FormDataEntryValue | null, request: Request) => {
  if (!(value instanceof File)) return null;
  const file: CommonStoredFileDto = {
    id: nextId(),
    fileName: value.name,
    size: value.size,
    uploadedAt: new Date().toISOString(),
    uploadedBy: registrarOf(request).userName,
  };
  db.files.set(file.id ?? 0, file);
  return file;
};

/** طرح بدون اطلاعات (وقتی همه طرح‌ها حذف شده‌اند) */
const EMPTY_SCHEME: MockScheme = {
  id: 0,
  code: '',
  title: '',
  isActive: false,
  settings: {
    schemeId: 0,
    contractTypes: [],
    qardHasanRate: 0,
    murabahaRates: [],
    repaymentTermsMonths: [],
    salaryFromSepahMultiplierYes: 1,
    salaryFromSepahMultiplierNo: 1,
    contractDurationMonths: 12,
    graceMonthsAfterExpiry: 0,
    maxPlansPerCompany: 0,
    personnelIntroductionDelayMonths: 0,
    waitingPeriodDays: 0,
    usableTable: [],
    rowVersion: '',
    digitalApprovalEnabled: false,
  },
  reasons: {
    contractCancel: [],
    loanReject: [],
    remoteGrantDenied: [],
    documentType: [],
    loanCancel: [],
    personnelReject: [],
  },
};

/** محاسبات بدون طرح مشخص از اولین طرح خوانده می‌شود */
export const primaryScheme = () => db.schemes[0] ?? EMPTY_SCHEME;

/** طرح کلان یک شرکت */
export const schemeOf = (schemeId?: number | null) =>
  db.schemes.find((scheme) => scheme.id === schemeId) ?? primaryScheme();

/** دلایل فعال یک نوع (لغو، رد، انواع مستند و …) */
export const reasonsOf = (kind: MockReasonKind, scheme: MockScheme = primaryScheme()) =>
  scheme.reasons[kind].filter((reason) => reason.isActive);

export const reasonTitle = (kind: MockReasonKind, id: unknown, scheme?: MockScheme) =>
  reasonsOf(kind, scheme).find((reason) => reason.id === Number(id))?.title;

/** ضریب حقوق‌بگیر بانک سپه بودن شرکت */
export const sepahMultiplier = (scheme: MockScheme, salaryFromSepah: boolean) =>
  salaryFromSepah
    ? scheme.settings.salaryFromSepahMultiplierYes
    : scheme.settings.salaryFromSepahMultiplierNo;

const CONTRACT_TITLES: Record<number, string> = { 1: 'قرض‌الحسنه', 2: 'مرابحه' };

/** طرح‌های قابل انتخاب یک طرح کلان (هر خانه جدول درصد قابل استفاده یک طرح است) */
export const schemePlans = (scheme: MockScheme = primaryScheme()): ReadModelsPlanDto[] =>
  scheme.settings.usableTable.map((cell, index) => ({
    id: scheme.id * 100 + index + 1,
    contractType: cell.contractType,
    rate: cell.rate,
    termMonths: cell.termMonths,
    usablePercent: cell.usablePercent,
    title: toPersianDigits(
      `${CONTRACT_TITLES[cell.contractType ?? 1]} - ${cell.rate}٪ - ${cell.termMonths} ماه`,
    ),
  }));

/** طرح با شناسه (از همه طرح‌های کلان) */
export const findPlan = (planId: number) =>
  db.schemes.flatMap((scheme) => schemePlans(scheme)).find((plan) => plan.id === planId);

/** کلید ماه شمسی (YYYY/MM) */
export const monthKey = (date: string | dayjs.Dayjs) => dayjs(date).formatJalali('YYYY/MM');

/** ۱۲ ماه سال جاری قرارداد به شکل کلید شمسی YYYY/MM */
export const contractMonths = (contractDate: string) => {
  const { year, month } = dayjs(contractDate).jalali();
  return Array.from({ length: 12 }, (_, index) => {
    const total = month - 1 + index;
    return `${year + Math.floor(total / 12)}/${String((total % 12) + 1).padStart(2, '0')}`;
  });
};

/** درخواست‌هایی که رد یا لغو نشده‌اند (در محاسبه اعتبار حساب می‌شوند) */
const INACTIVE_LOANS: number[] = [
  LOAN_REQUEST_STATUS.REJECTED_MANAGER,
  LOAN_REQUEST_STATUS.REJECTED,
  LOAN_REQUEST_STATUS.REJECTED_DIGITAL,
  LOAN_REQUEST_STATUS.CANCELLED,
];

export const activeLoans = (companyId: number) =>
  db.loanRequests.filter(
    (item) => item.companyId === companyId && !INACTIVE_LOANS.includes(item.status),
  );

/** فقط درخواست‌های در انتظار تأیید مدیر یا اعتبارات قابل لغو هستند */
const CANCELABLE: number[] = [
  LOAN_REQUEST_STATUS.PENDING_MANAGER,
  LOAN_REQUEST_STATUS.PENDING_CREDIT,
];

/** ردیف درخواست وام در قالب پاسخ بک‌اند */
export const toLoanItem = (loan: MockLoanRequest): CommandResponsesLoanRequestListItemDto => {
  const company = db.companies.find((item) => item.id === loan.companyId);
  return {
    id: loan.id,
    batchId: loan.batchId,
    companyId: loan.companyId,
    companyName: company?.name,
    branchCode: company?.branchCode,
    personnelId: loan.personnelId,
    personnelName: loan.personnelName,
    personnelCode: loan.personnelCode,
    planTitle: loan.planTitle,
    amount: loan.amount,
    paymentOrder: loan.paymentOrder,
    createdAt: loan.createdAt,
    decidedAt: loan.decidedAt,
    status: loan.status,
    postStage: loan.postStage,
    description: loan.description,
    documentCount: loan.documents.length,
    canCancel: CANCELABLE.includes(loan.status),
    documents: loan.documents,
  };
};

/** صفحه‌بندی ساده لیست (پارامترهای Page و PageSize بک‌اند) */
export const paginate = <T>(list: T[], url: URL, defaultSize = 10) => {
  const page = Number(url.searchParams.get('Page') ?? 1);
  const pageSize = Number(url.searchParams.get('PageSize') ?? defaultSize);
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), totalCount: list.length, page, pageSize };
};
