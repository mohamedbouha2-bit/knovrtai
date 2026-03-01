'use client';

import React, { CSSProperties, useMemo } from 'react';
import { Map as GoogleMap, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapProps {
  /** مركز الخريطة */
  center?: MapPosition;
  /** مستوى الزوم (1-20) */
  zoom?: number;
  /** نوع الخريطة */
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  /** ستايل مخصص للحاوية */
  style?: CSSProperties;
  /** اسم الكلاس (Tailwind مثلاً) */
  className?: string;
  /** التحكم بالإيماءات (سحب، زوم) */
  gestureHandling?: 'greedy' | 'cooperative' | 'none' | 'auto';
  /** إظهار أزرار التحكم */
  zoomControl?: boolean;
  streetViewControl?: boolean;
  mapTypeControl?: boolean;
  fullscreenControl?: boolean;
  /** معرف الخريطة للستايلات المتقدمة من Google Cloud */
  mapId?: string;
  /** حدث عند تغيير الكاميرا */
  onCameraChanged?: (ev: MapCameraChangedEvent) => void;
  /** العناصر الأبناء (Markers, InfoWindows) */
  children?: React.ReactNode;
}

/**
 * مكون الخريطة الأساسي المحسن
 */
export function Map({
  center = { lat: 24.7136, lng: 46.6753 }, // الافتراضي: الرياض
  zoom = 12,
  mapTypeId = 'roadmap',
  style,
  className,
  gestureHandling = 'auto',
  zoomControl = true,
  streetViewControl = false,
  mapTypeControl = false,
  fullscreenControl = false,
  mapId,
  onCameraChanged,
  children
}: MapProps) {
  
  // دمج الستايلات الافتراضية مع الممررة
  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '400px',
    borderRadius: '12px', // لمسة جمالية افتراضية
    overflow: 'hidden',
    ...style
  }), [style]);

  return (
    <div className={className} style={mapContainerStyle}>
      <GoogleMap
        defaultCenter={center}
        defaultZoom={zoom}
        mapTypeId={mapTypeId}
        gestureHandling={gestureHandling}
        disableDefaultUI={false}
        zoomControl={zoomControl}
        streetViewControl={streetViewControl}
        mapTypeControl={mapTypeControl}
        fullscreenControl={fullscreenControl}
        mapId={mapId}
        onCameraChanged={onCameraChanged}
      >
        {children}
      </GoogleMap>
    </div>
  );
}