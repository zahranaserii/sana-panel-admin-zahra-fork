import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm } from 'antd';
import { useEffect, useRef } from 'react';

import { useQueryParams, type QueryValue } from '@/hooks/useQueryParams';
import { removeEmpty } from '@/utils/object';

import { Button } from '../button';

import { type SearchFormProps } from './types';

const defaultParseQuery = (params: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      value.includes(',') ? value.split(',') : value,
    ]),
  );

/**
 * فرم جستجو (حالت inline): دکمه‌های «جستجو» و «حذف جستجو» خودکار اضافه می‌شوند.
 * جستجو → مقادیر به کوئری آدرس اضافه می‌شود (یا `onSearch` اجرا می‌شود).
 * حذف جستجو → فقط کوئری‌های همین فرم پاک می‌شوند (یا `onReset` اجرا می‌شود).
 */
export const SearchForm = <T,>({
  form: externalForm,
  layout: _layout,
  onSearch,
  onReset,
  parseQuery = defaultParseQuery as SearchFormProps<T>['parseQuery'],
  searchText = 'جستجو',
  resetText = 'حذف جستجو',
  loading,
  children,
  autoComplete = 'off',
  ...rest
}: SearchFormProps<T>) => {
  const [form] = AntForm.useForm<T>(externalForm);
  const { params, setParams, removeParams } = useQueryParams();
  const hydrated = useRef(false);

  const getFieldNames = () => Object.keys((form.getFieldsValue() ?? {}) as object);

  // مقداردهی اولیه فیلدها از کوئری آدرس (فقط کلیدهای همین فرم)
  useEffect(() => {
    if (hydrated.current || onSearch) return;
    hydrated.current = true;
    const names = getFieldNames();
    const own = Object.fromEntries(Object.entries(params).filter(([key]) => names.includes(key)));
    if (Object.keys(own).length && parseQuery) form.setFieldsValue(parseQuery(own) as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = (values: T) => {
    const cleaned = removeEmpty(values);
    if (onSearch) {
      onSearch(cleaned);
      return;
    }
    const all = Object.fromEntries(getFieldNames().map((name) => [name, undefined])) as Record<
      string,
      QueryValue
    >;
    setParams({ ...all, ...(cleaned as Record<string, QueryValue>) });
  };

  const handleReset = () => {
    form.resetFields();
    if (onReset) {
      onReset();
      return;
    }
    removeParams(getFieldNames());
  };

  return (
    <AntForm<T>
      form={form}
      layout="vertical"
      autoComplete={autoComplete}
      onFinish={handleFinish}
      {...rest}
    >
      <div className="flex flex-wrap items-end gap-x-4 [&_.ant-form-item]:min-w-[220px] [&_.ant-form-item]:flex-1">
        {children}
        <div className="mb-[18px] flex shrink-0 gap-2">
          <Button variant="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
            {searchText}
          </Button>
          <Button variant="secondary" icon={<ClearOutlined />} onClick={handleReset}>
            {resetText}
          </Button>
        </div>
      </div>
    </AntForm>
  );
};
