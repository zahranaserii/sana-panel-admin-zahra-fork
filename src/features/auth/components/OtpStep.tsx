import { ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { Form } from '@/component/form';
import { OtpInput } from '@/component/input';
import { Typography } from '@/component/typography';

interface OtpStepProps {
  onSubmit: (code: string) => Promise<void>;
  onBack: () => void;
}

const OTP_LENGTH = 6;

export const OtpStep = ({ onSubmit, onBack }: OtpStepProps) => {
  const [code, setCode] = useState('');
  const { mutate, isPending } = useMutation({
    mutationFn: onSubmit,
    onError: (error) => {
      if (!isAxiosError(error)) toast.error(error.message);
    },
  });
  const canVerify = code.length === OTP_LENGTH && /^\d+$/.test(code) && !isPending;

  return (
    <section aria-label="تأیید ورود" className="text-center">
      <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl border border-gold-soft-border bg-gold-soft text-2xl text-gold-soft-text">
        <SafetyCertificateOutlined aria-hidden />
      </span>
      <Typography as="title" level={2} size="xl" color="heading">
        تأیید ورود
      </Typography>
      <Typography as="paragraph" size="md" weight={400} color="soft" className="mt-2 mb-6">
        کد یک‌بارمصرف شش‌رقمی را وارد کنید.
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
          disabled={isPending}
          onInput={(digits) => setCode(digits.join(''))}
        />
        <Button htmlType="submit" size="large" block loading={isPending} disabled={!canVerify}>
          تأیید و ورود
        </Button>
        <Button
          variant="text"
          icon={<ArrowRightOutlined />}
          className="mt-3"
          disabled={isPending}
          onClick={onBack}
        >
          بازگشت به ورود
        </Button>
      </Form>
    </section>
  );
};
