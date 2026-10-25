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
  CommonFacilityLookupItemDto,
  InternalCompanyLookupParams,
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
 * هدر X-Api-Key لازم است.
 * @summary Lookup همهٔ شرکت‌ها برای Identity
 */
export const internalCompanyLookup = (
    params?: InternalCompanyLookupParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityLookupItemDto[] | null>(
      {url: `/facility-management/Internal/Companies/Lookup`, method: 'GET',
        params, signal
    },
      options);
    }




export const getInternalCompanyLookupQueryKey = (params?: InternalCompanyLookupParams,) => {
    return [
    `/facility-management/Internal/Companies/Lookup`, ...(params ? [params] : [])
    ] as const;
    }


export const getInternalCompanyLookupQueryOptions = <TData = Awaited<ReturnType<typeof internalCompanyLookup>>, TError = ErrorType<ProblemDetails>>(params?: InternalCompanyLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getInternalCompanyLookupQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof internalCompanyLookup>>> = ({ signal }) => internalCompanyLookup(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type InternalCompanyLookupQueryResult = NonNullable<Awaited<ReturnType<typeof internalCompanyLookup>>>
export type InternalCompanyLookupQueryError = ErrorType<ProblemDetails>


export function useInternalCompanyLookup<TData = Awaited<ReturnType<typeof internalCompanyLookup>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  InternalCompanyLookupParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof internalCompanyLookup>>,
          TError,
          Awaited<ReturnType<typeof internalCompanyLookup>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useInternalCompanyLookup<TData = Awaited<ReturnType<typeof internalCompanyLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: InternalCompanyLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof internalCompanyLookup>>,
          TError,
          Awaited<ReturnType<typeof internalCompanyLookup>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useInternalCompanyLookup<TData = Awaited<ReturnType<typeof internalCompanyLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: InternalCompanyLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Lookup همهٔ شرکت‌ها برای Identity
 */

export function useInternalCompanyLookup<TData = Awaited<ReturnType<typeof internalCompanyLookup>>, TError = ErrorType<ProblemDetails>>(
 params?: InternalCompanyLookupParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof internalCompanyLookup>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getInternalCompanyLookupQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






