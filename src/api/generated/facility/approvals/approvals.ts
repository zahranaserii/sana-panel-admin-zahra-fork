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
  ApprovalsCreditDecideBody,
  ApprovalsCreditQueueParams,
  ApprovalsDigitalDecideBody,
  ApprovalsDigitalQueueParams,
  ApprovalsManagerQueueParams,
  CommandResponsesDecisionResultDto,
  CommandResponsesLoanRequestListItemDto,
  CommonFacilityPagedResponseOfLoanRequestListItemDto,
  DecideLoanRequestsCommand,
  ProblemDetails,
  ReadModelsPendingCountsDto,
  SetPostApprovalStageCommand
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
 * فقط درخواست‌هایی که اینجا تأیید شوند به «تأیید اعتبارات» می‌روند.
 * @summary صف تأیید مدیر شرکت
 */
export const approvalsManagerQueue = (
    params?: ApprovalsManagerQueueParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfLoanRequestListItemDto>(
      {url: `/gateway/facility-management/ManagerApprovals`, method: 'GET',
        params, signal
    },
      options);
    }




export const getApprovalsManagerQueueQueryKey = (params?: ApprovalsManagerQueueParams,) => {
    return [
    `/gateway/facility-management/ManagerApprovals`, ...(params ? [params] : [])
    ] as const;
    }


export const getApprovalsManagerQueueQueryOptions = <TData = Awaited<ReturnType<typeof approvalsManagerQueue>>, TError = ErrorType<ProblemDetails>>(params?: ApprovalsManagerQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getApprovalsManagerQueueQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof approvalsManagerQueue>>> = ({ signal }) => approvalsManagerQueue(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ApprovalsManagerQueueQueryResult = NonNullable<Awaited<ReturnType<typeof approvalsManagerQueue>>>
export type ApprovalsManagerQueueQueryError = ErrorType<ProblemDetails>


export function useApprovalsManagerQueue<TData = Awaited<ReturnType<typeof approvalsManagerQueue>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  ApprovalsManagerQueueParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsManagerQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsManagerQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsManagerQueue<TData = Awaited<ReturnType<typeof approvalsManagerQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsManagerQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsManagerQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsManagerQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsManagerQueue<TData = Awaited<ReturnType<typeof approvalsManagerQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsManagerQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary صف تأیید مدیر شرکت
 */

export function useApprovalsManagerQueue<TData = Awaited<ReturnType<typeof approvalsManagerQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsManagerQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsManagerQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getApprovalsManagerQueueQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * تأیید به manager-approval.approve و رد به manager-approval.reject نیاز دارد. رد: دلیل و توضیح الزامی (از «دلایل رد درخواست وام»، همان فهرست اعتبارات). اجرای ناقص مجاز است: ردیف‌های انجام‌نشده در skipped با دلیل برمی‌گردند.
 * @summary تأیید/رد گروهی یا تکی مدیر شرکت
 */
export const approvalsManagerDecide = (
    decideLoanRequestsCommand?: BodyType<DecideLoanRequestsCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesDecisionResultDto>(
      {url: `/gateway/facility-management/ManagerApprovals/Decisions`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: decideLoanRequestsCommand, signal
    },
      options);
    }




export const getApprovalsManagerDecideMutationKey = () => ['approvalsManagerDecide'] as const;

export const getApprovalsManagerDecideMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsManagerDecide>>, TError,ApprovalsManagerDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof approvalsManagerDecide>>, TError,ApprovalsManagerDecideMutationVariables, TContext> => {

const mutationKey = getApprovalsManagerDecideMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof approvalsManagerDecide>>, ApprovalsManagerDecideMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  approvalsManagerDecide(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ApprovalsManagerDecideMutationResult = NonNullable<Awaited<ReturnType<typeof approvalsManagerDecide>>>
    export type ApprovalsManagerDecideMutationBody = BodyType<DecideLoanRequestsCommand> | undefined
    export type ApprovalsManagerDecideMutationError = ErrorType<ProblemDetails>
    export type ApprovalsManagerDecideMutationVariables = {data?: BodyType<DecideLoanRequestsCommand>}

    /**
 * @summary تأیید/رد گروهی یا تکی مدیر شرکت
 */
export const useApprovalsManagerDecide = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsManagerDecide>>, TError,ApprovalsManagerDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof approvalsManagerDecide>>,
        TError,
        ApprovalsManagerDecideMutationVariables,
        TContext
      > => {
      return useMutation(getApprovalsManagerDecideMutationOptions(options), queryClient);
    }
    /**
 * کاربر شعبه فقط شرکت‌های شعبهٔ خود؛ فیلتر شرکت.
 * @summary صف تأیید اعتبارات (US-B7)
 */
export const approvalsCreditQueue = (
    params?: ApprovalsCreditQueueParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfLoanRequestListItemDto>(
      {url: `/gateway/facility-management/CreditApprovals`, method: 'GET',
        params, signal
    },
      options);
    }




export const getApprovalsCreditQueueQueryKey = (params?: ApprovalsCreditQueueParams,) => {
    return [
    `/gateway/facility-management/CreditApprovals`, ...(params ? [params] : [])
    ] as const;
    }


export const getApprovalsCreditQueueQueryOptions = <TData = Awaited<ReturnType<typeof approvalsCreditQueue>>, TError = ErrorType<ProblemDetails>>(params?: ApprovalsCreditQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getApprovalsCreditQueueQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof approvalsCreditQueue>>> = ({ signal }) => approvalsCreditQueue(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ApprovalsCreditQueueQueryResult = NonNullable<Awaited<ReturnType<typeof approvalsCreditQueue>>>
export type ApprovalsCreditQueueQueryError = ErrorType<ProblemDetails>


export function useApprovalsCreditQueue<TData = Awaited<ReturnType<typeof approvalsCreditQueue>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  ApprovalsCreditQueueParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsCreditQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsCreditQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsCreditQueue<TData = Awaited<ReturnType<typeof approvalsCreditQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsCreditQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsCreditQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsCreditQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsCreditQueue<TData = Awaited<ReturnType<typeof approvalsCreditQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsCreditQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary صف تأیید اعتبارات (US-B7)
 */

export function useApprovalsCreditQueue<TData = Awaited<ReturnType<typeof approvalsCreditQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsCreditQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsCreditQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getApprovalsCreditQueueQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * یک تراکنش، ولی اجرای ناقص مجاز است: ردیف‌هایی که در این مرحله نیستند یا خارج از دامنهٔ شمایند در skipped با دلیل برمی‌گردند و processed تعداد انجام‌شده است. رد: دلیل از فهرست و توضیح الزامی و برای همه یکسان. پیوست مصوبه اختیاری. postStage را در همین تصمیم بفرستید تا مرحلهٔ پس از تأیید گروهی ثبت شود (کلید facility.credit-approval.stage لازم است؛ برای عدم اعطای غیرحضوری postStageReasonId الزامی).
 * @summary تأیید/رد اعتبارات، تکی یا گروهی (US-B8)
 */
export const approvalsCreditDecide = (
    approvalsCreditDecideBody?: BodyType<ApprovalsCreditDecideBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(approvalsCreditDecideBody)
      return apiClient<CommandResponsesDecisionResultDto>(
      {url: `/gateway/facility-management/CreditApprovals/Decisions`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getApprovalsCreditDecideMutationKey = () => ['approvalsCreditDecide'] as const;

export const getApprovalsCreditDecideMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsCreditDecide>>, TError,ApprovalsCreditDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof approvalsCreditDecide>>, TError,ApprovalsCreditDecideMutationVariables, TContext> => {

const mutationKey = getApprovalsCreditDecideMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof approvalsCreditDecide>>, ApprovalsCreditDecideMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  approvalsCreditDecide(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ApprovalsCreditDecideMutationResult = NonNullable<Awaited<ReturnType<typeof approvalsCreditDecide>>>
    export type ApprovalsCreditDecideMutationBody = BodyType<ApprovalsCreditDecideBody> | undefined
    export type ApprovalsCreditDecideMutationError = ErrorType<ProblemDetails>
    export type ApprovalsCreditDecideMutationVariables = {data?: BodyType<ApprovalsCreditDecideBody>}

    /**
 * @summary تأیید/رد اعتبارات، تکی یا گروهی (US-B8)
 */
export const useApprovalsCreditDecide = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsCreditDecide>>, TError,ApprovalsCreditDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof approvalsCreditDecide>>,
        TError,
        ApprovalsCreditDecideMutationVariables,
        TContext
      > => {
      return useMutation(getApprovalsCreditDecideMutationOptions(options), queryClient);
    }
    /**
 * تشکیل پرونده در شعبه / دریافت تسهیلات از امید بانک / دریافت در شعبه / عدم اعطای غیرحضوری (دلیل الزامی). برای ثبت مرحله هم‌زمان با تأیید، postStage را به سرویس تصمیم بدهید؛ این سرویس برای تغییر بعدی است.
 * @summary تغییر مرحلهٔ پس از تأیید (برای درخواست تأییدشده)
 */
export const approvalsPostStage = (
    requestId: number,
    setPostApprovalStageCommand?: BodyType<SetPostApprovalStageCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesLoanRequestListItemDto>(
      {url: `/gateway/facility-management/CreditApprovals/${requestId}/PostApprovalStage`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: setPostApprovalStageCommand, signal
    },
      options);
    }




export const getApprovalsPostStageMutationKey = () => ['approvalsPostStage'] as const;

export const getApprovalsPostStageMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsPostStage>>, TError,ApprovalsPostStageMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof approvalsPostStage>>, TError,ApprovalsPostStageMutationVariables, TContext> => {

const mutationKey = getApprovalsPostStageMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof approvalsPostStage>>, ApprovalsPostStageMutationVariables> = (props) => {
          const {requestId,data} = props ?? {};

          return  approvalsPostStage(requestId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ApprovalsPostStageMutationResult = NonNullable<Awaited<ReturnType<typeof approvalsPostStage>>>
    export type ApprovalsPostStageMutationBody = BodyType<SetPostApprovalStageCommand> | undefined
    export type ApprovalsPostStageMutationError = ErrorType<ProblemDetails>
    export type ApprovalsPostStageMutationVariables = {requestId: number;data?: BodyType<SetPostApprovalStageCommand>}

    /**
 * @summary تغییر مرحلهٔ پس از تأیید (برای درخواست تأییدشده)
 */
export const useApprovalsPostStage = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsPostStage>>, TError,ApprovalsPostStageMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof approvalsPostStage>>,
        TError,
        ApprovalsPostStageMutationVariables,
        TContext
      > => {
      return useMutation(getApprovalsPostStageMutationOptions(options), queryClient);
    }
    /**
 * @summary صف تأیید شعبهٔ دیجیتال
 */
export const approvalsDigitalQueue = (
    params?: ApprovalsDigitalQueueParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfLoanRequestListItemDto>(
      {url: `/gateway/facility-management/DigitalApprovals`, method: 'GET',
        params, signal
    },
      options);
    }




export const getApprovalsDigitalQueueQueryKey = (params?: ApprovalsDigitalQueueParams,) => {
    return [
    `/gateway/facility-management/DigitalApprovals`, ...(params ? [params] : [])
    ] as const;
    }


export const getApprovalsDigitalQueueQueryOptions = <TData = Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError = ErrorType<ProblemDetails>>(params?: ApprovalsDigitalQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getApprovalsDigitalQueueQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof approvalsDigitalQueue>>> = ({ signal }) => approvalsDigitalQueue(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ApprovalsDigitalQueueQueryResult = NonNullable<Awaited<ReturnType<typeof approvalsDigitalQueue>>>
export type ApprovalsDigitalQueueQueryError = ErrorType<ProblemDetails>


export function useApprovalsDigitalQueue<TData = Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  ApprovalsDigitalQueueParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsDigitalQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsDigitalQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsDigitalQueue<TData = Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsDigitalQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsDigitalQueue>>,
          TError,
          Awaited<ReturnType<typeof approvalsDigitalQueue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsDigitalQueue<TData = Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsDigitalQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary صف تأیید شعبهٔ دیجیتال
 */

export function useApprovalsDigitalQueue<TData = Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError = ErrorType<ProblemDetails>>(
 params?: ApprovalsDigitalQueueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsDigitalQueue>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getApprovalsDigitalQueueQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary تأیید/رد شعبهٔ دیجیتال
 */
export const approvalsDigitalDecide = (
    approvalsDigitalDecideBody?: BodyType<ApprovalsDigitalDecideBody>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {

      const formData = toAspNetFormData(approvalsDigitalDecideBody)
      return apiClient<CommandResponsesDecisionResultDto>(
      {url: `/gateway/facility-management/DigitalApprovals/Decisions`, method: 'POST',
      headers: {'Content-Type': 'multipart/form-data', },
       data: formData, signal
    },
      options);
    }




export const getApprovalsDigitalDecideMutationKey = () => ['approvalsDigitalDecide'] as const;

export const getApprovalsDigitalDecideMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsDigitalDecide>>, TError,ApprovalsDigitalDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof approvalsDigitalDecide>>, TError,ApprovalsDigitalDecideMutationVariables, TContext> => {

const mutationKey = getApprovalsDigitalDecideMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof approvalsDigitalDecide>>, ApprovalsDigitalDecideMutationVariables> = (props) => {
          const {data} = props ?? {};

          return  approvalsDigitalDecide(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ApprovalsDigitalDecideMutationResult = NonNullable<Awaited<ReturnType<typeof approvalsDigitalDecide>>>
    export type ApprovalsDigitalDecideMutationBody = BodyType<ApprovalsDigitalDecideBody> | undefined
    export type ApprovalsDigitalDecideMutationError = ErrorType<ProblemDetails>
    export type ApprovalsDigitalDecideMutationVariables = {data?: BodyType<ApprovalsDigitalDecideBody>}

    /**
 * @summary تأیید/رد شعبهٔ دیجیتال
 */
export const useApprovalsDigitalDecide = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof approvalsDigitalDecide>>, TError,ApprovalsDigitalDecideMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof approvalsDigitalDecide>>,
        TError,
        ApprovalsDigitalDecideMutationVariables,
        TContext
      > => {
      return useMutation(getApprovalsDigitalDecideMutationOptions(options), queryClient);
    }
    /**
 * برای مراحلی که کاربر مجوز دیدنشان را ندارد null برمی‌گردد.
 * @summary تعداد در انتظار روی تب‌ها
 */
export const approvalsPendingCounts = (

 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsPendingCountsDto>(
      {url: `/gateway/facility-management/Approvals/PendingCounts`, method: 'GET', signal
    },
      options);
    }




export const getApprovalsPendingCountsQueryKey = () => {
    return [
    `/gateway/facility-management/Approvals/PendingCounts`
    ] as const;
    }


export const getApprovalsPendingCountsQueryOptions = <TData = Awaited<ReturnType<typeof approvalsPendingCounts>>, TError = ErrorType<ProblemDetails>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getApprovalsPendingCountsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof approvalsPendingCounts>>> = ({ signal }) => approvalsPendingCounts(requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ApprovalsPendingCountsQueryResult = NonNullable<Awaited<ReturnType<typeof approvalsPendingCounts>>>
export type ApprovalsPendingCountsQueryError = ErrorType<ProblemDetails>


export function useApprovalsPendingCounts<TData = Awaited<ReturnType<typeof approvalsPendingCounts>>, TError = ErrorType<ProblemDetails>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsPendingCounts>>,
          TError,
          Awaited<ReturnType<typeof approvalsPendingCounts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsPendingCounts<TData = Awaited<ReturnType<typeof approvalsPendingCounts>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof approvalsPendingCounts>>,
          TError,
          Awaited<ReturnType<typeof approvalsPendingCounts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useApprovalsPendingCounts<TData = Awaited<ReturnType<typeof approvalsPendingCounts>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary تعداد در انتظار روی تب‌ها
 */

export function useApprovalsPendingCounts<TData = Awaited<ReturnType<typeof approvalsPendingCounts>>, TError = ErrorType<ProblemDetails>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof approvalsPendingCounts>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getApprovalsPendingCountsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






