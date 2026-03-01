"use client";

import * as React from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

export type Position = {
  x: number // الإحداثي الأفقي بالنسبة للصفحة
  y: number // الإحداثي الرأسي بالنسبة للصفحة
  elementX?: number // الإحداثي الأفقي داخل العنصر
  elementY?: number // الإحداثي الرأسي داخل العنصر
  elementPositionX?: number // موقع العنصر الأفقي في الصفحة
  elementPositionY?: number // موقع العنصر الرأسي في الصفحة
}

/**
 * خطاف مخصص لتتبع حركة الفأرة بدقة داخل الصفحة أو بالنسبة لعنصر محدد.
 */
export function useMousePosition<T extends HTMLElement = HTMLElement>(): [
  Position,
  React.RefObject<T | null>,
] {
  const [state, setState] = React.useState<Position>({ x: 0, y: 0 })
  const ref = React.useRef<T>(null)

  useIsomorphicLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newState: Position = {
        x: event.pageX,
        y: event.pageY,
      }

      if (ref.current) {
        // حساب موقع العنصر بالنسبة للشاشة مع مراعاة التمرير (Scroll)
        const rect = ref.current.getBoundingClientRect()
        const elementPositionX = rect.left + window.scrollX
        const elementPositionY = rect.top + window.scrollY
        
        // حساب موقع الفأرة "داخل" العنصر نفسه
        newState.elementPositionX = elementPositionX
        newState.elementPositionY = elementPositionY
        newState.elementX = event.pageX - elementPositionX
        newState.elementY = event.pageY - elementPositionY
      }

      setState(newState)
    }

    // الاستماع للحركة على مستوى المستند بالكامل
    window.addEventListener("mousemove", handleMouseMove)

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return [state, ref]
}