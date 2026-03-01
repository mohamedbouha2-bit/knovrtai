"use client";

import { useEffect, useLayoutEffect, useState, RefObject } from 'react';
import { useScroll, UseScrollOptions } from 'framer-motion';

// استخدام النسخة الآمنة لـ LayoutEffect التي صممناها سابقاً
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface UseSafeScrollOptions extends Omit<UseScrollOptions, 'target'> {
  target?: RefObject<HTMLElement | null>;
}

/**
 * خطاف useScroll آمن يضمن عدم حدوث أخطاء Hydration في Next.js.
 * يتأكد من أن المرجع (Target Ref) متاح ومركب قبل تفعيل مراقبة التمرير.
 */
export function useSafeScroll(options: UseSafeScrollOptions = {}) {
  const [isMounted, setIsMounted] = useState(false);
  const { target, ...restOptions } = options;

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  // لا يتم تمرير الـ target إلا بعد التأكد من تركيب المكون في المتصفح
  const scrollOptions: UseScrollOptions = {
    ...restOptions,
    ...(isMounted && target?.current ? { target: target as RefObject<HTMLElement> } : {}),
  };

  return useScroll(scrollOptions);
}