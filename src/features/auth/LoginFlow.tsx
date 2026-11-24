import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { panelProfileGet } from '@/api/generated/admin';

import { AuthLayout } from '@/component/layout';
import { ROUTES } from '@/constant/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';

import { changePassword, login, verifyOtp } from './api';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { OtpStep } from './components/OtpStep';
import { LoginPage } from './pages/LoginPage';
import { type AuthSessionResponse, type LoginRequest } from './types';

type LoginStep =
  | { kind: 'login'; username: string }
  | { kind: 'changePassword'; username: string; otpTracker: string }
  | { kind: 'otp'; username: string; challengeId: string };

export const LoginFlow = () => {
  const [step, setStep] = useState<LoginStep>({ kind: 'login', username: '' });
  const { username } = step;
  const backToLogin = () => setStep({ kind: 'login', username });
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.login);
  const setProfile = useProfileStore((state) => state.setProfile);

  const completeLogin = async ({ token }: AuthSessionResponse) => {
    setToken(token);
    const profile = await panelProfileGet();
    setProfile(profile);
    toast.success(`${profile.fullName ?? ''} خوش آمدید`);
    void navigate(ROUTES.HOME, { replace: true });
  };

  const submitCredentials = async (values: LoginRequest) => {
    const response = await login(values);
    if (response.mustChangePassword) {
      if (!response.otpTracker?.trim()) {
        throw new Error('شناسه تغییر رمز عبور دریافت نشد. دوباره وارد شوید.');
      }
      setStep({
        kind: 'changePassword',
        username: values.username,
        otpTracker: response.otpTracker,
      });
      return;
    }
    if ('token' in response) {
      await completeLogin(response);
      return;
    }
    const challengeId = 'challengeId' in response ? response.challengeId : response.otpTracker;
    if (!challengeId) throw new Error('شناسه تأیید ورود دریافت نشد. دوباره وارد شوید.');
    setStep({ kind: 'otp', username: values.username, challengeId });
  };

  return (
    <AuthLayout>
      {step.kind === 'otp' ? (
        <OtpStep
          onSubmit={async (code) =>
            completeLogin(await verifyOtp({ challengeId: step.challengeId, code }))
          }
          onBack={backToLogin}
        />
      ) : (
        <LoginPage key={step.kind} username={username} onSubmit={submitCredentials} />
      )}
      {step.kind === 'changePassword' && (
        <ChangePasswordModal
          onSubmit={async (values) => {
            await changePassword({
              ...values,
              otpTracker: step.otpTracker,
            });
            backToLogin();
            toast.success('رمز عبور تغییر کرد. با رمز جدید وارد شوید.');
          }}
          onCancel={backToLogin}
        />
      )}
    </AuthLayout>
  );
};
