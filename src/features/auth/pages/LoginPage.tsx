import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { panelProfileGet } from '@/api/generated/admin';

import { Button } from '@/component/button';
import { NoticeCard } from '@/component/card';
import { Form, FormItem } from '@/component/form';
import { PasswordInput, TextInput } from '@/component/input';
import { Typography } from '@/component/typography';
import { ROUTES } from '@/constant/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';

import { login } from '../api';
import { type LoginFormValues } from '../types';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.login);
  const setProfile = useProfileStore((state) => state.setProfile);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: LoginFormValues) => {
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
      <Form<LoginFormValues> onFinish={(values) => mutate(values)} requiredMark={false}>
        <FormItem name="username" label="نام کاربری" required>
          <TextInput prefix={<UserOutlined />} placeholder="نام کاربری" autoComplete="username" />
        </FormItem>
        <FormItem name="password" label="رمز عبور" required>
          <PasswordInput />
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
        >
          ورود
        </Button>
      </Form>
    </>
  );
};
