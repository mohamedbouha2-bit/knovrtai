"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * خطاف مخصص يختار بين useLayoutEffect و useEffect بناءً على البيئة.
 * - في المتصفح: يستخدم useLayoutEffect لضمان تحديث الواجهة قبل الرسم (Flicker-free).
 * - على السيرفر: يستخدم useEffect لتجنب تحذيرات SSR.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;