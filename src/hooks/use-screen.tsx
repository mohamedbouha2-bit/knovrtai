"use client";

import { useState } from 'react';
import { useDebounceCallback } from './use-debounce-callback';
import { useEventListener } from './use-event-listener';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type UseScreenOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === 'undefined';

/**
 * خطاف مخصص للوصول إلى خصائص شاشة المستخدم ومراقبة تغيراتها (مثل تدوير الشاشة).
 */
export function useScreen(options: UseScreenOptions<false>): Screen | undefined;
export function useScreen(options?: Partial<UseScreenOptions<true>>): Screen;
export function useScreen(
  options: Partial<UseScreenOptions<boolean>> = {},
): Screen | undefined {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const readScreen = () => {
    if (IS_SERVER) return undefined;
    return window.screen;
  };

  const [screen, setScreen] = useState<Screen | undefined>(() => {
    if (initializeWithValue) return readScreen();
    return undefined;
  });

  const debouncedSetScreen = useDebounceCallback(
    setScreen,
    options.debounceDelay ?? 0,
  );

  function handleSize() {
    const newScreen = readScreen();
    const setSize = options.debounceDelay ? debouncedSetScreen : setScreen;

    if (newScreen) {
      // نقوم بفك الخصائص لضمان تحديث الحالة بكائن جديد (Immutability)
      setSize({
        width: newScreen.width,
        height: newScreen.height,
        availHeight: newScreen.availHeight,
        availWidth: newScreen.availWidth,
        colorDepth: newScreen.colorDepth,
        orientation: newScreen.orientation,
        pixelDepth: newScreen.pixelDepth,
      } as Screen);
    }
  }

  // الاستماع لحدث التغيير (مثل تغيير حجم النافذة أو تدوير الجهاز)
  useEventListener('resize', handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return screen;
}