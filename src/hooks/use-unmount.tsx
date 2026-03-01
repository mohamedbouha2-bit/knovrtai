"use client";

import * as React from "react";

/**
 * خطاف مخصص لتنفيذ دالة "تنظيف" بمجرد خروج المكون من واجهة المستخدم (Unmount).
 * يضمن الوصول إلى أحدث القيم بفضل استخدام المراجع (Refs).
 * * @param fn - الدالة المراد تنفيذها عند إلغاء التركيب.
 */
export function useUnmount(fn: () => void): void {
  // التحقق من نوع المدخلات لضمان سلامة الكود
  if (process.env.NODE_ENV !== "production" && typeof fn !== "function") {
    console.error("useUnmount: expects a function as an argument");
  }

  const fnRef = React.useRef(fn);
  
  // تحديث المرجع في كل رندر لضمان عدم حدوث Stale Closure
  React.useLayoutEffect(() => {
    fnRef.current = fn;
  });

  // التنفيذ عند الخروج فقط
  React.useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}