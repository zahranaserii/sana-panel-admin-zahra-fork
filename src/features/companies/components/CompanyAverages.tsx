import { useState } from 'react';

import { PanelCard } from '@/component/card';

import { AverageDocsTable } from './AverageDocsTable';
import { AveragesTable } from './AveragesTable';
import { CompanySelect } from './CompanySelect';

/** بخش میانگین موجودی: انتخاب شرکت + جدول ماه‌ها + مستندات */
export const CompanyAverages = () => {
  const [companyId, setCompanyId] = useState<string>();

  return (
    <PanelCard
      title="میانگین موجودی حساب جاری — ماه‌های سال جاری قرارداد"
      subtitle="ستون اول را دستی وارد کنید؛ ستون‌های بعدی (مانده اعتبار و اعتبار استفاده‌شده) سمت سرور محاسبه می‌شود."
    >
      <CompanySelect value={companyId} onChange={setCompanyId} />
      {companyId && (
        <>
          <AveragesTable key={companyId} companyId={Number(companyId)} />
          <AverageDocsTable companyId={Number(companyId)} />
        </>
      )}
    </PanelCard>
  );
};
