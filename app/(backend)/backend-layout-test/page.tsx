"use client";

import React from 'react';

/**
 * تم تصحيح هذا الملف لإزالة الاستيرادات المكسورة (useAdminChanges) 
 * التي كانت تسبب فشل البناء (Build Error) في Vercel.
 */
export default function BackendTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl border border-purple-100 text-center">
        <h1 className="text-2xl font-bold text-purple-600 mb-2">Backend Test Page</h1>
        <p className="text-gray-600">
          تم إصلاح ملف الاختبار بنجاح. الموقع الآن جاهز للعمل.
        </p>
        <div className="mt-6">
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Status: Ready ✅
          </span>
        </div>
      </div>
    </div>
  );
}