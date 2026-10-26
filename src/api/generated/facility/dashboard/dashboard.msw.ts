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
  CommonFileLinkDto,
  ReadModelsCompanyRankingDto,
  ReadModelsDashboardDto,
  ReadModelsMonthOptionDto
} from '../facilityPanelAPI.schemas';


export const getDashboardGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsDashboardDto, object>> = {}): ReadModelsDashboardDto => ({kpis: {activeCompanies: faker.number.int(), totalRequests: faker.number.int(), approvedAmount: faker.number.int(), pendingAmount: faker.number.int()}, requestStatus: {approved: faker.number.int(), pending: faker.number.int(), rejected: faker.number.int()}, planShare: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), planTitle: faker.string.alpha({length: {min: 10, max: 20}}), requestCount: faker.number.int()})), creditVsAllocated: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({groupId: faker.string.alpha({length: {min: 10, max: 20}}), groupTitle: faker.string.alpha({length: {min: 10, max: 20}}), createdCredit: faker.number.int(), allocated: faker.number.int()})), creditVsAllocatedGroupKind: faker.helpers.arrayElement([1,2] as const), contractsByMonth: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({month: faker.string.alpha({length: {min: 10, max: 20}}), companyCount: faker.number.int(), companyNames: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.string.alpha({length: {min: 10, max: 20}})))})), monthlyAllocation: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), amountByMonth: {
        [faker.string.alphanumeric(5)]: faker.number.int()
      }})), removedCompanies: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), removedAt: faker.date.past().toISOString().slice(0, 10), averageBalance: faker.helpers.arrayElement([faker.number.int(), null]), allocatedTotal: faker.number.int(), requestCount: faker.number.int(), approvalRate: faker.helpers.arrayElement([faker.number.float({fractionDigits: 2}), null]), removalKind: faker.helpers.arrayElement([1,2,3,4] as const)})), ...overrideResponse})

export const getDashboardRankingResponseMock = (): ReadModelsCompanyRankingDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({rank: faker.number.int(), companyId: faker.number.int(), companyName: faker.string.alpha({length: {min: 10, max: 20}}), averageBalance: faker.helpers.arrayElement([faker.number.int(), null]), allocatedAmount: faker.number.int(), requestCount: faker.number.int(), personnelCount: faker.number.int(), status: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getDashboardMonthsResponseMock = (): ReadModelsMonthOptionDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({key: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getDashboardExportResponseMock = (overrideResponse: Partial<Extract<CommonFileLinkDto, object>> = {}): CommonFileLinkDto => ({url: faker.string.alpha({length: {min: 10, max: 20}}), fileName: faker.string.alpha({length: {min: 10, max: 20}}), contentType: faker.string.alpha({length: {min: 10, max: 20}}), expiresAt: faker.date.past().toISOString().slice(0, 19) + 'Z', ...overrideResponse})


export const getDashboardGetMockHandler = (overrideResponse?: ReadModelsDashboardDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsDashboardDto> | ReadModelsDashboardDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Dashboard', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getDashboardGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getDashboardRankingMockHandler = (overrideResponse?: ReadModelsCompanyRankingDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsCompanyRankingDto[] | null> | ReadModelsCompanyRankingDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Dashboard/CompanyRanking', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getDashboardRankingResponseMock(),
      { status: 200
      })
  }, options)
}

export const getDashboardMonthsMockHandler = (overrideResponse?: ReadModelsMonthOptionDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsMonthOptionDto[] | null> | ReadModelsMonthOptionDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Dashboard/Months', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getDashboardMonthsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getDashboardExportMockHandler = (overrideResponse?: CommonFileLinkDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFileLinkDto> | CommonFileLinkDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Dashboard/Exports/:report', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getDashboardExportResponseMock(),
      { status: 200
      })
  }, options)
}
export const getDashboardMock = () => [
  getDashboardGetMockHandler(),
  getDashboardRankingMockHandler(),
  getDashboardMonthsMockHandler(),
  getDashboardExportMockHandler()
]
