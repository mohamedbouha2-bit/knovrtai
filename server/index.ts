import express, { Request, Response, NextFunction, Router } from "express";
import { handleEntityRequest } from "./entity-handler";

// تصدير البريزما مباشرة كما طلبت لضمان توفرها في كامل المشروع
export { prisma } from './entities';

const router: Router = express.Router();

/**
 * المسار الرئيسي الموحد لمعالجة طلبات الكيانات (Entities)
 * تم تطويره ليدعم التحقق من البيانات الواردة قبل المعالجة
 */
router.post("/api/entities", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { entity, method, args } = req.body;

        // 1. التحقق من اكتمال البيانات في الطلب (Validation)
        if (!entity || !method) {
            return res.status(400).json({
                success: false, 
                error: "بيانات الطلب غير مكتملة. يرجى إرسال الـ entity والـ method." 
            });
        }

        // 2. تمرير الطلب للمحرك (Entity Handler)
        // أرسلنا مصفوفة فارغة في حال كانت الـ args غير موجودة لمنع انهيار المحرك
        const result = await handleEntityRequest(entity, method, args || []);

        // 3. إرجاع النتيجة (التي تحتوي أصلاً على نجاح أو فشل العملية)
        return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
        // تمرير أي خطأ غير متوقع لوسيط الأخطاء
        next(error); 
    }
});

/**
 * وسيط معالجة الأخطاء المطور (Global Error Handler)
 * يقوم بتسجيل الخطأ في الكونسول وإرجاع استجابة نظيفة للمستخدم
 */
router.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    const timestamp = new Date().toISOString();
    
    // تسجيل الخطأ مع تفاصيل إضافية للمساعدة في الإصلاح
    console.error(`[${timestamp}] Error in Module: ${err.message}`);
    console.error(`[Details]: Path: ${req.path}, Method: ${req.method}`);

    res.status(500).json({ 
        success: false,
        error: 'حدث خطأ داخلي في النظام (Module Internal Error)',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// المسار الفريد الخاص بالمشروع
export const path = '/BACKEND_PROJ_bb6c72d2_snap_20260225_135055_910';

const routeModule = {
    path,
    router
};

export default routeModule;