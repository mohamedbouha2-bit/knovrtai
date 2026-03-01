"use client";

import { useEffect, useRef } from "react";

/**
 * خطاف مخصص لإدارة الفواصل الزمنية (Intervals) بشكل تصريحي.
 * يحل مشكلة الإغلاقات (Closures) في React ويضمن الوصول لأحدث حالة.
 * * @param callback الدالة المطلوب تنفيذها دورياً.
 * @param delay التأخير بالملي ثانية (مرر null لإيقاف المؤقت).
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  // حفظ أحدث نسخة من الدالة دون إعادة تشغيل المؤقت
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // إعداد وتطهير المؤقت
  useEffect(() => {
    // التحقق من وجود تأخير (إذا كان null يتوقف المؤقت)
    if (delay !== null) {
      const tick = () => {
        savedCallback.current();
      };

      const id = setInterval(tick, delay);
      
      // تنظيف المؤقت عند تغيير التأخير أو إلغاء تحميل المكون
      return () => clearInterval(id);
    }
  }, [delay]);
}