import {
  CompanyCreditChart,
  CompanyRanking,
  ContractsByMonthTable,
  MonthlyPerformanceTable,
  PlanShareChart,
  RemovedCompaniesTable,
  ReportExports,
  RequestStatusChart,
  SummaryKpis,
} from '../components';

/** همه بخش‌ها از یک سرویس (Dashboard) خوانده می‌شوند؛ رتبه‌بندی و خروجی‌ها سرویس جدا دارند */
export const DashboardPage = () => (
  <>
    <SummaryKpis />
    <div className="grid grid-cols-1 gap-x-[18px] lg:grid-cols-2">
      <RequestStatusChart />
      <PlanShareChart />
    </div>
    <CompanyCreditChart />
    <CompanyRanking />
    <ContractsByMonthTable />
    <MonthlyPerformanceTable />
    <RemovedCompaniesTable />
    <ReportExports />
  </>
);
