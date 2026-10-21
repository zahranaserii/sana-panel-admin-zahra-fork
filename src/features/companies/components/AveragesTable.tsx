import { SaveOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { type ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  getCompaniesBalanceDocumentsQueryKey,
  getCompaniesBalancesQueryKey,
  useCompaniesBalances,
  useCompaniesBalancesSave,
  useCompaniesGet,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { Form, FormItem } from '@/component/form';
import { AmountInput } from '@/component/input';
import { Retry } from '@/component/retry';
import { Table } from '@/component/table';
import { toPersianDigits } from '@/utils/date';
import { formatAmount } from '@/utils/number';

import { type BalanceDocFormValues, type MonthlyBalance } from '../types';

import { AverageDocModal } from './AverageDocModal';

interface AveragesFormValues {
  /** کلید = ماه شمسی (YYYY/MM) */
  averages: Record<string, string | null>;
}

const toNumber = (value?: string | null) => (value ? Number(value) : null);

const rial = (value?: number | null) =>
  value === null || value === undefined ? '—' : `${toPersianDigits(formatAmount(value))} ریال`;

const columns: ColumnsType<MonthlyBalance> = [
  { title: 'ماه', dataIndex: 'month', render: (month: string) => toPersianDigits(month) },
  {
    title: 'میانگین موجودی (ریال)',
    key: 'average',
    render: (_value, row) => (
      <FormItem name={['averages', row.month ?? '']} noStyle>
        <AmountInput style={{ width: 240 }} />
      </FormItem>
    ),
  },
  {
    title: 'مانده اعتبار تا این ماه (محاسبه‌شده)',
    dataIndex: 'remainingCredit',
    render: (value?: number | null) => <b>{rial(value)}</b>,
  },
  { title: 'اعتبار استفاده‌شده', dataIndex: 'usedCredit', render: rial },
  {
    title: 'مستندات',
    dataIndex: 'documentCount',
    align: 'center',
    render: (value?: number) => toPersianDigits(value ?? 0),
  },
];

/** جدول میانگین موجودی ماه‌های سال جاری قرارداد */
export const AveragesTable = ({ companyId }: { companyId: number }) => {
  const [form] = Form.useForm<AveragesFormValues>();
  const queryClient = useQueryClient();
  const [changedMonths, setChangedMonths] = useState<string[]>([]);

  const { data, isFetching, isError, refetch } = useCompaniesBalances(companyId);
  const { data: company } = useCompaniesGet(companyId);
  const months = useMemo(() => data?.months ?? [], [data]);

  const initialValues = useMemo(
    () => ({
      averages: Object.fromEntries(
        months.map((item) => [
          item.month ?? '',
          item.averageBalance === null || item.averageBalance === undefined
            ? null
            : String(item.averageBalance),
        ]),
      ),
    }),
    [months],
  );

  // با هر بار دریافت سرویس (اولین بار یا بعد از ذخیره) مقادیر فرم به‌روز می‌شود
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const { mutateAsync } = useCompaniesBalancesSave({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getCompaniesBalancesQueryKey(companyId) });
        void queryClient.invalidateQueries({
          queryKey: getCompaniesBalanceDocumentsQueryKey(companyId),
        });
        setChangedMonths([]);
        toast.success('میانگین‌ها و مستند ثبت شد.');
      },
    },
  });

  /** میانگین‌ها همراه با مستند (multipart) ذخیره می‌شوند */
  const save = ({ file, documentTypeId, description }: BalanceDocFormValues) => {
    const averages = (form.getFieldValue('averages') ?? {}) as AveragesFormValues['averages'];
    return mutateAsync({
      id: companyId,
      data: {
        Months: changedMonths.map((month) => ({
          month,
          averageBalance: toNumber(averages[month]),
        })),
        RowVersion: data?.rowVersion ?? '',
        DocumentTypeId: documentTypeId,
        DocumentDescription: description,
        files: file ? [file] : [],
      },
    });
  };

  const handleFinish = ({ averages }: AveragesFormValues) => {
    const changed = months
      .filter((item) => toNumber(averages[item.month ?? '']) !== (item.averageBalance ?? null))
      .map((item) => item.month ?? '');
    if (changed.length === 0) {
      toast.info('تغییری در میانگین‌ها ایجاد نشده است.');
      return;
    }
    setChangedMonths(changed);
  };

  // بدون میانگین‌ها جدول و ذخیره معنی ندارد
  if (isError) return <Retry loading={isFetching} onRetry={() => void refetch()} />;

  return (
    <>
      <Form<AveragesFormValues> form={form} onFinish={handleFinish}>
        <Table<MonthlyBalance>
          rowKey="month"
          columns={columns}
          dataSource={months}
          loading={isFetching}
          maxHeight={440}
        />
        <Button
          variant="primary"
          size="small"
          htmlType="submit"
          icon={<SaveOutlined />}
          className="mt-3"
        >
          ذخیره میانگین‌ها
        </Button>
      </Form>
      <AverageDocModal
        open={changedMonths.length > 0}
        months={changedMonths}
        schemeId={company?.schemeId}
        onSubmit={save}
        onClose={() => setChangedMonths([])}
      />
    </>
  );
};
