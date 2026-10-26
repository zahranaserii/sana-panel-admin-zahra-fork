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
  CommonEnumCatalogDto,
  ProblemDetails
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
 * فرانت یک بار می‌خواند و کش می‌کند؛ عنوان وضعیت‌ها را در کد خودش تکرار نمی‌کند.
 * @summary عنوان همهٔ enumها. کلیدی لازم ندارد چون چیزی از دادهٔ شرکت‌ها نمی‌گوید — ولی
[RequirePermission] بدون کلید هست، پس نشست معتبر لازم است و مسیر
از قاعدهٔ «هر مسیر باید تعیین تکلیف شده باشد» بیرون نمی‌افتد.
 */
export const lookupsEnums = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonEnumCatalogDto>(
      {url: `/facility-management/Lookups/Enums`, method: 'GET', signal
    },
      options);
    }




export const getLookupsEnumsQueryKey = () => {
    return [
    `/facility-management/Lookups/Enums`
    ] as const;
    }


export const getLookupsEnumsQueryOptions = <TData = Awaited<ReturnType<typeof lookupsEnums>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLookupsEnumsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof lookupsEnums>>> = ({ signal }) => lookupsEnums(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LookupsEnumsQueryResult = NonNullable<Awaited<ReturnType<typeof lookupsEnums>>>
export type LookupsEnumsQueryError = ErrorType<ProblemDetails>


export function useLookupsEnums<TData = Awaited<ReturnType<typeof lookupsEnums>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof lookupsEnums>>,
          TError,
          Awaited<ReturnType<typeof lookupsEnums>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLookupsEnums<TData = Awaited<ReturnType<typeof lookupsEnums>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof lookupsEnums>>,
          TError,
          Awaited<ReturnType<typeof lookupsEnums>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLookupsEnums<TData = Awaited<ReturnType<typeof lookupsEnums>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary عنوان همهٔ enumها. کلیدی لازم ندارد چون چیزی از دادهٔ شرکت‌ها نمی‌گوید — ولی
[RequirePermission] بدون کلید هست، پس نشست معتبر لازم است و مسیر
از قاعدهٔ «هر مسیر باید تعیین تکلیف شده باشد» بیرون نمی‌افتد.
 */

export function useLookupsEnums<TData = Awaited<ReturnType<typeof lookupsEnums>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof lookupsEnums>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLookupsEnumsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






