import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { type ColumnsType } from 'antd/es/table';

import {
  getCompaniesBalanceDocumentsQueryKey,
  getCompaniesBalancesQueryKey,
  useCompaniesBalanceDocumentDelete,
  useCompaniesBalanceDocuments,
} from '@/api/generated/facility';
import { Button } from '@/component/button';
import { Table } from '@/component/table';
import { Typography } from '@/component/typography';
import { FACILITY } from '@/constant/endpoints';
import { http } from '@/services/http';
import { toPersianDigits } from '@/utils/date';

import { type BalanceDocument } from '../types';

export const AverageDocsTable = ({ companyId }: { companyId: number }) => {
  const queryClient = useQueryClient();
  const { modal } = App.useApp();
  const { data, isFetching, isError, refetch } = useCompaniesBalanceDocuments(companyId);

  const { mutateAsync: remove } = useCompaniesBalanceDocumentDelete({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getCompaniesBalanceDocumentsQueryKey(companyId),
        });
        void queryClient.invalidateQueries({ queryKey: getCompaniesBalancesQueryKey(companyId) });
      },
    },
  });

  /** سرویس تولیدشده نوع فایل را نمی‌شناسد؛ دانلود با http.download */
  const download = (doc: BalanceDocument) =>
    http.download(
      `${FACILITY}/Companies/${companyId}/Balances/Documents/${doc.id}`,
      doc.file?.fileName,
    );

  const confirmDelete = (doc: BalanceDocument) =>
    modal.confirm({
      title: 'حذف مستند',
      content: `مستند «${doc.file?.fileName ?? ''}» حذف می‌شود.`,
      okText: 'حذف',
      okButtonProps: { danger: true },
      cancelText: 'انصراف',
      onOk: () => remove({ id: companyId, documentId: doc.id ?? 0 }),
    });

  const columns: ColumnsType<BalanceDocument> = [
    {
      title: 'ماه',
      dataIndex: 'month',
      render: (value?: string | null) => (value ? toPersianDigits(value) : '—'),
    },
    { title: 'نوع مستند', dataIndex: 'documentType' },
    { title: 'فایل', dataIndex: ['file', 'fileName'] },
    {
      title: 'توضیحات',
      dataIndex: 'description',
      render: (value?: string | null) => value ?? '—',
    },
    {
      title: 'عملیات',
      key: 'actions',
      render: (_value, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => void download(row)}
          >
            دانلود
          </Button>
          <Button
            variant="secondary"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(row)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Typography as="title" level={3} size="md" color="heading" className="mt-6 mb-3">
        مستندات ثبت‌شده میانگین موجودی
      </Typography>
      <Table<BalanceDocument>
        rowKey="id"
        columns={columns}
        dataSource={data ?? []}
        loading={isFetching}
        error={isError}
        onRetry={() => void refetch()}
        locale={{ emptyText: 'هنوز مستندی ثبت نشده است.' }}
      />
    </>
  );
};
