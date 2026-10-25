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
  CommonFacilityLookupItemDto,
  ReadModelsBalanceDocumentDto,
  ReadModelsCompanyBalancesDto,
  ReadModelsCompanyDetailsDto,
  ReadModelsCompanySearchResultDto
} from '../facilityPanelAPI.schemas';


export const getCompaniesSearchResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanySearchResultDto, object>> = {}): ReadModelsCompanySearchResultDto => ({page: {items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), nationalId: faker.string.alpha({length: {min: 10, max: 20}}), agreementNumber: faker.string.alpha({length: {min: 10, max: 20}}), contractDate: faker.date.past().toISOString().slice(0, 10), planCount: faker.number.int(), registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, status: faker.helpers.arrayElement([1,2,3,4] as const), branchCode: faker.string.alpha({length: {min: 10, max: 20}}), cancelDate: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 10), null]), cancelReasonTitle: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int()}, activeCount: faker.number.int(), registeredCount: faker.number.int(), ...overrideResponse})

export const getCompaniesCreateResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyDetailsDto, object>> = {}): ReadModelsCompanyDetailsDto => ({id: faker.number.int(), schemeId: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), nationalId: faker.string.alpha({length: {min: 10, max: 20}}), agreementNumber: faker.string.alpha({length: {min: 10, max: 20}}), accountNumber: faker.string.alpha({length: {min: 10, max: 20}}), contractDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDayOfMonth: faker.number.int(), salaryFromSepah: faker.datatype.boolean(), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})), agreementFile: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', status: faker.helpers.arrayElement([1,2,3,4] as const), cancellation: {cancelDate: faker.date.past().toISOString().slice(0, 10), reason: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.string.alpha({length: {min: 10, max: 20}}), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, cancelledBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, cancelledAt: faker.date.past().toISOString().slice(0, 19) + 'Z'}, branchCode: faker.string.alpha({length: {min: 10, max: 20}}), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesLookupResponseMock = (): CommonFacilityLookupItemDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})))

export const getCompaniesGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyDetailsDto, object>> = {}): ReadModelsCompanyDetailsDto => ({id: faker.number.int(), schemeId: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), nationalId: faker.string.alpha({length: {min: 10, max: 20}}), agreementNumber: faker.string.alpha({length: {min: 10, max: 20}}), accountNumber: faker.string.alpha({length: {min: 10, max: 20}}), contractDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDayOfMonth: faker.number.int(), salaryFromSepah: faker.datatype.boolean(), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})), agreementFile: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', status: faker.helpers.arrayElement([1,2,3,4] as const), cancellation: {cancelDate: faker.date.past().toISOString().slice(0, 10), reason: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.string.alpha({length: {min: 10, max: 20}}), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, cancelledBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, cancelledAt: faker.date.past().toISOString().slice(0, 19) + 'Z'}, branchCode: faker.string.alpha({length: {min: 10, max: 20}}), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesUpdateResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyDetailsDto, object>> = {}): ReadModelsCompanyDetailsDto => ({id: faker.number.int(), schemeId: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), nationalId: faker.string.alpha({length: {min: 10, max: 20}}), agreementNumber: faker.string.alpha({length: {min: 10, max: 20}}), accountNumber: faker.string.alpha({length: {min: 10, max: 20}}), contractDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDayOfMonth: faker.number.int(), salaryFromSepah: faker.datatype.boolean(), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})), agreementFile: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', status: faker.helpers.arrayElement([1,2,3,4] as const), cancellation: {cancelDate: faker.date.past().toISOString().slice(0, 10), reason: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.string.alpha({length: {min: 10, max: 20}}), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, cancelledBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, cancelledAt: faker.date.past().toISOString().slice(0, 19) + 'Z'}, branchCode: faker.string.alpha({length: {min: 10, max: 20}}), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesDeleteResponseMock = (): boolean => (faker.datatype.boolean())

export const getCompaniesCancelContractResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyDetailsDto, object>> = {}): ReadModelsCompanyDetailsDto => ({id: faker.number.int(), schemeId: faker.number.int(), name: faker.string.alpha({length: {min: 10, max: 20}}), nationalId: faker.string.alpha({length: {min: 10, max: 20}}), agreementNumber: faker.string.alpha({length: {min: 10, max: 20}}), accountNumber: faker.string.alpha({length: {min: 10, max: 20}}), contractDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDate: faker.date.past().toISOString().slice(0, 10), accountOpeningDayOfMonth: faker.number.int(), salaryFromSepah: faker.datatype.boolean(), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({planId: faker.number.int(), title: faker.string.alpha({length: {min: 10, max: 20}})})), agreementFile: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, registrar: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, createdAt: faker.date.past().toISOString().slice(0, 19) + 'Z', status: faker.helpers.arrayElement([1,2,3,4] as const), cancellation: {cancelDate: faker.date.past().toISOString().slice(0, 10), reason: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.string.alpha({length: {min: 10, max: 20}}), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}, cancelledBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, cancelledAt: faker.date.past().toISOString().slice(0, 19) + 'Z'}, branchCode: faker.string.alpha({length: {min: 10, max: 20}}), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesBalancesResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyBalancesDto, object>> = {}): ReadModelsCompanyBalancesDto => ({companyId: faker.number.int(), months: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({month: faker.string.alpha({length: {min: 10, max: 20}}), averageBalance: faker.helpers.arrayElement([faker.number.int(), null]), remainingCredit: faker.helpers.arrayElement([faker.number.int(), null]), documentCount: faker.number.int(), hasDocuments: faker.datatype.boolean(), lastEditedBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, lastEditedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), usedCredit: faker.number.int()})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesBalancesSaveResponseMock = (overrideResponse: Partial<Extract<ReadModelsCompanyBalancesDto, object>> = {}): ReadModelsCompanyBalancesDto => ({companyId: faker.number.int(), months: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({month: faker.string.alpha({length: {min: 10, max: 20}}), averageBalance: faker.helpers.arrayElement([faker.number.int(), null]), remainingCredit: faker.helpers.arrayElement([faker.number.int(), null]), documentCount: faker.number.int(), hasDocuments: faker.datatype.boolean(), lastEditedBy: {panelUserId: faker.number.int(), userName: faker.string.alpha({length: {min: 10, max: 20}}), userCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchName: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), branchCode: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null])}, lastEditedAt: faker.helpers.arrayElement([faker.date.past().toISOString().slice(0, 19) + 'Z', null]), usedCredit: faker.number.int()})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), ...overrideResponse})

export const getCompaniesBalanceDocumentsResponseMock = (): ReadModelsBalanceDocumentDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), month: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentType: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}})))

export const getCompaniesBalanceDocumentsUploadResponseMock = (): ReadModelsBalanceDocumentDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), month: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), documentType: faker.string.alpha({length: {min: 10, max: 20}}), description: faker.helpers.arrayElement([faker.string.alpha({length: {min: 10, max: 20}}), null]), file: {id: faker.number.int(), fileName: faker.string.alpha({length: {min: 10, max: 20}}), size: faker.number.int(), uploadedAt: faker.date.past().toISOString().slice(0, 19) + 'Z', uploadedBy: faker.string.alpha({length: {min: 10, max: 20}})}})))

export const getCompaniesBalanceDocumentDeleteResponseMock = (): boolean => (faker.datatype.boolean())


export const getCompaniesSearchMockHandler = (overrideResponse?: ReadModelsCompanySearchResultDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsCompanySearchResultDto> | ReadModelsCompanySearchResultDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesSearchResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesCreateMockHandler = (overrideResponse?: ReadModelsCompanyDetailsDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsCompanyDetailsDto> | ReadModelsCompanyDetailsDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/Companies', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesCreateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesLookupMockHandler = (overrideResponse?: CommonFacilityLookupItemDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityLookupItemDto[] | null> | CommonFacilityLookupItemDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/Lookup', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesLookupResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesGetMockHandler = (overrideResponse?: ReadModelsCompanyDetailsDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsCompanyDetailsDto> | ReadModelsCompanyDetailsDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:id', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesUpdateMockHandler = (overrideResponse?: ReadModelsCompanyDetailsDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsCompanyDetailsDto> | ReadModelsCompanyDetailsDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/Companies/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesUpdateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesDeleteMockHandler = (overrideResponse?: boolean | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<boolean> | boolean), options?: RequestHandlerOptions) => {
  return http.delete('*/facility-management/Companies/:id', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesDeleteResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesCancelContractMockHandler = (overrideResponse?: ReadModelsCompanyDetailsDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsCompanyDetailsDto> | ReadModelsCompanyDetailsDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/Companies/:id/Cancel', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesCancelContractResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesAgreementFileMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:id/AgreementFile', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getCompaniesBalancesMockHandler = (overrideResponse?: ReadModelsCompanyBalancesDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsCompanyBalancesDto> | ReadModelsCompanyBalancesDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:id/Balances', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesBalancesResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesBalancesSaveMockHandler = (overrideResponse?: ReadModelsCompanyBalancesDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsCompanyBalancesDto> | ReadModelsCompanyBalancesDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/Companies/:id/Balances', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesBalancesSaveResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesBalanceDocumentsMockHandler = (overrideResponse?: ReadModelsBalanceDocumentDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsBalanceDocumentDto[] | null> | ReadModelsBalanceDocumentDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:id/Balances/Documents', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesBalanceDocumentsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesBalanceDocumentsUploadMockHandler = (overrideResponse?: ReadModelsBalanceDocumentDto[] | null | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsBalanceDocumentDto[] | null> | ReadModelsBalanceDocumentDto[] | null), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/Companies/:id/Balances/Documents', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesBalanceDocumentsUploadResponseMock(),
      { status: 200
      })
  }, options)
}

export const getCompaniesBalanceDocumentDownloadMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/Companies/:id/Balances/Documents/:documentId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }

    return new HttpResponse(null,
      { status: 200
      })
  }, options)
}

export const getCompaniesBalanceDocumentDeleteMockHandler = (overrideResponse?: boolean | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<boolean> | boolean), options?: RequestHandlerOptions) => {
  return http.delete('*/facility-management/Companies/:id/Balances/Documents/:documentId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getCompaniesBalanceDocumentDeleteResponseMock(),
      { status: 200
      })
  }, options)
}
export const getCompaniesMock = () => [
  getCompaniesSearchMockHandler(),
  getCompaniesCreateMockHandler(),
  getCompaniesLookupMockHandler(),
  getCompaniesGetMockHandler(),
  getCompaniesUpdateMockHandler(),
  getCompaniesDeleteMockHandler(),
  getCompaniesCancelContractMockHandler(),
  getCompaniesAgreementFileMockHandler(),
  getCompaniesBalancesMockHandler(),
  getCompaniesBalancesSaveMockHandler(),
  getCompaniesBalanceDocumentsMockHandler(),
  getCompaniesBalanceDocumentsUploadMockHandler(),
  getCompaniesBalanceDocumentDownloadMockHandler(),
  getCompaniesBalanceDocumentDeleteMockHandler()
]
