import { Input } from 'antd';
import { type ComponentProps } from 'react';

import { toEnglishDigits } from '@/utils/date';

export type OtpInputProps = ComponentProps<typeof Input.OTP>;

export const OtpInput = (props: OtpInputProps) => (
  <Input.OTP
    inputMode="numeric"
    autoComplete="one-time-code"
    formatter={(value) => toEnglishDigits(value).replace(/[^\d ]/g, '')}
    styles={{ root: { direction: 'ltr' } }}
    {...props}
  />
);
