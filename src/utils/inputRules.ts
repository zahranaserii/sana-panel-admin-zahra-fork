import { toEnglishDigits } from '@/utils/date';

const letters = 'آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءأؤئۀ';

export const normalizeLetters = (value: string) => value.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
export const normalizeText = (value: string) => toEnglishDigits(normalizeLetters(value));

export const usernameRule = {
  pattern: /^[A-Za-z\d.]{1,20}$/,
  message: 'فقط حروف انگلیسی، اعداد و نقطه (.) مجاز است.',
};
export const captchaRule = {
  pattern: /^[A-Za-z\d]{1,10}$/,
  message: 'کد امنیتی باید فقط شامل حروف و اعداد انگلیسی باشد.',
};
export const fullNameRule = {
  pattern: new RegExp(`^(?=.*[${letters}])[${letters} ‌]{1,51}$`, 'u'),
  message: 'نام و نام خانوادگی را فقط با حروف فارسی، فاصله و نیم‌فاصله وارد کنید.',
};
export const organizationNameRule = {
  pattern: new RegExp(`^(?=.*[${letters}])[${letters}0-9۰-۹٠-٩ ‌]+$`, 'u'),
  message: 'نام باید حداقل یک حرف فارسی داشته باشد و فقط شامل حروف فارسی، فاصله و رقم باشد.',
};
export const numericCodeRule = { pattern: /^\d{1,10}$/, message: 'کد باید ۱ تا ۱۰ رقم باشد.' };
export const personnelCodeRule = {
  pattern: /^[A-Za-z\d-]{1,10}$/,
  message: 'کد پرسنلی فقط شامل حروف انگلیسی، رقم و خط تیره است.',
};
export const agreementRule = {
  pattern: new RegExp(`^[${letters}A-Za-z0-9/.-]+$`, 'u'),
  message: 'شماره تفاهم‌نامه فقط شامل حرف فارسی یا انگلیسی، رقم، نقطه، خط تیره و / است.',
};
export const titleRule = {
  pattern: new RegExp(
    `^(?=.*[${letters}A-Za-z0-9۰-۹٠-٩])[${letters}A-Za-z0-9۰-۹٠-٩ ‌()-]{1,50}$`,
    'u',
  ),
  message: 'عنوان باید شامل حرف یا رقم باشد. فاصله، نیم‌فاصله، خط تیره و پرانتز هم مجازند.',
};
export const schemeCodeRule = {
  pattern: /^[A-Za-z\d_-]{2,30}$/,
  message: 'کد طرح فقط شامل حروف انگلیسی، رقم، خط تیره و زیرخط است.',
};
export const descriptionRule = {
  pattern: new RegExp(`^[${letters}A-Za-z0-9۰-۹٠-٩ ‌،,.;؛:؟?!()/\\n-]{1,300}$`, 'u'),
  whitespace: true,
  message: 'توضیح را با حروف، اعداد و نشانه‌های نگارشی مجاز، حداکثر در ۳۰۰ کاراکتر وارد کنید.',
};
export const descriptionHint = 'حداکثر ۳۰۰ کاراکتر';
const searchCharacters = `[${letters}A-Za-z0-9 ‌-]`;
export const selectSearchPattern = new RegExp(`^${searchCharacters}*$`, 'u');
export const searchRule = {
  pattern: new RegExp(`^${searchCharacters}{0,30}$`, 'u'),
  message: 'جستجو حداکثر ۳۰ کاراکتر است. فقط حروف، رقم، فاصله، نیم‌فاصله و خط تیره مجازند.',
};
