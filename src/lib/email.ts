import nodemailer from "nodemailer";

const transporter = process.env.SMTP_USER
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendVerificationCode(email: string, code: string) {
  if (!transporter) {
    console.log(`\n📧 ========== رمز التحقق ==========`);
    console.log(`   البريد: ${email}`);
    console.log(`   الرمز:  ${code}`);
    console.log(`   صالح لمدة: 10 دقائق`);
    console.log(`==================================\n`);
    return;
  }

  const from = process.env.SMTP_FROM || "noreply@professional-site.com";

  await transporter.sendMail({
    from,
    to: email,
    subject: "رمز التحقق - منصتي",
    html: `
      <div dir="rtl" style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9fb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px; font-size: 32px;">📧</div>
        <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <h1 style="font-size: 20px; margin: 0 0 8px; color: #1a1a2e;">رمز التحقق الخاص بك</h1>
          <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">استخدم الرمز التالي لتأكيد حسابك:</p>
          <div style="text-align: center; padding: 16px; background: #f0f0ff; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #7c3aed; direction: ltr;">${code}</div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; text-align: center;">هذا الرمز صالح لمدة 10 دقائق</p>
        </div>
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">إذا لم تطلب هذا، تجاهل هذه الرسالة</p>
      </div>
    `,
  });
}
