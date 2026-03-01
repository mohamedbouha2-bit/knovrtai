"use client";

import { useCallback, useState } from 'react';

// تعريف أنواع البيانات المدعومة في الحالة الأولية
export type MapOrEntries<K, V> = Map<K, V> | [K, V][];

// واجهة التحكم في الخريطة
export type UseMapActions<K, V> = {
  set: (key: K, value: V) => void;
  setAll: (entries: MapOrEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: () => void;
};

// تعريف مخرجات الخطاف
export type UseMapReturn<K, V> = [
  Omit<Map<K, V>, 'set' | 'clear' | 'delete'>,
  UseMapActions<K, V>,
];

/**
 * خطاف مخصص لإدارة حالة من نوع Map في React.
 * يوفر وصولاً سريعاً وسهلاً لإضافة، حذف، وتعديل العناصر باستخدام المفاتيح.
 */
export function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map(),
): UseMapReturn<K, V> {
  const [map, setMap] = useState<Map<K, V>>(() => new Map(initialState));

  const actions: UseMapActions<K, V> = {
    // إضافة أو تحديث عنصر
    set: useCallback((key, value) => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.set(key, value);
        return copy;
      });
    }, []),

    // استبدال الخريطة بالكامل
    setAll: useCallback(entries => {
      setMap(() => new Map(entries));
    }, []),

    // حذف عنصر معين بواسطة المفتاح
    remove: useCallback(key => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    // تفريغ الخريطة بالكامل
    reset: useCallback(() => {
      setMap(() => new Map());
    }, []),
  };

  return [map, actions];
}