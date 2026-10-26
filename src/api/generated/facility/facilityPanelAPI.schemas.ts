/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
export interface ReadModelsLoanRequestItemInput {
  /** @minimum 1 */
  personnelId: number;
  /**
     * فیلد ۱۵۹: در حالت متغیر الزامی؛ ۱۰٬۰۰۰٬۰۰۰ تا ۴٬۰۰۰٬۰۰۰٬۰۰۰ ریال
     * @minimum 10000000
     * @maximum 4000000000
     * @nullable
     */
  amount?: number | null;
  /**
     * فیلد ۱۶۱: ترتیب پرداخت ۱ تا ۹۹۹۹ (پیش‌فرض اولویت پرسنل)
     * @minimum 1
     * @maximum 9999
     * @nullable
     */
  paymentOrder?: number | null;
}

/**
 * US-D4: افزودن فرد به یک ثبت (قبل از تأیید اعتبارات).
 */
export interface AddLoanBatchMemberCommand {
  item: ReadModelsLoanRequestItemInput;
}

export type AllocationMode = typeof AllocationMode[keyof typeof AllocationMode];


export const AllocationMode = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export type ContractType = typeof ContractType[keyof typeof ContractType];


export const ContractType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export interface ReadModelsUsablePercentDto {
  termMonths?: number;
  contractType?: ContractType;
  rate?: number;
  usablePercent?: number;
}

export interface ReadModelsBasicInfoDto {
  schemeId?: number;
  contractTypes?: ContractType[];
  qardHasanRate?: number;
  murabahaRates?: number[];
  repaymentTermsMonths?: number[];
  salaryFromSepahMultiplierYes?: number;
  salaryFromSepahMultiplierNo?: number;
  contractDurationMonths?: number;
  graceMonthsAfterExpiry?: number;
  maxPlansPerCompany?: number;
  personnelIntroductionDelayMonths?: number;
  waitingPeriodDays?: number;
  /** جدول درصد قابل استفاده از میانگین: هر ردیف یک مدت، هر ستون یک نرخ. */
  usableTable?: ReadModelsUsablePercentDto[];
  rowVersion?: string;
}

export type EResponseStatusCode = typeof EResponseStatusCode[keyof typeof EResponseStatusCode];


export const EResponseStatusCode = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
  NUMBER_6: 6,
  NUMBER_7: 7,
  NUMBER_8: 8,
  NUMBER_9: 9,
  NUMBER_10: 10,
  NUMBER_12: 12,
  NUMBER_13: 13,
  NUMBER_14: 14,
  NUMBER_15: 15,
  NUMBER_16: 16,
  NUMBER_17: 17,
  NUMBER_18: 18,
  NUMBER_19: 19,
  NUMBER_20: 20,
  NUMBER_21: 21,
  NUMBER_22: 22,
  NUMBER_23: 23,
  NUMBER_24: 24,
  NUMBER_25: 25,
  NUMBER_26: 26,
  NUMBER_27: 27,
  NUMBER_28: 28,
  NUMBER_29: 29,
  NUMBER_30: 30,
  NUMBER_31: 31,
  NUMBER_32: 32,
  NUMBER_33: 33,
  NUMBER_34: 34,
  NUMBER_35: 35,
  NUMBER_36: 36,
  NUMBER_37: 37,
  NUMBER_38: 38,
  NUMBER_39: 39,
  NUMBER_40: 40,
  NUMBER_41: 41,
  NUMBER_42: 42,
  NUMBER_43: 43,
  NUMBER_44: 44,
  NUMBER_45: 45,
  NUMBER_46: 46,
  NUMBER_47: 47,
  NUMBER_48: 48,
  NUMBER_49: 49,
  NUMBER_50: 50,
  NUMBER_51: 51,
  NUMBER_52: 52,
  NUMBER_53: 53,
  NUMBER_54: 54,
  NUMBER_55: 55,
  NUMBER_56: 56,
  NUMBER_57: 57,
  NUMBER_58: 58,
  NUMBER_59: 59,
  NUMBER_60: 60,
  NUMBER_61: 61,
  NUMBER_62: 62,
  NUMBER_63: 63,
  NUMBER_64: 64,
  NUMBER_65: 65,
  NUMBER_66: 66,
  NUMBER_67: 67,
  NUMBER_68: 68,
  NUMBER_69: 69,
  NUMBER_70: 70,
  NUMBER_71: 71,
  NUMBER_73: 73,
  NUMBER_74: 74,
  NUMBER_75: 75,
  NUMBER_76: 76,
  NUMBER_77: 77,
  NUMBER_79: 79,
  NUMBER_80: 80,
  NUMBER_81: 81,
  NUMBER_82: 82,
  NUMBER_83: 83,
  NUMBER_84: 84,
  NUMBER_85: 85,
  NUMBER_86: 86,
  NUMBER_87: 87,
  NUMBER_88: 88,
  NUMBER_89: 89,
  NUMBER_90: 90,
  NUMBER_91: 91,
  NUMBER_92: 92,
  NUMBER_93: 93,
  NUMBER_94: 94,
  NUMBER_95: 95,
  NUMBER_96: 96,
  NUMBER_97: 97,
  NUMBER_98: 98,
  NUMBER_99: 99,
  NUMBER_100: 100,
  NUMBER_101: 101,
  NUMBER_102: 102,
  NUMBER_103: 103,
  NUMBER_104: 104,
  NUMBER_105: 105,
  NUMBER_106: 106,
  NUMBER_107: 107,
  NUMBER_108: 108,
  NUMBER_109: 109,
  NUMBER_110: 110,
  NUMBER_111: 111,
  NUMBER_112: 112,
  NUMBER_113: 113,
  NUMBER_114: 114,
  NUMBER_115: 115,
  NUMBER_116: 116,
  NUMBER_117: 117,
  NUMBER_118: 118,
  NUMBER_119: 119,
  NUMBER_120: 120,
  NUMBER_121: 121,
  NUMBER_122: 122,
  NUMBER_123: 123,
  NUMBER_124: 124,
  NUMBER_125: 125,
  NUMBER_126: 126,
  NUMBER_127: 127,
  NUMBER_128: 128,
  NUMBER_129: 129,
  NUMBER_130: 130,
  NUMBER_131: 131,
  NUMBER_132: 132,
  NUMBER_133: 133,
  NUMBER_134: 134,
  NUMBER_135: 135,
  NUMBER_136: 136,
  NUMBER_137: 137,
  NUMBER_138: 138,
  NUMBER_139: 139,
  NUMBER_140: 140,
  NUMBER_141: 141,
  NUMBER_142: 142,
  NUMBER_143: 143,
  NUMBER_144: 144,
  NUMBER_145: 145,
  NUMBER_146: 146,
  NUMBER_147: 147,
  NUMBER_148: 148,
  NUMBER_149: 149,
  NUMBER_150: 150,
  NUMBER_151: 151,
  NUMBER_152: 152,
  NUMBER_153: 153,
  NUMBER_154: 154,
  NUMBER_155: 155,
  NUMBER_156: 156,
  NUMBER_157: 157,
  NUMBER_158: 158,
  NUMBER_159: 159,
  NUMBER_160: 160,
  NUMBER_161: 161,
  NUMBER_162: 162,
  NUMBER_163: 163,
  NUMBER_164: 164,
  NUMBER_165: 165,
  NUMBER_166: 166,
  NUMBER_167: 167,
  NUMBER_168: 168,
  NUMBER_169: 169,
  NUMBER_170: 170,
  NUMBER_171: 171,
  NUMBER_172: 172,
  NUMBER_173: 173,
  NUMBER_174: 174,
  NUMBER_175: 175,
  NUMBER_176: 176,
  NUMBER_178: 178,
  NUMBER_179: 179,
  NUMBER_180: 180,
  NUMBER_181: 181,
  NUMBER_182: 182,
  NUMBER_183: 183,
  NUMBER_184: 184,
  NUMBER_185: 185,
  NUMBER_186: 186,
  NUMBER_187: 187,
  NUMBER_188: 188,
  NUMBER_189: 189,
  NUMBER_190: 190,
  NUMBER_191: 191,
  NUMBER_192: 192,
  NUMBER_193: 193,
  NUMBER_194: 194,
  NUMBER_195: 195,
  NUMBER_196: 196,
  NUMBER_197: 197,
  NUMBER_198: 198,
  NUMBER_199: 199,
  NUMBER_200: 200,
  NUMBER_201: 201,
  NUMBER_202: 202,
  NUMBER_203: 203,
  NUMBER_204: 204,
  NUMBER_205: 205,
  NUMBER_206: 206,
  NUMBER_207: 207,
  NUMBER_208: 208,
  NUMBER_209: 209,
  NUMBER_210: 210,
  NUMBER_211: 211,
  NUMBER_212: 212,
  NUMBER_213: 213,
  NUMBER_214: 214,
  NUMBER_215: 215,
  NUMBER_216: 216,
  NUMBER_217: 217,
  NUMBER_218: 218,
  NUMBER_219: 219,
  NUMBER_220: 220,
  NUMBER_221: 221,
  NUMBER_222: 222,
  NUMBER_223: 223,
  NUMBER_224: 224,
  NUMBER_225: 225,
  NUMBER_226: 226,
  NUMBER_227: 227,
  NUMBER_228: 228,
  NUMBER_229: 229,
  NUMBER_230: 230,
  NUMBER_231: 231,
  NUMBER_232: 232,
  NUMBER_233: 233,
  NUMBER_234: 234,
  NUMBER_235: 235,
  NUMBER_236: 236,
  NUMBER_237: 237,
  NUMBER_238: 238,
  NUMBER_239: 239,
  NUMBER_240: 240,
  NUMBER_241: 241,
  NUMBER_242: 242,
  NUMBER_243: 243,
  NUMBER_244: 244,
  NUMBER_245: 245,
  NUMBER_246: 246,
  NUMBER_247: 247,
  NUMBER_248: 248,
  NUMBER_249: 249,
  NUMBER_250: 250,
  NUMBER_251: 251,
  NUMBER_252: 252,
  NUMBER_253: 253,
  NUMBER_254: 254,
  NUMBER_255: 255,
  NUMBER_256: 256,
  NUMBER_257: 257,
  NUMBER_258: 258,
  NUMBER_259: 259,
  NUMBER_260: 260,
  NUMBER_261: 261,
  NUMBER_262: 262,
  NUMBER_263: 263,
  NUMBER_264: 264,
  NUMBER_265: 265,
  NUMBER_266: 266,
  NUMBER_267: 267,
  NUMBER_268: 268,
  NUMBER_269: 269,
  NUMBER_270: 270,
  NUMBER_271: 271,
  NUMBER_272: 272,
  NUMBER_273: 273,
  NUMBER_274: 274,
  NUMBER_275: 275,
  NUMBER_276: 276,
  NUMBER_277: 277,
  NUMBER_278: 278,
  NUMBER_279: 279,
  NUMBER_280: 280,
  NUMBER_281: 281,
  NUMBER_282: 282,
  NUMBER_283: 283,
  NUMBER_284: 284,
  NUMBER_285: 285,
  NUMBER_286: 286,
  NUMBER_287: 287,
  NUMBER_288: 288,
  NUMBER_290: 290,
  NUMBER_291: 291,
  NUMBER_292: 292,
  NUMBER_293: 293,
  NUMBER_294: 294,
  NUMBER_295: 295,
  NUMBER_296: 296,
  NUMBER_297: 297,
  NUMBER_298: 298,
  NUMBER_299: 299,
  NUMBER_300: 300,
  NUMBER_301: 301,
  NUMBER_302: 302,
  NUMBER_303: 303,
  NUMBER_304: 304,
  NUMBER_305: 305,
  NUMBER_306: 306,
  NUMBER_307: 307,
  NUMBER_308: 308,
  NUMBER_309: 309,
  NUMBER_310: 310,
  NUMBER_311: 311,
  NUMBER_312: 312,
  NUMBER_313: 313,
  NUMBER_314: 314,
  NUMBER_315: 315,
  NUMBER_316: 316,
  NUMBER_317: 317,
  NUMBER_318: 318,
  NUMBER_319: 319,
  NUMBER_320: 320,
  NUMBER_321: 321,
  NUMBER_401: 401,
  NUMBER_403: 403,
} as const;

export interface BaseMessageResponseOfBasicInfoDto {
  data?: ReadModelsBasicInfoDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface BaseMessageResponseOfBoolean {
  data?: boolean;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * «ثبت‌کننده» (نام و کد کاربر + نام و کد شعبه) — نمونهٔ پنل روی شرکت و درخواست نشان می‌دهد.
 */
export interface CommonRegistrarDto {
  panelUserId?: number;
  userName?: string;
  /** @nullable */
  userCode?: string | null;
  /** @nullable */
  branchName?: string | null;
  /** @nullable */
  branchCode?: string | null;
}

export type ChangeLogCategory = typeof ChangeLogCategory[keyof typeof ChangeLogCategory];


export const ChangeLogCategory = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
} as const;

export interface CommandResponsesChangeLogItemDto {
  id?: number;
  at?: string;
  user?: CommonRegistrarDto;
  category?: ChangeLogCategory;
  action?: string;
  details?: string;
  /** @nullable */
  before?: string | null;
  /** @nullable */
  after?: string | null;
  /** @nullable */
  companyId?: number | null;
  /** فقط ادمین و فقط عملیات قابل بازگردانی */
  canRestore?: boolean;
  /** @nullable */
  restoredAt?: string | null;
}

export interface BaseMessageResponseOfChangeLogItemDto {
  data?: CommandResponsesChangeLogItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsMonthlyBalanceDto {
  /** ماه شمسی به‌صورت «۱۴۰۵/۰۷» */
  month?: string;
  /** @nullable */
  averageBalance?: number | null;
  /**
     * مانده اعتبار تا این ماه (محاسبه‌شده از وام‌های تخصیص‌یافته)
     * @nullable
     */
  remainingCredit?: number | null;
  documentCount?: number;
  /** false ← هینت «برای این میانگین مستندی پیوست نشده است» */
  hasDocuments?: boolean;
  lastEditedBy?: CommonRegistrarDto;
  /** @nullable */
  lastEditedAt?: string | null;
  /** اعتبار مصرف‌شده: مجموع درخواست‌های ردنشده/لغونشده با تاریخ مبنا در همین ماه (معیار پذیرش ۱ مدیریت شرکت‌ها) */
  usedCredit?: number;
}

export interface ReadModelsCompanyBalancesDto {
  companyId?: number;
  /** ماه‌های سال جاری قرارداد */
  months?: ReadModelsMonthlyBalanceDto[];
  rowVersion?: string;
}

export interface BaseMessageResponseOfCompanyBalancesDto {
  data?: ReadModelsCompanyBalancesDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export type EligibilityStatus = typeof EligibilityStatus[keyof typeof EligibilityStatus];


export const EligibilityStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

export interface ReadModelsEligibilityBannerDto {
  status?: EligibilityStatus;
  /** پیام اصلی بنر. برای سازگاری نگه داشته شده؛ همان عضو اول Messages است. */
  message?: string;
  /**
     * روز مجاز انتقال اعتبار در ماه (مطابق روز افتتاح حساب سپرده)؛ اگر قرارداد فعال نباشد null.
     * @nullable
     */
  allowedDayOfMonth?: number | null;
  /**
     * فرانت دکمهٔ «ثبت درخواست وام» را با همین فعال/غیرفعال می‌کند و قاعدهٔ
     * `status == 3` را در کد خودش تکرار نمی‌کند — اگر فردا وضعیت پنجمی اضافه شد
     * که اجازه می‌دهد، فرانت نمی‌شکند.
     */
  canRegisterLoan?: boolean;
  /**
     * همهٔ پیام‌های بنر. امروز همیشه یک عضو دارد؛ آرایه است تا افزودن پیام دوم
     * (مثلاً هشدار نزدیک بودن سقف) قرارداد را عوض نکند.
     */
  messages?: string[];
}

/**
 * ستون‌های جدول نمونه: نوع تسهیلات، نرخ، مدت، سهم از میانگین، درصد قابل‌استفاده، اعتبار ایجادشده، تخصیص‌یافته، مانده.
 */
export interface ReadModelsPlanCreditDto {
  planId?: number;
  title?: string;
  contractType?: string;
  rate?: number;
  termMonths?: number;
  /**
     * مبلغ است، نه درصد — سهم ریالی این طرح از مجموع میانگین مبنا
     * (`totalAverageBase × usablePercent ÷ 100`، گرد‌شده). فرانت این را درصد نمایش می‌داد.
     * درصد همان UsablePercent است.
     */
  shareOfAverage?: number;
  /** درصد قابل استفاده از میانگین برای این طرح (از جدول اطلاعات پایه). */
  usablePercent?: number;
  createdCredit?: number;
  allocated?: number;
  remainingThisMonth?: number;
}

export interface ReadModelsCompanyCreditDto {
  companyId?: number;
  baseDate?: string;
  banner?: ReadModelsEligibilityBannerDto;
  monthRemainingCredit?: number;
  /** مجموع میانگین مبنای محاسبهٔ اعتبار (آخرین میانگین‌های مثبت) */
  totalAverageBase?: number;
  /** @nullable */
  currentMonthAverage?: number | null;
  plans?: ReadModelsPlanCreditDto[];
  /** تاریخ مبنای پیش‌فرض فرم ثبت وام (امروز). */
  baseDateDefault?: string;
  /**
     * کمینهٔ تاریخ مبنای مجاز: یک ماه شمسی قبل از امروز. فرانت تا امروز این بازه را نمی‌دانست و
     * خطا فقط هنگام ثبت معلوم می‌شد؛ حالا می‌تواند تاریخ‌شمار را همین‌جا محدود کند.
     */
  baseDateMin?: string;
  /** بیشینهٔ تاریخ مبنای مجاز: امروز. تاریخ آینده پذیرفته نمی‌شود. */
  baseDateMax?: string;
}

export interface BaseMessageResponseOfCompanyCreditDto {
  data?: ReadModelsCompanyCreditDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsPlanRefDto {
  planId?: number;
  title?: string;
}

/**
 * فایل ذخیره‌شده برای نمایش.
 */
export interface CommonStoredFileDto {
  id?: number;
  fileName?: string;
  size?: number;
  uploadedAt?: string;
  uploadedBy?: string;
}

export type CompanyStatus = typeof CompanyStatus[keyof typeof CompanyStatus];


export const CompanyStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

export interface ReadModelsCancellationInfoDto {
  cancelDate?: string;
  reason?: string;
  description?: string;
  file?: CommonStoredFileDto;
  cancelledBy?: CommonRegistrarDto;
  cancelledAt?: string;
}

export interface ReadModelsCompanyDetailsDto {
  id?: number;
  schemeId?: number;
  name?: string;
  nationalId?: string;
  agreementNumber?: string;
  accountNumber?: string;
  contractDate?: string;
  accountOpeningDate?: string;
  accountOpeningDayOfMonth?: number;
  salaryFromSepah?: boolean;
  plans?: ReadModelsPlanRefDto[];
  agreementFile?: CommonStoredFileDto;
  registrar?: CommonRegistrarDto;
  createdAt?: string;
  status?: CompanyStatus;
  cancellation?: ReadModelsCancellationInfoDto;
  branchCode?: string;
  rowVersion?: string;
}

export interface BaseMessageResponseOfCompanyDetailsDto {
  data?: ReadModelsCompanyDetailsDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsCompanyListItemDto {
  id?: number;
  name?: string;
  nationalId?: string;
  agreementNumber?: string;
  contractDate?: string;
  planCount?: number;
  registrar?: CommonRegistrarDto;
  status?: CompanyStatus;
  branchCode?: string;
  /** @nullable */
  cancelDate?: string | null;
  /** @nullable */
  cancelReasonTitle?: string | null;
}

export interface CommonFacilityPagedResponseOfCompanyListItemDto {
  items?: ReadModelsCompanyListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface ReadModelsCompanySearchResultDto {
  page?: CommonFacilityPagedResponseOfCompanyListItemDto;
  /** سرتیتر نمونه: «X شرکت فعال از Y شرکت ثبت‌شده» (در دامنهٔ کاربر) */
  activeCount?: number;
  registeredCount?: number;
}

export interface BaseMessageResponseOfCompanySearchResultDto {
  data?: ReadModelsCompanySearchResultDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * ۴ KPI سند: شرکت فعال، کل درخواست‌ها، جمع تأییدشده، جمع در انتظار.
 */
export interface ReadModelsDashboardKpisDto {
  activeCompanies?: number;
  totalRequests?: number;
  approvedAmount?: number;
  pendingAmount?: number;
}

export interface ReadModelsRequestStatusChartDto {
  approved?: number;
  pending?: number;
  rejected?: number;
}

export interface ReadModelsPlanShareDto {
  planId?: number;
  planTitle?: string;
  requestCount?: number;
}

export interface ReadModelsCreditVsAllocatedDto {
  groupId?: string;
  groupTitle?: string;
  createdCredit?: number;
  allocated?: number;
}

/**
 * «گروه» در نمودار اعتبار در برابر تخصیص چیست. فرانت نمی‌دانست شعبه است، طرح است یا شرکت —
 * و جواب به دامنهٔ کاربر بستگی دارد، پس باید در خود پاسخ بیاید.
 */
export type ReadModelsDashboardGroupKind = typeof ReadModelsDashboardGroupKind[keyof typeof ReadModelsDashboardGroupKind];


export const ReadModelsDashboardGroupKind = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export interface ReadModelsContractsByMonthDto {
  /** ماه شمسی «۱۴۰۵/۰۷» */
  month?: string;
  companyCount?: number;
  companyNames?: string[];
}

export type ReadModelsMonthlyAllocationDtoAmountByMonth = {[key: string]: number};

export interface ReadModelsMonthlyAllocationDto {
  companyId?: number;
  companyName?: string;
  amountByMonth?: ReadModelsMonthlyAllocationDtoAmountByMonth;
}

export interface ReadModelsRemovedCompanyDto {
  companyId?: number;
  companyName?: string;
  removedAt?: string;
  /** @nullable */
  averageBalance?: number | null;
  allocatedTotal?: number;
  requestCount?: number;
  /**
     * برای شرکتی که هیچ درخواستی ندارد null است، نه صفر؛ فرانت در این حالت «—» نشان می‌دهد
     * و صفر یعنی «درخواست داشت و هیچ‌کدام تأیید نشد».
     * @nullable
     */
  approvalRate?: number | null;
  removalKind?: CompanyStatus;
}

export interface ReadModelsDashboardDto {
  kpis?: ReadModelsDashboardKpisDto;
  requestStatus?: ReadModelsRequestStatusChartDto;
  planShare?: ReadModelsPlanShareDto[];
  /** برای ادمین/دیجیتال به تفکیک شعبه (US-C3: نسبت درخواست به اعتبار تخصیصی شعب)، برای بقیه به تفکیک شرکت */
  creditVsAllocated?: ReadModelsCreditVsAllocatedDto[];
  creditVsAllocatedGroupKind?: ReadModelsDashboardGroupKind;
  contractsByMonth?: ReadModelsContractsByMonthDto[];
  /**
     * مبلغ هر ماه با کلید ماه شمسی به قالب `1404/05`. ترتیب ستون‌ها را از
     * `GET Dashboard/Months` بگیرید؛ در این آبجکت فقط ماه‌هایی هستند که مبلغ دارند.
     */
  monthlyAllocation?: ReadModelsMonthlyAllocationDto[];
  removedCompanies?: ReadModelsRemovedCompanyDto[];
}

export interface BaseMessageResponseOfDashboardDto {
  data?: ReadModelsDashboardDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsSkippedRequestDto {
  requestId?: number;
  reason?: string;
}

export interface CommandResponsesDecisionResultDto {
  processed?: number;
  /** درخواست‌هایی که در این مرحله نبودند یا خارج از دامنهٔ کاربر بودند (با دلیل) */
  skipped?: ReadModelsSkippedRequestDto[];
}

export interface BaseMessageResponseOfDecisionResultDto {
  data?: CommandResponsesDecisionResultDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * یک مقدار از یک enum، با عنوان فارسی‌اش.
 * فرانت وضعیت‌ها را از همین می‌خواند و عنوان‌ها را در کد خودش تکرار نمی‌کند — پس افزودن
 * یک وضعیت جدید در بک‌اند، فرانت را نمی‌شکند و نیازی به دیپلوی هم‌زمان ندارد.
 */
export interface CommonEnumValueDto {
  /** همان عدد روی سیم. */
  value?: number;
  /** نام انگلیسی عضو enum؛ برای کدی که باید به یک مقدار خاص واکنش دهد. */
  name?: string;
  /** عنوان فارسی برای نمایش. */
  title?: string;
  /**
     * این مقدار هنگام انتخاب، دلیل هم لازم دارد. فعلاً فقط «عدم اعطای تسهیلات غیرحضوری»
     * در مرحلهٔ پس از تأیید. فرانت با همین می‌فهمد کِی باید کشویی دلیل را نشان دهد.
     */
  requiresReason?: boolean;
}

/**
 * همهٔ enumهای روی سیم، در یک پاسخ. فرانت یک بار می‌خواند و کش می‌کند.
 *
 * کلید هر فهرست همان نام enum در بک‌اند است، تا وقتی چیزی اضافه شد، جای پیدا کردنش روشن باشد.
 */
export interface CommonEnumCatalogDto {
  companyStatus?: CommonEnumValueDto[];
  personnelStatus?: CommonEnumValueDto[];
  loanRequestStatus?: CommonEnumValueDto[];
  postApprovalStage?: CommonEnumValueDto[];
  allocationMode?: CommonEnumValueDto[];
  eligibilityStatus?: CommonEnumValueDto[];
  approvalStage?: CommonEnumValueDto[];
  decisionType?: CommonEnumValueDto[];
  contractType?: CommonEnumValueDto[];
  reasonType?: CommonEnumValueDto[];
  changeLogCategory?: CommonEnumValueDto[];
  companyRankingSort?: CommonEnumValueDto[];
  dashboardExport?: CommonEnumValueDto[];
  hintLevel?: CommonEnumValueDto[];
}

export interface BaseMessageResponseOfEnumCatalogDto {
  data?: CommonEnumCatalogDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface CommonFacilityPagedResponseOfChangeLogItemDto {
  items?: CommandResponsesChangeLogItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface BaseMessageResponseOfFacilityPagedResponseOfChangeLogItemDto {
  data?: CommonFacilityPagedResponseOfChangeLogItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export type LoanRequestStatus = typeof LoanRequestStatus[keyof typeof LoanRequestStatus];


export const LoanRequestStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
  NUMBER_6: 6,
  NUMBER_7: 7,
  NUMBER_8: 8,
} as const;

export type PostApprovalStage = typeof PostApprovalStage[keyof typeof PostApprovalStage];


export const PostApprovalStage = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

export interface CommandResponsesLoanRequestListItemDto {
  id?: number;
  batchId?: number;
  companyId?: number;
  companyName?: string;
  branchCode?: string;
  personnelId?: number;
  personnelName?: string;
  personnelCode?: string;
  planTitle?: string;
  amount?: number;
  paymentOrder?: number;
  createdAt?: string;
  /** @nullable */
  decidedAt?: string | null;
  status?: LoanRequestStatus;
  postStage?: PostApprovalStage;
  /** @nullable */
  description?: string | null;
  documentCount?: number;
  canCancel?: boolean;
  documents?: CommonStoredFileDto[];
}

export interface CommonFacilityPagedResponseOfLoanRequestListItemDto {
  items?: CommandResponsesLoanRequestListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface BaseMessageResponseOfFacilityPagedResponseOfLoanRequestListItemDto {
  data?: CommonFacilityPagedResponseOfLoanRequestListItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export type PersonnelStatus = typeof PersonnelStatus[keyof typeof PersonnelStatus];


export const PersonnelStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

export interface ReadModelsPersonnelListItemDto {
  id?: number;
  /** اولویت تخصیص؛ عدد کوچک‌تر = اولویت بالاتر. فهرست با همین مرتب می‌شود. */
  priority?: number;
  fullName?: string;
  nationalCode?: string;
  mobile?: string;
  personnelCode?: string;
  hireDate?: string;
  status?: PersonnelStatus;
  /** @nullable */
  rejectReason?: string | null;
  createdAt?: string;
  /** @nullable */
  decidedAt?: string | null;
  registrar?: CommonRegistrarDto;
  /** در درخواست وام استفاده شده ← ویرایش و حذف مسدود */
  isLocked?: boolean;
}

export interface CommonFacilityPagedResponseOfPersonnelListItemDto {
  items?: ReadModelsPersonnelListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface BaseMessageResponseOfFacilityPagedResponseOfPersonnelListItemDto {
  data?: CommonFacilityPagedResponseOfPersonnelListItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * یک ردیف جدول «اطلاعات پایه طرح». هر چیزی که در جدول نشان داده می‌شود این‌جاست، تا فرانت
 * برای پر کردن جدول مجبور نشود برای هر ردیف سرویس جزئیات را صدا بزند.
 */
export interface ReadModelsSchemeListItemDto {
  id?: number;
  code?: string;
  title?: string;
  qardHasanRate?: number;
  murabahaRates?: number[];
  repaymentTermsMonths?: number[];
  contractDurationMonths?: number;
  maxPlansPerCompany?: number;
  isActive?: boolean;
  companyCount?: number;
}

export interface CommonFacilityPagedResponseOfSchemeListItemDto {
  items?: ReadModelsSchemeListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface BaseMessageResponseOfFacilityPagedResponseOfSchemeListItemDto {
  data?: CommonFacilityPagedResponseOfSchemeListItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * پاسخ همهٔ سرویس‌های دانلود و خروجی: لینک موقت فایل (Minio presigned URL)، نه محتوای فایل.
 * فرانت همین Url را باز می‌کند؛ لینک بعد از ExpiresAt دیگر کار نمی‌کند و باید دوباره گرفته شود.
 * مجوز و دامنهٔ کاربر قبل از ساختن لینک در سرویس بررسی شده است.
 */
export interface CommonFileLinkDto {
  url?: string;
  fileName?: string;
  contentType?: string;
  expiresAt?: string;
}

export interface BaseMessageResponseOfFileLinkDto {
  data?: CommonFileLinkDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsBalanceDocumentDto {
  id?: number;
  /** @nullable */
  month?: string | null;
  documentType?: string;
  /** @nullable */
  description?: string | null;
  file?: CommonStoredFileDto;
}

export interface BaseMessageResponseOfIReadOnlyListOfBalanceDocumentDto {
  /** @nullable */
  data?: ReadModelsBalanceDocumentDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsCompanyRankingDto {
  rank?: number;
  companyId?: number;
  companyName?: string;
  /** @nullable */
  averageBalance?: number | null;
  allocatedAmount?: number;
  requestCount?: number;
  personnelCount?: number;
  status?: string;
}

export interface BaseMessageResponseOfIReadOnlyListOfCompanyRankingDto {
  /** @nullable */
  data?: ReadModelsCompanyRankingDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * آیتم Dropdown. Id عدد (int64) است، مثل companyId در بقیهٔ سرویس‌ها.
 */
export interface CommonFacilityLookupItemDto {
  id?: number;
  title?: string;
}

export interface BaseMessageResponseOfIReadOnlyListOfFacilityLookupItemDto {
  /** @nullable */
  data?: CommonFacilityLookupItemDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsMonthOptionDto {
  /** کلید ماه شمسی، همیشه به قالب `1404/05` (چهار رقم سال، اسلش، دو رقم ماه). */
  key?: string;
  /** عنوان فارسی برای نمایش، مثل «مرداد ۱۴۰۴». */
  title?: string;
}

export interface BaseMessageResponseOfIReadOnlyListOfMonthOptionDto {
  /** @nullable */
  data?: ReadModelsMonthOptionDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export type ReasonType = typeof ReasonType[keyof typeof ReasonType];


export const ReasonType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
  NUMBER_6: 6,
} as const;

export interface ReadModelsReasonDto {
  id?: number;
  type?: ReasonType;
  title?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface BaseMessageResponseOfIReadOnlyListOfReasonDto {
  /** @nullable */
  data?: ReadModelsReasonDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface BaseMessageResponseOfIReadOnlyListOfRegistrarDto {
  /** @nullable */
  data?: CommonRegistrarDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsSchemeDto {
  id?: number;
  code?: string;
  title?: string;
  isActive?: boolean;
}

export interface BaseMessageResponseOfIReadOnlyListOfSchemeDto {
  /** @nullable */
  data?: ReadModelsSchemeDto[] | null;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface CommandResponsesLoanBatchDto {
  batchId?: number;
  companyId?: number;
  planId?: number;
  mode?: AllocationMode;
  total?: number;
  requests?: CommandResponsesLoanRequestListItemDto[];
}

export interface BaseMessageResponseOfLoanBatchDto {
  data?: CommandResponsesLoanBatchDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * قاعدهٔ فرایندی ۵: تاریخ تصمیم، تصمیم‌گیرنده، وضعیت قبلی و جدید.
 */
export interface ReadModelsLoanRequestHistoryDto {
  from?: LoanRequestStatus;
  to?: LoanRequestStatus;
  stage?: PostApprovalStage;
  /** @nullable */
  reason?: string | null;
  /** @nullable */
  description?: string | null;
  by?: CommonRegistrarDto;
  at?: string;
}

export interface ReadModelsLoanRequestDetailsDto {
  summary?: CommandResponsesLoanRequestListItemDto;
  registrar?: CommonRegistrarDto;
  history?: ReadModelsLoanRequestHistoryDto[];
  documents?: CommonStoredFileDto[];
}

export interface BaseMessageResponseOfLoanRequestDetailsDto {
  data?: ReadModelsLoanRequestDetailsDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface BaseMessageResponseOfLoanRequestListItemDto {
  data?: CommandResponsesLoanRequestListItemDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export type HintLevel = typeof HintLevel[keyof typeof HintLevel];


export const HintLevel = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

export interface ReadModelsHintDto {
  level?: HintLevel;
  text?: string;
}

export interface ReadModelsRepeatAllocationDto {
  /** فردی که در همین ماه قبلاً وام گرفته. */
  personnelId?: number;
  personnelName?: string;
  personnelCode?: string;
  /** ماه شمسی تخصیص قبلی، قالب 1404/05. */
  month?: string;
  /** مجموع مبالغ تخصیص‌های همان ماه این فرد. */
  previousAmount?: number;
}

export interface ReadModelsLoanRequestPreviewDto {
  selectedCount?: number;
  total?: number;
  remainingCredit?: number;
  isAllowed?: boolean;
  /** @nullable */
  maxCoverablePeople?: number | null;
  /** @nullable */
  suggestedMaxAmount?: number | null;
  /** پیام‌های هینت به ترتیب نمایش (سبز/قرمز/راهنما) */
  messages?: ReadModelsHintDto[];
  /**
     * افرادی از فهرست انتخاب‌شده که در همان ماه تاریخ مبنا قبلاً وام گرفته‌اند (قاعدهٔ «هشدار
     * تخصیص مجدد در همان ماه»). هشدار است نه خطا: ثبت را قفل نمی‌کند و `IsAllowed` را
     * عوض نمی‌کند — فرانت فهرست را نشان می‌دهد و تأیید دوباره می‌گیرد.
     * درخواست لغوشده یا ردشده حساب نمی‌شود، چون اعتباری مصرف نکرده.
     */
  repeatAllocations?: ReadModelsRepeatAllocationDto[];
}

export interface BaseMessageResponseOfLoanRequestPreviewDto {
  data?: ReadModelsLoanRequestPreviewDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface BaseMessageResponseOfObject {
  data?: unknown;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * تعداد در انتظار روی تب‌ها؛ null یعنی کاربر آن صف را نمی‌بیند. (تأیید پرسنل و تأیید شعبهٔ دیجیتال حذف شدند.)
 */
export interface ReadModelsPendingCountsDto {
  /** @nullable */
  managerApproval?: number | null;
  /** @nullable */
  creditApproval?: number | null;
}

export interface BaseMessageResponseOfPendingCountsDto {
  data?: ReadModelsPendingCountsDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * US-E3: «وضعیت‌های تغییر یافته را به همراه تاریخ و ساعت مشاهده کند».
 */
export interface ReadModelsPersonnelHistoryDto {
  from?: PersonnelStatus;
  to?: PersonnelStatus;
  /** @nullable */
  reason?: string | null;
  /** @nullable */
  description?: string | null;
  by?: CommonRegistrarDto;
  at?: string;
}

export interface ReadModelsPersonnelDetailsDto {
  id?: number;
  companyId?: number;
  priority?: number;
  fullName?: string;
  nationalCode?: string;
  mobile?: string;
  personnelCode?: string;
  hireDate?: string;
  status?: PersonnelStatus;
  isLocked?: boolean;
  history?: ReadModelsPersonnelHistoryDto[];
  rowVersion?: string;
}

export interface BaseMessageResponseOfPersonnelDetailsDto {
  data?: ReadModelsPersonnelDetailsDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsPersonnelImportErrorDto {
  row?: number;
  column?: string;
  message?: string;
}

export interface ReadModelsPersonnelImportResultDto {
  batchId?: number;
  totalRows?: number;
  accepted?: number;
  rejected?: number;
  errors?: ReadModelsPersonnelImportErrorDto[];
}

export interface BaseMessageResponseOfPersonnelImportResultDto {
  data?: ReadModelsPersonnelImportResultDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsPlanDto {
  id?: number;
  contractType?: ContractType;
  rate?: number;
  termMonths?: number;
  usablePercent?: number;
  title?: string;
}

/**
 * طرح‌های قابل انتخاب، همراه با سقف تعداد طرح هر شرکت.
 *
 * چرا پوشش گرفت: فرانت برای محدود کردن انتخاب طرح در فرم شرکت به
 * MaxPlansPerCompany نیاز دارد و تا امروز فقط در «اطلاعات پایهٔ طرح» بود —
 * یعنی فرانت باید یک سرویس دیگر را هم صدا می‌زد که مجوز ویرایش اطلاعات پایه می‌خواهد
 * و کاربر شعبه آن را ندارد.
 */
export interface ReadModelsPlanListDto {
  maxPlansPerCompany?: number;
  plans?: ReadModelsPlanDto[];
}

export interface BaseMessageResponseOfPlanListDto {
  data?: ReadModelsPlanListDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface BaseMessageResponseOfReasonDto {
  data?: ReadModelsReasonDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

export interface ReadModelsSchemeReasonsDto {
  /** دلایل لغو قرارداد (مورد ۱۱ فرم). */
  contractCancel?: ReadModelsReasonDto[];
  /** دلایل رد درخواست وام (مورد ۱۲). */
  loanReject?: ReadModelsReasonDto[];
  /** دلایل عدم اعطای تسهیلات غیرحضوری (مورد ۱۳). */
  remoteGrantDenied?: ReadModelsReasonDto[];
  /** انواع مستند میانگین موجودی (مورد ۱۴). */
  documentType?: ReadModelsReasonDto[];
  loanCancel?: ReadModelsReasonDto[];
  personnelReject?: ReadModelsReasonDto[];
}

/**
 * همهٔ ۱۴ مورد فرم طرح، در یک پاسخ — و همین شکل در ایجاد و ویرایش برگردانده می‌شود.
 *
 * چرا این‌طور شد: قبلاً هویت طرح (نام و کد)، تنظیماتش و فهرست‌های دلایلش سه جای جدا بودند
 * و فهرست‌ها هم سراسری بودند، پس «فرم طرح» در هیچ سرویسی کامل نبود.
 */
export interface ReadModelsSchemeFormDto {
  id?: number;
  code?: string;
  title?: string;
  isActive?: boolean;
  settings?: ReadModelsBasicInfoDto;
  reasons?: ReadModelsSchemeReasonsDto;
  companyCount?: number;
}

export interface BaseMessageResponseOfSchemeFormDto {
  data?: ReadModelsSchemeFormDto;
  statusCode?: EResponseStatusCode;
  /** @nullable */
  message?: string | null;
  isSuccess?: boolean;
}

/**
 * US-D5: لغو درخواست یک نفر تا قبل از تأیید اعتبارات؛ دلیل از فهرست (قاعدهٔ ۸) + توضیح.
 */
export interface CancelLoanRequestCommand {
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  reasonId: number;
  /**
     * @minLength 5
     * @maxLength 1000
     */
  description: string;
}

/**
 * تصمیم تأیید/رد گروهی یا تکی.
 */
export type CommonDecisionType = typeof CommonDecisionType[keyof typeof CommonDecisionType];


export const CommonDecisionType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

/**
 * ثبت درخواست تخصیص وام برای پرسنل انتخاب‌شده (US-D3). مجموع نباید از مانده اعتبار طرح بیشتر شود.
 */
export interface CreateLoanRequestsCommand {
  /**
     * فیلد ۱۴۳: از طرح‌های مصوب تفاهم‌نامهٔ شرکت
     * @minimum 1
     * @maximum 2147483647
     */
  planId: number;
  /** فیلد ۱۴۷: فقط در بازهٔ یک ماه گذشته بر اساس روز افتتاح حساب (قاعدهٔ ۹) */
  baseDate: string;
  mode: AllocationMode;
  /**
     * فیلد ۲۴۹: در حالت یکسان؛ ۱۰٬۰۰۰٬۰۰۰ تا ۴٬۰۰۰٬۰۰۰٬۰۰۰ ریال
     * @minimum 10000000
     * @maximum 4000000000
     * @nullable
     */
  amount?: number | null;
  /**
     * حداقل ۱ نفر؛ فقط پرسنل تأییدشده
     * @minItems 1
     * @maxItems 1000
     */
  items: ReadModelsLoanRequestItemInput[];
  /**
     * @minLength 0
     * @maxLength 1000
     * @nullable
     */
  description?: string | null;
}

export interface CreatePersonnelCommand {
  /**
     * فیلد ۲۴۱: ۳ تا ۶۰ حرف فارسی
     * @minLength 3
     * @maxLength 60
     * @pattern ^[؀-ۿ‌\s]+$
     */
  fullName: string;
  /**
     * فیلد ۲۴۲: کد ملی ۱۰ رقم
     * @minLength 1
     * @pattern ^\d{10}$
     */
  nationalCode: string;
  /**
     * فیلد ۲۴۳: موبایل ۱۱ رقم با ۰۹
     * @minLength 1
     * @pattern ^09\d{9}$
     */
  mobile: string;
  /**
     * فیلد ۲۴۴: کد پرسنلی ۱ تا ۲۰؛ حرف، عدد، - _
     * @minLength 1
     * @maxLength 20
     * @pattern ^[a-zA-Z0-9\-_]+$
     */
  personnelCode: string;
  /** فیلد ۲۴۵: ۱۳۵۰/۰۱/۰۱ تا امروز (تاریخ آینده ممنوع) */
  hireDate: string;
  /**
     * فیلد ۲۴۶: ۱ تا ۹۹۹
     * @minimum 1
     * @maximum 999
     */
  priority?: number;
}

export interface CreateReasonCommand {
  type: ReasonType;
  /**
     * فیلد ۴۶: ۳ تا ۱۰۰ حرف فارسی
     * @minLength 3
     * @maxLength 100
     */
  title: string;
}

/**
 * حذف شرکت (نرم؛ در داشبورد «شرکت‌های حذف‌شده» می‌ماند). فقط وقتی درخواست تأییدشده ندارد.
 */
export interface DeleteCompanyCommand {
  /**
     * @minLength 5
     * @maxLength 500
     */
  description: string;
}

/**
 * پیش‌نمایش و اعتبارسنجی زندهٔ فرم (هینت‌ها): مجموع، مجاز بودن، «حداکثر تا N نفر با این مبلغ».
 * فرانت هم محاسبه می‌کند؛ این Endpoint همان قواعد سرور را برمی‌گرداند تا ناهماهنگ نشوند.
 */
export interface PreviewLoanRequestQuery {
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  planId: number;
  /** @nullable */
  baseDate?: string | null;
  mode: AllocationMode;
  /**
     * @minimum 0
     * @maximum 4000000000
     * @nullable
     */
  amount?: number | null;
  items?: ReadModelsLoanRequestItemInput[];
}

export interface ProblemDetails {
  /** @nullable */
  type?: string | null;
  /** @nullable */
  title?: string | null;
  /** @nullable */
  status?: number | null;
  /** @nullable */
  detail?: string | null;
  /** @nullable */
  instance?: string | null;
  [key: string]: unknown;
}

export type ReadModelsCompanyRankingSort = typeof ReadModelsCompanyRankingSort[keyof typeof ReadModelsCompanyRankingSort];


export const ReadModelsCompanyRankingSort = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

/**
 * ۵ دکمهٔ خروجی CSV (UTF-8 با BOM برای Excel)؛ فقط دادهٔ دامنهٔ کاربر.
 */
export type ReadModelsDashboardExport = typeof ReadModelsDashboardExport[keyof typeof ReadModelsDashboardExport];


export const ReadModelsDashboardExport = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
  NUMBER_5: 5,
} as const;

export interface ReadModelsMonthlyBalanceInput {
  /**
     * @minLength 1
     * @pattern ^\d{4}/\d{2}$
     */
  month: string;
  /**
     * فیلد ۲۲۵: ۱ ریال تا ۱۵ رقم؛ null یعنی خالی کردن
     * @minimum 1
     * @maximum 999999999999999
     * @nullable
     */
  averageBalance?: number | null;
}

/**
 * بازگردانی یک عملیات (US-A4). قابل بازگردانی (Q16): ویرایش شرکت، حذف شرکت، میانگین موجودی، حذف مستند،
 * ویرایش پرسنل، حذف پرسنل، اطلاعات پایه/طرح. توضیح ۵ تا ۵۰۰ حرف الزامی.
 */
export interface RestoreChangeCommand {
  /**
     * @minLength 5
     * @maxLength 500
     */
  description: string;
}

/**
 * ایجاد یا ویرایش طرح — همهٔ ۱۴ مورد فرم در یک درخواست.
 *
 * یک بدنه برای هر دو، چون فرم یکی است: در ایجاد FacilityManagement.Application.Handler.BasicInfo.Commands.SaveScheme.SaveSchemeCommand.SchemeId صفر است و
 * FacilityManagement.Application.Handler.BasicInfo.Commands.SaveScheme.SaveSchemeCommand.Code و FacilityManagement.Application.Handler.BasicInfo.Commands.SaveScheme.SaveSchemeCommand.RowVersion لازم‌اند/نیستند همان‌طور که زیر هر کدام نوشته شده.
 * قاعدهٔ «null یعنی تغییر نکند» تنظیمات حفظ شده است، ولی در ایجاد هر چیزی که نیاید
 * مقدار پیش‌فرض موجودیت را می‌گیرد.
 */
export interface SaveSchemeCommand {
  /**
     * مورد ۱ فرم: نام طرح.
     * @minLength 3
     * @maxLength 100
     */
  title: string;
  /**
     * کد طرح (NEGIN، SHAJARE، ...). فقط در ایجاد؛ در ویرایش نادیده گرفته می‌شود چون کلید ارجاع است.
     * @minLength 2
     * @maxLength 30
     * @nullable
     */
  code?: string | null;
  /** طرح غیرفعال در کشویی‌ها نمی‌آید ولی شرکت‌های موجودش دست‌نخورده می‌مانند. */
  isActive?: boolean;
  /**
     * @minItems 1
     * @maxItems 2
     * @nullable
     */
  contractTypes?: ContractType[] | null;
  /**
     * مورد ۲: نرخ قرض‌الحسنه، ۰ تا ۴ درصد.
     * @minimum 0
     * @maximum 4
     * @nullable
     */
  qardHasanRate?: number | null;
  /**
     * مورد ۸: نرخ‌های مرابحه، حداکثر ۵ نرخ، هرکدام ۰ تا ۲۳ درصد.
     * @maxItems 5
     * @nullable
     */
  murabahaRates?: number[] | null;
  /**
     * مورد ۹: مدت‌های بازپرداخت، مضرب ۳ از ۳ تا ۶۰ ماه.
     * @maxItems 20
     * @nullable
     */
  repaymentTermsMonths?: number[] | null;
  /**
     * مورد ۳: ضریب تأثیر «حقوق‌بگیر بانک سپه = بله».
     * @minimum 0.01
     * @maximum 10
     * @nullable
     */
  salaryFromSepahMultiplierYes?: number | null;
  /**
     * @minimum 0.01
     * @maximum 10
     * @nullable
     */
  salaryFromSepahMultiplierNo?: number | null;
  /**
     * مورد ۴: مدت قرارداد (ماه).
     * @minimum 1
     * @maximum 120
     * @nullable
     */
  contractDurationMonths?: number | null;
  /**
     * مورد ۵: مهلت استفاده از مانده اعتبار پس از انقضا (ماه).
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  graceMonthsAfterExpiry?: number | null;
  /**
     * مورد ۶: حداکثر تعداد طرح قابل انتخاب برای هر شرکت.
     * @minimum 1
     * @maximum 10
     * @nullable
     */
  maxPlansPerCompany?: number | null;
  /**
     * مورد ۷: مهلت مجاز شدن معرفی پرسنل پس از انعقاد قرارداد (ماه).
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  personnelIntroductionDelayMonths?: number | null;
  /**
     * @minimum 0
     * @maximum 180
     * @nullable
     */
  waitingPeriodDays?: number | null;
  /**
     * مورد ۱۰: جدول درصد قابل استفاده از میانگین (هر مدت × قرض‌الحسنه و هر نرخ مرابحه).
     * @nullable
     */
  usableTable?: ReadModelsUsablePercentDto[] | null;
  /**
     * مورد ۱۱: دلایل لغو قرارداد.
     * @maxItems 100
     * @nullable
     */
  contractCancelReasons?: string[] | null;
  /**
     * مورد ۱۲: دلایل رد درخواست وام.
     * @maxItems 100
     * @nullable
     */
  loanRejectReasons?: string[] | null;
  /**
     * مورد ۱۳: دلایل عدم اعطای تسهیلات غیرحضوری.
     * @maxItems 100
     * @nullable
     */
  remoteGrantDeniedReasons?: string[] | null;
  /**
     * مورد ۱۴: انواع مستند میانگین موجودی.
     * @maxItems 100
     * @nullable
     */
  documentTypes?: string[] | null;
  /**
     * دلایل لغو درخواست وام (در فهرست سند نبود ولی سرویس لغو درخواست لازمش دارد).
     * @maxItems 100
     * @nullable
     */
  loanCancelReasons?: string[] | null;
  /**
     * دلایل رد پرسنل معرفی‌شده.
     * @maxItems 100
     * @nullable
     */
  personnelRejectReasons?: string[] | null;
  /**
     * در ویرایش الزامی (قفل خوش‌بینانه)؛ در ایجاد خالی.
     * @nullable
     */
  rowVersion?: string | null;
}

/**
 * تغییر «مرحلهٔ پس از تأیید» برای درخواست تأییدشده (نمونهٔ پنل). برای «عدم اعطای غیرحضوری» دلیل الزامی است.
 */
export interface SetPostApprovalStageCommand {
  stage: PostApprovalStage;
  /**
     * از «دلایل عدم اعطای تسهیلات غیرحضوری»
     * @nullable
     */
  reasonId?: number | null;
  /**
     * @minLength 0
     * @maxLength 1000
     * @nullable
     */
  description?: string | null;
}

/**
 * ذخیرهٔ کامل تنظیمات طرح (دکمهٔ «ذخیرهٔ تنظیمات پایه»). پر کردن همهٔ موارد الزامی نیست (نکتهٔ سند).
 */
export interface UpdateBasicInfoCommand {
  /**
     * فیلد ۲۲: حداقل ۱، حداکثر ۲ (قرض‌الحسنه، مرابحه)
     * @minItems 1
     * @maxItems 2
     * @nullable
     */
  contractTypes?: ContractType[] | null;
  /**
     * فیلد ۲۳۲: نرخ قرض‌الحسنه، ۰ تا ۴ درصد
     * @minimum 0
     * @maximum 4
     * @nullable
     */
  qardHasanRate?: number | null;
  /**
     * فیلد ۳۰: نرخ‌های مرابحه (درصد)، هرکدام ۰ تا ۲۳؛ نمونهٔ پنل ۵ نرخ. null = تغییر نکند
     * @maxItems 5
     * @nullable
     */
  murabahaRates?: number[] | null;
  /**
     * فیلد ۱۹۶: مدت‌های بازپرداخت، مضرب ۳ از ۳ تا ۶۰ ماه
     * @maxItems 20
     * @nullable
     */
  repaymentTermsMonths?: number[] | null;
  /**
     * فیلد ۲۳۰: ضریب حقوق از سپه (بله)، ۰٫۰۱ تا ۱۰ با دو رقم اعشار
     * @minimum 0.01
     * @maximum 10
     * @nullable
     */
  salaryFromSepahMultiplierYes?: number | null;
  /**
     * @minimum 0.01
     * @maximum 10
     * @nullable
     */
  salaryFromSepahMultiplierNo?: number | null;
  /**
     * فیلد ۲۲۹: مدت قرارداد ۱ تا ۱۲۰ ماه
     * @minimum 1
     * @maximum 120
     * @nullable
     */
  contractDurationMonths?: number | null;
  /**
     * مهلت استفاده از مانده اعتبار پس از انقضا (ماه) — نمونهٔ پنل
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  graceMonthsAfterExpiry?: number | null;
  /**
     * فیلد ۲۲۸: حداکثر تعداد طرح قابل انتخاب ۱ تا ۱۰
     * @minimum 1
     * @maximum 10
     * @nullable
     */
  maxPlansPerCompany?: number | null;
  /**
     * مهلت مجاز شدن معرفی پرسنل پس از انعقاد قرارداد (ماه) — نمونهٔ پنل
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  personnelIntroductionDelayMonths?: number | null;
  /**
     * فیلد ۲۲۷: دورهٔ انتظار معرفی به بانک ۰ تا ۱۸۰ روز
     * @minimum 0
     * @maximum 180
     * @nullable
     */
  waitingPeriodDays?: number | null;
  /**
     * فیلد ۱۹۷: درصد قابل استفاده ۰٫۱ تا ۱۰۰ با دو رقم اعشار. هر ردیف یک طرح؛ ردیف حذف‌شده غیرفعال می‌شود. null = تغییر نکند
     * @nullable
     */
  usableTable?: ReadModelsUsablePercentDto[] | null;
  /** @minLength 1 */
  rowVersion: string;
}

/**
 * ویرایش؛ برای فرد ردشده یعنی «اصلاح و ارسال دوباره» (وضعیت ← در انتظار تأیید مدیر).
 */
export interface UpdatePersonnelCommand {
  /**
     * @minLength 3
     * @maxLength 60
     * @pattern ^[؀-ۿ‌\s]+$
     */
  fullName: string;
  /**
     * @minLength 1
     * @pattern ^\d{10}$
     */
  nationalCode: string;
  /**
     * @minLength 1
     * @pattern ^09\d{9}$
     */
  mobile: string;
  /**
     * @minLength 1
     * @maxLength 20
     * @pattern ^[a-zA-Z0-9\-_]+$
     */
  personnelCode: string;
  hireDate: string;
  /**
     * @minimum 1
     * @maximum 999
     */
  priority?: number;
  /** @minLength 1 */
  rowVersion: string;
}

export interface UpdateReasonCommand {
  /**
     * @minLength 3
     * @maxLength 100
     */
  title: string;
  isActive?: boolean;
  /**
     * @minimum 0
     * @maximum 1000
     */
  sortOrder?: number;
}

export type ApprovalsManagerQueueParams = {
CompanyId?: number;
/**
 * null = فقط منتظر تصمیم؛ برای دیدن سابقه (تأییدشده/ردشده) وضعیت را بده.
 */
Status?: LoanRequestStatus;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type ApprovalsManagerDecideBody = {
  /**
     * فیلد ۱۷۴: انتخاب تکی یا همگانی
     * @minItems 1
     * @maxItems 500
     */
  RequestIds: number[];
  Decision: CommonDecisionType;
  /** فیلد ۱۷۸: در رد الزامی؛ از «دلایل رد درخواست وام» */
  ReasonId?: number;
  /**
     * فیلد ۲۵۱: تا ۱۰۰۰ حرف؛ در رد الزامی
     * @minLength 0
     * @maxLength 1000
     */
  Description?: string;
  PostStage?: PostApprovalStage;
  /** برای PostStage = RemoteGrantDenied الزامی؛ از «دلایل عدم اعطای تسهیلات غیرحضوری». */
  PostStageReasonId?: number;
  attachment?: Blob | File;
};

export type ApprovalsCreditQueueParams = {
CompanyId?: number;
/**
 * null = فقط منتظر تصمیم؛ برای دیدن سابقه (تأییدشده/ردشده) وضعیت را بده.
 */
Status?: LoanRequestStatus;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type ApprovalsCreditDecideBody = {
  /**
     * فیلد ۱۷۴: انتخاب تکی یا همگانی
     * @minItems 1
     * @maxItems 500
     */
  RequestIds: number[];
  Decision: CommonDecisionType;
  /** فیلد ۱۷۸: در رد الزامی؛ از «دلایل رد درخواست وام» */
  ReasonId?: number;
  /**
     * فیلد ۲۵۱: تا ۱۰۰۰ حرف؛ در رد الزامی
     * @minLength 0
     * @maxLength 1000
     */
  Description?: string;
  PostStage?: PostApprovalStage;
  /** برای PostStage = RemoteGrantDenied الزامی؛ از «دلایل عدم اعطای تسهیلات غیرحضوری». */
  PostStageReasonId?: number;
  attachment?: Blob | File;
};

export type BasicInfoSchemeSearchParams = {
/**
 * پیش‌فرض فقط طرح‌های فعال. غیرفعال‌ها را فقط کسی می‌بیند که اطلاعات پایه را ویرایش می‌کند.
 */
IncludeInactive?: boolean;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type BasicInfoSchemeReasonsParams = {
type?: ReasonType;
includeInactive?: boolean;
};

export type BasicInfoReasonsParams = {
type?: ReasonType;
includeInactive?: boolean;
};

export type ChangeLogsSearchParams = {
Category?: ChangeLogCategory;
CompanyId?: number;
PanelUserId?: number;
From?: string;
To?: string;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type ChangeLogsExportParams = {
Category?: ChangeLogCategory;
CompanyId?: number;
PanelUserId?: number;
From?: string;
To?: string;
/**
 * جستجوی متنی در عملیات و جزئیات؛ همان Term لیست.
 */
Term?: string;
};

export type CompaniesSearchParams = {
Status?: CompanyStatus;
/**
 * فقط برای ادمین/دیجیتال معنی دارد؛ برای کاربر شعبه نادیده گرفته می‌شود (دامنه‌اش ثابت است).
 * @minLength 0
 * @maxLength 50
 */
BranchCode?: string;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type CompaniesCreateBody = {
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  SchemeId: number;
  /**
     * فیلد ۲۱۷: ۳ تا ۱۰۰ حرف فارسی، فاصله و عدد
     * @minLength 3
     * @maxLength 100
     * @pattern ^[؀-ۿ‌\s0-9۰-۹]+$
     */
  Name: string;
  /**
     * فیلد ۲۱۸: شناسهٔ ملی دقیقاً ۱۱ رقم
     * @pattern ^\d{11}$
     */
  NationalId: string;
  /**
     * فیلد ۲۱۹: شمارهٔ تفاهم‌نامه ۳ تا ۵۰؛ حرف، عدد، / - .
     * @minLength 3
     * @maxLength 50
     * @pattern ^[\p{L}0-9/\-.]+$
     */
  AgreementNumber: string;
  /**
     * فیلد ۲۲۰: شمارهٔ حساب جاری ۸ تا ۲۴ رقم
     * @pattern ^\d{8,24}$
     */
  AccountNumber: string;
  /** فیلد ۲۲۱: تاریخ انعقاد قرارداد (شمسی ۱۴۰۰/۰۱/۰۱ تا ۱۴۵۰/۱۲/۲۹) */
  ContractDate: string;
  /** فیلد ۲۲۲: روز افتتاح حساب سپرده؛ روز ماهِ این تاریخ «روز مجاز انتقال اعتبار» است */
  AccountOpeningDate: string;
  /** فیلد ۲۳۱: دریافت حقوق پرسنل از بانک سپه */
  SalaryFromSepah?: boolean;
  /**
     * طرح‌های مندرج در تفاهم‌نامه؛ حداقل ۱ و حداکثر سقف اطلاعات پایه
     * @minItems 1
     */
  PlanIds: number[];
  /**
     * فقط ادمین/دیجیتال؛ برای کاربر شعبه از پروفایل خودش پر می‌شود.
     * @minLength 0
     * @maxLength 50
     */
  BranchCode?: string;
  agreementFile?: Blob | File;
};

export type CompaniesLookupParams = {
term?: string;
activeOnly?: boolean;
};

export type CompaniesUpdateBody = {
  /**
     * @minLength 3
     * @maxLength 100
     * @pattern ^[؀-ۿ‌\s0-9۰-۹]+$
     */
  Name: string;
  /**
     * @minLength 3
     * @maxLength 50
     * @pattern ^[\p{L}0-9/\-.]+$
     */
  AgreementNumber: string;
  /** @pattern ^\d{8,24}$ */
  AccountNumber: string;
  ContractDate: string;
  AccountOpeningDate: string;
  SalaryFromSepah?: boolean;
  /** @minItems 1 */
  PlanIds: number[];
  RowVersion: string;
  agreementFile?: Blob | File;
};

export type CompaniesCancelContractBody = {
  /** فیلد ۲۳۵: از ۱۴۰۵/۰۱/۰۱ تا امروز */
  CancelDate: string;
  /**
     * فیلد ۲۳۶: از «دلایل لغو قرارداد» اطلاعات پایه
     * @minimum 1
     * @maximum 2147483647
     */
  ReasonId: number;
  /**
     * فیلد ۲۳۷: ۵ تا ۱۰۰۰ حرف
     * @minLength 5
     * @maxLength 1000
     */
  Description: string;
  letterFile: Blob | File;
};

export type CompaniesBalancesSaveBody = {
  /**
     * @minItems 1
     * @maxItems 24
     */
  Months: ReadModelsMonthlyBalanceInput[];
  RowVersion: string;
  /**
     * نوع مستند از فهرست همین طرح (ReasonType.DocumentType). اگر مبلغی عوض شود الزامی است.
     * @minimum 1
     * @maximum 2147483647
     */
  DocumentTypeId?: number;
  /**
     * توضیح مستند، تا ۵۰۰ حرف.
     * @minLength 0
     * @maxLength 500
     */
  DocumentDescription?: string;
  files?: (Blob | File)[];
};

export type CompaniesBalanceDocumentsParams = {
month?: string;
};

export type CompaniesBalanceDocumentsUploadBody = {
  /** @pattern ^\d{4}/\d{2}$ */
  Month?: string;
  /**
     * فیلد ۲۶۱: نوع مستند از اطلاعات پایه (ReasonType.DocumentType)
     * @minimum 1
     * @maximum 2147483647
     */
  DocumentTypeId: number;
  /**
     * فیلد ۲۰۱: تا ۵۰۰ حرف
     * @minLength 0
     * @maxLength 500
     */
  Description?: string;
  files?: (Blob | File)[];
};

export type DashboardGetParams = {
From?: string;
To?: string;
CompanyId?: number;
/**
 * @minLength 0
 * @maxLength 50
 */
BranchCode?: string;
};

export type DashboardRankingParams = {
/**
 * @pattern ^\d{4}/\d{2}$
 */
Month?: string;
SortBy?: ReadModelsCompanyRankingSort;
/**
 * @minimum 1
 * @maximum 500
 */
Top?: number;
};

export type LoansCreditParams = {
baseDate?: string;
};

export type LoansSearchParams = {
/**
 * «درخواست‌های وام این شرکت» در تب تخصیص وام
 */
CompanyId?: number;
/**
 * @minLength 0
 * @maxLength 50
 */
BranchCode?: string;
Status?: LoanRequestStatus;
PlanId?: number;
From?: string;
To?: string;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type PersonnelSearchParams = {
Status?: PersonnelStatus;
HireDateFrom?: string;
HireDateTo?: string;
/**
 * فقط پرسنل تأییدشده‌ای که هنوز درخواست وام فعال ندارند (فرم تخصیص وام).
 */
OnlyAvailableForLoan?: boolean;
/**
 * @minLength 0
 * @maxLength 50
 */
Term?: string;
/**
 * @minimum 1
 * @maximum 2147483647
 */
Page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
PageSize?: number;
};

export type PersonnelDeleteBody = {
  /**
     * @minLength 5
     * @maxLength 500
     */
  Description: string;
  file: Blob | File;
};

export type PersonnelImportBody = {
  file: Blob | File;
};

