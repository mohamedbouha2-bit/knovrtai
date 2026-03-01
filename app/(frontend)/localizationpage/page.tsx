'use client';

import React from 'react';
import LocalizationPage_Header from '@/components/LocalizationPage_Header';
import LocalizationPage_Configurator from '@/components/LocalizationPage_Configurator';
export default function LocalizationPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <LocalizationPage_Header />
      </section>
      <section className="w-full relative">
        <LocalizationPage_Configurator />
      </section>
    </main>;
}
