/** بدنه ورود (LoginQuery) */
export interface LoginRequest {
  username: string;
  password: string;
  captchaToken: string;
  captchaValue: string;
}

export type LoginFormValues = Omit<LoginRequest, 'captchaToken'>;

export interface CaptchaResponse {
  captchaToken: string;
  image: string;
}

export interface AuthSessionResponse {
  token: string;
}

export interface OtpChallenge {
  challengeId: string;
}

export interface PasswordChangeRequired {
  mustChangePassword: true;
  otpTracker: string;
}

export type LoginResponse =
  | PasswordChangeRequired
  | ((AuthSessionResponse | OtpChallenge | { otpTracker: string }) & {
      mustChangePassword?: false;
      otpTracker?: string;
    });

export interface ChangePasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest extends ChangePasswordFormValues {
  otpTracker: string;
}

export interface VerifyOtpRequest extends OtpChallenge {
  code: string;
}
