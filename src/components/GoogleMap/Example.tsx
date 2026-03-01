'use client';

import { useState, useMemo } from 'react';
import { GoogleMapProvider, Map, Marker, InfoWindow, MapPosition } from './index';

/**
 * مثال استخدام خرائط جوجل - نسخة محسنة
 */
export function GoogleMapExample() {
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const [markerPosition, setMarkerPosition] = useState<MapPosition>({
    lat: 39.9042,
    lng: 116.4074
  });

  // استخدام useMemo لتعريف المصفوفة مرة واحدة فقط لتحسين الأداء
  const markers = useMemo(() => [
    {
      id: 1,
      position: { lat: 39.9042, lng: 116.4074 },
      title: 'ساحة تيانانمن',
      description: 'وسط مدينة بكين، الصين'
    },
    {
      id: 2,
      position: { lat: 39.9163, lng: 116.3972 },
      title: 'المدينة المحرمة',
      description: 'القصر الإمبراطوري لأسرتي مينغ وتشينغ'
    },
    {
      id: 3,
      position: { lat: 39.8839, lng: 116.4033 },
      title: 'معبد السماء',
      description: 'موقع قرابين الأباطرة'
    }
  ], []);

  // استخراج بيانات العلامة المختارة
  const selectedMarker = markers.find(m => m.id === selectedMarkerId);

  return (
    // التصحيح الأهم: تغليف الكل بـ Provider واحد فقط لضمان تحميل الـ API مرة واحدة
    <GoogleMapProvider>
      <div className="space-y-6 p-4">
        <h2 className="text-2xl font-bold border-b pb-2">أمثلة مكون خرائط جوجل</h2>

        {/* مثال 1: الخريطة الأساسية */}
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-blue-600">1. الخريطة الأساسية</h3>
          <Map 
            center={{ lat: 39.9042, lng: 116.4074 }} 
            zoom={12} 
            className="rounded-xl overflow-hidden border shadow-sm" 
            style={{ height: '400px' }} 
          />
        </section>

        {/* مثال 2: خريطة مع عدة علامات ونوافذ معلومات */}
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-blue-600">2. خريطة مع علامات (Markers)</h3>
          <Map 
            center={{ lat: 39.9042, lng: 116.4074 }} 
            zoom={13} 
            className="rounded-xl overflow-hidden border shadow-sm" 
            style={{ height: '400px' }}
          >
            {markers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={marker.position} 
                title={marker.title} 
                onClick={() => setSelectedMarkerId(marker.id)} 
                pinBackground="#EA4335" 
              />
            ))}

            {selectedMarker && (
              <InfoWindow 
                position={selectedMarker.position} 
                onClose={() => setSelectedMarkerId(null)}
              >
                <div className="p-2 min-w-[150px]">
                  <h4 className="font-bold text-gray-800">{selectedMarker.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{selectedMarker.description}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </section>

        {/* مثال 3: علامة قابلة للسحب */}
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-blue-600">3. علامة قابلة للسحب (Draggable)</h3>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
            <p className="text-sm font-mono text-blue-800">
              الموقع الحالي: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </p>
          </div>
          <Map 
            center={markerPosition} 
            zoom={15} 
            className="rounded-xl overflow-hidden border shadow-sm" 
            style={{ height: '400px' }}
          >
            <Marker 
              position={markerPosition} 
              title="اسحبني لتغيير الموقع" 
              draggable 
              onDragEnd={(newPos) => setMarkerPosition(newPos)} 
              pinBackground="#34A853" 
            />
          </Map>
        </section>

        {/* مثال 4: عرض القمر الصناعي */}
        <section className="space-y-2">
          <h3 className="text-xl font-semibold text-blue-600">4. خريطة القمر الصناعي</h3>
          <Map 
            center={{ lat: 39.9042, lng: 116.4074 }} 
            zoom={16} 
            mapTypeId="satellite" 
            className="rounded-xl overflow-hidden border shadow-sm" 
            style={{ height: '400px' }} 
            mapTypeControl={true}
          />
        </section>
      </div>
    </GoogleMapProvider>
  );
}