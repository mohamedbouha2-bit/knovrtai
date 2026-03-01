"use client";

import * as React from "react";

/**
 * واجهة التحكم في الحالة المنطقية
 */
export type UseBooleanReturn = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

/**
 * خطاف (Hook) مخصص لإدارة الحالات المنطقية (Boolean) بسهولة.
 * مفيد جداً للتحكم في النوافذ المنبثقة، القوائم، وحالات التحميل.
 */
export function useBoolean(defaultValue: boolean = false): UseBooleanReturn {
  // التأكد من أن القيمة الافتراضية منطقية دائماً
  const [value, setValue] = React.useState<boolean>(!!defaultValue);

  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle };
}