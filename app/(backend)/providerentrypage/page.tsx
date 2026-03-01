'use client';

import React from 'react';
import ProviderEntryPage_SystemHealthOverview from '@/components/ProviderEntryPage_SystemHealthOverview';
import ProviderEntryPage_SeedInitialization from '@/components/ProviderEntryPage_SeedInitialization';
import ProviderEntryPage_GlobalConfiguration from '@/components/ProviderEntryPage_GlobalConfiguration';
import ProviderEntryPage_GPT4oConsole from '@/components/ProviderEntryPage_GPT4oConsole';
export default function ProviderEntryPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <ProviderEntryPage_SystemHealthOverview />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <ProviderEntryPage_SeedInitialization />
      </section>
      <section className="w-full relative">
        <ProviderEntryPage_GlobalConfiguration />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <ProviderEntryPage_GPT4oConsole />
      </section>
    </main>;
}
