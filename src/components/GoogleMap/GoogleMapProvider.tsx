'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { ReactNode, useMemo } from 'react';

interface GoogleMapProviderProps {
  children: ReactNode;
  apiKey?: string;
  language?: string; // إضافة دعم اللغة (مثلاً 'ar' للعربية)
  region?: string;   // إضافة دعم المنطقة
}

/**
 * مزود خرائط جوجل (Google Map Provider)
 * يقوم بإدارة تحميل مكتبة Google Maps ويوفر السياق للمكونات الأبناء.
 */
export function GoogleMapProvider({
  children,
  apiKey,
  language = 'ar', // افتراضياً اللغة العربية
  region = 'SA',   // افتراضياً منطقة معينة
}: GoogleMapProviderProps) {
  
  // استخراج المفتاح مع إعطاء الأولوية للـ Prop ثم متغير البيئة
  const key = useMemo(() => 
    apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', 
  [apiKey]);

  // التحقق من وجود المفتاح قبل محاولة التحميل
  if (!key) {
    const isDev = process.env.NODE_ENV === 'development';
    
    console.warn('⚠️ Google Maps API Key is missing');

    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-1">
          <span>⚠️ تنبيه: مفتاح الخرائط غير متوفر</span>
        </div>
        <p className="text-sm text-yellow-700">
          {isDev 
            ? 'يرجى إضافة NEXT_PUBLIC_GOOGLE_MAPS_API_KEY في ملف .env.local الخاص بك.' 
            : 'خدمة الخرائط غير متاحة حالياً، يرجى المحاولة لاحقاً.'}
        </p>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={key} 
      language={language} 
      region={region}
      // يمكنك إضافة خيارات التحميل المتقدمة هنا مثل libraries=['places']
    >
      {children}
    </APIProvider>
  );
}