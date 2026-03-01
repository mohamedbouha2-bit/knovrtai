"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

// ----------------------------------------------------------------------
// Overload Signatures (تعدد توقيعات الدالة لضمان دقة الأنواع)
// ----------------------------------------------------------------------

// لمتصفح الويب (Window)
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

// للعناصر الرسومية (SVG) أو عناصر HTML
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
): void;

// للمستند (Document)
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document | null>,
  options?: boolean | AddEventListenerOptions
): void;

// لمراقبة تفضيلات الشاشة (MediaQueryList)
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: RefObject<MediaQueryList | null>,
  options?: boolean | AddEventListenerOptions
): void;

// ----------------------------------------------------------------------
// Implementation (التنفيذ الفعلي)
// ----------------------------------------------------------------------

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList | Document = HTMLElement
>(
  eventName: KW | KH | KM | string,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event
  ) => void,
  element?: RefObject<T | null>,
  options?: boolean | AddEventListenerOptions
) {
  // حفظ الـ handler في مرجع لضمان الوصول لأحدث القيم دون إعادة تشغيل الـ Effect
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // تحديد الهدف: إما العنصر الممرر عبر Ref أو الـ window كخيار افتراضي
    const targetElement: T | Window | null = element?.current ?? (typeof window !== "undefined" ? window : null);

    if (!targetElement || !targetElement.addEventListener) return;

    // تعريف المستمع الذي يستدعي أحدث نسخة من الدالة
    const listener: typeof handler = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    // تنظيف الذاكرة وإزالة المستمع عند التفكيك
    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };