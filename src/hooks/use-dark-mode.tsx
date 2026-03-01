"use client";

import { useEffect, useState, useCallback } from 'react';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const LOCAL_STORAGE_KEY = 'gem-ai-theme-mode';

type DarkModeOptions = {
  defaultValue?: boolean;
  localStorageKey?: string;
  initializeWithValue?: boolean;
  applyDarkClass?: boolean;
};

export function useDarkMode(options: DarkModeOptions = {}) {
  const {
    defaultValue = false,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
    applyDarkClass = true,
  } = options;

  // دالة لجلب تفضيلات النظام
  const getOSPreference = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(COLOR_SCHEME_QUERY).matches;
    }
    return defaultValue;
  }, [defaultValue]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !initializeWithValue) return defaultValue;

    try {
      const storedValue = window.localStorage.getItem(localStorageKey);
      if (storedValue !== null) return JSON.parse(storedValue);
    } catch (error) {
      console.warn("Failed to parse dark mode from localStorage", error);
    }
    return getOSPreference();
  });

  // مزامنة الحالة مع التغييرات الخارجية (مثل تبويبات أخرى)
  useEffect(() => {
    const root = window.document.documentElement;
    if (applyDarkClass) {
      if (isDarkMode) root.classList.add('dark');
      else root.classList.remove('dark');
    }

    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(isDarkMode));
    } catch (e) { /* تجاهل أخطاء التخزين الخاص */ }
  }, [isDarkMode, localStorageKey, applyDarkClass]);

  // الاستماع لتغييرات النظام
  useEffect(() => {
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    const handler = (e: MediaQueryListEvent) => {
      // لا نغير الوضع إذا كان المستخدم قد اختار يدوياً وحفظ خياره
      if (window.localStorage.getItem(localStorageKey) === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [localStorageKey]);

  return {
    isDarkMode,
    toggle: () => setIsDarkMode(prev => !prev),
    enable: () => setIsDarkMode(true),
    disable: () => setIsDarkMode(false),
    set: (value: boolean) => setIsDarkMode(value),
  };
}