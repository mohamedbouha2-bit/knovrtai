"use client";

import * as React from "react";

/**
 * خطاف داخلي لإدارة مستمعي الأحداث بكفاءة
 */
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void
) {
  // حفظ الـ handler في مرجع لتجنب إعادة تشغيل useEffect عند تغيره
  const savedHandler = React.useRef(handler);

  React.useLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // تعريف المستمع واستدعاء المرجع الحالي
    const eventListener = (event: DocumentEventMap[K]) => savedHandler.current(event);

    document.addEventListener(eventName, eventListener);
    
    // التنظيف عند إلغاء تحميل المكون
    return () => document.removeEventListener(eventName, eventListener);
  }, [eventName]);
}

/**
 * يقوم بتنفيذ دالة معينة عند النقر في أي مكان داخل المستند.
 * @param handler الدالة المطلوب تنفيذها عند النقر.
 */
export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener('click', (event) => {
    handler(event as MouseEvent);
  });
}