/** بدنه ورود (LoginQuery) */
export interface LoginRequest {
  username: string;
  password: string;
  captchaToken: string;
  captchaValue: string;
}

export type LoginFormValues = Omit<LoginRequest, 'captchaToken'>;

export interface CaptchaResponse {
  token: string;
  base64Image: string;
}

export interface AuthSessionResponse {
  token: string;
}

export interface LoginResponse {
  token: string | null;
  otpTracker: string | null;
  otpExpireTime: string | null;
  mustChangePassword: boolean;
  maskedMobile: string | null;
}

export interface ChangePasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  otpTracker: string;
}

export interface VerifyOtpRequest {
  otpTracker: string;
  code: string;
}
