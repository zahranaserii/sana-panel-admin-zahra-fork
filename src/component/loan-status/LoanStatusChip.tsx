import { loanStatusTone } from '@/constant/loanStatus';
import { useEnums } from '@/services/enums';

import { StatusChip } from '../status-chip';

/** وضعیت درخواست وام با عنوان بک‌اند */
export const LoanStatusChip = ({ status }: { status?: number }) => {
  const { title } = useEnums();
  return (
    <StatusChip tone={loanStatusTone(status)}>{title('loanRequestStatus', status)}</StatusChip>
  );
};
