'use client';

import React from 'react';
import BackendLoginPage_AuthPanel from '@/components/BackendLoginPage_AuthPanel';

// قمنا بإضافة { lang } كمستقبل (Prop) ليتم استلام اللغة من AuthLayout
export default function BackendLoginPage({ lang = 'ar' }: { lang?: string }) {
  return (
    <main className="min-h-screen w-full bg-[#f9fafb]">
      <section className="w-full relative">
        {/* نمرر lang هنا لكي يعرف المكون أي نصوص يعرض (عربي، إنجليزي، فرنسي) */}
        <BackendLoginPage_AuthPanel lang={lang} />
      </section>
    </main>
  );
}