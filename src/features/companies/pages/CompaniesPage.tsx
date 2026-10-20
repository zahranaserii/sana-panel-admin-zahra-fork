import { useState } from 'react';

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

  const openEdit = (id: number) => {
    setEditingId(id);
    setFormOpen(true);
  };

  return (
    <>
      <CompanyTable onCreate={openCreate} onEdit={openEdit} onCancelContract={setCancelTarget} />
      <CompanyAverages />

      <CompanyFormModal open={formOpen} companyId={editingId} onClose={() => setFormOpen(false)} />
      <CancelContractModal company={cancelTarget} onClose={() => setCancelTarget(null)} />
    </>
  );
};
