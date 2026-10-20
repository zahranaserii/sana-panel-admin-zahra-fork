import { TextListFields } from './TextListFields';

/** دلایل لغو، رد، عدم اعطا و انواع مستند میانگین */
export const TextListsSection = () => (
  <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
    <div>
      <TextListFields
        name="contractCancelReasons"
        title="دلایل لغو قرارداد"
        placeholder="مثلاً عدم تمدید به درخواست شرکت"
        addText="افزودن دلیل"
      />
    </div>
    <div>
      <TextListFields
        name="loanRejectReasons"
        title="دلایل رد درخواست وام"
        placeholder="مثلاً پایین بودن رتبه اعتباری"
        addText="افزودن دلیل"
      />
    </div>
    <div>
      <TextListFields
        name="remoteGrantDeniedReasons"
        title="دلایل عدم اعطای تسهیلات غیرحضوری"
        subtitle="این دلایل هنگام انتخاب مرحله «عدم اعطای تسهیلات غیرحضوری» (در تأیید اعتبارات) نمایش داده می‌شوند."
        placeholder="مثلاً رتبه اعتباری غیرمجاز"
        addText="افزودن دلیل"
      />
    </div>
    <div>
      <TextListFields
        name="documentTypes"
        title="انواع مستند میانگین موجودی"
        subtitle="هنگام ثبت میانگین موجودی، انتخاب یکی از این انواع مستند و بارگذاری فایل آن اجباری است."
        placeholder="مثلاً نامه"
        addText="افزودن نوع مستند"
      />
    </div>
    <div>
      <TextListFields
        name="loanCancelReasons"
        title="دلایل لغو درخواست وام"
        placeholder="مثلاً انصراف متقاضی"
        addText="افزودن دلیل"
      />
    </div>
    <div>
      <TextListFields
        name="personnelRejectReasons"
        title="دلایل رد پرسنل"
        placeholder="مثلاً عدم تطابق اطلاعات پرسنل"
        addText="افزودن دلیل"
      />
    </div>
  </div>
);
