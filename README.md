# پنل سانا (sana-panel-admin)

پنل مدیریتی **سامانه اعتباری نوید امید (سانا)** — راست‌چین، با تم روشن/تیره.

## اجرا

```bash
npm install
npm run dev          # محیط development  (https://localhost:3005)
npm run dev:stage    # محیط staging
npm run build        # بیلد production
npm run build:stage  # بیلد staging
```

> سرور توسعه با `HTTPS=true` در `.env.development` روی `https://localhost:3005` و گواهی self-signed (plugin-basic-ssl) اجرا می‌شود؛
> بار اول مرورگر هشدار گواهی می‌دهد که باید تأیید شود. https فقط روی `vite` (serve) اعمال می‌شود و روی build اثری ندارد.
> پورت با متغیر `PORT` قابل تغییر است (پیش‌فرض ۳۰۰۵).
> بیلد production با terser فشرده می‌شود و `console` و `debugger` حذف می‌شوند؛ بقیه محیط‌ها sourcemap دارند.

فعلاً در **همه محیط‌ها** (development، staging و production) دیتا از ماک خوانده می‌شود (`VITE_ENABLE_MOCK=true`). ماک مستقیماً روی axios وصل است و به Service Worker یا https نیاز ندارد، پس بعد از دیپلوی هم کار می‌کند. هنگام اتصال به API واقعی کافی است این متغیر در `.env.staging` و `.env.production` برابر `false` شود. کاربر نمونه: `admin / admin` یا `branch / branch`.

| فرمان                       | کار                                                    |
| --------------------------- | ------------------------------------------------------ |
| `npm run lint` / `lint:fix` | ESLint (TypeScript، React، Hooks، Sonar، قوانین SOLID) |
| `npm run format`            | Prettier                                               |
| `npm run typecheck`         | بررسی تایپ‌ها                                          |
| `npm test` / `test:run`     | Vitest                                                 |
| `npm run test:e2e`          | Playwright                                             |

قبل از هر کامیت، Husky و lint-staged روی فایل‌های stage‌شده lint و format اجرا می‌کنند.
همه فایل‌ها با پایان خط **LF** هستند (`.gitattributes` و `.editorconfig`).

## محیط‌ها

فایل‌های `.env.development`، `.env.staging` و `.env.production`:

| متغیر               | توضیح                 |
| ------------------- | --------------------- |
| `VITE_API_BASE_URL` | آدرس API              |
| `VITE_API_TIMEOUT`  | تایم‌اوت درخواست (ms) |
| `VITE_ENABLE_MOCK`  | فعال بودن ماک MSW     |
| `VITE_APP_TITLE`    | عنوان سامانه          |

## ساختار پوشه‌ها

```
src/
├─ app/            راه‌اندازی اپ: providers (تم، Query، ErrorBoundary، Toaster) و router
├─ assets/         عکس‌ها و آیکون‌های خاص
├─ component/      همه کامپوننت‌های پایه + layout
├─ constant/       ثابت‌ها: routes، menu، roles، endpoints، queryKeys و mock/ (همه دیتای ماک)
├─ store/          استورهای Zustand (auth، profile، theme)
├─ features/       بخش‌های پروژه (هر بخش: pages، api، types)
├─ services/http/  axios، interceptor، هندلر خطا، توابع پایه درخواست
├─ hooks/          useQueryParams، usePrint، useChartTheme
├─ utils/          تاریخ جلالی، مبلغ، اکسل
├─ theme/          پالت رنگ (لایت/دارک)، توکن‌های antd، تایپوگرافی
├─ styles/         CSS اصلی (لایه‌بندی Tailwind و antd)
├─ config/         خواندن env
├─ types/          تایپ‌های عمومی
└─ test/           setup تست و handlerهای MSW
```

## نکات کلیدی

### HTTP و مدیریت خطا

```ts
import { http } from '@/services/http';

http.get<User[]>('/users');
http.post<User, CreateUser>('/users', body);
http.upload('/files', { file });
http.download('/reports/1', 'report.xlsx');

// هندلر اختصاصی برای کد وضعیت: اگر باشد فقط همین اجرا می‌شود، وگرنه رفتار پیش‌فرض همان کد
http.get('/users/1', {
  onError: {
    404: () => navigate('/users'),
    network: () => toast.error('اینترنت قطع است'),
  },
});
http.get('/ping', { silent: true }); // بدون هیچ توست/ریدایرکت پیش‌فرض
```

رفتارهای پیش‌فرض در `services/http/errorHandler.ts` هستند (مثلاً ۴۰۱ = خروج از حساب).

همه پاسخ‌های بک‌اند (موفق و خطا) در قالب `{ data, statusCode, message, isSuccess }` هستند:
توابع `http` فقط `data` را برمی‌گردانند، HTTP 200 همیشه موفق است و پیام خطا از `message` خوانده می‌شود.
هدرهای ثابت (`x-api-version`، `AppId`، `DeviceId`، `DeviceTypeId`، `DeviceInfo`، `AppLanguage`، `DeviceVersion`)
و توکن (`Authorization: Bearer`) در `services/http/client.ts` به همه درخواست‌ها اضافه می‌شوند.

### سرویس‌ها و ماک

هر داده‌ای که در سلکت، جدول یا اکشن استفاده می‌شود یک سرویس و endpoint دارد؛ هیچ لیستی داخل کامپوننت تعریف نمی‌شود.

- آدرس‌ها: `src/constant/endpoints.ts` · کلیدهای کش: `src/constant/queryKeys.ts`
- سرویس‌های هر بخش: `src/features/<feature>/api.ts`
- سرویس‌های مشترک: `src/services/lookup` (لیست‌های کشویی) و `src/services/file` (آپلود فایل)
- دیتای اولیه ماک: `src/constant/mock` · پاسخ‌دهنده‌های ماک (شبیه بک‌اند): `src/test/msw/handlers`
- فایل `docs/design/panel-negin-misagh.html` راهنمای صفحات و سرویس‌های مورد نیاز است.

### احراز هویت و منو

فقط `useAuthStore` با کوکی کار می‌کند: موقع لاگین `login(token)` و موقع خروج `logout()`.
interceptor و بقیه بخش‌ها توکن را فقط از همین استور می‌خوانند.
اطلاعات کاربر و نقش‌ها در `useProfileStore` هستند (`hasRole`). موقع خروج `resetSession()` توکن، پروفایل و همه کش (از جمله منو) را پاک می‌کند.

سایدبار از سرویس منوی بک‌اند (`Authentication/MainMenu`) ساخته می‌شود؛ نمونه پاسخ تحویل‌شده به بک‌اند:
`docs/api/main-menu.response.json`. فقط آیتم‌های `isActive` با `url` شناخته‌شده نمایش داده می‌شوند و
مسیر و آیکون هر صفحه از `constant/menu.ts` (router خود ما) می‌آید. صفحه‌ای که در منوی کاربر نیست با آدرس مستقیم هم باز نمی‌شود.

### فرم

```tsx
// فرم عمودی: همه فیلدها و دکمه‌ها با دولوپر
<Form layout="vertical" columns={3} onFinish={save}>
  <FormItem name="name" label="نام" required><TextInput /></FormItem>
  <FormItem name="active"><Switch label="فعال" /></FormItem>
</Form>

// فرم جستجو: دکمه‌های جستجو و حذف جستجو خودکار اضافه می‌شوند.
// بدون onSearch مقادیر به کوئری آدرس اضافه می‌شوند و «حذف جستجو» فقط همان کوئری‌ها را پاک می‌کند.
<Form layout="inline" onSearch={(values) => setFilters(values)}>
  <FormItem name="q" label="جستجو"><TextInput /></FormItem>
  <FormItem name="from" label="از تاریخ"><DateInput /></FormItem>
</Form>
```

### ارقام فارسی

ارقام با فونت فارسی نمایش داده می‌شوند و **هیچ تبدیلی روی مقدار انجام نمی‌شود**: فونت «Sana Digits»
(نسخه Farsi-Digits وزیرمتن، `src/styles/digits.css`) فقط برای کاراکترهای 0 تا 9 بارگذاری می‌شود.
پس مقدار ورودی‌ها و داده‌های ارسالی به API انگلیسی می‌ماند ولی همه‌جا (ورودی‌ها، جدول، چارت) فارسی دیده می‌شود.

### تاریخ

- ورودی: `DateInput` (react-multi-date-picker) با حالت‌های تکی/بازه/چندتایی، روز/ماه/سال و ساعت.
  مقدار همیشه رشته میلادی است (`YYYY-MM-DD`).
- نمایش: `formatJalali(date, 'YYYY/MM/DD')` یا `dayjs(date).formatJalali('dddd D MMMM YYYY')`.

### جدول

پجینیشن به‌صورت پیش‌فرض غیرفعال است:

- `pagination` → صفحه‌بندی داخلی.
- `pagination={{ current, pageSize, total, onChange }}` → صفحه‌بندی سمت سرور.

صفحات وسط جدول قرار می‌گیرند و تعداد کل رکورد در انتهای سمت چپ.

### سایر

| مورد  | ابزار                                             |
| ----- | ------------------------------------------------- |
| اکسل  | `exportToExcel` و `readExcel` در `utils/excel.ts` |
| پرینت | `usePrint()`                                      |
| چارت  | `@ant-design/charts` با `theme={useChartTheme()}` |
