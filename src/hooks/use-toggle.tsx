"use client";

import * as React from "react";

type UseToggleReturn = [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>
];

/**
 * خطاف مخصص لتبديل حالة منطقية (Boolean) بسهولة.
 * @param defaultValue القيمة الابتدائية (الافتراضية false).
 */
export function useToggle(defaultValue: boolean = false): UseToggleReturn {
  // التأكد من صحة المدخلات في بيئة التطوير
  if (process.env.NODE_ENV !== "production" && typeof defaultValue !== "boolean") {
    throw new Error("useToggle: defaultValue must be a boolean");
  }
  
  const [value, setValue] = React.useState(defaultValue);

  // استخدام useCallback لضمان استقرار مرجع الدالة
  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}

export type { UseToggleReturn };