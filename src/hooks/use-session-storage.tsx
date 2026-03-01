"use client";

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useEventCallback } from './use-event-callback';
import { useEventListener } from './use-event-listener';

declare global {
  interface WindowEventMap {
    'session-storage': CustomEvent;
  }
}

type UseSessionStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

/**
 * خطاف مخصص لإدارة sessionStorage مع مزامنة الحالة وتوافق SSR.
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseSessionStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = useCallback<(value: T) => string>(
    value => options.serializer ? options.serializer(value) : JSON.stringify(value),
    [options],
  );

  const deserializer = useCallback<(value: string) => T>(
    value => {
      if (options.deserializer) return options.deserializer(value);
      if (value === 'undefined') return undefined as unknown as T;
      
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return initialValue instanceof Function ? initialValue() : initialValue;
      }
    },
    [options, initialValue],
  );

  const readValue = useCallback((): T => {
    const getInit = () => (initialValue instanceof Function ? initialValue() : initialValue);
    if (IS_SERVER) return getInit();

    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? deserializer(raw) : getInit();
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return getInit();
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) return readValue();
    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = useEventCallback(value => {
    if (IS_SERVER) return;

    try {
      const newValue = value instanceof Function ? value(readValue()) : value;
      window.sessionStorage.setItem(key, serializer(newValue));
      setStoredValue(newValue);
      window.dispatchEvent(new CustomEvent('session-storage', { detail: { key } }));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  });

  const removeValue = useEventCallback(() => {
    if (IS_SERVER) return;
    window.sessionStorage.removeItem(key);
    setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
    window.dispatchEvent(new CustomEvent('session-storage', { detail: { key } }));
  });

  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      const eventKey = (event as StorageEvent).key || (event as CustomEvent).detail?.key;
      if (eventKey && eventKey !== key) return;
      setStoredValue(readValue());
    },
    [key, readValue],
  );

  useEventListener('storage', handleStorageChange);
  useEventListener('session-storage', handleStorageChange);

  return [storedValue, setValue, removeValue];
}