'use client';

import React from 'react';
import BackendRegisterPage_RegistrationForm from '@/components/BackendRegisterPage_RegistrationForm';

// استقبال متغير lang الممرر تلقائياً من الـ Layout
export default function BackendRegisterPage({ lang = 'ar' }: { lang?: string }) {
  return (
    <main className="min-h-screen w-full bg-[#f9fafb]">
      <section className="w-full relative">
        {/* تمرير اللغة للمكون المسؤول عن نموذج التسجيل */}
        <BackendRegisterPage_RegistrationForm lang={lang} />
      </section>
    </main>
  );
}