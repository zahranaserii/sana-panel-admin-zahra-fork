/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  faker
} from '@faker-js/faker/locale/fa';

import {
  HttpResponse,
  delay,
  http
} from 'msw';
import type {
  RequestHandlerOptions
} from 'msw';
import { json } from '@/test/msw/utils';

import type {
  CommonFacilityPagedResponseOfPersonnelListItemDto,
  ReadModelsPersonnelDetailsDto,
  ReadModelsPersonnelImportResultDto
} from '../facilityPanelAPI.schemas';


export const getPersonnelSearchResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfPersonnelListItemDto, object>> = {}): CommonFacilityPagedResponseOfPersonnelListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), priority: faker.number.int(), fullName: faker.string.alpha({length: {min: 10, max: 20}}), nationalCode: faker.string.alpha({length: {min: 10, max: 20}}), mobile: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), hireDate: faker.date.past().toISOString().slice(0, 10), status: faker.helpers.arrayElement([1,2,3,4] as const), rejectReason: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', decidedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, isLocked: faker.datatype.boolean()})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getPersonnelCreateResponseMock = (overrideResponse: Partial<Extract<ReadModelsPersonnelDetailsDto, object>> = {}): ReadModelsPersonnelDetailsDto => ({id: faker.number.int(), companyId: faker.number.int(), priority: faker.number.int(), fullName: faker.string.alpha({length: {min: 10, max: 20}}), nationalCode: faker.string.alpha({length: {min: 10, max: 20}}), mobile: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), hireDate: faker.date.past().toISOString().slice(0, 10), status: faker.helpers.arrayElement([1,2,3,4] as const), isLocked: faker.datatype.boolean(), history: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({from: faker.helpers.arrayElement([1,2,3,4] as const), to: faker.helpers.arrayElement([1,2,3,4] as const), reason: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), by: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, at: faker.date.past().toISOString().slice(0, 19) + 'Z'})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getPersonnelGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsPersonnelDetailsDto, object>> = {}): ReadModelsPersonnelDetailsDto => ({id: faker.number.int(), companyId: faker.number.int(), priority: faker.number.int(), fullName: faker.string.alpha({length: {min: 10, max: 20}}), nationalCode: faker.string.alpha({length: {min: 10, max: 20}}), mobile: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), hireDate: faker.date.past().toISOString().slice(0, 10), status: faker.helpers.arrayElement([1,2,3,4] as const), isLocked: faker.datatype.boolean(), history: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({from: faker.helpers.arrayElement([1,2,3,4] as const), to: faker.helpers.arrayElement([1,2,3,4] as const), reason: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), by: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, at: faker.date.past().toISOString().slice(0, 19) + 'Z'})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getPersonnelUpdateResponseMock = (overrideResponse: Partial<Extract<ReadModelsPersonnelDetailsDto, object>> = {}): ReadModelsPersonnelDetailsDto => ({id: faker.number.int(), companyId: faker.number.int(), priority: faker.number.int(), fullName: faker.string.alpha({length: {min: 10, max: 20}}), nationalCode: faker.string.alpha({length: {min: 10, max: 20}}), mobile: faker.string.alpha({length: {min: 10, max: 20}}), personnelCode: faker.string.alpha({length: {min: 10, max: 20}}), hireDate: faker.date.past().toISOString().slice(0, 10), status: faker.helpers.arrayElement([1,2,3,4] as const), isLocked: faker.datatype.boolean(), history: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({from: faker.helpers.arrayElement([1,2,3,4] as const), to: faker.helpers.arrayElement([1,2,3,4] as const), reason: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), by: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, at: faker.date.past().toISOString().slice(0, 19) + 'Z'})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getPersonnelDeleteResponseMock = (): boolean => (faker.datatype.boolean())

export const getPersonnelImportResponseMock = (overrideResponse: Partial<Extract<ReadModelsPersonnelImportResultDto, object>> = {}): ReadModelsPersonnelImportResultDto => ({batchId: faker.number.int(), totalRows: faker.number.int(), accepted: faker.number.int(), rejected: faker.number.int(), errors: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({row: faker.number.int(), column: faker.string.alpha({length: {min: 10, max: 20}}), message: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getPersonnelImportResultResponseMock = (overrideResponse: Partial<Extract<ReadModelsPersonnelImportResultDto, object>> = {}): ReadModelsPersonnelImportResultDto => ({batchId: faker.number.int(), totalRows: faker.number.int(), accepted: faker.number.int(), rejected: faker.number.int(), errors: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({row: faker.number.int(), column: faker.string.alpha({length: {min: 10, max: 20}}), message: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getPersonnelDecideResponseMock = (): number => (faker.number.int())


export const getPersonnelSearchMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfPersonnelListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfPersonnelListItemDto> | CommonFacilityPagedResponseOfPersonnelListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Companies/:companyId/Personnel', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelSearchResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelCreateMockHandler = (overrideResponse?: ReadModelsPersonnelDetailsDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsPersonnelDetailsDto> | ReadModelsPersonnelDetailsDto), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/facility-management/Companies/:companyId/Personnel', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelCreateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelGetMockHandler = (overrideResponse?: ReadModelsPersonnelDetailsDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsPersonnelDetailsDto> | ReadModelsPersonnelDetailsDto), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Personnel/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelUpdateMockHandler = (overrideResponse?: ReadModelsPersonnelDetailsDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsPersonnelDetailsDto> | ReadModelsPersonnelDetailsDto), options?: RequestHandlerOptions) => {
  return http.put('*/gateway/facility-management/Personnel/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelUpdateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelDeleteMockHandler = (overrideResponse?: boolean | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<boolean> | boolean), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/facility-management/Personnel/:id/Delete', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelDeleteResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelImportTemplateMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Personnel/Import/Template', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getPersonnelImportMockHandler = (overrideResponse?: ReadModelsPersonnelImportResultDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsPersonnelImportResultDto> | ReadModelsPersonnelImportResultDto), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/facility-management/Companies/:companyId/Personnel/Import', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelImportResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelImportResultMockHandler = (overrideResponse?: ReadModelsPersonnelImportResultDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsPersonnelImportResultDto> | ReadModelsPersonnelImportResultDto), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Personnel/Import/:batchId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelImportResultResponseMock(),
      { status: 200
      })
  }, options)
}

export const getPersonnelDecideMockHandler = (overrideResponse?: number | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<number> | number), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/facility-management/Personnel/Decisions', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPersonnelDecideResponseMock(),
      { status: 200
      })
  }, options)
}
export const getPersonnelMock = () => [
  getPersonnelSearchMockHandler(),
  getPersonnelCreateMockHandler(),
  getPersonnelGetMockHandler(),
  getPersonnelUpdateMockHandler(),
  getPersonnelDeleteMockHandler(),
  getPersonnelImportTemplateMockHandler(),
  getPersonnelImportMockHandler(),
  getPersonnelImportResultMockHandler(),
  getPersonnelDecideMockHandler()
]
