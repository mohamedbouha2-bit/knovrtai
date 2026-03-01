import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// إنشاء نسخة واحدة من PrismaClient (أفضل للمنشآت الكبيرة)
const prisma = new PrismaClient();

export async function GET() {
  try {
    // في المستقبل، يمكنك استبدال هذه الأرقام الثابتة ببيانات حقيقية من قاعدة البيانات
    // مثال: const usage = await prisma.userQuota.findFirst({ where: { userId: 'current' } });
    
    return NextResponse.json({ 
      success: true,
      remaining: 85, 
      limit: 100,
      resetIn: "24h" 
    });
  } catch (error: any) {
    console.error("Quota API Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quota" }, 
      { status: 500 }
    );
  }
}