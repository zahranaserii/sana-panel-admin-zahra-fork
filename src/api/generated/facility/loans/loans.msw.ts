/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  faker
} from '@faker-js/faker/locale/fa';

import {
  delay,
  http
} from 'msw';
import type {
  RequestHandlerOptions
} from 'msw';
import { json } from '@/test/msw/utils';

import type {
  CommandResponsesLoanBatchDto,
  CommandResponsesLoanRequestListItemDto,
  CommonFacilityPagedResponseOfLoanRequestListItemDto,
  CommonFileLinkDto,
  ReadModelsCompanyCreditDto,
  ReadModelsLoanRequestDetailsDto,
  ReadModelsLoanRequestPreviewDto
} from '../facilityPanelAPI.schemas';


export const getLoansCreditResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyCreditDto, object>> = {}): ReadModelsCompanyCreditDto => ({companyId: faker.number.int(), baseDate: faker.date.past().toISOString().slice(0, 10), banner: {status: faker.helpers.arrayElement([1,2,3,4] as const), message: faker.string.alpha({length: {min: 10, max: 20}}), allowedDayOfMonth: faker.helpers.arrayElement([faker.number.int(), null]), canRegisterLoan: faker.datatype.boolean(), messages: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.string.alpha({length: {min: 10, max: 20}})))}, monthRemainingCredit: faker.number.int(), totalAverageBase: faker.number.int(), currentMonthAverage: faker.helpers.arrayElement([faker.number.int(), null]), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}}), contractType: faker.string.alpha({length: {min: 10, max: 20}}), rate: faker.number.float({fractionDigits: 2}), termMonths: faker.number.int(), shareOfAverage: faker.number.int(), usablePercent: faker.number.float({fractionDigits: 2}), createdCredit: faker.number.int(), allocated: faker.number.int(), remainingThisMonth: faker.number.int()})), baseDateDefault: faker.date.past().toISOString().slice(0, 10), baseDateMin: faker.date.past().toISOString().slice(0, 10), baseDateMax: faker.date.past().toISOString().slice(0, 10), ...overrideResponse})

export const getLoansPreviewResponseMock = (overrideResponse: Partial<Extract<ReadModelsLoanRequestPreviewDto, object>> = {}): ReadModelsLoanRequestPreviewDto => ({selectedCount: faker.number.int(), total: faker.number.int(), remainingCredit: faker.number.int(), isAllowed: faker.datatype.boolean(), maxCoverablePeople: faker.helpers.arrayElement([faker.number.int(), null]), suggestedMaxAmount: faker.helpers.arrayElement([faker.number.int(), null]), messages: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({level: faker.helpers.arrayElement([1,2,3,4] as const), text: faker.string.alpha({length: {min: 10, max: 20}})})), repeatAllocations: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), month: faker.string.alpha({length: {min: 10, max: 20}}), previousAmount: faker.number.int()})), ...overrideResponse})

export const getLoansCreateResponseMock = (overrideResponse: Partial<Extract<CommandResponsesLoanBatchDto, object>> = {}): CommandResponsesLoanBatchDto => ({batchId: faker.number.int(), companyId: faker.number.int(), planId: faker.number.int(), mode: faker.helpers.arrayElement([1,2] as const), total: faker.number.int(), requests: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int()})), ...overrideResponse})

export const getLoansSearchResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfLoanRequestListItemDto, object>> = {}): CommonFacilityPagedResponseOfLoanRequestListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int()})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getLoansGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsLoanRequestDetailsDto, object>> = {}): ReadModelsLoanRequestDetailsDto => ({summary: {id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int()}, registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, history: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({from: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), to: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), stage: faker.helpers.arrayElement([1,2,3,4] as const), reason: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), by: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, at: faker.date.past().toISOString().slice(0, 19) + 'Z'})), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getLoansAddMemberResponseMock = (overrideResponse: Partial<Extract<CommandResponsesLoanBatchDto, object>> = {}): CommandResponsesLoanBatchDto => ({batchId: faker.number.int(), companyId: faker.number.int(), planId: faker.number.int(), mode: faker.helpers.arrayElement([1,2] as const), total: faker.number.int(), requests: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int()})), ...overrideResponse})

export const getLoansRemoveMemberResponseMock = (overrideResponse: Partial<Extract<CommandResponsesLoanBatchDto, object>> = {}): CommandResponsesLoanBatchDto => ({batchId: faker.number.int(), companyId: faker.number.int(), planId: faker.number.int(), mode: faker.helpers.arrayElement([1,2] as const), total: faker.number.int(), requests: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int()})), ...overrideResponse})

export const getLoansDocumentDownloadResponseMock = (overrideResponse: Partial<Extract<CommonFileLinkDto, object>> = {}): CommonFileLinkDto => ({url: faker.string.alpha({length: {min: 10, max: 20}}), fileName: faker.string.alpha({length: {min: 10, max: 20}}), contentType: faker.string.alpha({length: {min: 10, max: 20}}), expiresAt: faker.date.past().toISOString().slice(0, 19) + 'Z', ...overrideResponse})

export const getLoansCancelResponseMock = (overrideResponse: Partial<Extract<CommandResponsesLoanRequestListItemDto, object>> = {}): CommandResponsesLoanRequestListItemDto => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), schemeId: faker.number.int(), ...overrideResponse})


export const getLoansCreditMockHandler = (overrideResponse?: ReadModelsCompanyCreditDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsCompanyCreditDto> | ReadModelsCompanyCreditDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:companyId/Credit', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansCreditResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansPreviewMockHandler = (overrideResponse?: ReadModelsLoanRequestPreviewDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsLoanRequestPreviewDto> | ReadModelsLoanRequestPreviewDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/Companies/:companyId/LoanRequests/Preview', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansPreviewResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansCreateMockHandler = (overrideResponse?: CommandResponsesLoanBatchDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesLoanBatchDto> | CommandResponsesLoanBatchDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/Companies/:companyId/LoanRequests', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansCreateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansSearchMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfLoanRequestListItemDto> | CommonFacilityPagedResponseOfLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/LoanRequests', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansSearchResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansGetMockHandler = (overrideResponse?: ReadModelsLoanRequestDetailsDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsLoanRequestDetailsDto> | ReadModelsLoanRequestDetailsDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/LoanRequests/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansAddMemberMockHandler = (overrideResponse?: CommandResponsesLoanBatchDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesLoanBatchDto> | CommandResponsesLoanBatchDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/LoanBatches/:batchId/Members', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansAddMemberResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansRemoveMemberMockHandler = (overrideResponse?: CommandResponsesLoanBatchDto | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<CommandResponsesLoanBatchDto> | CommandResponsesLoanBatchDto), options?: RequestHandlerOptions) => {
  return http.delete('*/facility-management/LoanBatches/:batchId/Members/:requestId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansRemoveMemberResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansDocumentDownloadMockHandler = (overrideResponse?: CommonFileLinkDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFileLinkDto> | CommonFileLinkDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/LoanRequests/:id/Documents/:fileId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansDocumentDownloadResponseMock(),
      { status: 200
      })
  }, options)
}

export const getLoansCancelMockHandler = (overrideResponse?: CommandResponsesLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesLoanRequestListItemDto> | CommandResponsesLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/LoanRequests/:id/Cancel', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLoansCancelResponseMock(),
      { status: 200
      })
  }, options)
}
export const getLoansMock = () => [
  getLoansCreditMockHandler(),
  getLoansPreviewMockHandler(),
  getLoansCreateMockHandler(),
  getLoansSearchMockHandler(),
  getLoansGetMockHandler(),
  getLoansAddMemberMockHandler(),
  getLoansRemoveMemberMockHandler(),
  getLoansDocumentDownloadMockHandler(),
  getLoansCancelMockHandler()
]
