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
  CommandResponsesChangeLogItemDto,
  CommonFacilityPagedResponseOfChangeLogItemDto,
  CommonRegistrarDto
} from '../facilityPanelAPI.schemas';


export const getChangeLogsSearchResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfChangeLogItemDto, object>> = {}): CommonFacilityPagedResponseOfChangeLogItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), at: faker.date.past().toISOString().slice(0, 19) + 'Z', user: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, category: faker.helpers.arrayElement([1,2,3,4] as const), action: faker.string.alpha({length: {min: 10, max: 20}}), details: faker.string.alpha({length: {min: 10, max: 20}}), before: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), after: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), companyId: faker.helpers.arrayElement([faker.number.int(), null]), canRestore: faker.datatype.boolean(), restoredAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null])})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getChangeLogsUsersResponseMock = (): CommonRegistrarDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])})))

export const getChangeLogsRestoreResponseMock = (overrideResponse: Partial<Extract<CommandResponsesChangeLogItemDto, object>> = {}): CommandResponsesChangeLogItemDto => ({id: faker.number.int(), at: faker.date.past().toISOString().slice(0, 19) + 'Z', user: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, category: faker.helpers.arrayElement([1,2,3,4] as const), action: faker.string.alpha({length: {min: 10, max: 20}}), details: faker.string.alpha({length: {min: 10, max: 20}}), before: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), after: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), companyId: faker.helpers.arrayElement([faker.number.int(), null]), canRestore: faker.datatype.boolean(), restoredAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), ...overrideResponse})


export const getChangeLogsSearchMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfChangeLogItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfChangeLogItemDto> | CommonFacilityPagedResponseOfChangeLogItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/ChangeLogs', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getChangeLogsSearchResponseMock(),
      { status: 200
      })
  }, options)
}

export const getChangeLogsUsersMockHandler = (overrideResponse?: CommonRegistrarDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonRegistrarDto[] | null> | CommonRegistrarDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/ChangeLogs/Users', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getChangeLogsUsersResponseMock(),
      { status: 200
      })
  }, options)
}

export const getChangeLogsExportMockHandler = (overrideResponse?: void | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<void> | void), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/ChangeLogs/Export', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getChangeLogsRestoreMockHandler = (overrideResponse?: CommandResponsesChangeLogItemDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<CommandResponsesChangeLogItemDto> | CommandResponsesChangeLogItemDto), options?: RequestHandlerOptions) => {
  return http.post('*/gateway/facility-management/ChangeLogs/:id/Restore', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getChangeLogsRestoreResponseMock(),
      { status: 200
      })
  }, options)
}
export const getChangeLogsMock = () => [
  getChangeLogsSearchMockHandler(),
  getChangeLogsUsersMockHandler(),
  getChangeLogsExportMockHandler(),
  getChangeLogsRestoreMockHandler()
]
