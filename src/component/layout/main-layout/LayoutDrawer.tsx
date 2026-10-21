import { CloseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Button } from '../../button';

/** نقطه شکست لی‌اوت موبایل (سایدبار و اکشن‌های هدر به دراور می‌روند) */
export const MOBILE_QUERY = '(max-width: 960px)';

/** صفحه خیلی کوچک: دراور تمام‌عرض */
const TINY_QUERY = '(max-width: 360px)';

const DRAWER_WIDTH = 276;

export interface LayoutDrawerProps {
  /** right: منوی سایدبار؛ left: اکشن‌های هدر */
  placement: 'right' | 'left';
  open: boolean;
  onClose: () => void;
  /** برای aria-label دراور و دکمه بستن */
  label: string;
  className?: string;
  /** کلاس دکمه بستن (مثلاً رنگ سفید روی پس‌زمینه تیره) */
  closeClassName?: string;
  children: ReactNode;
}

/**
 * دراور لی‌اوت موبایل: عرض ۲۷۶ (در صفحه ۳۶۰ پیکسل و کمتر تمام‌عرض)، پس‌زمینه تار،
 * بستن با ضربدر (گوشه داخلی بالا)، Esc و کلیک روی قسمت تار.
 */
export const LayoutDrawer = ({
  placement,
  open,
  onClose,
  label,
  className,
  closeClassName = '',
  children,
}: LayoutDrawerProps) => {
  const isTiny = useMediaQuery(TINY_QUERY);

  return (
    <Drawer
      open={open}
      placement={placement}
      size={isTiny ? '100vw' : DRAWER_WIDTH}
      closable={false}
      mask={{ blur: true, closable: true }}
      keyboard
      onClose={onClose}
      aria-label={label}
      classNames={{ section: className, body: 'relative !p-0' }}
    >
      <Button
        variant="text"
        shape="circle"
        aria-label={`بستن ${label}`}
        icon={<CloseOutlined />}
        className={`!absolute top-3 z-10 ${placement === 'right' ? 'left-3' : 'right-3'} ${closeClassName}`}
        onClick={onClose}
      />
      {children}
    </Drawer>
  );
};
