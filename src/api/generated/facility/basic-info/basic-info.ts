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
  BasicInfoReasonsParams,
  BasicInfoSchemeReasonsParams,
  BasicInfoSchemeSearchParams,
  CommonFacilityPagedResponseOfSchemeListItemDto,
  CreateReasonCommand,
  ProblemDetails,
  ReadModelsBasicInfoDto,
  ReadModelsPlanListDto,
  ReadModelsReasonDto,
  ReadModelsSchemeDto,
  ReadModelsSchemeFormDto,
  SaveSchemeCommand,
  UpdateBasicInfoCommand,
  UpdateReasonCommand
} from '../facilityPanelAPI.schemas';

import { apiClient } from '../../../../services/http/apiClient';
import type { ErrorType , BodyType } from '../../../../services/http/apiClient';


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
 * فقط شناسه و عنوان، برای کشویی فرم شرکت. برای جدول «اطلاعات پایه طرح» از Schemes/Search استفاده کنید.
 * @summary کشویی طرح‌های کلان (نگین میثاق، شجره طیبه، ...)
 */
export const basicInfoSchemes = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsSchemeDto[] | null>(
      {url: `/facility-management/BasicInfo/Schemes`, method: 'GET', signal
    },
      options);
    }




export const getBasicInfoSchemesQueryKey = () => {
    return [
    `/facility-management/BasicInfo/Schemes`
    ] as const;
    }


export const getBasicInfoSchemesQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoSchemes>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoSchemesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoSchemes>>> = ({ signal }) => basicInfoSchemes(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoSchemesQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemes>>>
export type BasicInfoSchemesQueryError = ErrorType<ProblemDetails>


export function useBasicInfoSchemes<TData = Awaited<ReturnType<typeof basicInfoSchemes>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemes>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemes<TData = Awaited<ReturnType<typeof basicInfoSchemes>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemes>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemes<TData = Awaited<ReturnType<typeof basicInfoSchemes>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary کشویی طرح‌های کلان (نگین میثاق، شجره طیبه، ...)
 */

export function useBasicInfoSchemes<TData = Awaited<ReturnType<typeof basicInfoSchemes>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemes>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoSchemesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * code الزامی است و بعداً عوض نمی‌شود. فهرست‌های دلایل به‌صورت آرایهٔ عنوان فرستاده می‌شوند و به همین طرح تعلق می‌گیرند.
 * @summary ایجاد طرح — همهٔ موارد فرم در یک درخواست
 */
export const basicInfoSchemeCreate = (
    saveSchemeCommand?: BodyType<SaveSchemeCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsSchemeFormDto>(
      {url: `/facility-management/BasicInfo/Schemes`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: saveSchemeCommand, signal
    },
      options);
    }




export const getBasicInfoSchemeCreateMutationKey = () => ['basicInfoSchemeCreate'] as const;

export const getBasicInfoSchemeCreateMutationOptions = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeCreate>>, TError,BasicInfoSchemeCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeCreate>>, TError,BasicInfoSchemeCreateMutationVariables, TContext> => {

const mutationKey = getBasicInfoSchemeCreateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoSchemeCreate>>, BasicInfoSchemeCreateMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  basicInfoSchemeCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoSchemeCreateMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeCreate>>>
    export type BasicInfoSchemeCreateMutationBody = BodyType<SaveSchemeCommand> | undefined
    export type BasicInfoSchemeCreateMutationError = ErrorType<unknown | ProblemDetails>
    export type BasicInfoSchemeCreateMutationVariables = {data?: BodyType<SaveSchemeCommand>}

    /**
 * @summary ایجاد طرح — همهٔ موارد فرم در یک درخواست
 */
export const useBasicInfoSchemeCreate = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeCreate>>, TError,BasicInfoSchemeCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoSchemeCreate>>,
        TError,
        BasicInfoSchemeCreateMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoSchemeCreateMutationOptions(options), queryClient);
    }
    /**
 * همان ستون‌هایی که در جدول دیده می‌شود: نام، نرخ قرض‌الحسنه، نرخ‌های مرابحه، مدت‌های بازپرداخت، مدت قرارداد، حداکثر طرح، وضعیت و تعداد شرکت. includeInactive فقط برای کسی که اطلاعات پایه را ویرایش می‌کند کار می‌کند.
 * @summary جدول طرح‌ها (صفحه‌بندی‌شده)
 */
export const basicInfoSchemeSearch = (
    params?: BasicInfoSchemeSearchParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfSchemeListItemDto>(
      {url: `/facility-management/BasicInfo/Schemes/Search`, method: 'GET',
        params, signal
    },
      options);
    }




export const getBasicInfoSchemeSearchQueryKey = (params?: BasicInfoSchemeSearchParams,) => {
    return [
    `/facility-management/BasicInfo/Schemes/Search`, ...(params ? [params] : [])
    ] as const;
    }


export const getBasicInfoSchemeSearchQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError = ErrorType<ProblemDetails>>(params?: BasicInfoSchemeSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoSchemeSearchQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoSchemeSearch>>> = ({ signal }) => basicInfoSchemeSearch(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoSchemeSearchQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeSearch>>>
export type BasicInfoSchemeSearchQueryError = ErrorType<ProblemDetails>


export function useBasicInfoSchemeSearch<TData = Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  BasicInfoSchemeSearchParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeSearch>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeSearch<TData = Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: BasicInfoSchemeSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeSearch>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeSearch<TData = Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: BasicInfoSchemeSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary جدول طرح‌ها (صفحه‌بندی‌شده)
 */

export function useBasicInfoSchemeSearch<TData = Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: BasicInfoSchemeSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoSchemeSearchQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * هویت طرح، تنظیمات (نرخ‌ها، مدت‌ها، ضرایب، جدول درصد قابل استفاده) و فهرست‌های دلایل همین طرح، در یک پاسخ.
 * @summary جزئیات طرح — همهٔ ۱۴ مورد فرم
 */
export const basicInfoSchemeGet = (
    schemeId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsSchemeFormDto>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}`, method: 'GET', signal
    },
      options);
    }




export const getBasicInfoSchemeGetQueryKey = (schemeId: number,) => {
    return [
    `/facility-management/BasicInfo/Schemes/${schemeId}`
    ] as const;
    }


export const getBasicInfoSchemeGetQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError = ErrorType<ProblemDetails>>(schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoSchemeGetQueryKey(schemeId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoSchemeGet>>> = ({ signal }) => basicInfoSchemeGet(schemeId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: schemeId !== null && schemeId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoSchemeGetQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeGet>>>
export type BasicInfoSchemeGetQueryError = ErrorType<ProblemDetails>


export function useBasicInfoSchemeGet<TData = Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeGet>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeGet<TData = Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeGet>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeGet<TData = Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary جزئیات طرح — همهٔ ۱۴ مورد فرم
 */

export function useBasicInfoSchemeGet<TData = Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoSchemeGetQueryOptions(schemeId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * rowVersion الزامی است (قفل خوش‌بینانه). code نادیده گرفته می‌شود. فهرستی که null بیاید تغییر نمی‌کند؛ فهرستی که بیاید جایگزین می‌شود و موارد برداشته‌شده غیرفعال (نه پاک) می‌شوند.
 * @summary ویرایش طرح — همهٔ موارد فرم در یک درخواست
 */
export const basicInfoSchemeUpdate = (
    schemeId: number,
    saveSchemeCommand?: BodyType<SaveSchemeCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsSchemeFormDto>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: saveSchemeCommand, signal
    },
      options);
    }




export const getBasicInfoSchemeUpdateMutationKey = () => ['basicInfoSchemeUpdate'] as const;

export const getBasicInfoSchemeUpdateMutationOptions = <TError = ErrorType<ProblemDetails | unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeUpdate>>, TError,BasicInfoSchemeUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeUpdate>>, TError,BasicInfoSchemeUpdateMutationVariables, TContext> => {

const mutationKey = getBasicInfoSchemeUpdateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoSchemeUpdate>>, BasicInfoSchemeUpdateMutationVariables> = (props) => {
          const {schemeId,data} = props ?? {};

          return  basicInfoSchemeUpdate(schemeId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoSchemeUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeUpdate>>>
    export type BasicInfoSchemeUpdateMutationBody = BodyType<SaveSchemeCommand> | undefined
    export type BasicInfoSchemeUpdateMutationError = ErrorType<ProblemDetails | unknown>
    export type BasicInfoSchemeUpdateMutationVariables = {schemeId: number;data?: BodyType<SaveSchemeCommand>}

    /**
 * @summary ویرایش طرح — همهٔ موارد فرم در یک درخواست
 */
export const useBasicInfoSchemeUpdate = <TError = ErrorType<ProblemDetails | unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeUpdate>>, TError,BasicInfoSchemeUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoSchemeUpdate>>,
        TError,
        BasicInfoSchemeUpdateMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoSchemeUpdateMutationOptions(options), queryClient);
    }
    /**
 * آخرین طرح فعال و طرحی که شرکت فعال دارد حذف نمی‌شوند.
 * @summary حذف طرح (نرم)
 */
export const basicInfoSchemeDelete = (
    schemeId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<boolean>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}`, method: 'DELETE', signal
    },
      options);
    }




export const getBasicInfoSchemeDeleteMutationKey = () => ['basicInfoSchemeDelete'] as const;

export const getBasicInfoSchemeDeleteMutationOptions = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeDelete>>, TError,BasicInfoSchemeDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeDelete>>, TError,BasicInfoSchemeDeleteMutationVariables, TContext> => {

const mutationKey = getBasicInfoSchemeDeleteMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoSchemeDelete>>, BasicInfoSchemeDeleteMutationVariables> = (props) => {
          const {schemeId} = props ?? {};

          return  basicInfoSchemeDelete(schemeId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoSchemeDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeDelete>>>

    export type BasicInfoSchemeDeleteMutationError = ErrorType<unknown | ProblemDetails>
    export type BasicInfoSchemeDeleteMutationVariables = {schemeId: number}

    /**
 * @summary حذف طرح (نرم)
 */
export const useBasicInfoSchemeDelete = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoSchemeDelete>>, TError,BasicInfoSchemeDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoSchemeDelete>>,
        TError,
        BasicInfoSchemeDeleteMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoSchemeDeleteMutationOptions(options), queryClient);
    }
    /**
 * برای فرم طرح از Schemes/{schemeId} استفاده کنید؛ آن یکی هویت طرح و فهرست‌های دلایلش را هم می‌دهد.
 * @summary فقط تنظیمات یک طرح (نرخ‌ها، مدت‌ها، ضرایب، جدول درصد قابل استفاده)
 */
export const basicInfoGet = (
    schemeId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsBasicInfoDto>(
      {url: `/facility-management/BasicInfo/${schemeId}`, method: 'GET', signal
    },
      options);
    }




export const getBasicInfoGetQueryKey = (schemeId: number,) => {
    return [
    `/facility-management/BasicInfo/${schemeId}`
    ] as const;
    }


export const getBasicInfoGetQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoGet>>, TError = ErrorType<ProblemDetails>>(schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoGetQueryKey(schemeId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoGet>>> = ({ signal }) => basicInfoGet(schemeId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: schemeId !== null && schemeId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoGetQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoGet>>>
export type BasicInfoGetQueryError = ErrorType<ProblemDetails>


export function useBasicInfoGet<TData = Awaited<ReturnType<typeof basicInfoGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoGet>>,
          TError,
          Awaited<ReturnType<typeof basicInfoGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoGet<TData = Awaited<ReturnType<typeof basicInfoGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoGet>>,
          TError,
          Awaited<ReturnType<typeof basicInfoGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoGet<TData = Awaited<ReturnType<typeof basicInfoGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary فقط تنظیمات یک طرح (نرخ‌ها، مدت‌ها، ضرایب، جدول درصد قابل استفاده)
 */

export function useBasicInfoGet<TData = Awaited<ReturnType<typeof basicInfoGet>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoGetQueryOptions(schemeId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فقط ادمین (پیش‌فرض). همهٔ محاسبات اعتبار از همین‌جا خوانده می‌شود. برای ذخیرهٔ کل فرم طرح (با نام و فهرست‌های دلایل) از PUT Schemes/{schemeId} استفاده کنید.
 * @summary ذخیرهٔ فقط تنظیمات پایه
 */
export const basicInfoUpdate = (
    schemeId: number,
    updateBasicInfoCommand?: BodyType<UpdateBasicInfoCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsBasicInfoDto>(
      {url: `/facility-management/BasicInfo/${schemeId}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateBasicInfoCommand, signal
    },
      options);
    }




export const getBasicInfoUpdateMutationKey = () => ['basicInfoUpdate'] as const;

export const getBasicInfoUpdateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoUpdate>>, TError,BasicInfoUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoUpdate>>, TError,BasicInfoUpdateMutationVariables, TContext> => {

const mutationKey = getBasicInfoUpdateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoUpdate>>, BasicInfoUpdateMutationVariables> = (props) => {
          const {schemeId,data} = props ?? {};

          return  basicInfoUpdate(schemeId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoUpdate>>>
    export type BasicInfoUpdateMutationBody = BodyType<UpdateBasicInfoCommand> | undefined
    export type BasicInfoUpdateMutationError = ErrorType<ProblemDetails>
    export type BasicInfoUpdateMutationVariables = {schemeId: number;data?: BodyType<UpdateBasicInfoCommand>}

    /**
 * @summary ذخیرهٔ فقط تنظیمات پایه
 */
export const useBasicInfoUpdate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoUpdate>>, TError,BasicInfoUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoUpdate>>,
        TError,
        BasicInfoUpdateMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoUpdateMutationOptions(options), queryClient);
    }
    /**
 * برای فرم ثبت شرکت و انتخاب طرح در تخصیص وام. maxPlansPerCompany همان سقفی است که فرانت برای محدود کردن انتخاب لازم دارد.
 * @summary طرح‌های قابل انتخاب (عقد × نرخ × مدت) + سقف تعداد طرح هر شرکت
 */
export const basicInfoPlans = (
    schemeId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPlanListDto>(
      {url: `/facility-management/BasicInfo/${schemeId}/Plans`, method: 'GET', signal
    },
      options);
    }




export const getBasicInfoPlansQueryKey = (schemeId: number,) => {
    return [
    `/facility-management/BasicInfo/${schemeId}/Plans`
    ] as const;
    }


export const getBasicInfoPlansQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoPlans>>, TError = ErrorType<ProblemDetails>>(schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoPlansQueryKey(schemeId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoPlans>>> = ({ signal }) => basicInfoPlans(schemeId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: schemeId !== null && schemeId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoPlansQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoPlans>>>
export type BasicInfoPlansQueryError = ErrorType<ProblemDetails>


export function useBasicInfoPlans<TData = Awaited<ReturnType<typeof basicInfoPlans>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoPlans>>,
          TError,
          Awaited<ReturnType<typeof basicInfoPlans>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoPlans<TData = Awaited<ReturnType<typeof basicInfoPlans>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoPlans>>,
          TError,
          Awaited<ReturnType<typeof basicInfoPlans>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoPlans<TData = Awaited<ReturnType<typeof basicInfoPlans>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary طرح‌های قابل انتخاب (عقد × نرخ × مدت) + سقف تعداد طرح هر شرکت
 */

export function useBasicInfoPlans<TData = Awaited<ReturnType<typeof basicInfoPlans>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoPlans>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoPlansQueryOptions(schemeId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * دلایل لغو قرارداد، رد وام، عدم اعطای غیرحضوری، لغو درخواست، رد پرسنل، نوع مستند. برای Dropdown مدال‌ها — طرح را از شرکت بگیرید.
 * @summary یک فهرست داینامیک از یک طرح
 */
export const basicInfoSchemeReasons = (
    schemeId: number,
    params?: BasicInfoSchemeReasonsParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsReasonDto[] | null>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}/Reasons`, method: 'GET',
        params, signal
    },
      options);
    }




export const getBasicInfoSchemeReasonsQueryKey = (schemeId: number,
    params?: BasicInfoSchemeReasonsParams,) => {
    return [
    `/facility-management/BasicInfo/Schemes/${schemeId}/Reasons`, ...(params ? [params] : [])
    ] as const;
    }


export const getBasicInfoSchemeReasonsQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError = ErrorType<ProblemDetails>>(schemeId: number,
    params?: BasicInfoSchemeReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoSchemeReasonsQueryKey(schemeId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoSchemeReasons>>> = ({ signal }) => basicInfoSchemeReasons(schemeId,params, requestOptions, signal);





   return  { queryKey, queryFn, enabled: schemeId !== null && schemeId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoSchemeReasonsQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoSchemeReasons>>>
export type BasicInfoSchemeReasonsQueryError = ErrorType<ProblemDetails>


export function useBasicInfoSchemeReasons<TData = Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number,
    params: undefined |  BasicInfoSchemeReasonsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeReasons>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeReasons>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeReasons<TData = Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number,
    params?: BasicInfoSchemeReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoSchemeReasons>>,
          TError,
          Awaited<ReturnType<typeof basicInfoSchemeReasons>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoSchemeReasons<TData = Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number,
    params?: BasicInfoSchemeReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary یک فهرست داینامیک از یک طرح
 */

export function useBasicInfoSchemeReasons<TData = Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError = ErrorType<ProblemDetails>>(
 schemeId: number,
    params?: BasicInfoSchemeReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoSchemeReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoSchemeReasonsQueryOptions(schemeId,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary افزودن یک مورد به فهرست طرح
 */
export const basicInfoReasonCreate = (
    schemeId: number,
    createReasonCommand?: BodyType<CreateReasonCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsReasonDto>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}/Reasons`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createReasonCommand, signal
    },
      options);
    }




export const getBasicInfoReasonCreateMutationKey = () => ['basicInfoReasonCreate'] as const;

export const getBasicInfoReasonCreateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonCreate>>, TError,BasicInfoReasonCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonCreate>>, TError,BasicInfoReasonCreateMutationVariables, TContext> => {

const mutationKey = getBasicInfoReasonCreateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoReasonCreate>>, BasicInfoReasonCreateMutationVariables> = (props) => {
          const {schemeId,data} = props ?? {};

          return  basicInfoReasonCreate(schemeId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoReasonCreateMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoReasonCreate>>>
    export type BasicInfoReasonCreateMutationBody = BodyType<CreateReasonCommand> | undefined
    export type BasicInfoReasonCreateMutationError = ErrorType<ProblemDetails>
    export type BasicInfoReasonCreateMutationVariables = {schemeId: number;data?: BodyType<CreateReasonCommand>}

    /**
 * @summary افزودن یک مورد به فهرست طرح
 */
export const useBasicInfoReasonCreate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonCreate>>, TError,BasicInfoReasonCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoReasonCreate>>,
        TError,
        BasicInfoReasonCreateMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoReasonCreateMutationOptions(options), queryClient);
    }
    /**
 * ⚠ فهرست‌ها دیگر سراسری نیستند. این مسیر تا وقتی فقط یک طرح فعال باشد کار می‌کند و با طرح دوم خطای روشن می‌دهد. مسیر درست: Schemes/{schemeId}/Reasons.
 * @summary فهرست داینامیک طرح پیش‌فرض (برای سازگاری)
 */
export const basicInfoReasons = (
    params?: BasicInfoReasonsParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsReasonDto[] | null>(
      {url: `/facility-management/BasicInfo/Reasons`, method: 'GET',
        params, signal
    },
      options);
    }




export const getBasicInfoReasonsQueryKey = (params?: BasicInfoReasonsParams,) => {
    return [
    `/facility-management/BasicInfo/Reasons`, ...(params ? [params] : [])
    ] as const;
    }


export const getBasicInfoReasonsQueryOptions = <TData = Awaited<ReturnType<typeof basicInfoReasons>>, TError = ErrorType<unknown | ProblemDetails>>(params?: BasicInfoReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getBasicInfoReasonsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof basicInfoReasons>>> = ({ signal }) => basicInfoReasons(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type BasicInfoReasonsQueryResult = NonNullable<Awaited<ReturnType<typeof basicInfoReasons>>>
export type BasicInfoReasonsQueryError = ErrorType<unknown | ProblemDetails>


export function useBasicInfoReasons<TData = Awaited<ReturnType<typeof basicInfoReasons>>, TError = ErrorType<unknown | ProblemDetails>>(
 params: undefined |  BasicInfoReasonsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoReasons>>,
          TError,
          Awaited<ReturnType<typeof basicInfoReasons>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoReasons<TData = Awaited<ReturnType<typeof basicInfoReasons>>, TError = ErrorType<unknown | ProblemDetails>>(
 params?: BasicInfoReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof basicInfoReasons>>,
          TError,
          Awaited<ReturnType<typeof basicInfoReasons>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useBasicInfoReasons<TData = Awaited<ReturnType<typeof basicInfoReasons>>, TError = ErrorType<unknown | ProblemDetails>>(
 params?: BasicInfoReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary فهرست داینامیک طرح پیش‌فرض (برای سازگاری)
 */

export function useBasicInfoReasons<TData = Awaited<ReturnType<typeof basicInfoReasons>>, TError = ErrorType<unknown | ProblemDetails>>(
 params?: BasicInfoReasonsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof basicInfoReasons>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getBasicInfoReasonsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary ویرایش/غیرفعال کردن یک مورد
 */
export const basicInfoReasonUpdate = (
    schemeId: number,
    id: number,
    updateReasonCommand?: BodyType<UpdateReasonCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsReasonDto>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}/Reasons/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateReasonCommand, signal
    },
      options);
    }




export const getBasicInfoReasonUpdateMutationKey = () => ['basicInfoReasonUpdate'] as const;

export const getBasicInfoReasonUpdateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonUpdate>>, TError,BasicInfoReasonUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonUpdate>>, TError,BasicInfoReasonUpdateMutationVariables, TContext> => {

const mutationKey = getBasicInfoReasonUpdateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoReasonUpdate>>, BasicInfoReasonUpdateMutationVariables> = (props) => {
          const {schemeId,id,data} = props ?? {};

          return  basicInfoReasonUpdate(schemeId,id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoReasonUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoReasonUpdate>>>
    export type BasicInfoReasonUpdateMutationBody = BodyType<UpdateReasonCommand> | undefined
    export type BasicInfoReasonUpdateMutationError = ErrorType<ProblemDetails>
    export type BasicInfoReasonUpdateMutationVariables = {schemeId: number;id: number;data?: BodyType<UpdateReasonCommand>}

    /**
 * @summary ویرایش/غیرفعال کردن یک مورد
 */
export const useBasicInfoReasonUpdate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonUpdate>>, TError,BasicInfoReasonUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoReasonUpdate>>,
        TError,
        BasicInfoReasonUpdateMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoReasonUpdateMutationOptions(options), queryClient);
    }
    /**
 * @summary حذف یک مورد (نرم)
 */
export const basicInfoReasonDelete = (
    schemeId: number,
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<boolean>(
      {url: `/facility-management/BasicInfo/Schemes/${schemeId}/Reasons/${id}`, method: 'DELETE', signal
    },
      options);
    }




export const getBasicInfoReasonDeleteMutationKey = () => ['basicInfoReasonDelete'] as const;

export const getBasicInfoReasonDeleteMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonDelete>>, TError,BasicInfoReasonDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonDelete>>, TError,BasicInfoReasonDeleteMutationVariables, TContext> => {

const mutationKey = getBasicInfoReasonDeleteMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof basicInfoReasonDelete>>, BasicInfoReasonDeleteMutationVariables> = (props) => {
          const {schemeId,id} = props ?? {};

          return  basicInfoReasonDelete(schemeId,id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type BasicInfoReasonDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof basicInfoReasonDelete>>>

    export type BasicInfoReasonDeleteMutationError = ErrorType<ProblemDetails>
    export type BasicInfoReasonDeleteMutationVariables = {schemeId: number;id: number}

    /**
 * @summary حذف یک مورد (نرم)
 */
export const useBasicInfoReasonDelete = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof basicInfoReasonDelete>>, TError,BasicInfoReasonDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof basicInfoReasonDelete>>,
        TError,
        BasicInfoReasonDeleteMutationVariables,
        TContext
      > => {
      return useMutation(getBasicInfoReasonDeleteMutationOptions(options), queryClient);
    }
