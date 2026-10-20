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
  CommonEnumCatalogDto
} from '../facilityPanelAPI.schemas';


export const getLookupsEnumsResponseMock = (overrideResponse: Partial<Extract<CommonEnumCatalogDto, object>> = {}): CommonEnumCatalogDto => ({companyStatus: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), personnelStatus: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), loanRequestStatus: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), postApprovalStage: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), allocationMode: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), eligibilityStatus: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), approvalStage: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), decisionType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), contractType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), reasonType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), changeLogCategory: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), companyRankingSort: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), dashboardExport: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), hintLevel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({value: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), requiresReason: faker.datatype.boolean()})), ...overrideResponse})


export const getLookupsEnumsMockHandler = (overrideResponse?: CommonEnumCatalogDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonEnumCatalogDto> | CommonEnumCatalogDto), options?: RequestHandlerOptions) => {
  return http.get('*/gateway/facility-management/Lookups/Enums', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getLookupsEnumsResponseMock(),
      { status: 200
      })
  }, options)
}
export const getLookupsMock = () => [
  getLookupsEnumsMockHandler()
]
