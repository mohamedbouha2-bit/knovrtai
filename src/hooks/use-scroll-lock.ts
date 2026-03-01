"use client";

import { useRef, useState, useCallback } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

type UseScrollLockOptions = {
  autoLock?: boolean
  lockTarget?: HTMLElement | string
  widthReflow?: boolean
}

type UseScrollLockReturn = {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

type OriginalStyle = {
  overflow: CSSStyleDeclaration["overflow"]
  paddingRight: CSSStyleDeclaration["paddingRight"]
}

const IS_SERVER = typeof window === "undefined"

/**
 * خطاف مخصص لمنع التمرير في الصفحة أو عنصر معين.
 * يمنع "قفزة المحتوى" الناتجة عن اختفاء شريط التمرير بشكل ذكي.
 */
export function useScrollLock(
  options: UseScrollLockOptions = {},
): UseScrollLockReturn {
  const { autoLock = true, lockTarget, widthReflow = true } = options
  const [isLocked, setIsLocked] = useState(false)
  const target = useRef<HTMLElement | null>(null)
  const originalStyle = useRef<OriginalStyle | null>(null)

  const lock = useCallback(() => {
    if (target.current) {
      const { overflow, paddingRight } = target.current.style

      // حفظ الأنماط الأصلية لاستعادتها لاحقاً
      originalStyle.current = { overflow, paddingRight }

      if (widthReflow) {
        // حساب العرض المتاح (window للجسم أو offsetWidth للعناصر)
        const offsetWidth =
          target.current === document.body
            ? window.innerWidth
            : target.current.offsetWidth
        
        // حساب الحشو الحالي
        const currentPaddingRight =
          parseInt(window.getComputedStyle(target.current).paddingRight, 10) || 0

        // حساب عرض شريط التمرير الفعلي
        const scrollbarWidth = offsetWidth - target.current.scrollWidth
        
        // تعويض اختفاء الشريط بزيادة الحشو
        target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`
      }

      // قفل التمرير
      target.current.style.overflow = "hidden"
      setIsLocked(true)
    }
  }, [widthReflow])

  const unlock = useCallback(() => {
    if (target.current && originalStyle.current) {
      target.current.style.overflow = originalStyle.current.overflow

      if (widthReflow) {
        target.current.style.paddingRight = originalStyle.current.paddingRight
      }
    }

    setIsLocked(false)
  }, [widthReflow])

  useIsomorphicLayoutEffect(() => {
    if (IS_SERVER) return

    // تحديد العنصر المستهدف (Body هو الافتراضي)
    if (lockTarget) {
      target.current = typeof lockTarget === "string" 
        ? document.querySelector(lockTarget) 
        : lockTarget
    }

    if (!target.current) {
      target.current = document.body
    }

    if (autoLock) lock()

    return () => unlock()
  }, [autoLock, lockTarget, widthReflow, lock, unlock])

  return { isLocked, lock, unlock }
}