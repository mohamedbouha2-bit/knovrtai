// استيراد PrismaClient من المجلد المولد كما أكدت سجلات Vercel الأخيرة
// المسار ../ يخرج من مجلد (app) أو (lib) للوصول إلى الجذر حيث يوجد prisma-generated
import { PrismaClient } from "../prisma-generated/client";

/**
 * نمط Singleton لضمان إنشاء نسخة واحدة فقط من Prisma Client.
 * هذا ضروري جداً في Next.js لمنع استهلاك اتصالات قاعدة البيانات (Too many clients)
 * ولضمان استقرار العمل مع Turbopack في بيئة Vercel.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    // إظهار السجلات في بيئة التطوير فقط لتسهيل التصحيح
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// إعداد الواجهة العالمية (Global Type) لضمان توافق TypeScript
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// إنشاء النسخة أو استدعاء النسخة الموجودة مسبقاً
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// حفظ النسخة عالمياً في بيئة التطوير فقط
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;