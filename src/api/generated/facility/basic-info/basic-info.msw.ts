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
  CommonFacilityPagedResponseOfSchemeListItemDto,
  ReadModelsBasicInfoDto,
  ReadModelsPlanListDto,
  ReadModelsReasonDto,
  ReadModelsSchemeDto,
  ReadModelsSchemeFormDto
} from '../facilityPanelAPI.schemas';


export const getBasicInfoSchemesResponseMock = (): ReadModelsSchemeDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), code: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean()})))

export const getBasicInfoSchemeCreateResponseMock = (overrideResponse: Partial<Extract<ReadModelsSchemeFormDto, object>> = {}): ReadModelsSchemeFormDto => ({id: faker.number.int(), code: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), settings: {schemeId: faker.number.int(), contractTypes: faker.helpers.arrayElements([1,2] as const), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), salaryFromSepahMultiplierYes: faker.number.float({fractionDigits: 2}), salaryFromSepahMultiplierNo: faker.number.float({fractionDigits: 2}), contractDurationMonths: faker.number.int(), graceMonthsAfterExpiry: faker.number.int(), maxPlansPerCompany: faker.number.int(), personnelIntroductionDelayMonths: faker.number.int(), waitingPeriodDays: faker.number.int(), usableTable: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({termMonths: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), usablePercent: faker.number.float({fractionDigits: 2})})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), digitalApprovalEnabled: faker.datatype.boolean()}, reasons: {contractCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), remoteGrantDenied: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), documentType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), personnelReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()}))}, companyCount: faker.number.int(), ...overrideResponse})

export const getBasicInfoSchemeSearchResponseMock = (overrideResponse: Partial<Extract<CommonFacilityPagedResponseOfSchemeListItemDto, object>> = {}): CommonFacilityPagedResponseOfSchemeListItemDto => ({items: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), code: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), contractDurationMonths: faker.number.int(), maxPlansPerCompany: faker.number.int(), isActive: faker.datatype.boolean(), companyCount: faker.number.int()})), totalCount: faker.number.int(), page: faker.number.int(), pageSize: faker.number.int(), ...overrideResponse})

export const getBasicInfoSchemeGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsSchemeFormDto, object>> = {}): ReadModelsSchemeFormDto => ({id: faker.number.int(), code: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), settings: {schemeId: faker.number.int(), contractTypes: faker.helpers.arrayElements([1,2] as const), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), salaryFromSepahMultiplierYes: faker.number.float({fractionDigits: 2}), salaryFromSepahMultiplierNo: faker.number.float({fractionDigits: 2}), contractDurationMonths: faker.number.int(), graceMonthsAfterExpiry: faker.number.int(), maxPlansPerCompany: faker.number.int(), personnelIntroductionDelayMonths: faker.number.int(), waitingPeriodDays: faker.number.int(), usableTable: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({termMonths: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), usablePercent: faker.number.float({fractionDigits: 2})})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), digitalApprovalEnabled: faker.datatype.boolean()}, reasons: {contractCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), remoteGrantDenied: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), documentType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), personnelReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()}))}, companyCount: faker.number.int(), ...overrideResponse})

export const getBasicInfoSchemeUpdateResponseMock = (overrideResponse: Partial<Extract<ReadModelsSchemeFormDto, object>> = {}): ReadModelsSchemeFormDto => ({id: faker.number.int(), code: faker.string.alpha({length: {min: 10, max: 20}}), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), settings: {schemeId: faker.number.int(), contractTypes: faker.helpers.arrayElements([1,2] as const), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), salaryFromSepahMultiplierYes: faker.number.float({fractionDigits: 2}), salaryFromSepahMultiplierNo: faker.number.float({fractionDigits: 2}), contractDurationMonths: faker.number.int(), graceMonthsAfterExpiry: faker.number.int(), maxPlansPerCompany: faker.number.int(), personnelIntroductionDelayMonths: faker.number.int(), waitingPeriodDays: faker.number.int(), usableTable: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({termMonths: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), usablePercent: faker.number.float({fractionDigits: 2})})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), digitalApprovalEnabled: faker.datatype.boolean()}, reasons: {contractCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), remoteGrantDenied: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), documentType: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), loanCancel: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})), personnelReject: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()}))}, companyCount: faker.number.int(), ...overrideResponse})

export const getBasicInfoSchemeDeleteResponseMock = (): boolean => (faker.datatype.boolean())

export const getBasicInfoGetResponseMock = (overrideResponse: Partial<Extract<ReadModelsBasicInfoDto, object>> = {}): ReadModelsBasicInfoDto => ({schemeId: faker.number.int(), contractTypes: faker.helpers.arrayElements([1,2] as const), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), salaryFromSepahMultiplierYes: faker.number.float({fractionDigits: 2}), salaryFromSepahMultiplierNo: faker.number.float({fractionDigits: 2}), contractDurationMonths: faker.number.int(), graceMonthsAfterExpiry: faker.number.int(), maxPlansPerCompany: faker.number.int(), personnelIntroductionDelayMonths: faker.number.int(), waitingPeriodDays: faker.number.int(), usableTable: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({termMonths: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), usablePercent: faker.number.float({fractionDigits: 2})})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), digitalApprovalEnabled: faker.datatype.boolean(), ...overrideResponse})

export const getBasicInfoUpdateResponseMock = (overrideResponse: Partial<Extract<ReadModelsBasicInfoDto, object>> = {}): ReadModelsBasicInfoDto => ({schemeId: faker.number.int(), contractTypes: faker.helpers.arrayElements([1,2] as const), qardHasanRate: faker.number.float({fractionDigits: 2}), murabahaRates: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.float({fractionDigits: 2}))), repaymentTermsMonths: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => (faker.number.int())), salaryFromSepahMultiplierYes: faker.number.float({fractionDigits: 2}), salaryFromSepahMultiplierNo: faker.number.float({fractionDigits: 2}), contractDurationMonths: faker.number.int(), graceMonthsAfterExpiry: faker.number.int(), maxPlansPerCompany: faker.number.int(), personnelIntroductionDelayMonths: faker.number.int(), waitingPeriodDays: faker.number.int(), usableTable: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({termMonths: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), usablePercent: faker.number.float({fractionDigits: 2})})), rowVersion: faker.string.alpha({length: {min: 10, max: 20}}), digitalApprovalEnabled: faker.datatype.boolean(), ...overrideResponse})

export const getBasicInfoPlansResponseMock = (overrideResponse: Partial<Extract<ReadModelsPlanListDto, object>> = {}): ReadModelsPlanListDto => ({maxPlansPerCompany: faker.number.int(), plans: Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), contractType: faker.helpers.arrayElement([1,2] as const), rate: faker.number.float({fractionDigits: 2}), termMonths: faker.number.int(), usablePercent: faker.number.float({fractionDigits: 2}), title: faker.string.alpha({length: {min: 10, max: 20}})})), ...overrideResponse})

export const getBasicInfoSchemeReasonsResponseMock = (): ReadModelsReasonDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})))

export const getBasicInfoReasonCreateResponseMock = (overrideResponse: Partial<Extract<ReadModelsReasonDto, object>> = {}): ReadModelsReasonDto => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int(), ...overrideResponse})

export const getBasicInfoReasonsResponseMock = (): ReadModelsReasonDto[] | null => (Array.from({ length: faker.number.int({min: 1, max: 10}) }, (_, i) => i + 1).map(() => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int()})))

export const getBasicInfoReasonUpdateResponseMock = (overrideResponse: Partial<Extract<ReadModelsReasonDto, object>> = {}): ReadModelsReasonDto => ({id: faker.number.int(), type: faker.helpers.arrayElement([1,2,3,4,5,6] as const), title: faker.string.alpha({length: {min: 10, max: 20}}), isActive: faker.datatype.boolean(), sortOrder: faker.number.int(), ...overrideResponse})

export const getBasicInfoReasonDeleteResponseMock = (): boolean => (faker.datatype.boolean())


export const getBasicInfoSchemesMockHandler = (overrideResponse?: ReadModelsSchemeDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsSchemeDto[] | null> | ReadModelsSchemeDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/Schemes', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemesResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeCreateMockHandler = (overrideResponse?: ReadModelsSchemeFormDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsSchemeFormDto> | ReadModelsSchemeFormDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/BasicInfo/Schemes', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeCreateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeSearchMockHandler = (overrideResponse?: CommonFacilityPagedResponseOfSchemeListItemDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<CommonFacilityPagedResponseOfSchemeListItemDto> | CommonFacilityPagedResponseOfSchemeListItemDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/Schemes/Search', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeSearchResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeGetMockHandler = (overrideResponse?: ReadModelsSchemeFormDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsSchemeFormDto> | ReadModelsSchemeFormDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/Schemes/:schemeId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeUpdateMockHandler = (overrideResponse?: ReadModelsSchemeFormDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsSchemeFormDto> | ReadModelsSchemeFormDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/BasicInfo/Schemes/:schemeId', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeUpdateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeDeleteMockHandler = (overrideResponse?: boolean | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<boolean> | boolean), options?: RequestHandlerOptions) => {
  return http.delete('*/facility-management/BasicInfo/Schemes/:schemeId', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeDeleteResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoGetMockHandler = (overrideResponse?: ReadModelsBasicInfoDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsBasicInfoDto> | ReadModelsBasicInfoDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/:schemeId', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoGetResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoUpdateMockHandler = (overrideResponse?: ReadModelsBasicInfoDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsBasicInfoDto> | ReadModelsBasicInfoDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/BasicInfo/:schemeId', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoUpdateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoPlansMockHandler = (overrideResponse?: ReadModelsPlanListDto | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsPlanListDto> | ReadModelsPlanListDto), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/:schemeId/Plans', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoPlansResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoSchemeReasonsMockHandler = (overrideResponse?: ReadModelsReasonDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsReasonDto[] | null> | ReadModelsReasonDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/Schemes/:schemeId/Reasons', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoSchemeReasonsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoReasonCreateMockHandler = (overrideResponse?: ReadModelsReasonDto | ((info: Parameters<Parameters<typeof http.post>[1]>[0]) => Promise<ReadModelsReasonDto> | ReadModelsReasonDto), options?: RequestHandlerOptions) => {
  return http.post('*/facility-management/BasicInfo/Schemes/:schemeId/Reasons', async (info: Parameters<Parameters<typeof http.post>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoReasonCreateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoReasonsMockHandler = (overrideResponse?: ReadModelsReasonDto[] | null | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<ReadModelsReasonDto[] | null> | ReadModelsReasonDto[] | null), options?: RequestHandlerOptions) => {
  return http.get('*/facility-management/BasicInfo/Reasons', async (info: Parameters<Parameters<typeof http.get>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoReasonsResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoReasonUpdateMockHandler = (overrideResponse?: ReadModelsReasonDto | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<ReadModelsReasonDto> | ReadModelsReasonDto), options?: RequestHandlerOptions) => {
  return http.put('*/facility-management/BasicInfo/Schemes/:schemeId/Reasons/:id', async (info: Parameters<Parameters<typeof http.put>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoReasonUpdateResponseMock(),
      { status: 200
      })
  }, options)
}

export const getBasicInfoReasonDeleteMockHandler = (overrideResponse?: boolean | ((info: Parameters<Parameters<typeof http.delete>[1]>[0]) => Promise<boolean> | boolean), options?: RequestHandlerOptions) => {
  return http.delete('*/facility-management/BasicInfo/Schemes/:schemeId/Reasons/:id', async (info: Parameters<Parameters<typeof http.delete>[1]>[0]) => {await delay(250);


    return json(overrideResponse !== undefined
    ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
    : getBasicInfoReasonDeleteResponseMock(),
      { status: 200
      })
  }, options)
}
export const getBasicInfoMock = () => [
  getBasicInfoSchemesMockHandler(),
  getBasicInfoSchemeCreateMockHandler(),
  getBasicInfoSchemeSearchMockHandler(),
  getBasicInfoSchemeGetMockHandler(),
  getBasicInfoSchemeUpdateMockHandler(),
  getBasicInfoSchemeDeleteMockHandler(),
  getBasicInfoGetMockHandler(),
  getBasicInfoUpdateMockHandler(),
  getBasicInfoPlansMockHandler(),
  getBasicInfoSchemeReasonsMockHandler(),
  getBasicInfoReasonCreateMockHandler(),
  getBasicInfoReasonsMockHandler(),
  getBasicInfoReasonUpdateMockHandler(),
  getBasicInfoReasonDeleteMockHandler()
]
