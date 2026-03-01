// 仅本地 run dev 使用 (ملف تشغيل بيئة التطوير المحلية)
import express, { Request, Response } from 'express';
import cors from 'cors';
import backendRoute from './index'; // استيراد الموديول الرئيسي الذي يحتوي على المسار والراوتر

const app = express();

// 1. إعدادات CORS: للسماح لمتصفحك بالاتصال بالسيرفر المحلي دون قيود الأمان
app.use(cors());

// 2. تصحيح أساسي: رفع حد حجم بيانات JSON المستلمة
// رفعنا الحد لـ 10mb لضمان استقبال نصوص AI الطويلة (Prompts) دون خطأ "Payload Too Large"
app.use(express.json({ limit: '10mb' }));

// 3. ربط المسار الديناميكي والراوتر من ملف index
// سيتم تفعيل المسار: http://localhost:3001/BACKEND_PROJ_bb6c72d2...
app.use(backendRoute.path, backendRoute.router);

// 4. مسار فحص الحالة (اختياري للتأكد من عمل السيرفر)
app.get('/status', (_req: Request, res: Response) => {
    res.json({ 
        success: true, 
        message: "Backend is live!", 
        active_path: backendRoute.path 
    });
});

// 5. تحديد المنفذ وتشغيل الخادم
const PORT = 3001;

app.listen(PORT, () => {
    console.log(`
    🚀 后端服务已启动 (Backend Started Successfully)
    --------------------------------------------------
    📍 Local URL:   http://localhost:${PORT}
    🔗 API Path:    ${backendRoute.path}
    🛠️ Mode:        Development (Local)
    --------------------------------------------------
    `);
});

// معالجة الأخطاء المفاجئة لمنع توقف العملية (Process)
process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR:', err.message);
});