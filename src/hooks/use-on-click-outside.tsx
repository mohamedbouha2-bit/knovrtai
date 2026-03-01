"use client";

import type { RefObject } from 'react';
import { useEventListener } from './use-event-listener';

type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

/**
 * خطاف مخصص لاكتشاف النقرات أو التفاعلات خارج عنصر محدد (أو مجموعة عناصر).
 * @param ref مرجع لعنصر واحد أو مصفوفة من المراجع.
 * @param handler الدالة التي يتم تنفيذها عند النقر بالخارج.
 * @param eventType نوع الحدث المطلوب مراقبته (الافتراضي mousedown).
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  useEventListener(
    eventType,
    event => {
      const target = event.target as Node;

      // تجاهل العناصر التي تم حذفها من الـ DOM أثناء النقر
      if (!target || !target.isConnected) {
        return;
      }

      // التحقق مما إذا كان النقر خارج جميع المراجع الممررة
      const isOutside = Array.isArray(ref)
        ? ref.every(r => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    undefined, // نراقب الحدث على مستوى window
    eventListenerOptions,
  );
}