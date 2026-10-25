/**
 * تولید خودکار با Orval از روی OpenAPI — دستی ویرایش نشود (npm run api:generate)
 */
import {
  useMutation
} from '@tanstack/react-query';
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';

import type {
  ResolveRequest
} from '../adminApi.schemas';

import { apiClient } from '../../../../services/http/apiClient';
import type { ErrorType , BodyType } from '../../../../services/http/apiClient';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const internalAuthorizationResolvePost = (
    resolveRequest?: BodyType<ResolveRequest>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<void>(
      {url: `/identity/Internal/Authorization/Resolve`, method: 'POST',
      headers: {'Content-Type': 'application/json; x-api-version=2', },
      data: resolveRequest, signal
    },
      options);
    }




export const getInternalAuthorizationResolvePostMutationKey = () => ['internalAuthorizationResolvePost'] as const;

export const getInternalAuthorizationResolvePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof internalAuthorizationResolvePost>>, TError,InternalAuthorizationResolvePostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof internalAuthorizationResolvePost>>, TError,InternalAuthorizationResolvePostMutationVariables, TContext> => {

const mutationKey = getInternalAuthorizationResolvePostMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof internalAuthorizationResolvePost>>, InternalAuthorizationResolvePostMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  internalAuthorizationResolvePost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type InternalAuthorizationResolvePostMutationResult = NonNullable<Awaited<ReturnType<typeof internalAuthorizationResolvePost>>>
    export type InternalAuthorizationResolvePostMutationBody = BodyType<ResolveRequest> | undefined
    export type InternalAuthorizationResolvePostMutationError = ErrorType<unknown>
    export type InternalAuthorizationResolvePostMutationVariables = {data?: BodyType<ResolveRequest>}

    export const useInternalAuthorizationResolvePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof internalAuthorizationResolvePost>>, TError,InternalAuthorizationResolvePostMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof internalAuthorizationResolvePost>>,
        TError,
        InternalAuthorizationResolvePostMutationVariables,
        TContext
      > => {
      return useMutation(getInternalAuthorizationResolvePostMutationOptions(options), queryClient);
    }
