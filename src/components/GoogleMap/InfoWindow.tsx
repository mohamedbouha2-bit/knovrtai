'use client';

import React, { useMemo } from 'react';
import { InfoWindow as GoogleInfoWindow } from '@vis.gl/react-google-maps';
import { MapPosition } from './Map';

export interface InfoWindowProps {
  /** موقع نافذة المعلومات */
  position: MapPosition;
  /** استدعاء عند الإغلاق */
  onClose?: () => void;
  /** المحتوى الداخلي */
  children: React.ReactNode;
  /** العرض الأقصى (بالبكسل) */
  maxWidth?: number;
  /** إزاحة البكسل [x, y] لضبط موقع النافذة فوق العلامة */
  pixelOffset?: [number, number];
  /** هل يتم تعطيل التحريك التلقائي للخريطة عند فتح النافذة */
  disableAutoPan?: boolean;
  /** خيار إضافي: عنوان للنافذة (Header) */
  headerDisabled?: boolean;
}

/**
 * مكون نافذة المعلومات (InfoWindow)
 * يستخدم لعرض تفاصيل إضافية عند النقر على علامة في الخريطة.
 */
export function InfoWindow({
  position,
  onClose,
  children,
  maxWidth = 300,
  pixelOffset,
  disableAutoPan = false,
  headerDisabled = false
}: InfoWindowProps) {
  
  // تحويل pixelOffset إلى كائن الحجم الذي تتوقعه مكتبة جوجل إذا وُجد
  const offset = useMemo(() => {
    if (!pixelOffset) return undefined;
    return new google.maps.Size(pixelOffset[0], pixelOffset[1]);
  }, [pixelOffset]);

  return (
    <GoogleInfoWindow
      position={position}
      onCloseClick={onClose} // المكتبة تستخدم onCloseClick بدلاً من onClose في بعض الإصدارات
      maxWidth={maxWidth}
      pixelOffset={offset}
      disableAutoPan={disableAutoPan}
      headerDisabled={headerDisabled}
    >
      {/* تنسيق داخلي يضمن توافق الخطوط والألوان مع تصميم تطبيقك */}
      <div className="p-1 min-w-[120px] text-gray-800 leading-relaxed font-sans">
        {children}
      </div>
    </GoogleInfoWindow>
  );
}