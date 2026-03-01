// استيراد PrismaClient من المجلد المولد في الجذر
// استخدمنا ../ للخروج من مجلد app والوصول إلى prisma-generated
import { PrismaClient } from "../prisma-generated/client";

/**
 * نمط Singleton لضمان إنشاء نسخة واحدة فقط من Prisma Client
 * هذا يمنع خطأ "Too many clients" ويحل مشاكل المسارات في Next.js
 */

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;