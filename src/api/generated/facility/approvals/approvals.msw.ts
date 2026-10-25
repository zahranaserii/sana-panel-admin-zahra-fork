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
  CommandResponsesDecisionResultDto,
  CommandResponsesLoanRequestListItemDto,
  CommonFacilityPagedResponseOfLoanRequestListItemDto,
  ReadModelsPendingCountsDto
} from '../facilityPanelAPI.schemas';


export const getApprovalsManagerQueueResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfLoanRequestListItemDto, object>> = {}): CommonFacilityPagedResponseOfLoanRequestListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}))})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getApprovalsManagerDecideResponseMock = (overrideResponse: Partial<Extract<CommandResponsesDecisionResultDto, object>> = {}): CommandResponsesDecisionResultDto => ({processed: faker.number.int(), skipped: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({requestId: faker.number.int(), reason: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getApprovalsCreditQueueResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfLoanRequestListItemDto, object>> = {}): CommonFacilityPagedResponseOfLoanRequestListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}))})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getApprovalsCreditDecideResponseMock = (overrideResponse: Partial<Extract<CommandResponsesDecisionResultDto, object>> = {}): CommandResponsesDecisionResultDto => ({processed: faker.number.int(), skipped: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({requestId: faker.number.int(), reason: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getApprovalsPostStageResponseMock = (overrideResponse: Partial<Extract<CommandResponsesLoanRequestListItemDto, object>> = {}): CommandResponsesLoanRequestListItemDto => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getApprovalsDigitalQueueResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfLoanRequestListItemDto, object>> = {}): CommonFacilityPagedResponseOfLoanRequestListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), batchId: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), personnelId: faker.number.int(), personnelName: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), amount: faker.number.int(), paymentOrder: faker.number.int(), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), status: faker.helpers.arrayElement([1,2,3,4,5,6,7,8] as const), postStage: faker.helpers.arrayElement([1,2,3,4] as const), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentCount: faker.number.int(), canCancel: faker.datatype.boolean(), documents: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}))})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getApprovalsDigitalDecideResponseMock = (overrideResponse: Partial<Extract<CommandResponsesDecisionResultDto, object>> = {}): CommandResponsesDecisionResultDto => ({processed: faker.number.int(), skipped: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({requestId: faker.number.int(), reason: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getApprovalsPendingCountsResponseMock = (overrideResponse: Partial<Extract<ReadModelsPendingCountsDto, object>> = {}): ReadModelsPendingCountsDto => ({personnelApproval: faker.helpers.arrayElement([faker.number.int(), null]), managerApproval: faker.helpers.arrayElement([faker.number.int(), null]), creditApproval: faker.helpers.arrayElement([faker.number.int(), null]), digitalApproval: faker.helpers.arrayElement([faker.number.int(), null]), ...overrideResponse})


export const getApprovalsManagerQueueMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfLoanRequestListItemDto> | CommonFacilityPagedResponseOfLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/ManagerApprovals', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsManagerQueueResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsManagerDecideMockHandler = (overrideResponse?: CommandResponsesDecisionResultDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesDecisionResultDto> | CommandResponsesDecisionResultDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/ManagerApprovals/Decisions', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsManagerDecideResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsCreditQueueMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfLoanRequestListItemDto> | CommonFacilityPagedResponseOfLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/CreditApprovals', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsCreditQueueResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsCreditDecideMockHandler = (overrideResponse?: CommandResponsesDecisionResultDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesDecisionResultDto> | CommandResponsesDecisionResultDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/CreditApprovals/Decisions', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsCreditDecideResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsPostStageMockHandler = (overrideResponse?: CommandResponsesLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<CommandResponsesLoanRequestListItemDto> | CommandResponsesLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/CreditApprovals/:requestId/PostApprovalStage', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsPostStageResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsDigitalQueueMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfLoanRequestListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfLoanRequestListItemDto> | CommonFacilityPagedResponseOfLoanRequestListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/DigitalApprovals', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsDigitalQueueResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsDigitalDecideMockHandler = (overrideResponse?: CommandResponsesDecisionResultDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesDecisionResultDto> | CommandResponsesDecisionResultDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/DigitalApprovals/Decisions', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsDigitalDecideResponseMock(),
      { status: 200
      })
  }, options)
}

export const getApprovalsPendingCountsMockHandler = (overrideResponse?: ReadModelsPendingCountsDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsPendingCountsDto> | ReadModelsPendingCountsDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Approvals/PendingCounts', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getApprovalsPendingCountsResponseMock(),
      { status: 200
      })
  }, options)
}
export const getApprovalsMock = () => [
  getApprovalsManagerQueueMockHandler(),
  getApprovalsManagerDecideMockHandler(),
  getApprovalsCreditQueueMockHandler(),
  getApprovalsCreditDecideMockHandler(),
  getApprovalsPostStageMockHandler(),
  getApprovalsDigitalQueueMockHandler(),
  getApprovalsDigitalDecideMockHandler(),
  getApprovalsPendingCountsMockHandler()
]
