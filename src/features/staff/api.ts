import { ENDPOINTS } from '@/constant/endpoints';
import { http } from '@/services/http';
import { type PageParams, type PaginatedResponse } from '@/types/common';

import {
  type DeleteStaffPayload,
  type Staff,
  type StaffFilters,
  type StaffImportResult,
  type StaffPayload,
} from './types';

/** لیست پرسنل شرکت (مرتب‌شده بر اساس اولویت سمت سرور) */
export const getStaffList = (companyId: string, params: StaffFilters & PageParams) =>
  http.get<PaginatedResponse<Staff>>(ENDPOINTS.STAFF.LIST(companyId), { params });

export const getStaff = (companyId: string, id: string) =>
  http.get<Staff>(ENDPOINTS.STAFF.DETAIL(companyId, id));

export const createStaff = (companyId: string, body: StaffPayload) =>
  http.post<Staff, StaffPayload>(ENDPOINTS.STAFF.LIST(companyId), body);

export const updateStaff = (companyId: string, id: string, body: StaffPayload) =>
  http.put<Staff, StaffPayload>(ENDPOINTS.STAFF.DETAIL(companyId, id), body);

/** حذف با توضیح و فایل مستند (هر دو الزامی) */
export const deleteStaff = (companyId: string, id: string, body: DeleteStaffPayload) =>
  http.delete<void>(ENDPOINTS.STAFF.DETAIL(companyId, id), { data: body });

export const importStaff = (companyId: string, file: File) =>
  http.upload<StaffImportResult>(ENDPOINTS.STAFF.IMPORT(companyId), { file });

export const downloadStaffSample = () =>
  http.download(ENDPOINTS.STAFF.SAMPLE_FILE, 'نمونه-فایل-پرسنل.xlsx');
