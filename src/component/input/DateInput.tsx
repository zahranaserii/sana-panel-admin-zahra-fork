import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

import { FormItemInputContext } from 'antd/es/form/context';
import { memo, useCallback, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatePickerModule, { type DatePickerProps, type Value } from 'react-multi-date-picker';
import DatePanelModule from 'react-multi-date-picker/plugins/date_panel';
import TimePickerModule from 'react-multi-date-picker/plugins/time_picker';

import { useThemeStore } from '@/store/useThemeStore';
import { dayjs, ISO_DATE_FORMAT } from '@/utils/date';

/**
 * این پکیج CommonJS است و باندلر Vite 8 گاهی کل module.exports را به‌عنوان default برمی‌گرداند؛
 * اینجا export اصلی را جدا می‌کنیم.
 */
const interopDefault = <T,>(module: T): T => (module as { default?: T }).default ?? module;
/**
 * memo: تقویم کتابخانه با هر رندر دوباره، ماهِ در حال نمایش را به ماه مقدار (یا ماه جاری) برمی‌گرداند؛
 * با props ثابت، رندر والد (مثلاً رسیدن پاسخ یک سرویس) ماهی را که کاربر به آن رفته عوض نمی‌کند.
 */
const DatePicker = memo(interopDefault(DatePickerModule));
const DatePanel = interopDefault(DatePanelModule);
const TimePicker = interopDefault(TimePickerModule);

export type DateInputMode = 'single' | 'range' | 'multiple';
export type DateInputPicker = 'day' | 'month' | 'year';
/** مقدار همیشه میلادی و رشته‌ای است (YYYY-MM-DD یا با ساعت YYYY-MM-DDTHH:mm:ss) */
export type DateInputValue = string | string[] | null;

export interface DateInputProps {
  id?: string;
  value?: DateInputValue;
  onChange?: (value: DateInputValue) => void;
  /** تکی / بازه / چندتایی */
  mode?: DateInputMode;
  /** روز / ماه / سال */
  picker?: DateInputPicker;
  withTime?: boolean;
  hideSeconds?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string | Date;
  maxDate?: string | Date;
  /** فرمت نمایش داخل فیلد */
  format?: string;
  className?: string;
  /** سایر props کتابخانه react-multi-date-picker */
  pickerProps?: Omit<DatePickerProps<boolean, boolean>, 'value' | 'onChange'>;
}

const DISPLAY_FORMAT: Record<DateInputPicker, string> = {
  day: 'YYYY/MM/DD',
  month: 'YYYY/MM',
  year: 'YYYY',
};

const ISO_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const toPickerValue = (value: DateInputValue | undefined, mode: DateInputMode) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return mode === 'single' ? null : [];
  const list = (Array.isArray(value) ? value : [value]).map((item) => dayjs(item).toDate());
  return mode === 'single' ? (list[0] ?? null) : list;
};

const toIso = (date: DateObject, withTime: boolean) =>
  dayjs(date.toDate()).format(withTime ? ISO_DATE_TIME_FORMAT : ISO_DATE_FORMAT);

export const DateInput = ({
  id,
  value,
  onChange,
  mode = 'single',
  picker = 'day',
  withTime = false,
  hideSeconds = true,
  placeholder = 'انتخاب تاریخ',
  disabled,
  minDate,
  maxDate,
  format,
  className,
  pickerProps,
}: DateInputProps) => {
  const themeMode = useThemeStore((state) => state.mode);
  // وضعیت خطای FormItem (بیرون از FormItem مقدار ندارد و هشداری هم نمی‌دهد)
  const { status } = useContext(FormItemInputContext);

  const plugins = useMemo(() => {
    const list = [];
    if (withTime) list.push(<TimePicker key="time" position="bottom" hideSeconds={hideSeconds} />);
    if (mode === 'multiple') list.push(<DatePanel key="panel" position="left" />);
    return list;
  }, [withTime, hideSeconds, mode]);

  // onChange فرم با هر رندر عوض می‌شود؛ آخرین نسخه در ref نگه داشته می‌شود تا handleChange ثابت بماند
  const onChangeRef = useRef(onChange);
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  const handleChange = useCallback(
    (selected: DateObject | DateObject[] | DateObject[][] | null) => {
      const emit = onChangeRef.current;
      if (!selected) return emit?.(null);
      if (!Array.isArray(selected)) return emit?.(toIso(selected, withTime));
      const flat = selected.flat();
      emit?.(flat.length ? flat.map((item) => toIso(item, withTime)) : null);
    },
    [withTime],
  );

  const pickerValue = useMemo(() => toPickerValue(value, mode) as Value, [value, mode]);

  const displayFormat = format ?? `${DISPLAY_FORMAT[picker]}${withTime ? ' HH:mm' : ''}`;
  const inputClass = ['sana-date-input', status === 'error' ? 'sana-date-input--error' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <DatePicker
      id={id}
      calendar={persian}
      locale={persian_fa}
      value={pickerValue}
      onChange={handleChange}
      range={mode === 'range'}
      multiple={mode === 'multiple'}
      onlyMonthPicker={picker === 'month'}
      onlyYearPicker={picker === 'year'}
      format={displayFormat}
      placeholder={placeholder}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      plugins={plugins}
      calendarPosition="bottom-right"
      containerClassName="w-full"
      inputClass={inputClass}
      className={['sana-date-calendar', themeMode === 'dark' ? 'bg-dark' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      zIndex={1100}
      portal
      {...pickerProps}
    />
  );
};
