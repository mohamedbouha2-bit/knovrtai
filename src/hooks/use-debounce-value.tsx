"use client";

import { useRef, useState, useMemo } from "react";
import { useDebounceCallback } from "./use-debounce-callback";
import type { DebouncedState } from "./use-debounce-callback";

type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
};

/**
 * خطاف مخصص لإرجاع نسخة "مؤجلة" من القيمة، مع دالة لتحديثها.
 * مفيد جداً لتصفية القوائم أو تحديث واجهات الاستعلام الثقيلة.
 */
export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions<T>
): [T, DebouncedState<(value: T) => void>] {
  const eq = options?.equalityFn ?? ((left: T, right: T) => left === right);
  
  // فك القيمة الأولية إذا كانت دالة (Lazy Initialization)
  const [unwrappedInitialValue] = useState(initialValue);
  
  const [debouncedValue, setDebouncedValue] = useState<T>(unwrappedInitialValue);
  const previousValueRef = useRef<T>(unwrappedInitialValue);

  const updateDebouncedValue = useDebounceCallback(
    (value: T) => {
      setDebouncedValue(value);
    },
    delay,
    options
  );

  // تحديث القيمة المؤجلة إذا تغيرت القيمة الأولية الممررة من الخارج
  if (!eq(previousValueRef.current, unwrappedInitialValue)) {
    updateDebouncedValue(unwrappedInitialValue);
    previousValueRef.current = unwrappedInitialValue;
  }

  return [debouncedValue, updateDebouncedValue];
}