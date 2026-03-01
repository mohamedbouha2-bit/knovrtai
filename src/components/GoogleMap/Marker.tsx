'use client';

import React, { useCallback } from 'react';
import { AdvancedMarker, Pin, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPosition } from './Map';

export interface MarkerProps {
  /** موقع العلامة */
  position: MapPosition;
  /** نص يظهر عند تمرير الفأرة */
  title?: string;
  /** حدث عند النقر */
  onClick?: () => void;
  /** لون الأيقونة الداخلية (الرمز) */
  pinColor?: string;
  /** لون خلفية الدبوس */
  pinBackground?: string;
  /** لون حدود الدبوس */
  pinBorderColor?: string;
  /** حجم الدبوس (0.5 إلى 2) */
  pinScale?: number;
  /** قابلية السحب */
  draggable?: boolean;
  /** استدعاء عند انتهاء السحب */
  onDragEnd?: (position: MapPosition) => void;
  /** محتوى مخصص (HTML/React) بدلاً من الدبوس الافتراضي */
  children?: React.ReactNode;
}

/**
 * مكون العلامة المتقدمة (Advanced Marker)
 */
export function Marker({
  position,
  title,
  onClick,
  pinColor,
  pinBackground,
  pinBorderColor,
  pinScale = 1,
  draggable = false,
  onDragEnd,
  children
}: MarkerProps) {
  
  // استخدام Ref متقدم للوصول لميزات الخريطة إذا لزم الأمر
  const [markerRef, marker] = useAdvancedMarkerRef();

  // معالجة حدث السحب بطريقة آمنة
  const handleDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (onDragEnd && event.latLng) {
      onDragEnd({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  }, [onDragEnd]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      title={title}
      onClick={onClick}
      draggable={draggable}
      onDragEnd={handleDragEnd}
    >
      {/* إذا تم تمرير children يتم عرضها، وإلا يتم عرض الدبوس الافتراضي القابل للتخصيص */}
      {children ? (
        children
      ) : (
        <Pin
          background={pinBackground}
          borderColor={pinBorderColor}
          glyphColor={pinColor}
          scale={pinScale}
        />
      )}
    </AdvancedMarker>
  );
}