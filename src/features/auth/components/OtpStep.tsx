import { ArrowRightOutlined, ReloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { Form } from '@/component/form';
import { OtpInput } from '@/component/input';
import { Typography } from '@/component/typography';

interface OtpStepProps {
  onSubmit: (code: string) => Promise<void>;
  maskedMobile: string | null;
  expiresAt: number;
  onResend: () => Promise<void>;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export const OtpStep = ({ onSubmit, onBack, onResend, maskedMobile, expiresAt }: OtpStepProps) => {
  const [code, setCode] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: onSubmit,
    onError: (error) => {
      if (!isAxiosError(error)) toast.error(error.message);
    },
  });
  const [now, setNow] = useState(Date.now);
  const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000)) || 0;
  useEffect(() => {
    if (now >= expiresAt) return;
    const timer = window.setTimeout(() => setNow(Date.now()), 1000);
    return () => window.clearTimeout(timer);
  }, [now, expiresAt]);
  const resend = useMutation({ mutationFn: onResend });
  const busy = isPending || resend.isPending;
  const canVerify = code.length === OTP_LENGTH && /^\d+$/.test(code) && !busy && remaining > 0;

  return (
    <section aria-label="تأیید ورود" className="text-center">
      <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-gold-soft-border bg-gold-soft text-2xl text-gold-soft-text">
        <SafetyCertificateOutlined aria-hidden />
      </span>
      <Typography as="title" level={2} size="xl" color="heading">
        تأیید ورود
      </Typography>
      <Typography as="paragraph" size="md" weight={400} color="soft" className="mt-2 mb-6">
        کد ۶ رقمی{' '}
        {maskedMobile ? (
          <>
            که به شمارهٔ <bdi dir="ltr">{maskedMobile}</bdi> ارسال شده
          </>
        ) : (
          'ارسال‌شده'
        )}{' '}
        را وارد کنید.
      </Typography>
      <Form
        onFinish={() => {
          if (canVerify) mutate(code);
        }}
      >
        <OtpInput
          aria-label="کد یک‌بارمصرف"
          length={OTP_LENGTH}
          className="mb-5 grid w-full grid-cols-6"
          autoFocus
          disabled={busy}
          onInput={(digits) => setCode(digits.join(''))}
        />
        <div className="mb-4">
          {remaining > 0 ? (
            <span role="timer" dir="ltr">
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
            </span>
          ) : (
            <Button
              variant="text"
              icon={<ReloadOutlined />}
              disabled={busy}
              loading={resend.isPending}
              onClick={() => resend.mutate()}
            >
              ارسال مجدد
            </Button>
          )}
        </div>
        <Button htmlType="submit" size="large" block loading={isPending} disabled={!canVerify}>
          تأیید و ورود
        </Button>
        <Button
          variant="text"
          icon={<ArrowRightOutlined />}
          className="mt-3"
          disabled={busy}
          onClick={onBack}
        >
          بازگشت به ورود
        </Button>
      </Form>
    </section>
  );
};
