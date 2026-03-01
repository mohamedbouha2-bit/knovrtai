"use client";

import * as React from "react";

/**
 * خطاف مخصص لاستخدام setTimeout بطريقة توافق دورة حياة React.
 * يضمن تحديث الدالة المرجعية دون إعادة تشغيل المؤقت.
 * * @param callback الدالة المراد تنفيذها.
 * @param delay الوقت بالملي ثانية (مرر null لإيقاف المؤقت).
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef(callback);

  // تحديث الدالة المرجعية عند كل رندر لضمان الوصول لأحدث State/Props
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // إعداد المؤقت
  React.useEffect(() => {
    // التحقق من صحة التأخير ومنع القيم السالبة
    if (delay === null || delay < 0) return;

    const id = setTimeout(() => savedCallback.current(), delay);

    // تنظيف المؤقت عند إغلاق المكون أو تغيير التأخير
    return () => clearTimeout(id);
  }, [delay]);
}