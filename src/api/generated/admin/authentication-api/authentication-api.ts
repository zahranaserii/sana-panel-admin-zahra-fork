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
  AuthenticationLogoutGetParams,
  LoginQuery
} from '../adminApi.schemas';

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

export const authenticationLoginPost = (
    loginQuery?: BodyType<LoginQuery>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/Authentication/Login`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: loginQuery, signal
    },
      options);
    }




export const getAuthenticationLoginPostMutationKey = () => ['authenticationLoginPost'] as const;

export const getAuthenticationLoginPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authenticationLoginPost>>, TError,AuthenticationLoginPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof authenticationLoginPost>>, TError,AuthenticationLoginPostMutationVariables, TContext> => {

const mutationKey = getAuthenticationLoginPostMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authenticationLoginPost>>, AuthenticationLoginPostMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  authenticationLoginPost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthenticationLoginPostMutationResult = NonNullable<Awaited<ReturnType<typeof authenticationLoginPost>>>
    export type AuthenticationLoginPostMutationBody = BodyType<LoginQuery> | undefined
    export type AuthenticationLoginPostMutationError = ErrorType<unknown>
    export type AuthenticationLoginPostMutationVariables = {data?: BodyType<LoginQuery>}

    export const useAuthenticationLoginPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authenticationLoginPost>>, TError,AuthenticationLoginPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authenticationLoginPost>>,
        TError,
        AuthenticationLoginPostMutationVariables,
        TContext
      > => {
      return useMutation(getAuthenticationLoginPostMutationOptions(options), queryClient);
    }
    export const authenticationGenerateGet = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/Authentication/Generate`, method: 'GET', signal
    },
      options);
    }




export const getAuthenticationGenerateGetQueryKey = () => {
    return [
    `/identity/Authentication/Generate`
    ] as const;
    }


export const getAuthenticationGenerateGetQueryOptions = <TData = Awaited<ReturnType<typeof authenticationGenerateGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthenticationGenerateGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authenticationGenerateGet>>> = ({ signal }) => authenticationGenerateGet(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthenticationGenerateGetQueryResult = NonNullable<Awaited<ReturnType<typeof authenticationGenerateGet>>>
export type AuthenticationGenerateGetQueryError = ErrorType<unknown>


export function useAuthenticationGenerateGet<TData = Awaited<ReturnType<typeof authenticationGenerateGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authenticationGenerateGet>>,
          TError,
          Awaited<ReturnType<typeof authenticationGenerateGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthenticationGenerateGet<TData = Awaited<ReturnType<typeof authenticationGenerateGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authenticationGenerateGet>>,
          TError,
          Awaited<ReturnType<typeof authenticationGenerateGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthenticationGenerateGet<TData = Awaited<ReturnType<typeof authenticationGenerateGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthenticationGenerateGet<TData = Awaited<ReturnType<typeof authenticationGenerateGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationGenerateGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthenticationGenerateGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const authenticationMainMenuGet = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/Authentication/MainMenu`, method: 'GET', signal
    },
      options);
    }




export const getAuthenticationMainMenuGetQueryKey = () => {
    return [
    `/identity/Authentication/MainMenu`
    ] as const;
    }


export const getAuthenticationMainMenuGetQueryOptions = <TData = Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthenticationMainMenuGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authenticationMainMenuGet>>> = ({ signal }) => authenticationMainMenuGet(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthenticationMainMenuGetQueryResult = NonNullable<Awaited<ReturnType<typeof authenticationMainMenuGet>>>
export type AuthenticationMainMenuGetQueryError = ErrorType<unknown>


export function useAuthenticationMainMenuGet<TData = Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authenticationMainMenuGet>>,
          TError,
          Awaited<ReturnType<typeof authenticationMainMenuGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthenticationMainMenuGet<TData = Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authenticationMainMenuGet>>,
          TError,
          Awaited<ReturnType<typeof authenticationMainMenuGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthenticationMainMenuGet<TData = Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthenticationMainMenuGet<TData = Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authenticationMainMenuGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthenticationMainMenuGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const authenticationLogoutGet = (
    params?: AuthenticationLogoutGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/Authentication/Logout`, method: 'GET',
        params, signal
    },
      options);
    }




export const getAuthenticationLogoutGetMutationKey = () => ['authenticationLogoutGet'] as const;

export const getAuthenticationLogoutGetMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authenticationLogoutGet>>, TError,AuthenticationLogoutGetMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof authenticationLogoutGet>>, TError,AuthenticationLogoutGetMutationVariables, TContext> => {

const mutationKey = getAuthenticationLogoutGetMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authenticationLogoutGet>>, AuthenticationLogoutGetMutationVariables> = (props) => {
          const {params} = props ?? {};

          return  authenticationLogoutGet(params,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthenticationLogoutGetMutationResult = NonNullable<Awaited<ReturnType<typeof authenticationLogoutGet>>>

    export type AuthenticationLogoutGetMutationError = ErrorType<unknown>
    export type AuthenticationLogoutGetMutationVariables = {params?: AuthenticationLogoutGetParams}

    export const useAuthenticationLogoutGet = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authenticationLogoutGet>>, TError,AuthenticationLogoutGetMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authenticationLogoutGet>>,
        TError,
        AuthenticationLogoutGetMutationVariables,
        TContext
      > => {
      return useMutation(getAuthenticationLogoutGetMutationOptions(options), queryClient);
    }
