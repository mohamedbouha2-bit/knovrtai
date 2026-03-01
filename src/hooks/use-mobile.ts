"use client";

import * as React from "react";
import { useMediaQuery } from "./use-media-query";

const MOBILE_BREAKPOINT = 768;

/**
 * خطاف مخصص وسريع للتحقق مما إذا كان المستخدم يستخدم جهازاً محمولاً.
 * يعتمد على العرض القياسي (768px).
 */
export function useIsMobile(): boolean {
  // نستخدمuseMediaQuery الذي بنيناه سابقاً لضمان توحيد المنطق
  // وتقليل استهلاك موارد المتصفح
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`, {
    defaultValue: false,
    initializeWithValue: true,
  });

  return isMobile;
}