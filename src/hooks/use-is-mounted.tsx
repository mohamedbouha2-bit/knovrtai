"use client";

import { useCallback, useEffect, useRef } from 'react';

/**
 * خطاف مخصص للتحقق مما إذا كان المكون لا يزال "مركباً" (Mounted) في واجهة المستخدم.
 * يستخدم لمنع تحديث الحالة (State Update) بعد إلغاء تحميل المكون.
 * * @returns دالة تعيد true إذا كان المكون موجوداً، و false إذا تم إلغاء تحميله.
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  // استخدام useCallback لضمان عدم تغير مرجع الدالة عند تمريرها لتببعيات أخرى
  return useCallback(() => isMounted.current, []);
}