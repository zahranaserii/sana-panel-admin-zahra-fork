/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  DashboardGetParams,
  DashboardRankingParams,
  ProblemDetails,
  ReadModelsCompanyRankingDto,
  ReadModelsDashboardDto,
  ReadModelsDashboardExport,
  ReadModelsMonthOptionDto
} from '../facilityPanelAPI.schemas';

import { apiClient } from '../../../../services/http/apiClient';
import type { ErrorType } from '../../../../services/http/apiClient';


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
 * ۴ KPI، وضعیت درخواست‌ها، سهم طرح‌ها، اعتبار در برابر تخصیص، تفاهم‌نامه‌ها به تفکیک ماه، عملکرد ماهانه، شرکت‌های حذف‌شده. همه در دامنهٔ کاربر.
 * @summary KPIها و نمودارها
 */
export const dashboardGet = (
    params?: DashboardGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsDashboardDto>(
      {url: `/gateway/facility-management/Dashboard`, method: 'GET',
        params, signal
    },
      options);
    }




export const getDashboardGetQueryKey = (params?: DashboardGetParams,) => {
    return [
    `/gateway/facility-management/Dashboard`, ...(params ? [params] : [])
    ] as const;
    }


export const getDashboardGetQueryOptions = <TData = Awaited<ReturnType<typeof dashboardGet>>, TError = ErrorType<ProblemDetails>>(params?: DashboardGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardGet>>> = ({ signal }) => dashboardGet(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardGetQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardGet>>>
export type DashboardGetQueryError = ErrorType<ProblemDetails>


export function useDashboardGet<TData = Awaited<ReturnType<typeof dashboardGet>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  DashboardGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardGet>>,
          TError,
          Awaited<ReturnType<typeof dashboardGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardGet<TData = Awaited<ReturnType<typeof dashboardGet>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardGet>>,
          TError,
          Awaited<ReturnType<typeof dashboardGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardGet<TData = Awaited<ReturnType<typeof dashboardGet>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary KPIها و نمودارها
 */

export function useDashboardGet<TData = Awaited<ReturnType<typeof dashboardGet>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * ماه خالی = تجمعی.
 * @summary رتبه‌بندی شرکت‌ها
 */
export const dashboardRanking = (
    params?: DashboardRankingParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsCompanyRankingDto[] | null>(
      {url: `/gateway/facility-management/Dashboard/CompanyRanking`, method: 'GET',
        params, signal
    },
      options);
    }




export const getDashboardRankingQueryKey = (params?: DashboardRankingParams,) => {
    return [
    `/gateway/facility-management/Dashboard/CompanyRanking`, ...(params ? [params] : [])
    ] as const;
    }


export const getDashboardRankingQueryOptions = <TData = Awaited<ReturnType<typeof dashboardRanking>>, TError = ErrorType<ProblemDetails>>(params?: DashboardRankingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardRankingQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardRanking>>> = ({ signal }) => dashboardRanking(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardRankingQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardRanking>>>
export type DashboardRankingQueryError = ErrorType<ProblemDetails>


export function useDashboardRanking<TData = Awaited<ReturnType<typeof dashboardRanking>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  DashboardRankingParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardRanking>>,
          TError,
          Awaited<ReturnType<typeof dashboardRanking>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardRanking<TData = Awaited<ReturnType<typeof dashboardRanking>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardRankingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardRanking>>,
          TError,
          Awaited<ReturnType<typeof dashboardRanking>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardRanking<TData = Awaited<ReturnType<typeof dashboardRanking>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardRankingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary رتبه‌بندی شرکت‌ها
 */

export function useDashboardRanking<TData = Awaited<ReturnType<typeof dashboardRanking>>, TError = ErrorType<ProblemDetails>>(
 params?: DashboardRankingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardRanking>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardRankingQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * کلید ماه همیشه قالب 1404/05 دارد؛ همین کلید را به CompanyRanking?month= بدهید. ترتیب: تازه‌ترین اول.
 * @summary ماه‌های دارای داده (برای فیلتر ماه و ترتیب ستون‌ها)
 */
export const dashboardMonths = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsMonthOptionDto[] | null>(
      {url: `/gateway/facility-management/Dashboard/Months`, method: 'GET', signal
    },
      options);
    }




export const getDashboardMonthsQueryKey = () => {
    return [
    `/gateway/facility-management/Dashboard/Months`
    ] as const;
    }


export const getDashboardMonthsQueryOptions = <TData = Awaited<ReturnType<typeof dashboardMonths>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardMonthsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardMonths>>> = ({ signal }) => dashboardMonths(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardMonthsQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardMonths>>>
export type DashboardMonthsQueryError = ErrorType<ProblemDetails>


export function useDashboardMonths<TData = Awaited<ReturnType<typeof dashboardMonths>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardMonths>>,
          TError,
          Awaited<ReturnType<typeof dashboardMonths>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardMonths<TData = Awaited<ReturnType<typeof dashboardMonths>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardMonths>>,
          TError,
          Awaited<ReturnType<typeof dashboardMonths>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardMonths<TData = Awaited<ReturnType<typeof dashboardMonths>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary ماه‌های دارای داده (برای فیلتر ماه و ترتیب ستون‌ها)
 */

export function useDashboardMonths<TData = Awaited<ReturnType<typeof dashboardMonths>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardMonths>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardMonthsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * Companies، Personnel، LoanRequests، MonthlyAverages، RemovedCompanies — فقط دادهٔ دامنهٔ کاربر.
 * @summary خروجی CSV (۵ دکمه)
 */
export const dashboardExport = (
    report: ReadModelsDashboardExport,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<unknown>(
      {url: `/gateway/facility-management/Dashboard/Exports/${report}`, method: 'GET', signal
    },
      options);
    }




export const getDashboardExportQueryKey = (report: ReadModelsDashboardExport,) => {
    return [
    `/gateway/facility-management/Dashboard/Exports/${report}`
    ] as const;
    }


export const getDashboardExportQueryOptions = <TData = Awaited<ReturnType<typeof dashboardExport>>, TError = ErrorType<ProblemDetails>>(report: ReadModelsDashboardExport, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardExportQueryKey(report);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardExport>>> = ({ signal }) => dashboardExport(report, requestOptions, signal);





   return  { queryKey, queryFn, enabled: report !== null && report !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardExportQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardExport>>>
export type DashboardExportQueryError = ErrorType<ProblemDetails>


export function useDashboardExport<TData = Awaited<ReturnType<typeof dashboardExport>>, TError = ErrorType<ProblemDetails>>(
 report: ReadModelsDashboardExport, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardExport>>,
          TError,
          Awaited<ReturnType<typeof dashboardExport>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardExport<TData = Awaited<ReturnType<typeof dashboardExport>>, TError = ErrorType<ProblemDetails>>(
 report: ReadModelsDashboardExport, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardExport>>,
          TError,
          Awaited<ReturnType<typeof dashboardExport>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardExport<TData = Awaited<ReturnType<typeof dashboardExport>>, TError = ErrorType<ProblemDetails>>(
 report: ReadModelsDashboardExport, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary خروجی CSV (۵ دکمه)
 */

export function useDashboardExport<TData = Awaited<ReturnType<typeof dashboardExport>>, TError = ErrorType<ProblemDetails>>(
 report: ReadModelsDashboardExport, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardExport>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardExportQueryOptions(report,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






