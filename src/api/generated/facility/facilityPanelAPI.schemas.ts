/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
export interface ReadModelsLoanRequestItemInput {
  /** @minimum 1 */
  personnelId: number;
  /**
     * @minimum 10000000
     * @maximum 4000000000
     * @nullable
     */
  amount?: number | null;
  /**
     * @minimum 1
     * @maximum 9999
     * @nullable
     */
  paymentOrder?: number | null;
}

export interface AddLoanBatchMemberCommand {
  item: ReadModelsLoanRequestItemInput;
}

export type AllocationMode = typeof AllocationMode[keyof typeof AllocationMode];


export const AllocationMode = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

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

export type ChangeLogCategory = typeof ChangeLogCategory[keyof typeof ChangeLogCategory];


export const ChangeLogCategory = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

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
  canRestore?: boolean;
  /** @nullable */
  restoredAt?: string | null;
}

export interface ReadModelsSkippedRequestDto {
  requestId?: number;
  reason?: string;
}

export interface CommandResponsesDecisionResultDto {
  processed?: number;
  skipped?: ReadModelsSkippedRequestDto[];
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

export interface CommonStoredFileDto {
  id?: number;
  fileName?: string;
  size?: number;
  uploadedAt?: string;
  uploadedBy?: string;
}

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

export interface CommandResponsesLoanBatchDto {
  batchId?: number;
  companyId?: number;
  planId?: number;
  mode?: AllocationMode;
  total?: number;
  requests?: CommandResponsesLoanRequestListItemDto[];
}

export type CommonDecisionType = typeof CommonDecisionType[keyof typeof CommonDecisionType];


export const CommonDecisionType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export interface CommonEnumValueDto {
  value?: number;
  name?: string;
  title?: string;
  requiresReason?: boolean;
}

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

export interface CommonFacilityLookupItemDto {
  id?: string;
  title?: string;
}

export interface CommonFacilityPagedResponseOfChangeLogItemDto {
  items?: CommandResponsesChangeLogItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export type CompanyStatus = typeof CompanyStatus[keyof typeof CompanyStatus];


export const CompanyStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
} as const;

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

export interface CommonFacilityPagedResponseOfLoanRequestListItemDto {
  items?: CommandResponsesLoanRequestListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
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
  isLocked?: boolean;
}

export interface CommonFacilityPagedResponseOfPersonnelListItemDto {
  items?: ReadModelsPersonnelListItemDto[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

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

export type ContractType = typeof ContractType[keyof typeof ContractType];


export const ContractType = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export interface CreateLoanRequestsCommand {
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  planId: number;
  baseDate: string;
  mode: AllocationMode;
  /**
     * @minimum 10000000
     * @maximum 4000000000
     * @nullable
     */
  amount?: number | null;
  /**
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

export interface CreateReasonCommand {
  type: ReasonType;
  /**
     * @minLength 3
     * @maxLength 100
     */
  title: string;
}

export interface DecideLoanRequestsCommand {
  /**
     * @minItems 1
     * @maxItems 500
     */
  requestIds: number[];
  decision: CommonDecisionType;
  /** @nullable */
  reasonId?: number | null;
  /**
     * @minLength 0
     * @maxLength 1000
     * @nullable
     */
  description?: string | null;
  postStage?: PostApprovalStage;
  /** @nullable */
  postStageReasonId?: number | null;
}

export interface DecidePersonnelCommand {
  /**
     * @minItems 1
     * @maxItems 500
     */
  personnelIds: number[];
  decision: CommonDecisionType;
  /** @nullable */
  reasonId?: number | null;
  /**
     * @minLength 0
     * @maxLength 1000
     * @nullable
     */
  description?: string | null;
}

export interface DeleteCompanyCommand {
  /**
     * @minLength 5
     * @maxLength 500
     */
  description: string;
}

export type EligibilityStatus = typeof EligibilityStatus[keyof typeof EligibilityStatus];


export const EligibilityStatus = {
  NUMBER_1: 1,
  NUMBER_2: 2,
  NUMBER_3: 3,
  NUMBER_4: 4,
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
  usableTable?: ReadModelsUsablePercentDto[];
  rowVersion?: string;
  digitalApprovalEnabled?: boolean;
}

export interface FacilityBaseMessageResponseOfBasicInfoDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsBasicInfoDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfBoolean {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: boolean;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfChangeLogItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommandResponsesChangeLogItemDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsMonthlyBalanceDto {
  month?: string;
  /** @nullable */
  averageBalance?: number | null;
  /** @nullable */
  remainingCredit?: number | null;
  documentCount?: number;
  hasDocuments?: boolean;
  lastEditedBy?: CommonRegistrarDto;
  /** @nullable */
  lastEditedAt?: string | null;
  usedCredit?: number;
}

export interface ReadModelsCompanyBalancesDto {
  companyId?: number;
  months?: ReadModelsMonthlyBalanceDto[];
  rowVersion?: string;
}

export interface FacilityBaseMessageResponseOfCompanyBalancesDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsCompanyBalancesDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsEligibilityBannerDto {
  status?: EligibilityStatus;
  message?: string;
  /** @nullable */
  allowedDayOfMonth?: number | null;
  canRegisterLoan?: boolean;
  messages?: string[];
}

export interface ReadModelsPlanCreditDto {
  planId?: number;
  title?: string;
  contractType?: string;
  rate?: number;
  termMonths?: number;
  shareOfAverage?: number;
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
  totalAverageBase?: number;
  /** @nullable */
  currentMonthAverage?: number | null;
  plans?: ReadModelsPlanCreditDto[];
  baseDateDefault?: string;
  baseDateMin?: string;
  baseDateMax?: string;
}

export interface FacilityBaseMessageResponseOfCompanyCreditDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsCompanyCreditDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsPlanRefDto {
  planId?: number;
  title?: string;
}

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

export interface FacilityBaseMessageResponseOfCompanyDetailsDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsCompanyDetailsDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsCompanySearchResultDto {
  page?: CommonFacilityPagedResponseOfCompanyListItemDto;
  activeCount?: number;
  registeredCount?: number;
}

export interface FacilityBaseMessageResponseOfCompanySearchResultDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsCompanySearchResultDto;
  readonly isSuccess?: boolean;
}

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

export type ReadModelsDashboardGroupKind = typeof ReadModelsDashboardGroupKind[keyof typeof ReadModelsDashboardGroupKind];


export const ReadModelsDashboardGroupKind = {
  NUMBER_1: 1,
  NUMBER_2: 2,
} as const;

export interface ReadModelsContractsByMonthDto {
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
  /** @nullable */
  approvalRate?: number | null;
  removalKind?: CompanyStatus;
}

export interface ReadModelsDashboardDto {
  kpis?: ReadModelsDashboardKpisDto;
  requestStatus?: ReadModelsRequestStatusChartDto;
  planShare?: ReadModelsPlanShareDto[];
  creditVsAllocated?: ReadModelsCreditVsAllocatedDto[];
  creditVsAllocatedGroupKind?: ReadModelsDashboardGroupKind;
  contractsByMonth?: ReadModelsContractsByMonthDto[];
  monthlyAllocation?: ReadModelsMonthlyAllocationDto[];
  removedCompanies?: ReadModelsRemovedCompanyDto[];
}

export interface FacilityBaseMessageResponseOfDashboardDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsDashboardDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfDecisionResultDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommandResponsesDecisionResultDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfEnumCatalogDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommonEnumCatalogDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfFacilityPagedResponseOfChangeLogItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommonFacilityPagedResponseOfChangeLogItemDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfFacilityPagedResponseOfLoanRequestListItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommonFacilityPagedResponseOfLoanRequestListItemDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfFacilityPagedResponseOfPersonnelListItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommonFacilityPagedResponseOfPersonnelListItemDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfFacilityPagedResponseOfSchemeListItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommonFacilityPagedResponseOfSchemeListItemDto;
  readonly isSuccess?: boolean;
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

export interface FacilityBaseMessageResponseOfIReadOnlyListOfBalanceDocumentDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: ReadModelsBalanceDocumentDto[] | null;
  readonly isSuccess?: boolean;
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

export interface FacilityBaseMessageResponseOfIReadOnlyListOfCompanyRankingDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: ReadModelsCompanyRankingDto[] | null;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfIReadOnlyListOfFacilityLookupItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: CommonFacilityLookupItemDto[] | null;
  readonly isSuccess?: boolean;
}

export interface ReadModelsMonthOptionDto {
  key?: string;
  title?: string;
}

export interface FacilityBaseMessageResponseOfIReadOnlyListOfMonthOptionDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: ReadModelsMonthOptionDto[] | null;
  readonly isSuccess?: boolean;
}

export interface ReadModelsReasonDto {
  id?: number;
  type?: ReasonType;
  title?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface FacilityBaseMessageResponseOfIReadOnlyListOfReasonDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: ReadModelsReasonDto[] | null;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfIReadOnlyListOfRegistrarDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: CommonRegistrarDto[] | null;
  readonly isSuccess?: boolean;
}

export interface ReadModelsSchemeDto {
  id?: number;
  code?: string;
  title?: string;
  isActive?: boolean;
}

export interface FacilityBaseMessageResponseOfIReadOnlyListOfSchemeDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  /** @nullable */
  data?: ReadModelsSchemeDto[] | null;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfInt32 {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: number;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfLoanBatchDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommandResponsesLoanBatchDto;
  readonly isSuccess?: boolean;
}

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

export interface FacilityBaseMessageResponseOfLoanRequestDetailsDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsLoanRequestDetailsDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfLoanRequestListItemDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: CommandResponsesLoanRequestListItemDto;
  readonly isSuccess?: boolean;
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
  personnelId?: number;
  personnelName?: string;
  personnelCode?: string;
  month?: string;
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
  messages?: ReadModelsHintDto[];
  repeatAllocations?: ReadModelsRepeatAllocationDto[];
}

export interface FacilityBaseMessageResponseOfLoanRequestPreviewDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsLoanRequestPreviewDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfObject {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: unknown;
  readonly isSuccess?: boolean;
}

export interface ReadModelsPendingCountsDto {
  /** @nullable */
  personnelApproval?: number | null;
  /** @nullable */
  managerApproval?: number | null;
  /** @nullable */
  creditApproval?: number | null;
  /** @nullable */
  digitalApproval?: number | null;
}

export interface FacilityBaseMessageResponseOfPendingCountsDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsPendingCountsDto;
  readonly isSuccess?: boolean;
}

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

export interface FacilityBaseMessageResponseOfPersonnelDetailsDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsPersonnelDetailsDto;
  readonly isSuccess?: boolean;
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

export interface FacilityBaseMessageResponseOfPersonnelImportResultDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsPersonnelImportResultDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsPlanDto {
  id?: number;
  contractType?: ContractType;
  rate?: number;
  termMonths?: number;
  usablePercent?: number;
  title?: string;
}

export interface ReadModelsPlanListDto {
  maxPlansPerCompany?: number;
  plans?: ReadModelsPlanDto[];
}

export interface FacilityBaseMessageResponseOfPlanListDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsPlanListDto;
  readonly isSuccess?: boolean;
}

export interface FacilityBaseMessageResponseOfReasonDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsReasonDto;
  readonly isSuccess?: boolean;
}

export interface ReadModelsSchemeReasonsDto {
  contractCancel?: ReadModelsReasonDto[];
  loanReject?: ReadModelsReasonDto[];
  remoteGrantDenied?: ReadModelsReasonDto[];
  documentType?: ReadModelsReasonDto[];
  loanCancel?: ReadModelsReasonDto[];
  personnelReject?: ReadModelsReasonDto[];
}

export interface ReadModelsSchemeFormDto {
  id?: number;
  code?: string;
  title?: string;
  isActive?: boolean;
  settings?: ReadModelsBasicInfoDto;
  reasons?: ReadModelsSchemeReasonsDto;
  companyCount?: number;
}

export interface FacilityBaseMessageResponseOfSchemeFormDto {
  statusCode?: number;
  /** @nullable */
  message?: string | null;
  data?: ReadModelsSchemeFormDto;
  readonly isSuccess?: boolean;
}

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
     * @minimum 1
     * @maximum 999999999999999
     * @nullable
     */
  averageBalance?: number | null;
}

export interface RestoreChangeCommand {
  /**
     * @minLength 5
     * @maxLength 500
     */
  description: string;
}

export interface SaveSchemeCommand {
  /**
     * @minLength 3
     * @maxLength 100
     */
  title: string;
  /**
     * @minLength 2
     * @maxLength 30
     * @nullable
     */
  code?: string | null;
  isActive?: boolean;
  /**
     * @minItems 1
     * @maxItems 2
     * @nullable
     */
  contractTypes?: ContractType[] | null;
  /**
     * @minimum 0
     * @maximum 4
     * @nullable
     */
  qardHasanRate?: number | null;
  /**
     * @maxItems 5
     * @nullable
     */
  murabahaRates?: number[] | null;
  /**
     * @maxItems 20
     * @nullable
     */
  repaymentTermsMonths?: number[] | null;
  /**
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
     * @minimum 1
     * @maximum 120
     * @nullable
     */
  contractDurationMonths?: number | null;
  /**
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  graceMonthsAfterExpiry?: number | null;
  /**
     * @minimum 1
     * @maximum 10
     * @nullable
     */
  maxPlansPerCompany?: number | null;
  /**
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
  /** @nullable */
  digitalApprovalEnabled?: boolean | null;
  /** @nullable */
  usableTable?: ReadModelsUsablePercentDto[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  contractCancelReasons?: string[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  loanRejectReasons?: string[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  remoteGrantDeniedReasons?: string[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  documentTypes?: string[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  loanCancelReasons?: string[] | null;
  /**
     * @maxItems 100
     * @nullable
     */
  personnelRejectReasons?: string[] | null;
  /** @nullable */
  rowVersion?: string | null;
}

export interface SetPostApprovalStageCommand {
  stage: PostApprovalStage;
  /** @nullable */
  reasonId?: number | null;
  /**
     * @minLength 0
     * @maxLength 1000
     * @nullable
     */
  description?: string | null;
}

export interface UpdateBasicInfoCommand {
  /**
     * @minItems 1
     * @maxItems 2
     * @nullable
     */
  contractTypes?: ContractType[] | null;
  /**
     * @minimum 0
     * @maximum 4
     * @nullable
     */
  qardHasanRate?: number | null;
  /**
     * @maxItems 5
     * @nullable
     */
  murabahaRates?: number[] | null;
  /**
     * @maxItems 20
     * @nullable
     */
  repaymentTermsMonths?: number[] | null;
  /**
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
     * @minimum 1
     * @maximum 120
     * @nullable
     */
  contractDurationMonths?: number | null;
  /**
     * @minimum 0
     * @maximum 120
     * @nullable
     */
  graceMonthsAfterExpiry?: number | null;
  /**
     * @minimum 1
     * @maximum 10
     * @nullable
     */
  maxPlansPerCompany?: number | null;
  /**
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
  /** @nullable */
  digitalApprovalEnabled?: boolean | null;
  /** @nullable */
  usableTable?: ReadModelsUsablePercentDto[] | null;
  /** @minLength 1 */
  rowVersion: string;
}

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

export type ApprovalsCreditQueueParams = {
CompanyId?: number;
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
     * @minItems 1
     * @maxItems 500
     */
  RequestIds: number[];
  Decision: CommonDecisionType;
  ReasonId?: number;
  /**
     * @minLength 0
     * @maxLength 1000
     */
  Description?: string;
  PostStage?: PostApprovalStage;
  PostStageReasonId?: number;
  attachment?: Blob | File;
};

export type ApprovalsDigitalQueueParams = {
CompanyId?: number;
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

export type ApprovalsDigitalDecideBody = {
  /**
     * @minItems 1
     * @maxItems 500
     */
  RequestIds: number[];
  Decision: CommonDecisionType;
  ReasonId?: number;
  /**
     * @minLength 0
     * @maxLength 1000
     */
  Description?: string;
  PostStage?: PostApprovalStage;
  PostStageReasonId?: number;
  attachment?: Blob | File;
};

export type BasicInfoSchemeSearchParams = {
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
Term?: string;
};

export type CompaniesSearchParams = {
Status?: CompanyStatus;
/**
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
     * @minLength 3
     * @maxLength 100
     * @pattern ^[؀-ۿ‌\s0-9۰-۹]+$
     */
  Name: string;
  /** @pattern ^\d{11}$ */
  NationalId: string;
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
  /**
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
  CancelDate: string;
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  ReasonId: number;
  /**
     * @minLength 5
     * @maxLength 1000
     */
  Description: string;
  letterFile?: Blob | File;
};

export type CompaniesBalancesSaveBody = {
  /**
     * @minItems 1
     * @maxItems 24
     */
  Months: ReadModelsMonthlyBalanceInput[];
  RowVersion: string;
  /**
     * @minimum 1
     * @maximum 2147483647
     */
  DocumentTypeId?: number;
  /**
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
     * @minimum 1
     * @maximum 2147483647
     */
  DocumentTypeId: number;
  /**
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

export type InternalCompanyLookupParams = {
term?: string;
};

export type LoansCreditParams = {
baseDate?: string;
};

export type LoansSearchParams = {
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
  file?: Blob | File;
};

export type PersonnelImportBody = {
  file?: Blob | File;
};

