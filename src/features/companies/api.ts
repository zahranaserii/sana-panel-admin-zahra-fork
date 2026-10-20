import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';
import { type PageParams, type PaginatedResponse } from '@/types/common';

import {
  type AverageDoc,
  type CancelContractPayload,
  type CompanyDetail,
  type CompanyListItem,
  type CompanyPayload,
  type DeleteCompanyPayload,
  type MonthlyAverage,
  type SaveAveragesPayload,
} from './types';

export const getCompanies = (params: PageParams) =>
  http.get<PaginatedResponse<CompanyListItem>>(ENDPOINTS.COMPANIES.LIST, { params });

export const getCompany = (id: string) => http.get<CompanyDetail>(ENDPOINTS.COMPANIES.DETAIL(id));

export const createCompany = (body: CompanyPayload) =>
  http.post<CompanyDetail, CompanyPayload>(ENDPOINTS.COMPANIES.LIST, body);

export const updateCompany = (id: string, body: CompanyPayload) =>
  http.put<CompanyDetail, CompanyPayload>(ENDPOINTS.COMPANIES.DETAIL(id), body);

/** حذف شرکت با توضیح الزامی (اطلاعات برای گزارش‌گیری نزد سرور باقی می‌ماند) */
export const deleteCompany = (id: string, body: DeleteCompanyPayload) =>
  http.delete<void>(ENDPOINTS.COMPANIES.DETAIL(id), { data: body });

export const cancelContract = (id: string, body: CancelContractPayload) =>
  http.post<void, CancelContractPayload>(ENDPOINTS.COMPANIES.CANCEL(id), body);

/** میانگین‌های ماهانه سال جاری قرارداد (ثبت‌شده و ثبت‌نشده) */
export const getAverages = (companyId: string) =>
  http.get<MonthlyAverage[]>(ENDPOINTS.COMPANIES.AVERAGES(companyId));

export const saveAverages = (companyId: string, body: SaveAveragesPayload) =>
  http.post<MonthlyAverage[], SaveAveragesPayload>(ENDPOINTS.COMPANIES.AVERAGES(companyId), body);

export const getAverageDocs = (companyId: string) =>
  http.get<AverageDoc[]>(ENDPOINTS.COMPANIES.AVERAGE_DOCS(companyId));
