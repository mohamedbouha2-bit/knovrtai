"use client";

import { useCallback, useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { useEventCallback } from "./use-event-callback"
import { useEventListener } from "./use-event-listener"

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent
  }
}

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options

  // وظائف التسلسل (Serialization)
  const serializer = useCallback<(value: T) => string>(
    (value) => options.serializer ? options.serializer(value) : JSON.stringify(value),
    [options]
  )

  const deserializer = useCallback<(value: string) => T>(
    (value) => {
      if (options.deserializer) return options.deserializer(value)
      if (value === "undefined") return undefined as unknown as T
      
      try {
        return JSON.parse(value) as T
      } catch (error) {
        console.error("Error parsing localStorage JSON:", error)
        return initialValue instanceof Function ? initialValue() : initialValue
      }
    },
    [options, initialValue]
  )

  // دالة قراءة القيمة
  const readValue = useCallback((): T => {
    const getInitialValue = () => initialValue instanceof Function ? initialValue() : initialValue
    if (IS_SERVER) return getInitialValue()

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : getInitialValue()
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return getInitialValue()
    }
  }, [initialValue, key, deserializer])

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) return readValue()
    return initialValue instanceof Function ? initialValue() : initialValue
  })

  // دالة التحديث
  const setValue: Dispatch<SetStateAction<T>> = useEventCallback((value) => {
    if (IS_SERVER) return

    try {
      const newValue = value instanceof Function ? value(storedValue) : value
      window.localStorage.setItem(key, serializer(newValue))
      setStoredValue(newValue)

      // تنبيه كافة المكونات في نفس التبويب
      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  })

  const removeValue = useEventCallback(() => {
    if (IS_SERVER) return

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue)
      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }))
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  })

  // مزامنة الحالة عند تغير المفتاح
  useEffect(() => {
    setStoredValue(readValue())
  }, [key, readValue])

  // مستمع الأحداث للتغييرات (من تبويبات أخرى أو من نفس التبويب)
  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) return
      // للحدث المخصص (التبويب الحالي)
      if ((event as CustomEvent).detail?.key && (event as CustomEvent).detail.key !== key) return
      
      setStoredValue(readValue())
    },
    [key, readValue]
  )

  useEventListener("storage", handleStorageChange)
  useEventListener("local-storage", handleStorageChange)

  return [storedValue, setValue, removeValue]
}