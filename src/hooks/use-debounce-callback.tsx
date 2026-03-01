"use client";

import * as React from "react"
import debounce from "lodash.debounce"
import { useUnmount } from "./use-unmount"

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) & ControlFunctions

export function useDebounceCallback<T extends (...args: any[]) => any>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  // حفظ الدالة الأصلية في مرجع لتجنب إعادة إنشاء الـ debounce عند تغير المراجع
  const funcRef = React.useRef(func)
  
  React.useLayoutEffect(() => {
    funcRef.current = func
  }, [func])

  const debounced = React.useMemo(() => {
    // دالة وسيطة تستدعي دائماً أحدث نسخة من func
    const internalFunc = (...args: Parameters<T>) => funcRef.current(...args)
    
    const debouncedInstance = debounce(internalFunc, delay, options)

    const wrappedFunc = ((...args: Parameters<T>) => {
      return debouncedInstance(...args)
    }) as DebouncedState<T>

    wrappedFunc.cancel = () => debouncedInstance.cancel()
    wrappedFunc.flush = () => debouncedInstance.flush()
    wrappedFunc.isPending = () => !!debouncedInstance.pending

    return wrappedFunc
  }, [delay, options])

  // تنظيف العمليات المعلقة عند إلغاء تحميل المكون
  useUnmount(() => {
    debounced.cancel()
  })

  return debounced
}