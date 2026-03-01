"use client";

import * as React from "react";

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

interface UseCounterOptions {
  min?: number;
  max?: number;
}

/**
 * خطاف مخصص لإدارة حالة العداد مع دعم اختياري للحدود الدنيا والقصوى.
 */
export function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min, max } = options;
  const [count, setCount] = React.useState(initialValue);

  const increment = React.useCallback(() => {
    setCount((x) => {
      if (max !== undefined && x >= max) return x;
      return x + 1;
    });
  }, [max]);

  const decrement = React.useCallback(() => {
    setCount((x) => {
      if (min !== undefined && x <= min) return x;
      return x - 1;
    });
  }, [min]);

  const reset = React.useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}