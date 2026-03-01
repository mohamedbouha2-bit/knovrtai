"use client";

import { useCallback, useEffect, useState } from "react"
import { useEventListener } from "./use-event-listener"

const IS_SERVER = typeof window === "undefined"

type Options<T, InitializeWithValue extends boolean | undefined> = {
  deserializer?: (value: string) => T
  initializeWithValue: InitializeWithValue
}

/**
 * خطاف مخصص لقراءة القيم من localStorage ومراقبة تغيراتها دون تعديلها.
 */
export function useReadLocalStorage<T>(
  key: string,
  options: Options<T, false>,
): T | null | undefined
export function useReadLocalStorage<T>(
  key: string,
  options?: Partial<Options<T, true>>,
): T | null
export function useReadLocalStorage<T>(
  key: string,
  options: Partial<Options<T, boolean>> = {},
): T | null | undefined {
  let { initializeWithValue = true } = options
  if (IS_SERVER) initializeWithValue = false

  const deserializer = useCallback<(value: string) => T | null>(
    (value) => {
      if (options.deserializer) return options.deserializer(value)
      if (value === "undefined") return undefined as unknown as T

      try {
        return JSON.parse(value) as T
      } catch (error) {
        console.error("Error parsing JSON:", error)
        return null
      }
    },
    [options],
  )

  const readValue = useCallback((): T | null => {
    if (IS_SERVER) return null

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : null
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return null
    }
  }, [key, deserializer])

  const [storedValue, setStoredValue] = useState<T | null | undefined>(() => {
    if (initializeWithValue) return readValue()
    return undefined
  })

  // التحديث عند تغيير المفتاح (Key)
  useEffect(() => {
    setStoredValue(readValue())
  }, [key, readValue])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      // التحقق من أن التغيير يخص هذا المفتاح تحديداً
      const eventKey = (event as StorageEvent).key || (event as CustomEvent).detail?.key
      if (eventKey && eventKey !== key) return
      
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  // مراقبة التغييرات من التبويبات الأخرى (storage) ومن نفس التبويب (local-storage)
  useEventListener("storage", handleStorageChange)
  useEventListener("local-storage", handleStorageChange)

  return storedValue
}