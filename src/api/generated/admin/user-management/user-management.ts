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
  CreateAccessCommand,
  CreateRoleCommand,
  UpdateAccessCommand,
  UpdateRoleCommand,
  UserManagementAccessesGetParams,
  UserManagementGroupsGetParams,
  UserManagementPanelUsersByIdActivePutParams,
  UserManagementPanelUsersGetParams,
  UserManagementRolesGetParams
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

export const userManagementAccessesGet = (
    params?: UserManagementAccessesGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Accesses`, method: 'GET',
        params, signal
    },
      options);
    }




export const getUserManagementAccessesGetQueryKey = (params?: UserManagementAccessesGetParams,) => {
    return [
    `/identity/UserManagement/Accesses`, ...(params ? [params] : [])
    ] as const;
    }


export const getUserManagementAccessesGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementAccessesGet>>, TError = ErrorType<unknown>>(params?: UserManagementAccessesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementAccessesGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementAccessesGet>>> = ({ signal }) => userManagementAccessesGet(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementAccessesGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementAccessesGet>>>
export type UserManagementAccessesGetQueryError = ErrorType<unknown>


export function useUserManagementAccessesGet<TData = Awaited<ReturnType<typeof userManagementAccessesGet>>, TError = ErrorType<unknown>>(
 params: undefined |  UserManagementAccessesGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessesGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessesGet<TData = Awaited<ReturnType<typeof userManagementAccessesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementAccessesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessesGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessesGet<TData = Awaited<ReturnType<typeof userManagementAccessesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementAccessesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementAccessesGet<TData = Awaited<ReturnType<typeof userManagementAccessesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementAccessesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementAccessesGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementAccessesPost = (
    createAccessCommand?: BodyType<CreateAccessCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Accesses`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: createAccessCommand, signal
    },
      options);
    }




export const getUserManagementAccessesPostMutationKey = () => ['userManagementAccessesPost'] as const;

export const getUserManagementAccessesPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesPost>>, TError,UserManagementAccessesPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesPost>>, TError,UserManagementAccessesPostMutationVariables, TContext> => {

const mutationKey = getUserManagementAccessesPostMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementAccessesPost>>, UserManagementAccessesPostMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  userManagementAccessesPost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementAccessesPostMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementAccessesPost>>>
    export type UserManagementAccessesPostMutationBody = BodyType<CreateAccessCommand> | undefined
    export type UserManagementAccessesPostMutationError = ErrorType<unknown>
    export type UserManagementAccessesPostMutationVariables = {data?: BodyType<CreateAccessCommand>}

    export const useUserManagementAccessesPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesPost>>, TError,UserManagementAccessesPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementAccessesPost>>,
        TError,
        UserManagementAccessesPostMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementAccessesPostMutationOptions(options), queryClient);
    }
    export const userManagementAccessesByIdGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Accesses/${id}`, method: 'GET', signal
    },
      options);
    }




export const getUserManagementAccessesByIdGetQueryKey = (id: number,) => {
    return [
    `/identity/UserManagement/Accesses/${id}`
    ] as const;
    }


export const getUserManagementAccessesByIdGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError = ErrorType<unknown>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementAccessesByIdGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>> = ({ signal }) => userManagementAccessesByIdGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementAccessesByIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>>
export type UserManagementAccessesByIdGetQueryError = ErrorType<unknown>


export function useUserManagementAccessesByIdGet<TData = Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessesByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessesByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessesByIdGet<TData = Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessesByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessesByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessesByIdGet<TData = Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementAccessesByIdGet<TData = Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementAccessesByIdGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementAccessesByIdPut = (
    id: number,
    updateAccessCommand?: BodyType<UpdateAccessCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Accesses/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: updateAccessCommand, signal
    },
      options);
    }




export const getUserManagementAccessesByIdPutMutationKey = () => ['userManagementAccessesByIdPut'] as const;

export const getUserManagementAccessesByIdPutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesByIdPut>>, TError,UserManagementAccessesByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesByIdPut>>, TError,UserManagementAccessesByIdPutMutationVariables, TContext> => {

const mutationKey = getUserManagementAccessesByIdPutMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementAccessesByIdPut>>, UserManagementAccessesByIdPutMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  userManagementAccessesByIdPut(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementAccessesByIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementAccessesByIdPut>>>
    export type UserManagementAccessesByIdPutMutationBody = BodyType<UpdateAccessCommand> | undefined
    export type UserManagementAccessesByIdPutMutationError = ErrorType<unknown>
    export type UserManagementAccessesByIdPutMutationVariables = {id: number;data?: BodyType<UpdateAccessCommand>}

    export const useUserManagementAccessesByIdPut = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementAccessesByIdPut>>, TError,UserManagementAccessesByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementAccessesByIdPut>>,
        TError,
        UserManagementAccessesByIdPutMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementAccessesByIdPutMutationOptions(options), queryClient);
    }
    export const userManagementRolesGet = (
    params?: UserManagementRolesGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Roles`, method: 'GET',
        params, signal
    },
      options);
    }




export const getUserManagementRolesGetQueryKey = (params?: UserManagementRolesGetParams,) => {
    return [
    `/identity/UserManagement/Roles`, ...(params ? [params] : [])
    ] as const;
    }


export const getUserManagementRolesGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementRolesGet>>, TError = ErrorType<unknown>>(params?: UserManagementRolesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementRolesGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementRolesGet>>> = ({ signal }) => userManagementRolesGet(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementRolesGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementRolesGet>>>
export type UserManagementRolesGetQueryError = ErrorType<unknown>


export function useUserManagementRolesGet<TData = Awaited<ReturnType<typeof userManagementRolesGet>>, TError = ErrorType<unknown>>(
 params: undefined |  UserManagementRolesGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementRolesGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementRolesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementRolesGet<TData = Awaited<ReturnType<typeof userManagementRolesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementRolesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementRolesGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementRolesGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementRolesGet<TData = Awaited<ReturnType<typeof userManagementRolesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementRolesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementRolesGet<TData = Awaited<ReturnType<typeof userManagementRolesGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementRolesGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementRolesGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementRolesPost = (
    createRoleCommand?: BodyType<CreateRoleCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Roles`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: createRoleCommand, signal
    },
      options);
    }




export const getUserManagementRolesPostMutationKey = () => ['userManagementRolesPost'] as const;

export const getUserManagementRolesPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesPost>>, TError,UserManagementRolesPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesPost>>, TError,UserManagementRolesPostMutationVariables, TContext> => {

const mutationKey = getUserManagementRolesPostMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementRolesPost>>, UserManagementRolesPostMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  userManagementRolesPost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementRolesPostMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementRolesPost>>>
    export type UserManagementRolesPostMutationBody = BodyType<CreateRoleCommand> | undefined
    export type UserManagementRolesPostMutationError = ErrorType<unknown>
    export type UserManagementRolesPostMutationVariables = {data?: BodyType<CreateRoleCommand>}

    export const useUserManagementRolesPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesPost>>, TError,UserManagementRolesPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementRolesPost>>,
        TError,
        UserManagementRolesPostMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementRolesPostMutationOptions(options), queryClient);
    }
    export const userManagementRolesByIdGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Roles/${id}`, method: 'GET', signal
    },
      options);
    }




export const getUserManagementRolesByIdGetQueryKey = (id: number,) => {
    return [
    `/identity/UserManagement/Roles/${id}`
    ] as const;
    }


export const getUserManagementRolesByIdGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError = ErrorType<unknown>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementRolesByIdGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementRolesByIdGet>>> = ({ signal }) => userManagementRolesByIdGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementRolesByIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementRolesByIdGet>>>
export type UserManagementRolesByIdGetQueryError = ErrorType<unknown>


export function useUserManagementRolesByIdGet<TData = Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementRolesByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementRolesByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementRolesByIdGet<TData = Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementRolesByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementRolesByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementRolesByIdGet<TData = Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementRolesByIdGet<TData = Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementRolesByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementRolesByIdGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementRolesByIdPut = (
    id: number,
    updateRoleCommand?: BodyType<UpdateRoleCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Roles/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: updateRoleCommand, signal
    },
      options);
    }




export const getUserManagementRolesByIdPutMutationKey = () => ['userManagementRolesByIdPut'] as const;

export const getUserManagementRolesByIdPutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesByIdPut>>, TError,UserManagementRolesByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesByIdPut>>, TError,UserManagementRolesByIdPutMutationVariables, TContext> => {

const mutationKey = getUserManagementRolesByIdPutMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementRolesByIdPut>>, UserManagementRolesByIdPutMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  userManagementRolesByIdPut(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementRolesByIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementRolesByIdPut>>>
    export type UserManagementRolesByIdPutMutationBody = BodyType<UpdateRoleCommand> | undefined
    export type UserManagementRolesByIdPutMutationError = ErrorType<unknown>
    export type UserManagementRolesByIdPutMutationVariables = {id: number;data?: BodyType<UpdateRoleCommand>}

    export const useUserManagementRolesByIdPut = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementRolesByIdPut>>, TError,UserManagementRolesByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementRolesByIdPut>>,
        TError,
        UserManagementRolesByIdPutMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementRolesByIdPutMutationOptions(options), queryClient);
    }
    export const userManagementGroupsGet = (
    params?: UserManagementGroupsGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Groups`, method: 'GET',
        params, signal
    },
      options);
    }




export const getUserManagementGroupsGetQueryKey = (params?: UserManagementGroupsGetParams,) => {
    return [
    `/identity/UserManagement/Groups`, ...(params ? [params] : [])
    ] as const;
    }


export const getUserManagementGroupsGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementGroupsGet>>, TError = ErrorType<unknown>>(params?: UserManagementGroupsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementGroupsGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementGroupsGet>>> = ({ signal }) => userManagementGroupsGet(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementGroupsGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementGroupsGet>>>
export type UserManagementGroupsGetQueryError = ErrorType<unknown>


export function useUserManagementGroupsGet<TData = Awaited<ReturnType<typeof userManagementGroupsGet>>, TError = ErrorType<unknown>>(
 params: undefined |  UserManagementGroupsGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementGroupsGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementGroupsGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementGroupsGet<TData = Awaited<ReturnType<typeof userManagementGroupsGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementGroupsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementGroupsGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementGroupsGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementGroupsGet<TData = Awaited<ReturnType<typeof userManagementGroupsGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementGroupsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementGroupsGet<TData = Awaited<ReturnType<typeof userManagementGroupsGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementGroupsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementGroupsGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementGroupsPost = (
    createRoleCommand?: BodyType<CreateRoleCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Groups`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: createRoleCommand, signal
    },
      options);
    }




export const getUserManagementGroupsPostMutationKey = () => ['userManagementGroupsPost'] as const;

export const getUserManagementGroupsPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsPost>>, TError,UserManagementGroupsPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsPost>>, TError,UserManagementGroupsPostMutationVariables, TContext> => {

const mutationKey = getUserManagementGroupsPostMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementGroupsPost>>, UserManagementGroupsPostMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  userManagementGroupsPost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementGroupsPostMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementGroupsPost>>>
    export type UserManagementGroupsPostMutationBody = BodyType<CreateRoleCommand> | undefined
    export type UserManagementGroupsPostMutationError = ErrorType<unknown>
    export type UserManagementGroupsPostMutationVariables = {data?: BodyType<CreateRoleCommand>}

    export const useUserManagementGroupsPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsPost>>, TError,UserManagementGroupsPostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementGroupsPost>>,
        TError,
        UserManagementGroupsPostMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementGroupsPostMutationOptions(options), queryClient);
    }
    export const userManagementGroupsByIdGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Groups/${id}`, method: 'GET', signal
    },
      options);
    }




export const getUserManagementGroupsByIdGetQueryKey = (id: number,) => {
    return [
    `/identity/UserManagement/Groups/${id}`
    ] as const;
    }


export const getUserManagementGroupsByIdGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError = ErrorType<unknown>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementGroupsByIdGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>> = ({ signal }) => userManagementGroupsByIdGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementGroupsByIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>>
export type UserManagementGroupsByIdGetQueryError = ErrorType<unknown>


export function useUserManagementGroupsByIdGet<TData = Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementGroupsByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementGroupsByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementGroupsByIdGet<TData = Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementGroupsByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementGroupsByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementGroupsByIdGet<TData = Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementGroupsByIdGet<TData = Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementGroupsByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementGroupsByIdGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementGroupsByIdPut = (
    id: number,
    updateRoleCommand?: BodyType<UpdateRoleCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/Groups/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: updateRoleCommand, signal
    },
      options);
    }




export const getUserManagementGroupsByIdPutMutationKey = () => ['userManagementGroupsByIdPut'] as const;

export const getUserManagementGroupsByIdPutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsByIdPut>>, TError,UserManagementGroupsByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsByIdPut>>, TError,UserManagementGroupsByIdPutMutationVariables, TContext> => {

const mutationKey = getUserManagementGroupsByIdPutMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementGroupsByIdPut>>, UserManagementGroupsByIdPutMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  userManagementGroupsByIdPut(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementGroupsByIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementGroupsByIdPut>>>
    export type UserManagementGroupsByIdPutMutationBody = BodyType<UpdateRoleCommand> | undefined
    export type UserManagementGroupsByIdPutMutationError = ErrorType<unknown>
    export type UserManagementGroupsByIdPutMutationVariables = {id: number;data?: BodyType<UpdateRoleCommand>}

    export const useUserManagementGroupsByIdPut = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementGroupsByIdPut>>, TError,UserManagementGroupsByIdPutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementGroupsByIdPut>>,
        TError,
        UserManagementGroupsByIdPutMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementGroupsByIdPutMutationOptions(options), queryClient);
    }
    export const userManagementPanelUsersGet = (
    params?: UserManagementPanelUsersGetParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/PanelUsers`, method: 'GET',
        params, signal
    },
      options);
    }




export const getUserManagementPanelUsersGetQueryKey = (params?: UserManagementPanelUsersGetParams,) => {
    return [
    `/identity/UserManagement/PanelUsers`, ...(params ? [params] : [])
    ] as const;
    }


export const getUserManagementPanelUsersGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError = ErrorType<unknown>>(params?: UserManagementPanelUsersGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementPanelUsersGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementPanelUsersGet>>> = ({ signal }) => userManagementPanelUsersGet(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementPanelUsersGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementPanelUsersGet>>>
export type UserManagementPanelUsersGetQueryError = ErrorType<unknown>


export function useUserManagementPanelUsersGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError = ErrorType<unknown>>(
 params: undefined |  UserManagementPanelUsersGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementPanelUsersGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementPanelUsersGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementPanelUsersGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementPanelUsersGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementPanelUsersGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementPanelUsersGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementPanelUsersGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementPanelUsersGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementPanelUsersGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError = ErrorType<unknown>>(
 params?: UserManagementPanelUsersGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementPanelUsersGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementPanelUsersByIdGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/PanelUsers/${id}`, method: 'GET', signal
    },
      options);
    }




export const getUserManagementPanelUsersByIdGetQueryKey = (id: number,) => {
    return [
    `/identity/UserManagement/PanelUsers/${id}`
    ] as const;
    }


export const getUserManagementPanelUsersByIdGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError = ErrorType<unknown>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementPanelUsersByIdGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>> = ({ signal }) => userManagementPanelUsersByIdGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementPanelUsersByIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>>
export type UserManagementPanelUsersByIdGetQueryError = ErrorType<unknown>


export function useUserManagementPanelUsersByIdGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementPanelUsersByIdGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementPanelUsersByIdGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementPanelUsersByIdGet<TData = Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError = ErrorType<unknown>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementPanelUsersByIdGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






export const userManagementPanelUsersByIdActivePut = (
    id: number,
    params?: UserManagementPanelUsersByIdActivePutParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/PanelUsers/${id}/Active`, method: 'PUT',
        params, signal
    },
      options);
    }




export const getUserManagementPanelUsersByIdActivePutMutationKey = () => ['userManagementPanelUsersByIdActivePut'] as const;

export const getUserManagementPanelUsersByIdActivePutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>, TError,UserManagementPanelUsersByIdActivePutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>, TError,UserManagementPanelUsersByIdActivePutMutationVariables, TContext> => {

const mutationKey = getUserManagementPanelUsersByIdActivePutMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>, UserManagementPanelUsersByIdActivePutMutationVariables> = (props) => {
          const {id,params} = props ?? {};

          return  userManagementPanelUsersByIdActivePut(id,params,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserManagementPanelUsersByIdActivePutMutationResult = NonNullable<Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>>

    export type UserManagementPanelUsersByIdActivePutMutationError = ErrorType<unknown>
    export type UserManagementPanelUsersByIdActivePutMutationVariables = {id: number;params?: UserManagementPanelUsersByIdActivePutParams}

    export const useUserManagementPanelUsersByIdActivePut = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>, TError,UserManagementPanelUsersByIdActivePutMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userManagementPanelUsersByIdActivePut>>,
        TError,
        UserManagementPanelUsersByIdActivePutMutationVariables,
        TContext
      > => {
      return useMutation(getUserManagementPanelUsersByIdActivePutMutationOptions(options), queryClient);
    }
    export const userManagementAccessMatrixGet = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/UserManagement/AccessMatrix`, method: 'GET', signal
    },
      options);
    }




export const getUserManagementAccessMatrixGetQueryKey = () => {
    return [
    `/identity/UserManagement/AccessMatrix`
    ] as const;
    }


export const getUserManagementAccessMatrixGetQueryOptions = <TData = Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserManagementAccessMatrixGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>> = ({ signal }) => userManagementAccessMatrixGet(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserManagementAccessMatrixGetQueryResult = NonNullable<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>>
export type UserManagementAccessMatrixGetQueryError = ErrorType<unknown>


export function useUserManagementAccessMatrixGet<TData = Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessMatrixGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessMatrixGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessMatrixGet<TData = Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userManagementAccessMatrixGet>>,
          TError,
          Awaited<ReturnType<typeof userManagementAccessMatrixGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserManagementAccessMatrixGet<TData = Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserManagementAccessMatrixGet<TData = Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userManagementAccessMatrixGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserManagementAccessMatrixGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






