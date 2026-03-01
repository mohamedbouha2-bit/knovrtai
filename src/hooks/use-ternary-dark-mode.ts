"use client";

import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "./use-local-storage";
import { useMediaQuery } from "./use-media-query";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "gem-ai-theme";

export type TernaryDarkMode = "system" | "dark" | "light";

export type TernaryDarkModeOptions = {
  defaultValue?: TernaryDarkMode;
  localStorageKey?: string;
  initializeWithValue?: boolean;
};

export type TernaryDarkModeReturn = {
  isDarkMode: boolean; // النتيجة النهائية (هل الوضع داكن الآن؟)
  ternaryDarkMode: TernaryDarkMode; // الاختيار الحالي للمستخدم
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
};

/**
 * خطاف مخصص لإدارة الوضع الليلي الثلاثي (نظام، فاتح، داكن).
 * يعتمد على إعدادات نظام التشغيل ويحفظ اختيار المستخدم محلياً.
 */
export function useTernaryDarkMode({
  defaultValue = "system",
  localStorageKey = LOCAL_STORAGE_KEY,
  initializeWithValue = true,
}: TernaryDarkModeOptions = {}): TernaryDarkModeReturn {
  // 1. مراقبة تفضيلات نظام التشغيل
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, { initializeWithValue });

  // 2. إدارة الحالة في التخزين المحلي
  const [mode, setMode] = useLocalStorage<TernaryDarkMode>(localStorageKey, defaultValue, {
    initializeWithValue,
  });

  // 3. تحديد النتيجة النهائية بناءً على الاختيار وإعدادات النظام
  const isDarkMode = mode === "dark" || (mode === "system" && isDarkOS);

  // 4. دالة التبديل الدوري (Light -> System -> Dark -> Light)
  const toggleTernaryDarkMode = () => {
    const modes: TernaryDarkMode[] = ["light", "system", "dark"];
    setMode((prevMode) => {
      const nextIndex = (modes.indexOf(prevMode) + 1) % modes.length;
      return modes[nextIndex];
    });
  };

  return {
    isDarkMode,
    ternaryDarkMode: mode,
    setTernaryDarkMode: setMode,
    toggleTernaryDarkMode,
  };
}