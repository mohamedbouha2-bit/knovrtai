"use client";

import { useEffect, useRef, useState } from 'react';

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined,
] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

/**
 * خطاف مخصص لمراقبة تقاطع العنصر مع الشاشة (Viewport) أو عنصر حاوٍ.
 */
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const [ref, setRef] = useState<Element | null>(null);

  const [state, setState] = useState<State>(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));

  // حفظ الـ onChange في مرجع لتجنب إعادة تشغيل الـ Effect عند تغير الدالة
  const callbackRef = useRef<UseIntersectionObserverOptions['onChange']>(onChange);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    if (!ref || frozen || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        entries.forEach(entry => {
          // حساب التقاطع بناءً على التوقعات (Thresholds)
          const isIntersecting = entry.isIntersecting;

          setState({ isIntersecting, entry });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }
        });
      },
      { threshold, root, rootMargin },
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };

    // نستخدم قيم بسيطة في مصفوفة التبعيات لضمان الاستقرار
  }, [ref, JSON.stringify(threshold), root, rootMargin, frozen]);

  const result = [
    setRef,
    state.isIntersecting,
    state.entry,
  ] as IntersectionReturn;

  // دعم الوصول للقيم عبر التفكيك ككائن
  result.ref = setRef;
  result.isIntersecting = state.isIntersecting;
  result.entry = state.entry;

  return result;
}