"use client";

import * as React from "react";

/**
 * خطاف مخصص لتحديث عنوان الصفحة ديناميكياً.
 * @param title العنوان الجديد للصفحة.
 * @param restoreOnUnmount هل يجب إعادة العنوان القديم عند مغادرة الصفحة؟
 */
export function useDocumentTitle(
  title: string, 
  restoreOnUnmount: boolean = false
): void {
  // حفظ العنوان الأصلي عند أول تحميل للمكون
  const prevTitleRef = React.useRef<string>(
    typeof document !== 'undefined' ? document.title : "GemAI"
  );

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;
    }

    // تنظيف العنوان عند مغادرة الصفحة إذا تم تفعيل الخيار
    return () => {
      if (restoreOnUnmount && typeof document !== 'undefined') {
        document.title = prevTitleRef.current;
      }
    };
  }, [title, restoreOnUnmount]);
}