import { useState } from 'react';

import { getCompaniesGetQueryOptions } from '@/api/generated/facility';
import { useFetchBeforeOpen } from '@/hooks';

import {
  CancelContractModal,
  CompanyAverages,
  CompanyFormModal,
  CompanyTable,
} from '../components';
import { type CompanyListItem } from '../types';

export const CompaniesPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<CompanyListItem | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const details = useFetchBeforeOpen<number>();

  /** جزئیات شرکت اول گرفته می‌شود؛ با خطا مودال باز نمی‌شود */
  const openEdit = (id: number) =>
    void details.open(
      id,
      (client) => client.fetchQuery(getCompaniesGetQueryOptions(id)),
      () => {
        setEditingId(id);
        setFormOpen(true);
      },
    );

  return (
    <>
      <CompanyTable
        loadingEditId={details.loadingKey}
        onCreate={openCreate}
        onEdit={openEdit}
        onCancelContract={setCancelTarget}
      />
      <CompanyAverages />

      <CompanyFormModal open={formOpen} companyId={editingId} onClose={() => setFormOpen(false)} />
      <CancelContractModal company={cancelTarget} onClose={() => setCancelTarget(null)} />
    </>
  );
};
