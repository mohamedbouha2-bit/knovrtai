"use client";

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useIsMounted } from './use-is-mounted';

type Size = {
  width: number | undefined;
  height: number | undefined;
};

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T | null>;
  onResize?: (size: Size) => void;
  box?: 'border-box' | 'content-box' | 'device-pixel-content-box';
};

const initialSize: Size = { width: undefined, height: undefined };

/**
 * خطاف مخصص لمراقبة تغير حجم عنصر معين بدقة.
 */
export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>,
): Size {
  const { ref, box = 'content-box' } = options;
  const [{ width, height }, setSize] = useState<Size>(initialSize);
  const isMounted = useIsMounted();
  const previousSize = useRef<Size>({ ...initialSize });
  
  // حفظ الدالة في مرجع لتجنب إعادة تشغيل التأثير عند تغير تعريف الدالة بالخارج
  const onResize = useRef<((size: Size) => void) | undefined>(undefined);
  onResize.current = options.onResize;

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined' || !('ResizeObserver' in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      const boxProp = box === 'border-box'
          ? 'borderBoxSize'
          : box === 'device-pixel-content-box'
            ? 'devicePixelContentBoxSize'
            : 'contentBoxSize';

      const newWidth = extractSize(entry, boxProp, 'inlineSize');
      const newHeight = extractSize(entry, boxProp, 'blockSize');

      // تجنب تحديث الحالة إذا لم تتغير الأبعاد فعلياً (الأداء)
      if (previousSize.current.width !== newWidth || previousSize.current.height !== newHeight) {
        const newSize = { width: newWidth, height: newHeight };
        previousSize.current = newSize;

        if (onResize.current) {
          onResize.current(newSize);
        } else if (isMounted()) {
          setSize(newSize);
        }
      }
    });

    observer.observe(ref.current, { box });

    return () => observer.disconnect();
  }, [box, ref, isMounted]);

  return { width, height };
}

function extractSize(
  entry: ResizeObserverEntry,
  box: keyof Pick<ResizeObserverEntry, 'borderBoxSize' | 'contentBoxSize' | 'devicePixelContentBoxSize'>,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  if (!entry[box]) {
    if (box === 'contentBoxSize') {
      return entry.contentRect[sizeType === 'inlineSize' ? 'width' : 'height'];
    }
    return undefined;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : (entry[box] as unknown as ResizeObserverSize)[sizeType];
}