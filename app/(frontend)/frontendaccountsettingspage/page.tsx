'use client';

import React from 'react';
import FrontendAccountSettingsPage_Header from '@/components/FrontendAccountSettingsPage_Header';
import FrontendAccountSettingsPage_ProfileEditor from '@/components/FrontendAccountSettingsPage_ProfileEditor';
import FrontendAccountSettingsPage_PasswordManager from '@/components/FrontendAccountSettingsPage_PasswordManager';
import FrontendAccountSettingsPage_IntegrationList from '@/components/FrontendAccountSettingsPage_IntegrationList';
export default function FrontendAccountSettingsPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <FrontendAccountSettingsPage_Header />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <FrontendAccountSettingsPage_ProfileEditor />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <FrontendAccountSettingsPage_PasswordManager />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <FrontendAccountSettingsPage_IntegrationList />
      </section>
    </main>;
}
