import { useState } from 'react';

import { getPersonnelGetQueryOptions } from '@/api/generated/facility';

import { PanelCard } from '@/component/card';
import { useFetchBeforeOpen } from '@/hooks';
import { useQueryParams } from '@/hooks/useQueryParams';
import { CompanySelect, useSelectedCompany } from '@/features/companies/components';

import { StaffFormModal, StaffSearch, StaffTable, StaffToolbar } from '../components';
import { type StaffFilters } from '../types';

export const StaffPage = () => {
  const { params, setParams } = useQueryParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // بخش پرسنل فقط وقتی شرکت انتخاب‌شده در کشویی شرکت‌ها باشد نمایش داده می‌شود
  const companyId = useSelectedCompany(params.companyId);
  const filters: StaffFilters = { q: params.q, hireFrom: params.hireFrom, hireTo: params.hireTo };

  const details = useFetchBeforeOpen<number>();

  /** ویرایش: جزئیات پرسنل اول گرفته می‌شود؛ با خطا مودال باز نمی‌شود */
  const openEdit = (id: number) =>
    void details.open(
      id,
      (client) => client.fetchQuery(getPersonnelGetQueryOptions(id)),
      () => openModal(id),
    );

  const openModal = (id: number | null) => {
    setEditingId(id);
    setModalOpen(true);
  };

  return (
    <>
      <PanelCard>
        <CompanySelect value={params.companyId} onChange={(id) => setParams({ companyId: id })} />
      </PanelCard>

      {companyId && (
        <PanelCard
          title="پرسنل شرکت"
          extra={<StaffToolbar companyId={companyId} onCreate={() => openModal(null)} />}
        >
          <p className="mt-0 mb-4 text-xs text-ink-soft">
            جهت بارگذاری فایل گروهی، فایل نمونه را دانلود و پس از تکمیل آن را بارگذاری کنید. ستون‌ها
            به ترتیب: نام و نام خانوادگی، کد ملی، موبایل، کد پرسنلی، تاریخ استخدام، اولویت تخصیص.
            فهرست پرسنل و صفحه پرداخت وام بر اساس این اولویت مرتب می‌شوند.
          </p>
          <StaffSearch />
          {/* با تغییر شرکت یا فیلترها جدول از صفحه اول شروع می‌شود */}
          <StaffTable
            key={`${companyId}-${JSON.stringify(filters)}`}
            companyId={companyId}
            filters={filters}
            loadingEditId={details.loadingKey}
            onEdit={openEdit}
          />
          <StaffFormModal
            open={modalOpen}
            companyId={companyId}
            staffId={editingId}
            onClose={() => setModalOpen(false)}
          />
        </PanelCard>
      )}
    </>
  );
};
