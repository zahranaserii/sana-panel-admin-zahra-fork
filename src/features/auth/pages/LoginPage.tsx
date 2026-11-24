import { LoginOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/component/button';
import { NoticeCard } from '@/component/card';
import { Form, FormItem } from '@/component/form';
import { PasswordInput, TextInput } from '@/component/input';
import { Spinner } from '@/component/loading';
import { Typography } from '@/component/typography';
import { QUERY_KEYS } from '@/constant/queryKeys';

import { getCaptcha } from '../api';
import { type LoginFormValues, type LoginRequest } from '../types';

interface LoginPageProps {
  username: string;
  onSubmit: (values: LoginRequest) => Promise<void>;
}

export const LoginPage = ({ username, onSubmit }: LoginPageProps) => {
  const [form] = Form.useForm<LoginFormValues>();
  const captchaValue = Form.useWatch('captchaValue', form)?.trim();
  const captcha = useQuery({
    queryKey: QUERY_KEYS.CAPTCHA,
    queryFn: ({ signal }) => getCaptcha(signal),
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const captchaReady = captcha.isSuccess && !captcha.isFetching;

  useEffect(() => {
    if (captcha.errorUpdatedAt) {
      toast.error('دریافت تصویر کپچا ناموفق بود.', { id: 'captcha-error' });
    }
  }, [captcha.errorUpdatedAt]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: onSubmit,
    onError: (error) => {
      if (!isAxiosError(error)) toast.error(error.message);
    },
  });
  const invalidCredentials = isAxiosError(error) && error.response?.status === 401;

  return (
    <>
      <Typography as="title" level={2} size="xl" color="heading" align="center" className="mb-6">
        ورود به سامانه
      </Typography>
      <Form<LoginFormValues>
        form={form}
        initialValues={{ username }}
        onFinish={(values) => {
          const value = values.captchaValue?.trim();
          if (captchaReady && value && !isPending) {
            mutate({ ...values, captchaValue: value, captchaToken: captcha.data.captchaToken });
          }
        }}
        requiredMark={false}
      >
        <FormItem name="username" label="نام کاربری" required>
          <TextInput prefix={<UserOutlined />} placeholder="نام کاربری" autoComplete="username" />
        </FormItem>
        <FormItem name="password" label="رمز عبور" required>
          <PasswordInput />
        </FormItem>
        <FormItem name="captchaValue" label="کد امنیتی" required>
          <TextInput
            placeholder="کد امنیتی"
            disabled={!captchaReady}
            suffix={
              <span className="flex h-8 w-24 items-center justify-center">
                {captcha.isFetching && <Spinner />}
                {captchaReady && (
                  <img
                    src={captcha.data.image}
                    alt="تصویر کپچا"
                    className="h-8 w-24 rounded object-contain"
                  />
                )}
                {captcha.isError && !captcha.isFetching && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    aria-label="تلاش مجدد برای دریافت کپچا"
                    onClick={() => void captcha.refetch()}
                  />
                )}
              </span>
            }
          />
        </FormItem>
        {invalidCredentials && (
          <NoticeCard type="error">نام کاربری یا رمز عبور اشتباه است.</NoticeCard>
        )}
        <Button
          variant="primary"
          htmlType="submit"
          size="large"
          block
          icon={<LoginOutlined />}
          loading={isPending}
          disabled={!captchaReady || !captchaValue || isPending}
        >
          ورود
        </Button>
      </Form>
    </>
  );
};
