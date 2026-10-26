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
  ChangeLogsExportParams,
  ChangeLogsSearchParams,
  CommandResponsesChangeLogItemDto,
  CommonFacilityPagedResponseOfChangeLogItemDto,
  CommonFileLinkDto,
  CommonRegistrarDto,
  ProblemDetails,
  RestoreChangeCommand
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
 * فیلتر دسته (1 شرکت، 2 پرسنل، 3 وام، 4 کاربران، 5 اطلاعات پایه؛ عنوان‌ها در Lookups/Enums)، شرکت، کاربر، تاریخ، متن؛ در دامنهٔ کاربر. همهٔ فرایندها (ثبت/ویرایش/حذف/لغو/تصمیم/بارگذاری فایل) لاگ می‌شوند.
 * @summary لاگ عملیات
 */
export const changeLogsSearch = (
    params?: ChangeLogsSearchParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfChangeLogItemDto>(
      {url: `/facility-management/ChangeLogs`, method: 'GET',
        params, signal
    },
      options);
    }




export const getChangeLogsSearchQueryKey = (params?: ChangeLogsSearchParams,) => {
    return [
    `/facility-management/ChangeLogs`, ...(params ? [params] : [])
    ] as const;
    }


export const getChangeLogsSearchQueryOptions = <TData = Awaited<ReturnType<typeof changeLogsSearch>>, TError = ErrorType<ProblemDetails>>(params?: ChangeLogsSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getChangeLogsSearchQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof changeLogsSearch>>> = ({ signal }) => changeLogsSearch(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ChangeLogsSearchQueryResult = NonNullable<Awaited<ReturnType<typeof changeLogsSearch>>>
export type ChangeLogsSearchQueryError = ErrorType<ProblemDetails>


export function useChangeLogsSearch<TData = Awaited<ReturnType<typeof changeLogsSearch>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  ChangeLogsSearchParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsSearch>>,
          TError,
          Awaited<ReturnType<typeof changeLogsSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsSearch<TData = Awaited<ReturnType<typeof changeLogsSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsSearch>>,
          TError,
          Awaited<ReturnType<typeof changeLogsSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsSearch<TData = Awaited<ReturnType<typeof changeLogsSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary لاگ عملیات
 */

export function useChangeLogsSearch<TData = Awaited<ReturnType<typeof changeLogsSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getChangeLogsSearchQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فقط کاربرانی که ردیف‌هایشان در دامنهٔ کاربر جاری دیده می‌شود؛ panelUserId همان چیزی است که به فیلتر داده می‌شود.
 * @summary کاربران دارای ردیف در گزارش (برای سلکت فیلتر)
 */
export const changeLogsUsers = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonRegistrarDto[] | null>(
      {url: `/facility-management/ChangeLogs/Users`, method: 'GET', signal
    },
      options);
    }




export const getChangeLogsUsersQueryKey = () => {
    return [
    `/facility-management/ChangeLogs/Users`
    ] as const;
    }


export const getChangeLogsUsersQueryOptions = <TData = Awaited<ReturnType<typeof changeLogsUsers>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getChangeLogsUsersQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof changeLogsUsers>>> = ({ signal }) => changeLogsUsers(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ChangeLogsUsersQueryResult = NonNullable<Awaited<ReturnType<typeof changeLogsUsers>>>
export type ChangeLogsUsersQueryError = ErrorType<ProblemDetails>


export function useChangeLogsUsers<TData = Awaited<ReturnType<typeof changeLogsUsers>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsUsers>>,
          TError,
          Awaited<ReturnType<typeof changeLogsUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsUsers<TData = Awaited<ReturnType<typeof changeLogsUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsUsers>>,
          TError,
          Awaited<ReturnType<typeof changeLogsUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsUsers<TData = Awaited<ReturnType<typeof changeLogsUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary کاربران دارای ردیف در گزارش (برای سلکت فیلتر)
 */

export function useChangeLogsUsers<TData = Awaited<ReturnType<typeof changeLogsUsers>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsUsers>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getChangeLogsUsersQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فیلترها دقیقاً همان فیلترهای لیست‌اند (شامل جستجوی متنی و فیلتر کاربر). پاسخ لینک موقت فایل xlsx است.
 * @summary خروجی اکسل گزارش (xlsx)
 */
export const changeLogsExport = (
    params?: ChangeLogsExportParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFileLinkDto>(
      {url: `/facility-management/ChangeLogs/Export`, method: 'GET',
        params, signal
    },
      options);
    }




export const getChangeLogsExportQueryKey = (params?: ChangeLogsExportParams,) => {
    return [
    `/facility-management/ChangeLogs/Export`, ...(params ? [params] : [])
    ] as const;
    }


export const getChangeLogsExportQueryOptions = <TData = Awaited<ReturnType<typeof changeLogsExport>>, TError = ErrorType<ProblemDetails>>(params?: ChangeLogsExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getChangeLogsExportQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof changeLogsExport>>> = ({ signal }) => changeLogsExport(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ChangeLogsExportQueryResult = NonNullable<Awaited<ReturnType<typeof changeLogsExport>>>
export type ChangeLogsExportQueryError = ErrorType<ProblemDetails>


export function useChangeLogsExport<TData = Awaited<ReturnType<typeof changeLogsExport>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  ChangeLogsExportParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsExport>>,
          TError,
          Awaited<ReturnType<typeof changeLogsExport>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsExport<TData = Awaited<ReturnType<typeof changeLogsExport>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof changeLogsExport>>,
          TError,
          Awaited<ReturnType<typeof changeLogsExport>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useChangeLogsExport<TData = Awaited<ReturnType<typeof changeLogsExport>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary خروجی اکسل گزارش (xlsx)
 */

export function useChangeLogsExport<TData = Awaited<ReturnType<typeof changeLogsExport>>, TError = ErrorType<ProblemDetails>>(
 params?: ChangeLogsExportParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof changeLogsExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getChangeLogsExportQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فقط ادمین، فقط یک بار برای هر ردیف (canRestore در فهرست). قابل بازگردانی: ویرایش شرکت، حذف شرکت، میانگین موجودی، حذف مستند، ویرایش پرسنل، حذف پرسنل، اطلاعات پایه/طرح. تصمیم‌های تأیید/رد، عملیات وام و لغو قرارداد بازگردانی ندارند. اگر رکورد بعد از آن تغییر دوباره ویرایش شده باشد (یا بعد از تغییر میانگین وامی ثبت شده باشد) با 400 و پیام روشن رد می‌شود. توضیح الزامی.
 * @summary بازگردانی عملیات (US-A4)
 */
export const changeLogsRestore = (
    id: number,
    restoreChangeCommand?: BodyType<RestoreChangeCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesChangeLogItemDto>(
      {url: `/facility-management/ChangeLogs/${id}/Restore`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: restoreChangeCommand, signal
    },
      options);
    }




export const getChangeLogsRestoreMutationKey = () => ['changeLogsRestore'] as const;

export const getChangeLogsRestoreMutationOptions = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeLogsRestore>>, TError,ChangeLogsRestoreMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof changeLogsRestore>>, TError,ChangeLogsRestoreMutationVariables, TContext> => {

const mutationKey = getChangeLogsRestoreMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof changeLogsRestore>>, ChangeLogsRestoreMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  changeLogsRestore(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ChangeLogsRestoreMutationResult = NonNullable<Awaited<ReturnType<typeof changeLogsRestore>>>
    export type ChangeLogsRestoreMutationBody = BodyType<RestoreChangeCommand> | undefined
    export type ChangeLogsRestoreMutationError = ErrorType<unknown | ProblemDetails>
    export type ChangeLogsRestoreMutationVariables = {id: number;data?: BodyType<RestoreChangeCommand>}

    /**
 * @summary بازگردانی عملیات (US-A4)
 */
export const useChangeLogsRestore = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof changeLogsRestore>>, TError,ChangeLogsRestoreMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof changeLogsRestore>>,
        TError,
        ChangeLogsRestoreMutationVariables,
        TContext
      > => {
      return useMutation(getChangeLogsRestoreMutationOptions(options), queryClient);
    }
