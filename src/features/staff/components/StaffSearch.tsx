import { useEffect } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import { normalizeText, searchRule } from '@/utils/inputRules';
import { Form, FormItem } from '@/component/form';
import { DateInput, TextInput } from '@/component/input';

import { getStaffDateError, type StaffFilters } from '../types';

/** جستجوی پرسنل — مقادیر در کوئری آدرس نوشته می‌شوند */
export const StaffSearch = () => {
  const [form] = Form.useForm<StaffFilters>();
  const term = Form.useWatch('q', form);
  const invalidTerm = !searchRule.pattern.test(term ?? '');
  const { params } = useQueryParams();
  useEffect(() => {
    const values = {
      q: normalizeText(params.q ?? ''),
      hireFrom: params.hireFrom,
      hireTo: params.hireTo,
    };
    form.setFieldsValue(values);
    void form.validateFields().catch(() => undefined);
  }, [form, params.q, params.hireFrom, params.hireTo]);
  return (
    <Form<StaffFilters>
      form={form}
      layout="inline"
      parseQuery={(params) => ({ ...params, q: normalizeText(params.q ?? '') })}
    >
      <FormItem
        name="q"
        normalize={normalizeText}
        rules={[searchRule]}
        help={invalidTerm ? searchRule.message : undefined}
        validateStatus={invalidTerm ? 'error' : undefined}
        label="جستجو (نام، کد ملی، موبایل، کد پرسنلی)"
      >
        <TextInput maxLength={30} placeholder="جستجو..." />
      </FormItem>
      <FormItem name="hireFrom" label="از تاریخ استخدام">
        <DateInput />
      </FormItem>
      <FormItem
        name="hireTo"
        dependencies={['hireFrom']}
        rules={[
          ({ getFieldValue }) => ({
            validator: async (_, hireTo?: string) => {
              const error = getStaffDateError({ hireFrom: getFieldValue('hireFrom'), hireTo });
              if (error) throw new Error(error);
            },
          }),
        ]}
        label="تا تاریخ استخدام"
      >
        <DateInput />
      </FormItem>
    </Form>
  );
};
