"use client";

import { useState } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

/**
 * خطاف مخصص لمراقبة استعلامات الوسائط (Media Queries) برمجياً.
 * @param query استعلام CSS (مثل: '(max-width: 768px)')
 * @param options خيارات القيمة الافتراضية والتهيأة.
 */
export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) return defaultValue
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query)
    return defaultValue
  })

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    
    // تحديث الحالة فوراً عند التركيب (Mount)
    const handleChange = () => setMatches(getMatches(query))

    // دعم المتصفحات القديمة والحديثة
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener("change", handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener("change", handleChange)
      }
    }
  }, [query])

  return matches
}