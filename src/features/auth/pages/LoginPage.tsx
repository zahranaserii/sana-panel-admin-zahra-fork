import { captchaRule, usernameRule } from '@/utils/inputRules';
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
  const captchaValue = Form.useWatch('captchaValue', form) ?? '';
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
  const regenerateCaptcha = () => {
    form.setFieldValue('captchaValue', '');
    void captcha.refetch();
  };
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
        <FormItem
          name="username"
          rules={[usernameRule]}
          extra={usernameRule.message}
          label="نام کاربری"
          required
        >
          <TextInput
            maxLength={20}
            prefix={<UserOutlined />}
            placeholder="نام کاربری"
            autoComplete="username"
          />
        </FormItem>
        <FormItem name="password" label="رمز عبور" required>
          <PasswordInput />
        </FormItem>
        <FormItem name="captchaValue" rules={[captchaRule]} label="کد امنیتی" required>
          <TextInput
            maxLength={10}
            placeholder="کد امنیتی"
            disabled={!captchaReady}
            suffix={
              <span className="flex h-8 items-center justify-center">
                {captcha.isFetching && <Spinner />}
                {captchaReady && (
                  <img
                    src={captcha.data.image}
                    alt="تصویر کپچا"
                    className="h-8 w-24 rounded object-contain"
                  />
                )}
                {!captcha.isFetching && (captchaReady || captcha.isError) && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    aria-label={
                      captcha.isError ? 'تلاش مجدد برای دریافت کپچا' : 'دریافت کپچای جدید'
                    }
                    disabled={isPending}
                    onClick={regenerateCaptcha}
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
          disabled={!captchaReady || !captchaRule.pattern.test(captchaValue) || isPending}
        >
          ورود
        </Button>
      </Form>
    </>
  );
};
