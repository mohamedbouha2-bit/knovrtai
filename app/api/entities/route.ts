import { NextResponse } from 'next/server';
// التعديل هنا ليرتبط بالمجلد الذي تم إنشاؤه بنجاح
import { PrismaClient } from '../../../prisma-generated/client'; 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entity, method, args } = body;

    // معالجة طلب إنشاء مستخدم جديد (Signup)
    if (entity === 'user' && method === 'Create') {
      const newUser = await prisma.user.create({
        data: {
          email: args[0].email,
          username: args[0].username,
          password: args[0].password,
          role: 'user',
          status: 'active'
        }
      });
      return NextResponse.json({ success: true, data: newUser });
    }

    // معالجة طلب فحص البريد (Count)
    if (entity === 'user' && method === 'Count') {
      const count = await prisma.user.count({ where: args[0] });
      return NextResponse.json({ success: true, data: count });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}