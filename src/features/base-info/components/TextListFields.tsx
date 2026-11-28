import { descriptionRule, normalizeLetters, titleRule } from '@/utils/inputRules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import { Button } from '@/component/button';
import { FormItem } from '@/component/form';
import { TextInput } from '@/component/input';
import { toPersianDigits } from '@/utils/date';

import { type SchemeTextList } from '../types';

import { SectionTitle } from './SectionTitle';

interface TextListFieldsProps {
  name: SchemeTextList;
  title: string;
  subtitle?: string;
  placeholder: string;
  addText: string;
}

/** لیست متنی (دلایل، انواع مستند) با امکان افزودن و حذف ردیف */
export const TextListFields = ({
  name,
  title,
  subtitle,
  placeholder,
  addText,
}: TextListFieldsProps) => (
  <>
    <SectionTitle title={title} subtitle={subtitle} />
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          <div className="flex flex-col">
            {fields.map((field, index) => (
              <div key={field.key} className="flex items-start gap-1.5">
                <span className="mt-1.5 w-6 shrink-0 text-center text-[12px] text-ink-soft">
                  {toPersianDigits(index + 1)}
                </span>
                <FormItem
                  name={field.name}
                  normalize={normalizeLetters}
                  rules={[name === 'documentTypes' ? titleRule : descriptionRule]}
                  className="mb-2 flex-1"
                >
                  <TextInput
                    maxLength={name === 'documentTypes' ? 50 : 300}
                    placeholder={placeholder}
                  />
                </FormItem>
                {fields.length > 1 && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    aria-label={`حذف ردیف ${toPersianDigits(index + 1)} ${title}`}
                    className="mt-1"
                    onClick={() => remove(field.name)}
                  />
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="small" icon={<PlusOutlined />} onClick={() => add('')}>
            {addText}
          </Button>
        </>
      )}
    </Form.List>
  </>
);
