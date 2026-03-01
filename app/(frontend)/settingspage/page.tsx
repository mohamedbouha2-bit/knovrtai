'use client';

import React from 'react';
import SettingsPage_AccountProfile from '@/components/SettingsPage_AccountProfile';
import SettingsPage_SystemPreferences from '@/components/SettingsPage_SystemPreferences';
export default function SettingsPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <SettingsPage_AccountProfile />
      </section>
      <section className="w-full relative">
        <SettingsPage_SystemPreferences />
      </section>
    </main>;
}
