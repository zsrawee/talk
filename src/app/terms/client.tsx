"use client";

export default function TermsContent() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <span className="horizon-rule mb-4 w-20" />
      <h1 className="font-display text-4xl font-black text-moon-ink dark:text-moon-text">
        شروط الاستخدام
      </h1>
      <p className="mt-2 text-sm text-dusk dark:text-dusk-light">
        آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
      </p>

      <div className="mt-10 space-y-6">
        <section>
          <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
            ١. مقدمة
          </h2>
          <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
            مرحباً بك في منصتي. باستخدامك لهذه المنصة، فإنك توافق على هذه
            الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط،
            فيرجى عدم استخدام المنصة.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
            ٢. الحسابات
          </h2>
          <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
            عند إنشاء حساب على منصتنا، يجب أن تكون المعلومات التي تقدمها
            دقيقة وكاملة ومحدثة. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة
            المرور وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
            ٣. المحتوى
          </h2>
          <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
            أنت تمتلك حقوق المحتوى الذي تنشره على المنصة. بنشر المحتوى،
            تمنح منصتي ترخيصاً غير حصري لعرض المحتوى الخاص بك على المنصة.
            أنت وحدك المسؤول عن المحتوى الذي تنشره.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
            ٤. الخصوصية
          </h2>
          <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
            نحن نحترم خصوصيتك. يتم جمع البيانات الأساسية فقط لتشغيل
            المنصة، ونحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة دون
            موافقتك.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
            ٥. التعديلات
          </h2>
          <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار
            المستخدمين بالتغييرات الهامة عبر البريد الإلكتروني.
          </p>
        </section>
      </div>
    </div>
  );
}
