'use client';

import React from 'react';

/**
 * تم تنظيف هذا الملف وإزالة useAdminChanges 
 * لضمان نجاح عملية الـ Build في Vercel.
 */
export default function FrontendTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-purple-100 text-center">
        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          🚀
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-4">
          Frontend Test Page
        </h1>
        <p className="text-slate-600 leading-relaxed mb-8">
          تم إصلاح المسارات المكسورة بنجاح. الآن سيتمكن Vercel من إكمال بناء الموقع وتفعيل شهادة الـ SSL.
        </p>
        <div className="flex flex-col gap-3">
          <span className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm border border-green-100">
            الحالة: تم الإصلاح ✅
          </span>
        </div>
      </div>
    </div>
  );
}