import heroImage from '@/assets/images/home-hero.svg';
import { env } from '@/config/env';

/** صفحه خانه — تصویر معرفی خدمات تسهیلاتی */
export const HomePage = () => (
  <section className="overflow-hidden rounded-[28px] border border-line shadow-panel">
    <img
      src={heroImage}
      alt="خدمات تسهیلاتی سانا: بانک سپه، سکه‌های بهار آزادی، قرارداد تأییدشده، کارت‌های امید بانک و نمودار رشد اعتبار"
      className="block h-auto w-full"
    />
    <div className="bg-panel px-8 py-5 max-sm:px-4">
      <h2 className="m-0 text-[20px] font-extrabold text-heading max-sm:text-base">
        {env.appTitle}
      </h2>
      <p className="m-0 mt-1 text-[13.5px] text-ink-soft max-sm:text-xs">
        تخصیص تسهیلات قرض‌الحسنه و مرابحه به پرسنل شرکت‌ها بر اساس میانگین موجودی حساب
      </p>
    </div>
  </section>
);
