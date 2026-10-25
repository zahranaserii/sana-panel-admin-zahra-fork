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
  CommonFacilityPagedResponseOfPersonnelListItemDto,
  CreatePersonnelCommand,
  DecidePersonnelCommand,
  PersonnelDeleteBody,
  PersonnelImportBody,
  PersonnelSearchParams,
  ProblemDetails,
  ReadModelsPersonnelDetailsDto,
  ReadModelsPersonnelImportResultDto,
  UpdatePersonnelCommand
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
 * جستجو در نام، کد ملی، موبایل، کد پرسنلی + بازهٔ تاریخ استخدام. مرتب بر اساس اولویت. در انتظار/ردشده فقط برای ادمین، منابع انسانی و مدیر همان شرکت.
 * @summary پرسنل یک شرکت
 */
export const personnelSearch = (
    companyId: number,
    params?: PersonnelSearchParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfPersonnelListItemDto>(
      {url: `/facility-management/Companies/${companyId}/Personnel`, method: 'GET',
        params, signal
    },
      options);
    }




export const getPersonnelSearchQueryKey = (companyId: number,
    params?: PersonnelSearchParams,) => {
    return [
    `/facility-management/Companies/${companyId}/Personnel`, ...(params ? [params] : [])
    ] as const;
    }


export const getPersonnelSearchQueryOptions = <TData = Awaited<ReturnType<typeof personnelSearch>>, TError = ErrorType<ProblemDetails>>(companyId: number,
    params?: PersonnelSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPersonnelSearchQueryKey(companyId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof personnelSearch>>> = ({ signal }) => personnelSearch(companyId,params, requestOptions, signal);





   return  { queryKey, queryFn, enabled: companyId !== null && companyId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PersonnelSearchQueryResult = NonNullable<Awaited<ReturnType<typeof personnelSearch>>>
export type PersonnelSearchQueryError = ErrorType<ProblemDetails>


export function usePersonnelSearch<TData = Awaited<ReturnType<typeof personnelSearch>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params: undefined |  PersonnelSearchParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelSearch>>,
          TError,
          Awaited<ReturnType<typeof personnelSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelSearch<TData = Awaited<ReturnType<typeof personnelSearch>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: PersonnelSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelSearch>>,
          TError,
          Awaited<ReturnType<typeof personnelSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelSearch<TData = Awaited<ReturnType<typeof personnelSearch>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: PersonnelSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary پرسنل یک شرکت
 */

export function usePersonnelSearch<TData = Awaited<ReturnType<typeof personnelSearch>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: PersonnelSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPersonnelSearchQueryOptions(companyId,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * با وضعیت «در انتظار تأیید مدیر شرکت» ثبت می‌شود.
 * @summary افزودن پرسنل
 */
export const personnelCreate = (
    companyId: number,
    createPersonnelCommand?: BodyType<CreatePersonnelCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPersonnelDetailsDto>(
      {url: `/facility-management/Companies/${companyId}/Personnel`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createPersonnelCommand, signal
    },
      options);
    }




export const getPersonnelCreateMutationKey = () => ['personnelCreate'] as const;

export const getPersonnelCreateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelCreate>>, TError,PersonnelCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof personnelCreate>>, TError,PersonnelCreateMutationVariables, TContext> => {

const mutationKey = getPersonnelCreateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof personnelCreate>>, PersonnelCreateMutationVariables> = (props) => {
          const {companyId,data} = props ?? {};

          return  personnelCreate(companyId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PersonnelCreateMutationResult = NonNullable<Awaited<ReturnType<typeof personnelCreate>>>
    export type PersonnelCreateMutationBody = BodyType<CreatePersonnelCommand> | undefined
    export type PersonnelCreateMutationError = ErrorType<ProblemDetails>
    export type PersonnelCreateMutationVariables = {companyId: number;data?: BodyType<CreatePersonnelCommand>}

    /**
 * @summary افزودن پرسنل
 */
export const usePersonnelCreate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelCreate>>, TError,PersonnelCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof personnelCreate>>,
        TError,
        PersonnelCreateMutationVariables,
        TContext
      > => {
      return useMutation(getPersonnelCreateMutationOptions(options), queryClient);
    }
    /**
 * @summary جزئیات و تاریخچهٔ وضعیت (US-E3)
 */
export const personnelGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPersonnelDetailsDto>(
      {url: `/facility-management/Personnel/${id}`, method: 'GET', signal
    },
      options);
    }




export const getPersonnelGetQueryKey = (id: number,) => {
    return [
    `/facility-management/Personnel/${id}`
    ] as const;
    }


export const getPersonnelGetQueryOptions = <TData = Awaited<ReturnType<typeof personnelGet>>, TError = ErrorType<ProblemDetails>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPersonnelGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof personnelGet>>> = ({ signal }) => personnelGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PersonnelGetQueryResult = NonNullable<Awaited<ReturnType<typeof personnelGet>>>
export type PersonnelGetQueryError = ErrorType<ProblemDetails>


export function usePersonnelGet<TData = Awaited<ReturnType<typeof personnelGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelGet>>,
          TError,
          Awaited<ReturnType<typeof personnelGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelGet<TData = Awaited<ReturnType<typeof personnelGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelGet>>,
          TError,
          Awaited<ReturnType<typeof personnelGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelGet<TData = Awaited<ReturnType<typeof personnelGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary جزئیات و تاریخچهٔ وضعیت (US-E3)
 */

export function usePersonnelGet<TData = Awaited<ReturnType<typeof personnelGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPersonnelGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * برای فرد ردشده وضعیت دوباره «در انتظار تأیید مدیر» می‌شود. فرد استفاده‌شده در وام قفل است.
 * @summary ویرایش یا اصلاح و ارسال دوباره
 */
export const personnelUpdate = (
    id: number,
    updatePersonnelCommand?: BodyType<UpdatePersonnelCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPersonnelDetailsDto>(
      {url: `/facility-management/Personnel/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updatePersonnelCommand, signal
    },
      options);
    }




export const getPersonnelUpdateMutationKey = () => ['personnelUpdate'] as const;

export const getPersonnelUpdateMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelUpdate>>, TError,PersonnelUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof personnelUpdate>>, TError,PersonnelUpdateMutationVariables, TContext> => {

const mutationKey = getPersonnelUpdateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof personnelUpdate>>, PersonnelUpdateMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  personnelUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PersonnelUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof personnelUpdate>>>
    export type PersonnelUpdateMutationBody = BodyType<UpdatePersonnelCommand> | undefined
    export type PersonnelUpdateMutationError = ErrorType<ProblemDetails>
    export type PersonnelUpdateMutationVariables = {id: number;data?: BodyType<UpdatePersonnelCommand>}

    /**
 * @summary ویرایش یا اصلاح و ارسال دوباره
 */
export const usePersonnelUpdate = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelUpdate>>, TError,PersonnelUpdateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof personnelUpdate>>,
        TError,
        PersonnelUpdateMutationVariables,
        TContext
      > => {
      return useMutation(getPersonnelUpdateMutationOptions(options), queryClient);
    }
    /**
 * توضیح و فایل الزامی. POST چون فایل دارد.
 * @summary حذف پرسنل
 */
export const personnelDelete = (
    id: number,
    personnelDeleteBody?: BodyType<PersonnelDeleteBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(personnelDeleteBody)
      return apiClient<boolean>(
      {url: `/facility-management/Personnel/${id}/Delete`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getPersonnelDeleteMutationKey = () => ['personnelDelete'] as const;

export const getPersonnelDeleteMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelDelete>>, TError,PersonnelDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof personnelDelete>>, TError,PersonnelDeleteMutationVariables, TContext> => {

const mutationKey = getPersonnelDeleteMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof personnelDelete>>, PersonnelDeleteMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  personnelDelete(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PersonnelDeleteMutationResult = NonNullable<Awaited<ReturnType<typeof personnelDelete>>>
    export type PersonnelDeleteMutationBody = BodyType<PersonnelDeleteBody> | undefined
    export type PersonnelDeleteMutationError = ErrorType<ProblemDetails>
    export type PersonnelDeleteMutationVariables = {id: number;data?: BodyType<PersonnelDeleteBody>}

    /**
 * @summary حذف پرسنل
 */
export const usePersonnelDelete = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelDelete>>, TError,PersonnelDeleteMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof personnelDelete>>,
        TError,
        PersonnelDeleteMutationVariables,
        TContext
      > => {
      return useMutation(getPersonnelDeleteMutationOptions(options), queryClient);
    }
    /**
 * @summary دانلود نمونه فایل اکسل
 */
export const personnelImportTemplate = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<unknown>(
      {url: `/facility-management/Personnel/Import/Template`, method: 'GET', signal
    },
      options);
    }




export const getPersonnelImportTemplateQueryKey = () => {
    return [
    `/facility-management/Personnel/Import/Template`
    ] as const;
    }


export const getPersonnelImportTemplateQueryOptions = <TData = Awaited<ReturnType<typeof personnelImportTemplate>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPersonnelImportTemplateQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof personnelImportTemplate>>> = ({ signal }) => personnelImportTemplate(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PersonnelImportTemplateQueryResult = NonNullable<Awaited<ReturnType<typeof personnelImportTemplate>>>
export type PersonnelImportTemplateQueryError = ErrorType<ProblemDetails>


export function usePersonnelImportTemplate<TData = Awaited<ReturnType<typeof personnelImportTemplate>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelImportTemplate>>,
          TError,
          Awaited<ReturnType<typeof personnelImportTemplate>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelImportTemplate<TData = Awaited<ReturnType<typeof personnelImportTemplate>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelImportTemplate>>,
          TError,
          Awaited<ReturnType<typeof personnelImportTemplate>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelImportTemplate<TData = Awaited<ReturnType<typeof personnelImportTemplate>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary دانلود نمونه فایل اکسل
 */

export function usePersonnelImportTemplate<TData = Awaited<ReturnType<typeof personnelImportTemplate>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportTemplate>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPersonnelImportTemplateQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * xlsx, xls, csv تا ۱۰ مگابایت. خطای هر ردیف برمی‌گردد.
 * @summary بارگذاری گروهی (US-E2)
 */
export const personnelImport = (
    companyId: number,
    personnelImportBody?: BodyType<PersonnelImportBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(personnelImportBody)
      return apiClient<ReadModelsPersonnelImportResultDto>(
      {url: `/facility-management/Companies/${companyId}/Personnel/Import`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getPersonnelImportMutationKey = () => ['personnelImport'] as const;

export const getPersonnelImportMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelImport>>, TError,PersonnelImportMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof personnelImport>>, TError,PersonnelImportMutationVariables, TContext> => {

const mutationKey = getPersonnelImportMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof personnelImport>>, PersonnelImportMutationVariables> = (props) => {
          const {companyId,data} = props ?? {};

          return  personnelImport(companyId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PersonnelImportMutationResult = NonNullable<Awaited<ReturnType<typeof personnelImport>>>
    export type PersonnelImportMutationBody = BodyType<PersonnelImportBody> | undefined
    export type PersonnelImportMutationError = ErrorType<ProblemDetails>
    export type PersonnelImportMutationVariables = {companyId: number;data?: BodyType<PersonnelImportBody>}

    /**
 * @summary بارگذاری گروهی (US-E2)
 */
export const usePersonnelImport = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelImport>>, TError,PersonnelImportMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof personnelImport>>,
        TError,
        PersonnelImportMutationVariables,
        TContext
      > => {
      return useMutation(getPersonnelImportMutationOptions(options), queryClient);
    }
    /**
 * @summary نتیجهٔ یک بارگذاری
 */
export const personnelImportResult = (
    batchId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPersonnelImportResultDto>(
      {url: `/facility-management/Personnel/Import/${batchId}`, method: 'GET', signal
    },
      options);
    }




export const getPersonnelImportResultQueryKey = (batchId: number,) => {
    return [
    `/facility-management/Personnel/Import/${batchId}`
    ] as const;
    }


export const getPersonnelImportResultQueryOptions = <TData = Awaited<ReturnType<typeof personnelImportResult>>, TError = ErrorType<ProblemDetails>>(batchId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPersonnelImportResultQueryKey(batchId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof personnelImportResult>>> = ({ signal }) => personnelImportResult(batchId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: batchId !== null && batchId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PersonnelImportResultQueryResult = NonNullable<Awaited<ReturnType<typeof personnelImportResult>>>
export type PersonnelImportResultQueryError = ErrorType<ProblemDetails>


export function usePersonnelImportResult<TData = Awaited<ReturnType<typeof personnelImportResult>>, TError = ErrorType<ProblemDetails>>(
 batchId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelImportResult>>,
          TError,
          Awaited<ReturnType<typeof personnelImportResult>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelImportResult<TData = Awaited<ReturnType<typeof personnelImportResult>>, TError = ErrorType<ProblemDetails>>(
 batchId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof personnelImportResult>>,
          TError,
          Awaited<ReturnType<typeof personnelImportResult>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePersonnelImportResult<TData = Awaited<ReturnType<typeof personnelImportResult>>, TError = ErrorType<ProblemDetails>>(
 batchId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary نتیجهٔ یک بارگذاری
 */

export function usePersonnelImportResult<TData = Awaited<ReturnType<typeof personnelImportResult>>, TError = ErrorType<ProblemDetails>>(
 batchId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof personnelImportResult>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPersonnelImportResultQueryOptions(batchId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * تکی یا گروهی، در یک تراکنش.
 * @summary تأیید/رد افراد معرفی‌شده (US-D1)
 */
export const personnelDecide = (
    decidePersonnelCommand?: BodyType<DecidePersonnelCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<number>(
      {url: `/facility-management/Personnel/Decisions`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: decidePersonnelCommand, signal
    },
      options);
    }




export const getPersonnelDecideMutationKey = () => ['personnelDecide'] as const;

export const getPersonnelDecideMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelDecide>>, TError,PersonnelDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof personnelDecide>>, TError,PersonnelDecideMutationVariables, TContext> => {

const mutationKey = getPersonnelDecideMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof personnelDecide>>, PersonnelDecideMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  personnelDecide(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PersonnelDecideMutationResult = NonNullable<Awaited<ReturnType<typeof personnelDecide>>>
    export type PersonnelDecideMutationBody = BodyType<DecidePersonnelCommand> | undefined
    export type PersonnelDecideMutationError = ErrorType<ProblemDetails>
    export type PersonnelDecideMutationVariables = {data?: BodyType<DecidePersonnelCommand>}

    /**
 * @summary تأیید/رد افراد معرفی‌شده (US-D1)
 */
export const usePersonnelDecide = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof personnelDecide>>, TError,PersonnelDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof personnelDecide>>,
        TError,
        PersonnelDecideMutationVariables,
        TContext
      > => {
      return useMutation(getPersonnelDecideMutationOptions(options), queryClient);
    }
