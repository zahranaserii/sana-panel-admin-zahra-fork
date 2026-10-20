import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import { Button } from '@/component/button';
import { FormItem } from '@/component/form';
import { NumberInput } from '@/component/input';
import { toPersianDigits } from '@/utils/date';

import { SectionTitle } from './SectionTitle';

interface NumberListFieldsProps {
  name: 'murabahaRates' | 'repaymentTermsMonths';
  title: string;
  /** لیبل هر ردیف، مثلاً «نرخ مرابحه» */
  itemLabel: string;
  addText: string;
  step?: number;
  /** بعد از حذف یک ردیف (برای هماهنگ کردن جدول درصد قابل استفاده) */
  onRemove?: (index: number) => void;
}

/** لیست عددی با امکان افزودن و حذف ردیف (نرخ‌های مرابحه و مدت‌های بازپرداخت) */
export const NumberListFields = ({
  name,
  title,
  itemLabel,
  addText,
  step = 1,
  onRemove,
}: NumberListFieldsProps) => (
  <>
    <SectionTitle title={title} />
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 xl:grid-cols-5">
            {fields.map((field, index) => (
              <div key={field.key} className="flex items-start gap-1.5">
                <FormItem
                  name={field.name}
                  label={`${itemLabel} ${toPersianDigits(index + 1)}`}
                  required
                  requiredMessage="مقدار را وارد کنید."
                  className="flex-1"
                >
                  <NumberInput min={0} step={step} />
                </FormItem>
                {fields.length > 1 && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    aria-label={`حذف ${itemLabel} ${toPersianDigits(index + 1)}`}
                    className="mt-[30px]"
                    onClick={() => {
                      remove(field.name);
                      onRemove?.(index);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="small" icon={<PlusOutlined />} onClick={() => add()}>
            {addText}
          </Button>
        </>
      )}
    </Form.List>
  </>
);
