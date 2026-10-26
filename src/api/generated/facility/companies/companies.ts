/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  CommonFacilityLookupItemDto,
  CommonFileLinkDto,
  CompaniesBalanceDocumentsParams,
  CompaniesBalanceDocumentsUploadBody,
  CompaniesBalancesSaveBody,
  CompaniesCancelContractBody,
  CompaniesCreateBody,
  CompaniesLookupParams,
  CompaniesSearchParams,
  CompaniesUpdateBody,
  DeleteCompanyCommand,
  ProblemDetails,
  ReadModelsBalanceDocumentDto,
  ReadModelsCompanyBalancesDto,
  ReadModelsCompanyDetailsDto,
  ReadModelsCompanySearchResultDto
} from '../facilityPanelAPI.schemas';

import { apiClient } from '../../../../services/http/apiClient';
import type { ErrorType , BodyType } from '../../../../services/http/apiClient';
import { toAspNetFormData } from '../../../../services/http/formData';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



const withQueryKey = <T extends object, K>(query: T, queryKey: K): T & { queryKey: K } => {
  const result = { queryKey } as T & { queryKey: K };
  for (const key of Object.keys(query)) {
    // The explicit queryKey always wins, matching the previous
    // `{ ...query, queryKey }` spread where it was set last.
    if (key === 'queryKey') continue;
    Object.defineProperty(result, key, {
      enumerable: true,
      configurable: true,
      get: () => (query as Record<string, unknown>)[key],
    });
  }
  return result;
};

/**
 * فقط شرکت‌های دامنهٔ کاربر (شعبهٔ خود/همه). جستجو در نام، شناسهٔ ملی، شمارهٔ تفاهم‌نامه.
 * @summary فهرست شرکت‌ها
 */
export const companiesSearch = (
    params?: CompaniesSearchParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsCompanySearchResultDto>(
      {url: `/facility-management/Companies`, method: 'GET',
        params, signal
    },
      options);
    }




export const getCompaniesSearchQueryKey = (params?: CompaniesSearchParams,) => {
    return [
    `/facility-management/Companies`, ...(params ? [params] : [])
    ] as const;
    }


export const getCompaniesSearchQueryOptions = <TData = Awaited<ReturnType<typeof companiesSearch>>, TError = ErrorType<ProblemDetails>>(params?: CompaniesSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesSearchQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesSearch>>> = ({ signal }) => companiesSearch(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesSearchQueryResult = NonNullable<Awaited<ReturnType<typeof companiesSearch>>>
export type CompaniesSearchQueryError = ErrorType<ProblemDetails>


export function useCompaniesSearch<TData = Awaited<ReturnType<typeof companiesSearch>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  CompaniesSearchParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesSearch>>,
          TError,
          Awaited<ReturnType<typeof companiesSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesSearch<TData = Awaited<ReturnType<typeof companiesSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesSearch>>,
          TError,
          Awaited<ReturnType<typeof companiesSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesSearch<TData = Awaited<ReturnType<typeof companiesSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary فهرست شرکت‌ها
 */

export function useCompaniesSearch<TData = Awaited<ReturnType<typeof companiesSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesSearchQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فرم + فایل تفاهم‌نامه (اختیاری). کد شعبه: کاربر شعبه همیشه شعبهٔ خودش (BranchCode نادیده گرفته می‌شود)؛ ادمین و شعبهٔ دیجیتال (دامنهٔ سراسری) BranchCode را می‌فرستند و اگر خالی باشد شعبهٔ خودشان ثبت می‌شود.
 * @summary ثبت شرکت جدید (US-B2)
 */
export const companiesCreate = (
    companiesCreateBody?: BodyType<CompaniesCreateBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(companiesCreateBody)
      return apiClient<ReadModelsCompanyDetailsDto>(
      {url: `/facility-management/Companies`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getCompaniesCreateMutationKey = () => ['companiesCreate'] as const;

export const getCompaniesCreateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesCreate>>, TError,CompaniesCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesCreate>>, TError,CompaniesCreateMutationVariables, TContext> => {

const mutationKey = getCompaniesCreateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesCreate>>, CompaniesCreateMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  companiesCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesCreateMutationResult = NonNullable<Awaited<ReturnType<typeof companiesCreate>>>
    export type CompaniesCreateMutationBody = BodyType<CompaniesCreateBody> | undefined
    export type CompaniesCreateMutationError = ErrorType<ProblemDetails>
    export type CompaniesCreateMutationVariables = {data?: BodyType<CompaniesCreateBody>}

    /**
 * @summary ثبت شرکت جدید (US-B2)
 */
export const useCompaniesCreate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesCreate>>, TError,CompaniesCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesCreate>>,
        TError,
        CompaniesCreateMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesCreateMutationOptions(options), queryClient);
    }
    /**
 * برای نقش شرکت فقط شرکت خودش (قفل).
 * @summary Dropdown «انتخاب شرکت»
 */
export const companiesLookup = (
    params?: CompaniesLookupParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityLookupItemDto[] | null>(
      {url: `/facility-management/Companies/Lookup`, method: 'GET',
        params, signal
    },
      options);
    }




export const getCompaniesLookupQueryKey = (params?: CompaniesLookupParams,) => {
    return [
    `/facility-management/Companies/Lookup`, ...(params ? [params] : [])
    ] as const;
    }


export const getCompaniesLookupQueryOptions = <TData = Awaited<ReturnType<typeof companiesLookup>>, TError = ErrorType<ProblemDetails>>(params?: CompaniesLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesLookupQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesLookup>>> = ({ signal }) => companiesLookup(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesLookupQueryResult = NonNullable<Awaited<ReturnType<typeof companiesLookup>>>
export type CompaniesLookupQueryError = ErrorType<ProblemDetails>


export function useCompaniesLookup<TData = Awaited<ReturnType<typeof companiesLookup>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  CompaniesLookupParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesLookup>>,
          TError,
          Awaited<ReturnType<typeof companiesLookup>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesLookup<TData = Awaited<ReturnType<typeof companiesLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesLookup>>,
          TError,
          Awaited<ReturnType<typeof companiesLookup>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesLookup<TData = Awaited<ReturnType<typeof companiesLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Dropdown «انتخاب شرکت»
 */

export function useCompaniesLookup<TData = Awaited<ReturnType<typeof companiesLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: CompaniesLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesLookupQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary جزئیات شرکت و ثبت‌کننده (US-B6)
 */
export const companiesGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsCompanyDetailsDto>(
      {url: `/facility-management/Companies/${id}`, method: 'GET', signal
    },
      options);
    }




export const getCompaniesGetQueryKey = (id: number,) => {
    return [
    `/facility-management/Companies/${id}`
    ] as const;
    }


export const getCompaniesGetQueryOptions = <TData = Awaited<ReturnType<typeof companiesGet>>, TError = ErrorType<ProblemDetails>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesGet>>> = ({ signal }) => companiesGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesGetQueryResult = NonNullable<Awaited<ReturnType<typeof companiesGet>>>
export type CompaniesGetQueryError = ErrorType<ProblemDetails>


export function useCompaniesGet<TData = Awaited<ReturnType<typeof companiesGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesGet>>,
          TError,
          Awaited<ReturnType<typeof companiesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesGet<TData = Awaited<ReturnType<typeof companiesGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesGet>>,
          TError,
          Awaited<ReturnType<typeof companiesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesGet<TData = Awaited<ReturnType<typeof companiesGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary جزئیات شرکت و ثبت‌کننده (US-B6)
 */

export function useCompaniesGet<TData = Awaited<ReturnType<typeof companiesGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary ویرایش شرکت
 */
export const companiesUpdate = (
    id: number,
    companiesUpdateBody?: BodyType<CompaniesUpdateBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(companiesUpdateBody)
      return apiClient<ReadModelsCompanyDetailsDto>(
      {url: `/facility-management/Companies/${id}`, method: 'PUT',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getCompaniesUpdateMutationKey = () => ['companiesUpdate'] as const;

export const getCompaniesUpdateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesUpdate>>, TError,CompaniesUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesUpdate>>, TError,CompaniesUpdateMutationVariables, TContext> => {

const mutationKey = getCompaniesUpdateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesUpdate>>, CompaniesUpdateMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  companiesUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof companiesUpdate>>>
    export type CompaniesUpdateMutationBody = BodyType<CompaniesUpdateBody> | undefined
    export type CompaniesUpdateMutationError = ErrorType<ProblemDetails>
    export type CompaniesUpdateMutationVariables = {id: number;data?: BodyType<CompaniesUpdateBody>}

    /**
 * @summary ویرایش شرکت
 */
export const useCompaniesUpdate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesUpdate>>, TError,CompaniesUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesUpdate>>,
        TError,
        CompaniesUpdateMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesUpdateMutationOptions(options), queryClient);
    }
    /**
 * در داشبورد «شرکت‌های حذف‌شده» می‌ماند.
 * @summary حذف شرکت (نرم)
 */
export const companiesDelete = (
    id: number,
    deleteCompanyCommand?: BodyType<DeleteCompanyCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<boolean>(
      {url: `/facility-management/Companies/${id}`, method: 'DELETE',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: deleteCompanyCommand, signal
    },
      options);
    }




export const getCompaniesDeleteMutationKey = () => ['companiesDelete'] as const;

export const getCompaniesDeleteMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesDelete>>, TError,CompaniesDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesDelete>>, TError,CompaniesDeleteMutationVariables, TContext> => {

const mutationKey = getCompaniesDeleteMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesDelete>>, CompaniesDeleteMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  companiesDelete(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof companiesDelete>>>
    export type CompaniesDeleteMutationBody = BodyType<DeleteCompanyCommand> | undefined
    export type CompaniesDeleteMutationError = ErrorType<ProblemDetails>
    export type CompaniesDeleteMutationVariables = {id: number;data?: BodyType<DeleteCompanyCommand>}

    /**
 * @summary حذف شرکت (نرم)
 */
export const useCompaniesDelete = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesDelete>>, TError,CompaniesDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesDelete>>,
        TError,
        CompaniesDeleteMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesDeleteMutationOptions(options), queryClient);
    }
    /**
 * تاریخ، دلیل از فهرست، توضیح (۵ تا ۱۰۰۰ حرف) و فایل نامه (letterFile: pdf/jpg/jpeg/png تا ۵ مگابایت) همه الزامی.
 * @summary لغو قرارداد (مدال تصمیم)
 */
export const companiesCancelContract = (
    id: number,
    companiesCancelContractBody?: BodyType<CompaniesCancelContractBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(companiesCancelContractBody)
      return apiClient<ReadModelsCompanyDetailsDto>(
      {url: `/facility-management/Companies/${id}/Cancel`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getCompaniesCancelContractMutationKey = () => ['companiesCancelContract'] as const;

export const getCompaniesCancelContractMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesCancelContract>>, TError,CompaniesCancelContractMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesCancelContract>>, TError,CompaniesCancelContractMutationVariables, TContext> => {

const mutationKey = getCompaniesCancelContractMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesCancelContract>>, CompaniesCancelContractMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  companiesCancelContract(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesCancelContractMutationResult = NonNullable<Awaited<ReturnType<typeof companiesCancelContract>>>
    export type CompaniesCancelContractMutationBody = BodyType<CompaniesCancelContractBody> | undefined
    export type CompaniesCancelContractMutationError = ErrorType<ProblemDetails>
    export type CompaniesCancelContractMutationVariables = {id: number;data?: BodyType<CompaniesCancelContractBody>}

    /**
 * @summary لغو قرارداد (مدال تصمیم)
 */
export const useCompaniesCancelContract = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesCancelContract>>, TError,CompaniesCancelContractMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesCancelContract>>,
        TError,
        CompaniesCancelContractMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesCancelContractMutationOptions(options), queryClient);
    }
    /**
 * @summary لینک دانلود فایل تفاهم‌نامه
 */
export const companiesAgreementFile = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFileLinkDto>(
      {url: `/facility-management/Companies/${id}/AgreementFile`, method: 'GET', signal
    },
      options);
    }




export const getCompaniesAgreementFileQueryKey = (id: number,) => {
    return [
    `/facility-management/Companies/${id}/AgreementFile`
    ] as const;
    }


export const getCompaniesAgreementFileQueryOptions = <TData = Awaited<ReturnType<typeof companiesAgreementFile>>, TError = ErrorType<ProblemDetails>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesAgreementFileQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesAgreementFile>>> = ({ signal }) => companiesAgreementFile(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesAgreementFileQueryResult = NonNullable<Awaited<ReturnType<typeof companiesAgreementFile>>>
export type CompaniesAgreementFileQueryError = ErrorType<ProblemDetails>


export function useCompaniesAgreementFile<TData = Awaited<ReturnType<typeof companiesAgreementFile>>, TError = ErrorType<ProblemDetails>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesAgreementFile>>,
          TError,
          Awaited<ReturnType<typeof companiesAgreementFile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesAgreementFile<TData = Awaited<ReturnType<typeof companiesAgreementFile>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesAgreementFile>>,
          TError,
          Awaited<ReturnType<typeof companiesAgreementFile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesAgreementFile<TData = Awaited<ReturnType<typeof companiesAgreementFile>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary لینک دانلود فایل تفاهم‌نامه
 */

export function useCompaniesAgreementFile<TData = Awaited<ReturnType<typeof companiesAgreementFile>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesAgreementFile>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesAgreementFileQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary میانگین موجودی ماه‌های سال جاری قرارداد + مانده اعتبار
 */
export const companiesBalances = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsCompanyBalancesDto>(
      {url: `/facility-management/Companies/${id}/Balances`, method: 'GET', signal
    },
      options);
    }




export const getCompaniesBalancesQueryKey = (id: number,) => {
    return [
    `/facility-management/Companies/${id}/Balances`
    ] as const;
    }


export const getCompaniesBalancesQueryOptions = <TData = Awaited<ReturnType<typeof companiesBalances>>, TError = ErrorType<ProblemDetails>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesBalancesQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesBalances>>> = ({ signal }) => companiesBalances(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesBalancesQueryResult = NonNullable<Awaited<ReturnType<typeof companiesBalances>>>
export type CompaniesBalancesQueryError = ErrorType<ProblemDetails>


export function useCompaniesBalances<TData = Awaited<ReturnType<typeof companiesBalances>>, TError = ErrorType<ProblemDetails>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalances>>,
          TError,
          Awaited<ReturnType<typeof companiesBalances>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalances<TData = Awaited<ReturnType<typeof companiesBalances>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalances>>,
          TError,
          Awaited<ReturnType<typeof companiesBalances>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalances<TData = Awaited<ReturnType<typeof companiesBalances>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary میانگین موجودی ماه‌های سال جاری قرارداد + مانده اعتبار
 */

export function useCompaniesBalances<TData = Awaited<ReturnType<typeof companiesBalances>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalances>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesBalancesQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فقط کاربر شعبه (شعبهٔ خود) و ادمین. ⚠  بدنه multipart شد: اگر مبلغی عوض شود، documentTypeId و حداقل یک فایل الزامی است و هر دو در یک تراکنش ثبت می‌شوند. یک مستند همهٔ ماه‌های تغییریافتهٔ همین ذخیره را پوشش می‌دهد. اگر هیچ مبلغی عوض نشود، مستند لازم نیست. مبلغ قبلی و جدید در گزارش تغییرات ثبت می‌شود.
 * @summary ذخیرهٔ میانگین‌ها همراه مستندش (US-B4، US-B5)
 */
export const companiesBalancesSave = (
    id: number,
    companiesBalancesSaveBody?: BodyType<CompaniesBalancesSaveBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(companiesBalancesSaveBody)
      return apiClient<ReadModelsCompanyBalancesDto>(
      {url: `/facility-management/Companies/${id}/Balances`, method: 'PUT',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getCompaniesBalancesSaveMutationKey = () => ['companiesBalancesSave'] as const;

export const getCompaniesBalancesSaveMutationOptions = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalancesSave>>, TError,CompaniesBalancesSaveMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesBalancesSave>>, TError,CompaniesBalancesSaveMutationVariables, TContext> => {

const mutationKey = getCompaniesBalancesSaveMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesBalancesSave>>, CompaniesBalancesSaveMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  companiesBalancesSave(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesBalancesSaveMutationResult = NonNullable<Awaited<ReturnType<typeof companiesBalancesSave>>>
    export type CompaniesBalancesSaveMutationBody = BodyType<CompaniesBalancesSaveBody> | undefined
    export type CompaniesBalancesSaveMutationError = ErrorType<unknown | ProblemDetails>
    export type CompaniesBalancesSaveMutationVariables = {id: number;data?: BodyType<CompaniesBalancesSaveBody>}

    /**
 * @summary ذخیرهٔ میانگین‌ها همراه مستندش (US-B4، US-B5)
 */
export const useCompaniesBalancesSave = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalancesSave>>, TError,CompaniesBalancesSaveMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesBalancesSave>>,
        TError,
        CompaniesBalancesSaveMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesBalancesSaveMutationOptions(options), queryClient);
    }
    /**
 * @summary مستندات میانگین (US-B5)
 */
export const companiesBalanceDocuments = (
    id: number,
    params?: CompaniesBalanceDocumentsParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsBalanceDocumentDto[] | null>(
      {url: `/facility-management/Companies/${id}/Balances/Documents`, method: 'GET',
        params, signal
    },
      options);
    }




export const getCompaniesBalanceDocumentsQueryKey = (id: number,
    params?: CompaniesBalanceDocumentsParams,) => {
    return [
    `/facility-management/Companies/${id}/Balances/Documents`, ...(params ? [params] : [])
    ] as const;
    }


export const getCompaniesBalanceDocumentsQueryOptions = <TData = Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError = ErrorType<ProblemDetails>>(id: number,
    params?: CompaniesBalanceDocumentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesBalanceDocumentsQueryKey(id,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesBalanceDocuments>>> = ({ signal }) => companiesBalanceDocuments(id,params, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesBalanceDocumentsQueryResult = NonNullable<Awaited<ReturnType<typeof companiesBalanceDocuments>>>
export type CompaniesBalanceDocumentsQueryError = ErrorType<ProblemDetails>


export function useCompaniesBalanceDocuments<TData = Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    params: undefined |  CompaniesBalanceDocumentsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalanceDocuments>>,
          TError,
          Awaited<ReturnType<typeof companiesBalanceDocuments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalanceDocuments<TData = Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    params?: CompaniesBalanceDocumentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalanceDocuments>>,
          TError,
          Awaited<ReturnType<typeof companiesBalanceDocuments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalanceDocuments<TData = Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    params?: CompaniesBalanceDocumentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary مستندات میانگین (US-B5)
 */

export function useCompaniesBalanceDocuments<TData = Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    params?: CompaniesBalanceDocumentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocuments>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesBalanceDocumentsQueryOptions(id,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * pdf, doc, docx, xls, xlsx, zip, jpg, png؛ هر فایل تا ۵ مگابایت.
 * @summary الصاق یک یا چند مستند
 */
export const companiesBalanceDocumentsUpload = (
    id: number,
    companiesBalanceDocumentsUploadBody?: BodyType<CompaniesBalanceDocumentsUploadBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(companiesBalanceDocumentsUploadBody)
      return apiClient<ReadModelsBalanceDocumentDto[] | null>(
      {url: `/facility-management/Companies/${id}/Balances/Documents`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getCompaniesBalanceDocumentsUploadMutationKey = () => ['companiesBalanceDocumentsUpload'] as const;

export const getCompaniesBalanceDocumentsUploadMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>, TError,CompaniesBalanceDocumentsUploadMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>, TError,CompaniesBalanceDocumentsUploadMutationVariables, TContext> => {

const mutationKey = getCompaniesBalanceDocumentsUploadMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>, CompaniesBalanceDocumentsUploadMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  companiesBalanceDocumentsUpload(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesBalanceDocumentsUploadMutationResult = NonNullable<Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>>
    export type CompaniesBalanceDocumentsUploadMutationBody = BodyType<CompaniesBalanceDocumentsUploadBody> | undefined
    export type CompaniesBalanceDocumentsUploadMutationError = ErrorType<ProblemDetails>
    export type CompaniesBalanceDocumentsUploadMutationVariables = {id: number;data?: BodyType<CompaniesBalanceDocumentsUploadBody>}

    /**
 * @summary الصاق یک یا چند مستند
 */
export const useCompaniesBalanceDocumentsUpload = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>, TError,CompaniesBalanceDocumentsUploadMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesBalanceDocumentsUpload>>,
        TError,
        CompaniesBalanceDocumentsUploadMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesBalanceDocumentsUploadMutationOptions(options), queryClient);
    }
    /**
 * @summary لینک دانلود مستند
 */
export const companiesBalanceDocumentDownload = (
    id: number,
    documentId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFileLinkDto>(
      {url: `/facility-management/Companies/${id}/Balances/Documents/${documentId}`, method: 'GET', signal
    },
      options);
    }




export const getCompaniesBalanceDocumentDownloadQueryKey = (id: number,
    documentId: number,) => {
    return [
    `/facility-management/Companies/${id}/Balances/Documents/${documentId}`
    ] as const;
    }


export const getCompaniesBalanceDocumentDownloadQueryOptions = <TData = Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError = ErrorType<ProblemDetails>>(id: number,
    documentId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCompaniesBalanceDocumentDownloadQueryKey(id,documentId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>> = ({ signal }) => companiesBalanceDocumentDownload(id,documentId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined && documentId !== null && documentId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CompaniesBalanceDocumentDownloadQueryResult = NonNullable<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>>
export type CompaniesBalanceDocumentDownloadQueryError = ErrorType<ProblemDetails>


export function useCompaniesBalanceDocumentDownload<TData = Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    documentId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>,
          TError,
          Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalanceDocumentDownload<TData = Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    documentId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>,
          TError,
          Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCompaniesBalanceDocumentDownload<TData = Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    documentId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary لینک دانلود مستند
 */

export function useCompaniesBalanceDocumentDownload<TData = Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    documentId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCompaniesBalanceDocumentDownloadQueryOptions(id,documentId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary حذف مستند (فقط ادمین)
 */
export const companiesBalanceDocumentDelete = (
    id: number,
    documentId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<boolean>(
      {url: `/facility-management/Companies/${id}/Balances/Documents/${documentId}`, method: 'DELETE', signal
    },
      options);
    }




export const getCompaniesBalanceDocumentDeleteMutationKey = () => ['companiesBalanceDocumentDelete'] as const;

export const getCompaniesBalanceDocumentDeleteMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>, TError,CompaniesBalanceDocumentDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>, TError,CompaniesBalanceDocumentDeleteMutationVariables, TContext> => {

const mutationKey = getCompaniesBalanceDocumentDeleteMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>, CompaniesBalanceDocumentDeleteMutationVariables> = (props) => {
          const {id,documentId} = props ?? {};

          return  companiesBalanceDocumentDelete(id,documentId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CompaniesBalanceDocumentDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>>

    export type CompaniesBalanceDocumentDeleteMutationError = ErrorType<ProblemDetails>
    export type CompaniesBalanceDocumentDeleteMutationVariables = {id: number;documentId: number}

    /**
 * @summary حذف مستند (فقط ادمین)
 */
export const useCompaniesBalanceDocumentDelete = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>, TError,CompaniesBalanceDocumentDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof companiesBalanceDocumentDelete>>,
        TError,
        CompaniesBalanceDocumentDeleteMutationVariables,
        TContext
      > => {
      return useMutation(getCompaniesBalanceDocumentDeleteMutationOptions(options), queryClient);
    }
