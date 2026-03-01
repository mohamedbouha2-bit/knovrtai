import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../prisma-generated/client'; 

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entity, method, args } = body;

    if (!args || !Array.isArray(args)) {
       return NextResponse.json({ success: false, error: "Invalid arguments" }, { status: 400 });
    }

    if (entity === 'user' && method === 'Create') {
      const newUser = await prisma.user.create({
        data: {
          email: args[0].email,
          // ملاحظة: إذا استمر خطأ 'username'، تأكد من اسمه في schema.prisma (ربما يكون name)
          password: args[0].password,
          role: 'user',
          status: 'active'
        }
      });
      return NextResponse.json({ success: true, data: newUser });
    }

    if (entity === 'user' && method === 'Count') {
      const count = await prisma.user.count({ where: args[0] || {} });
      return NextResponse.json({ success: true, data: count });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}