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
  PanelProfileDto
} from '../adminApi.schemas';


export const getPanelProfileGetResponseMock = (overrideResponse: Partial<Extract<PanelProfileDto, object>> = {}): PanelProfileDto => ({panelUserId: faker.number.int(), userName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), fullName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), scopeType: faker.number.int(), scopeId: faker.helpers.arrayElement([faker.number.int(), null]), keys: faker.helpers.arrayElement([Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.string.alpha({length: {min: 10, max: 20}}))), null]), ...overrideResponse})


export const getPanelProfileGetMockHandler = (overrideResponse?: PanelProfileDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<PanelProfileDto> | PanelProfileDto), options?: RequestHandlerOptions) => {
  return http.get('*/identity/Panel/Profile', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getPanelProfileGetResponseMock(),
      { status: 200
      })
  }, options)
}
export const getPanelAccessMock = () => [
  getPanelProfileGetMockHandler()
]
