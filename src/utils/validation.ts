export const getNationalCodeError = (value: string): string | undefined => {
  if (!value) return 'کد ملی الزامی است.';
  if (/\D/.test(value)) return 'کد ملی باید فقط شامل اعداد باشد';
  if (value.length !== 10) return 'کد ملی باید ۱۰ رقم باشد';

  const invalidCode = 'کد ملی معتبر نیست';
  if (/^(\d)\1{9}$/.test(value)) return invalidCode;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(value[i]) * (10 - i);
  }
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;
  if (Number(value[9]) !== checkDigit) return invalidCode;
};

export const nationalCodeRule = {
  validator: async (_: unknown, value: string) => {
    const error = getNationalCodeError(value);
    if (error) throw new Error(error);
  },
};

export const getNewPasswordError = (value: string, currentPassword?: string) => {
  if (!value) return 'رمز عبور جدید الزامی است.';
  if (value === currentPassword) return 'رمز عبور جدید باید با رمز فعلی متفاوت باشد.';
  if (value.length < 8 || value.length > 30) return 'رمز عبور باید بین ۸ تا ۳۰ کاراکتر باشد.';
  if (/[^A-Za-z0-9!@#$%&*_-]/.test(value))
    return 'فقط حروف و اعداد انگلیسی و نمادهای ! @ # $ % & * _ - مجاز هستند.';
  if (!/^[A-Za-z0-9]/.test(value)) return 'رمز عبور باید با حرف یا عدد انگلیسی شروع شود.';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value) || !/[!@#$%&*_-]/.test(value))
    return 'رمز عبور باید حداقل یک حرف انگلیسی، یک عدد انگلیسی و یک نماد مجاز داشته باشد.';
};

export const newPasswordRule = (currentPassword?: string) => ({
  validator: async (_: unknown, value?: string) => {
    if (!value) return; // Required fields are handled by FormItem.
    const error = getNewPasswordError(value, currentPassword);
    if (error) throw new Error(error);
  },
});
