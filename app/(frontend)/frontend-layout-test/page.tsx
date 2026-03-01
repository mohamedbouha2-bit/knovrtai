'use client';

import React from 'react';
import { useAdminChanges } from '../layout'; // استدعاء سياق التغييرات من الـ Layout

export default function BackendTestPage() {
  const { setHasUnsavedChanges, showToast, locale, darkMode } = useAdminChanges();

  return (
    <div className="py-12 space-y-8">
      <div className={`p-8 rounded-[2rem] border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h1 className="text-2xl font-black mb-4">مركز اختبار الإدارة (Backend)</h1>
        <p className="opacity-70 mb-8">
          {locale === 'ar' 
            ? 'هذه الصفحة مخصصة لتجربة زر الحفظ العائم ونظام التنبيهات.' 
            : 'This page is for testing the floating save button and toast system.'}
        </p>

        <div className="flex flex-wrap gap-4">
          {/* تفعيل زر الحفظ العائم */}
          <button 
            onClick={() => setHasUnsavedChanges(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-transform active:scale-95"
          >
            {locale === 'ar' ? 'إجراء تعديل تجريبي' : 'Make Test Change'}
          </button>

          {/* تجربة التنبيهات (Toasts) */}
          <button 
            onClick={() => showToast(locale === 'ar' ? 'تم تحديث البيانات!' : 'Data Updated!', 'success')}
            className={`px-6 py-3 rounded-xl font-bold border transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}
          >
            {locale === 'ar' ? 'إظهار تنبيه نجاح' : 'Show Success Toast'}
          </button>
        </div>
      </div>
    </div>
  );
}