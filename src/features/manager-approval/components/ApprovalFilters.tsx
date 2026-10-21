import { useCompaniesLookup } from '@/api/generated/facility';
import { type LoanRequestStatus } from '@/api/generated/facility/facilityPanelAPI.schemas';
import { SelectInput, TextInput } from '@/component/input';
import { LOAN_STATUS } from '@/constant/loanStatus';

const ALL = 'all';

/** صف پیش‌فرض بک‌اند (بدون Status) فقط درخواست‌های منتظر تصمیم است؛ ردشده‌ها سابقه‌اند */
const STATUS_OPTIONS = [
  { value: LOAN_STATUS.PENDING_MANAGER, label: 'در انتظار تأیید' },
  { value: LOAN_STATUS.REJECTED_MANAGER, label: 'ردشده توسط مدیر شرکت' },
];

interface ApprovalFiltersProps {
  term: string;
  onTermChange: (term: string) => void;
  /** خالی = همه شرکت‌ها */
  companyId?: string;
  onCompanyChange: (companyId: string | undefined) => void;
  status: LoanRequestStatus;
  onStatusChange: (status: LoanRequestStatus) => void;
}

/** جستجوی پرسنل، انتخاب شرکت و وضعیت صف تأیید مدیر شرکت */
export const ApprovalFilters = ({
  term,
  onTermChange,
  companyId,
  onCompanyChange,
  status,
  onStatusChange,
}: ApprovalFiltersProps) => {
  // برای نقش مدیر شرکت فقط شرکت خودش برمی‌گردد
  const { data: companies, isFetching, refetch } = useCompaniesLookup({ activeOnly: false });

  return (
    <>
      <TextInput
        size="small"
        style={{ width: 200 }}
        placeholder="جستجوی نام یا کد پرسنلی"
        maxLength={50}
        value={term}
        onChange={(event) => onTermChange(event.target.value)}
      />
      <SelectInput
        size="small"
        allowClear={false}
        style={{ minWidth: 200 }}
        loading={isFetching}
        onRetry={() => void refetch()}
        value={companyId ?? ALL}
        onChange={(value: string) => onCompanyChange(value === ALL ? undefined : value)}
        options={[
          { value: ALL, label: 'همه شرکت‌ها' },
          ...(companies ?? []).map((item) => ({ value: String(item.id), label: item.title })),
        ]}
      />
      <SelectInput
        size="small"
        allowClear={false}
        showSearch={false}
        style={{ minWidth: 170 }}
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
      />
    </>
  );
};
