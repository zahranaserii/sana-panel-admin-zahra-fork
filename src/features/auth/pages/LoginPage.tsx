import { LoginOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { panelProfileGet } from '@/api/generated/admin';

import { Button } from '@/component/button';
import { NoticeCard } from '@/component/card';
import { Form, FormItem } from '@/component/form';
import { PasswordInput, TextInput } from '@/component/input';
import { Spinner } from '@/component/loading';
import { Typography } from '@/component/typography';
import { QUERY_KEYS } from '@/constant/queryKeys';
import { ROUTES } from '@/constant/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';

import { getCaptcha, login } from '../api';
import { type LoginFormValues, type LoginRequest } from '../types';

export const LoginPage = () => {
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
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.login);
  const setProfile = useProfileStore((state) => state.setProfile);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: LoginRequest) => {
      const { token } = await login(values);
      // توکن در کوکی و استور ست می‌شود و از این به بعد همراه همه درخواست‌ها ارسال می‌شود
      setToken(token);
      return panelProfileGet();
    },
    onSuccess: (profile) => {
      setProfile(profile);
      toast.success(`${profile.fullName ?? ''} خوش آمدید`);
      void navigate(ROUTES.HOME, { replace: true });
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
              <>
                {captcha.isFetching && <Spinner />}
                {captchaReady && (
                  <img
                    src={captcha.data.image}
                    alt="تصویر کپچا"
                    className="h-8 w-24 rounded object-contain"
                  />
                )}
              </>
            }
          />
        </FormItem>
        {captcha.isError && (
          <NoticeCard type="error">
            دریافت تصویر کپچا ناموفق بود.
            <Button variant="text" icon={<ReloadOutlined />} onClick={() => void captcha.refetch()}>
              تلاش مجدد
            </Button>
          </NoticeCard>
        )}
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
