"use client";

import { useState } from 'react';
import type { RefObject } from 'react';
import { useEventListener } from './use-event-listener';

/**
 * خطاف مخصص لمراقبة حالة "حوم" الفأرة (Hover) فوق عنصر محدد.
 * @param elementRef مرجع العنصر المطلوب مراقبته.
 * @returns قيمة منطقية (true/false) تعبر عن حالة الحوم.
 */
export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T | null>,
): boolean {
  const [value, setValue] = useState<boolean>(false);

  // استخدام الدوال كأحداث مستقرة
  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  // ربط الأحداث باستخدام الخطاف الذي بنيناه سابقاً
  // لاحظ أنه يتعامل تلقائياً مع تنظيف الذاكرة (Cleanup)
  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}