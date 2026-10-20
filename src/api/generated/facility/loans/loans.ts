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
  AddLoanBatchMemberCommand,
  CancelLoanRequestCommand,
  CommandResponsesLoanBatchDto,
  CommandResponsesLoanRequestListItemDto,
  CommonFacilityPagedResponseOfLoanRequestListItemDto,
  CreateLoanRequestsCommand,
  LoansCreditParams,
  LoansSearchParams,
  PreviewLoanRequestQuery,
  ProblemDetails,
  ReadModelsCompanyCreditDto,
  ReadModelsLoanRequestDetailsDto,
  ReadModelsLoanRequestPreviewDto
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
 * بنر: مهلت معرفی نرسیده / امروز روز مجاز انتقال نیست / مجاز است. جدول اعتبار هر طرح تفاهم‌نامه.
 * @summary اعتبار طرح‌ها و بنر وضعیت (US-E4، D2)
 */
export const loansCredit = (
    companyId: number,
    params?: LoansCreditParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsCompanyCreditDto>(
      {url: `/gateway/facility-management/Companies/${companyId}/Credit`, method: 'GET',
        params, signal
    },
      options);
    }




export const getLoansCreditQueryKey = (companyId: number,
    params?: LoansCreditParams,) => {
    return [
    `/gateway/facility-management/Companies/${companyId}/Credit`, ...(params ? [params] : [])
    ] as const;
    }


export const getLoansCreditQueryOptions = <TData = Awaited<ReturnType<typeof loansCredit>>, TError = ErrorType<ProblemDetails>>(companyId: number,
    params?: LoansCreditParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLoansCreditQueryKey(companyId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof loansCredit>>> = ({ signal }) => loansCredit(companyId,params, requestOptions, signal);





   return  { queryKey, queryFn, enabled: companyId !== null && companyId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LoansCreditQueryResult = NonNullable<Awaited<ReturnType<typeof loansCredit>>>
export type LoansCreditQueryError = ErrorType<ProblemDetails>


export function useLoansCredit<TData = Awaited<ReturnType<typeof loansCredit>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params: undefined |  LoansCreditParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansCredit>>,
          TError,
          Awaited<ReturnType<typeof loansCredit>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansCredit<TData = Awaited<ReturnType<typeof loansCredit>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: LoansCreditParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansCredit>>,
          TError,
          Awaited<ReturnType<typeof loansCredit>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansCredit<TData = Awaited<ReturnType<typeof loansCredit>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: LoansCreditParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary اعتبار طرح‌ها و بنر وضعیت (US-E4، D2)
 */

export function useLoansCredit<TData = Awaited<ReturnType<typeof loansCredit>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    params?: LoansCreditParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansCredit>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLoansCreditQueryOptions(companyId,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * مجموع، مجاز بودن، «حداکثر تا N نفر با این مبلغ»، هشدار تجاوز از اعتبار، و repeatAllocations: افرادی که در همین ماه قبلاً وام گرفته‌اند. repeatAllocations هشدار است نه خطا — isAllowed را عوض نمی‌کند و ثبت را قفل نمی‌کند؛ فرانت فهرست را نشان می‌دهد و تأیید دوباره می‌گیرد. چیزی ذخیره نمی‌شود.
 * @summary هینت‌های زندهٔ فرم (US-E5، D6)
 */
export const loansPreview = (
    companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsLoanRequestPreviewDto>(
      {url: `/gateway/facility-management/Companies/${companyId}/LoanRequests/Preview`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: previewLoanRequestQuery, signal
    },
      options);
    }




export const getLoansPreviewQueryKey = (companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>,) => {
    return [
    'POST', `/gateway/facility-management/Companies/${companyId}/LoanRequests/Preview`, previewLoanRequestQuery
    ] as const;
    }


export const getLoansPreviewQueryOptions = <TData = Awaited<ReturnType<typeof loansPreview>>, TError = ErrorType<ProblemDetails>>(companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLoansPreviewQueryKey(companyId,previewLoanRequestQuery);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof loansPreview>>> = ({ signal }) => loansPreview(companyId,previewLoanRequestQuery, requestOptions, signal);





   return  { queryKey, queryFn, enabled: companyId !== null && companyId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LoansPreviewQueryResult = NonNullable<Awaited<ReturnType<typeof loansPreview>>>
export type LoansPreviewQueryError = ErrorType<ProblemDetails>


export function useLoansPreview<TData = Awaited<ReturnType<typeof loansPreview>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    previewLoanRequestQuery: undefined |  BodyType<PreviewLoanRequestQuery>, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansPreview>>,
          TError,
          Awaited<ReturnType<typeof loansPreview>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansPreview<TData = Awaited<ReturnType<typeof loansPreview>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansPreview>>,
          TError,
          Awaited<ReturnType<typeof loansPreview>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansPreview<TData = Awaited<ReturnType<typeof loansPreview>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary هینت‌های زندهٔ فرم (US-E5، D6)
 */

export function useLoansPreview<TData = Awaited<ReturnType<typeof loansPreview>>, TError = ErrorType<ProblemDetails>>(
 companyId: number,
    previewLoanRequestQuery?: BodyType<PreviewLoanRequestQuery>, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansPreview>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLoansPreviewQueryOptions(companyId,previewLoanRequestQuery,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * مبلغ یکسان یا متفاوت؛ مجموع ≤ مانده اعتبار طرح؛ تاریخ مبنا در یک ماه گذشته بر اساس روز افتتاح حساب. درخواست‌ها به صف «تأیید مدیر شرکت» می‌روند.
 * @summary ثبت درخواست برای پرسنل انتخاب‌شده (US-D3)
 */
export const loansCreate = (
    companyId: number,
    createLoanRequestsCommand?: BodyType<CreateLoanRequestsCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesLoanBatchDto>(
      {url: `/gateway/facility-management/Companies/${companyId}/LoanRequests`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createLoanRequestsCommand, signal
    },
      options);
    }




export const getLoansCreateMutationKey = () => ['loansCreate'] as const;

export const getLoansCreateMutationOptions = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansCreate>>, TError,LoansCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof loansCreate>>, TError,LoansCreateMutationVariables, TContext> => {

const mutationKey = getLoansCreateMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof loansCreate>>, LoansCreateMutationVariables> = (props) => {
          const {companyId,data} = props ?? {};

          return  loansCreate(companyId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoansCreateMutationResult = NonNullable<Awaited<ReturnType<typeof loansCreate>>>
    export type LoansCreateMutationBody = BodyType<CreateLoanRequestsCommand> | undefined
    export type LoansCreateMutationError = ErrorType<unknown | ProblemDetails>
    export type LoansCreateMutationVariables = {companyId: number;data?: BodyType<CreateLoanRequestsCommand>}

    /**
 * @summary ثبت درخواست برای پرسنل انتخاب‌شده (US-D3)
 */
export const useLoansCreate = <TError = ErrorType<unknown | ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansCreate>>, TError,LoansCreateMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof loansCreate>>,
        TError,
        LoansCreateMutationVariables,
        TContext
      > => {
      return useMutation(getLoansCreateMutationOptions(options), queryClient);
    }
    /**
 * همهٔ درخواست‌های دامنهٔ کاربر؛ برای «درخواست‌های وام این شرکت» CompanyId بده. با تاریخ ثبت، تاریخ تأیید/رد و وضعیت.
 * @summary درخواست‌های وام
 */
export const loansSearch = (
    params?: LoansSearchParams,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommonFacilityPagedResponseOfLoanRequestListItemDto>(
      {url: `/gateway/facility-management/LoanRequests`, method: 'GET',
        params, signal
    },
      options);
    }




export const getLoansSearchQueryKey = (params?: LoansSearchParams,) => {
    return [
    `/gateway/facility-management/LoanRequests`, ...(params ? [params] : [])
    ] as const;
    }


export const getLoansSearchQueryOptions = <TData = Awaited<ReturnType<typeof loansSearch>>, TError = ErrorType<ProblemDetails>>(params?: LoansSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLoansSearchQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof loansSearch>>> = ({ signal }) => loansSearch(params, requestOptions, signal);





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LoansSearchQueryResult = NonNullable<Awaited<ReturnType<typeof loansSearch>>>
export type LoansSearchQueryError = ErrorType<ProblemDetails>


export function useLoansSearch<TData = Awaited<ReturnType<typeof loansSearch>>, TError = ErrorType<ProblemDetails>>(
 params: undefined |  LoansSearchParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansSearch>>,
          TError,
          Awaited<ReturnType<typeof loansSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansSearch<TData = Awaited<ReturnType<typeof loansSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: LoansSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansSearch>>,
          TError,
          Awaited<ReturnType<typeof loansSearch>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansSearch<TData = Awaited<ReturnType<typeof loansSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: LoansSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary درخواست‌های وام
 */

export function useLoansSearch<TData = Awaited<ReturnType<typeof loansSearch>>, TError = ErrorType<ProblemDetails>>(
 params?: LoansSearchParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansSearch>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLoansSearchQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * @summary جزئیات درخواست و تاریخچهٔ تصمیم‌ها
 */
export const loansGet = (
    id: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<ReadModelsLoanRequestDetailsDto>(
      {url: `/gateway/facility-management/LoanRequests/${id}`, method: 'GET', signal
    },
      options);
    }




export const getLoansGetQueryKey = (id: number,) => {
    return [
    `/gateway/facility-management/LoanRequests/${id}`
    ] as const;
    }


export const getLoansGetQueryOptions = <TData = Awaited<ReturnType<typeof loansGet>>, TError = ErrorType<ProblemDetails>>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLoansGetQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof loansGet>>> = ({ signal }) => loansGet(id, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LoansGetQueryResult = NonNullable<Awaited<ReturnType<typeof loansGet>>>
export type LoansGetQueryError = ErrorType<ProblemDetails>


export function useLoansGet<TData = Awaited<ReturnType<typeof loansGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansGet>>,
          TError,
          Awaited<ReturnType<typeof loansGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansGet<TData = Awaited<ReturnType<typeof loansGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansGet>>,
          TError,
          Awaited<ReturnType<typeof loansGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansGet<TData = Awaited<ReturnType<typeof loansGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary جزئیات درخواست و تاریخچهٔ تصمیم‌ها
 */

export function useLoansGet<TData = Awaited<ReturnType<typeof loansGet>>, TError = ErrorType<ProblemDetails>>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansGet>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLoansGetQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * قبل از تأیید اعتبارات.
 * @summary افزودن فرد به درخواست (US-D4)
 */
export const loansAddMember = (
    batchId: number,
    addLoanBatchMemberCommand?: BodyType<AddLoanBatchMemberCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesLoanBatchDto>(
      {url: `/gateway/facility-management/LoanBatches/${batchId}/Members`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: addLoanBatchMemberCommand, signal
    },
      options);
    }




export const getLoansAddMemberMutationKey = () => ['loansAddMember'] as const;

export const getLoansAddMemberMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansAddMember>>, TError,LoansAddMemberMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof loansAddMember>>, TError,LoansAddMemberMutationVariables, TContext> => {

const mutationKey = getLoansAddMemberMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof loansAddMember>>, LoansAddMemberMutationVariables> = (props) => {
          const {batchId,data} = props ?? {};

          return  loansAddMember(batchId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoansAddMemberMutationResult = NonNullable<Awaited<ReturnType<typeof loansAddMember>>>
    export type LoansAddMemberMutationBody = BodyType<AddLoanBatchMemberCommand> | undefined
    export type LoansAddMemberMutationError = ErrorType<ProblemDetails>
    export type LoansAddMemberMutationVariables = {batchId: number;data?: BodyType<AddLoanBatchMemberCommand>}

    /**
 * @summary افزودن فرد به درخواست (US-D4)
 */
export const useLoansAddMember = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansAddMember>>, TError,LoansAddMemberMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof loansAddMember>>,
        TError,
        LoansAddMemberMutationVariables,
        TContext
      > => {
      return useMutation(getLoansAddMemberMutationOptions(options), queryClient);
    }
    /**
 * قبل از هر تصمیم.
 * @summary حذف فرد از درخواست (US-D4)
 */
export const loansRemoveMember = (
    batchId: number,
    requestId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesLoanBatchDto>(
      {url: `/gateway/facility-management/LoanBatches/${batchId}/Members/${requestId}`, method: 'DELETE', signal
    },
      options);
    }




export const getLoansRemoveMemberMutationKey = () => ['loansRemoveMember'] as const;

export const getLoansRemoveMemberMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansRemoveMember>>, TError,LoansRemoveMemberMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof loansRemoveMember>>, TError,LoansRemoveMemberMutationVariables, TContext> => {

const mutationKey = getLoansRemoveMemberMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof loansRemoveMember>>, LoansRemoveMemberMutationVariables> = (props) => {
          const {batchId,requestId} = props ?? {};

          return  loansRemoveMember(batchId,requestId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoansRemoveMemberMutationResult = NonNullable<Awaited<ReturnType<typeof loansRemoveMember>>>

    export type LoansRemoveMemberMutationError = ErrorType<ProblemDetails>
    export type LoansRemoveMemberMutationVariables = {batchId: number;requestId: number}

    /**
 * @summary حذف فرد از درخواست (US-D4)
 */
export const useLoansRemoveMember = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansRemoveMember>>, TError,LoansRemoveMemberMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof loansRemoveMember>>,
        TError,
        LoansRemoveMemberMutationVariables,
        TContext
      > => {
      return useMutation(getLoansRemoveMemberMutationOptions(options), queryClient);
    }
    /**
 * fileId همان id عضوهای documents در ردیف فهرست است.
 * @summary دانلود مستند درخواست
 */
export const loansDocumentDownload = (
    id: number,
    fileId: number,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<unknown>(
      {url: `/gateway/facility-management/LoanRequests/${id}/Documents/${fileId}`, method: 'GET', signal
    },
      options);
    }




export const getLoansDocumentDownloadQueryKey = (id: number,
    fileId: number,) => {
    return [
    `/gateway/facility-management/LoanRequests/${id}/Documents/${fileId}`
    ] as const;
    }


export const getLoansDocumentDownloadQueryOptions = <TData = Awaited<ReturnType<typeof loansDocumentDownload>>, TError = ErrorType<ProblemDetails>>(id: number,
    fileId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getLoansDocumentDownloadQueryKey(id,fileId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof loansDocumentDownload>>> = ({ signal }) => loansDocumentDownload(id,fileId, requestOptions, signal);





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined && fileId !== null && fileId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type LoansDocumentDownloadQueryResult = NonNullable<Awaited<ReturnType<typeof loansDocumentDownload>>>
export type LoansDocumentDownloadQueryError = ErrorType<ProblemDetails>


export function useLoansDocumentDownload<TData = Awaited<ReturnType<typeof loansDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    fileId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansDocumentDownload>>,
          TError,
          Awaited<ReturnType<typeof loansDocumentDownload>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansDocumentDownload<TData = Awaited<ReturnType<typeof loansDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    fileId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof loansDocumentDownload>>,
          TError,
          Awaited<ReturnType<typeof loansDocumentDownload>>
        > , 'initialData'
      >, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useLoansDocumentDownload<TData = Awaited<ReturnType<typeof loansDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    fileId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary دانلود مستند درخواست
 */

export function useLoansDocumentDownload<TData = Awaited<ReturnType<typeof loansDocumentDownload>>, TError = ErrorType<ProblemDetails>>(
 id: number,
    fileId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof loansDocumentDownload>>, TError, TData>>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getLoansDocumentDownloadQueryOptions(id,fileId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return withQueryKey(query, queryOptions.queryKey);
}






/**
 * فقط قبل از تأیید اعتبارات؛ دلیل از فهرست + توضیح.
 * @summary لغو درخواست یک نفر (US-D5)
 */
export const loansCancel = (
    id: number,
    cancelLoanRequestCommand?: BodyType<CancelLoanRequestCommand>,
 options?: SecondParameter<typeof apiClient>,signal?: AbortSignal
) => {


      return apiClient<CommandResponsesLoanRequestListItemDto>(
      {url: `/gateway/facility-management/LoanRequests/${id}/Cancel`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: cancelLoanRequestCommand, signal
    },
      options);
    }




export const getLoansCancelMutationKey = () => ['loansCancel'] as const;

export const getLoansCancelMutationOptions = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansCancel>>, TError,LoansCancelMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
): UseMutationOptions<Awaited<ReturnType<typeof loansCancel>>, TError,LoansCancelMutationVariables, TContext> => {

const mutationKey = getLoansCancelMutationKey();
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof loansCancel>>, LoansCancelMutationVariables> = (props) => {
          const {id,data} = props ?? {};

          return  loansCancel(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type LoansCancelMutationResult = NonNullable<Awaited<ReturnType<typeof loansCancel>>>
    export type LoansCancelMutationBody = BodyType<CancelLoanRequestCommand> | undefined
    export type LoansCancelMutationError = ErrorType<ProblemDetails>
    export type LoansCancelMutationVariables = {id: number;data?: BodyType<CancelLoanRequestCommand>}

    /**
 * @summary لغو درخواست یک نفر (US-D5)
 */
export const useLoansCancel = <TError = ErrorType<ProblemDetails>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof loansCancel>>, TError,LoansCancelMutationVariables, TContext>, request?: SecondParameter<typeof apiClient>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof loansCancel>>,
        TError,
        LoansCancelMutationVariables,
        TContext
      > => {
      return useMutation(getLoansCancelMutationOptions(options), queryClient);
    }
