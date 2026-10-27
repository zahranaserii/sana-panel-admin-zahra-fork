import { NoticeCard } from '@/component/card';
import { Skeleton } from '@/component/loading';

import { type CompanyCredit } from '../types';

interface EligibilityNoticesProps {
  credit?: CompanyCredit;
  loading: boolean;
}

/** پیام مجاز بودن شرکت برای ثبت درخواست (همان پیام سرویس اعتبار) */
export const EligibilityNotices = ({ credit, loading }: EligibilityNoticesProps) => {
  if (loading && !credit) return <Skeleton variant="panel" rows={1} />;
  const banner = credit?.banner;
  if (!banner?.message) return null;

  return (
    <div className="mt-2">
      <NoticeCard type={banner.canRegisterLoan ? 'success' : 'error'}>{banner.message}</NoticeCard>
    </div>
  );
};
