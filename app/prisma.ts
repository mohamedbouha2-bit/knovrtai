// استيراد PrismaClient من المجلد المولد كما يظهر في سجلات Vercel
// السجلات أكدت التوليد في ./prisma-generated/client
import { PrismaClient } from "../prisma-generated/client";

/**
 * نمط Singleton لضمان إنشاء نسخة واحدة فقط من Prisma Client.
 * هذا يمنع خطأ "Too many clients" ويحل مشاكل المسارات في بيئة Next.js (Turbopack).
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    // اختيارياً: يمكنك إضافة سجلات لمراقبة الاستعلامات أثناء التطوير
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// تعريف الواجهة العالمية لمنع تكرار النسخ في بيئة التطوير
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// استخدام النسخة الموجودة أو إنشاء واحدة جديدة
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// في بيئة التطوير، نحفظ النسخة في globalThis لمنع إعادة الإنشاء عند الـ Hot Reload
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;