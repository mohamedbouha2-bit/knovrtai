"use client";

import { useCallback, useState, useRef, useEffect } from "react";

export type UseCopyToClipboardReturn = [
  (text: string) => Promise<boolean>,
  boolean
];

export const useCopyToClipboard = (timeout = 2000): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  // مرجع لحفظ المؤقت لتنظيفه عند الحاجة
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      // مسح أي مؤقت سابق إذا نقر المستخدم مرتين بسرعة
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
      return false;
    }
  }, [timeout]);

  // تنظيف المؤقت عند إلغاء تحميل المكون (Prevent Memory Leaks)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [copy, isCopied];
};