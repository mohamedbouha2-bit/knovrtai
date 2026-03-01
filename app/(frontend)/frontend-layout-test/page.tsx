"use client";

import React from 'react';

export default function FrontendFixPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-3xl shadow-lg border border-green-200">
        <h2 className="text-xl font-bold text-green-600">Frontend Test Page</h2>
        <p className="text-gray-500 mt-2">تم إصلاح أخطاء الاستيراد المكسورة بنجاح.</p>
      </div>
    </div>
  );
}