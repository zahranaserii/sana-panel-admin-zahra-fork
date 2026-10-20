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
  CommonFacilityLookupItemDto
} from '../facilityPanelAPI.schemas';


export const getInternalCompanyLookupResponseMock = (): CommonFacilityLookupItemDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})))


export const getInternalCompanyLookupMockHandler = (overrideResponse?: CommonFacilityLookupItemDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityLookupItemDto[] | null> | CommonFacilityLookupItemDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Internal/Companies/Lookup', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getInternalCompanyLookupResponseMock(),
      { status: 200
      })
  }, options)
}
export const getInternalCompaniesMock = () => [
  getInternalCompanyLookupMockHandler()
]
