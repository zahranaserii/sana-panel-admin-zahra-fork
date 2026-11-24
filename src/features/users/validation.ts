export const mobileNumberRule = {
  pattern: /^09\d{9}$/,
  message: 'شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.',
};

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
