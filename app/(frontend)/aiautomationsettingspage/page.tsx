'use client';

import React from 'react';
import AIAutomationSettingsPage_Header from '@/components/AIAutomationSettingsPage_Header';
import AIAutomationSettingsPage_ConfigurationPanel from '@/components/AIAutomationSettingsPage_ConfigurationPanel';
const AIAutomationSettingsPage: React.FC = () => {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <AIAutomationSettingsPage_Header />
      </section>
      <section className="w-full relative">
        <AIAutomationSettingsPage_ConfigurationPanel />
      </section>
    </main>;
};
export default AIAutomationSettingsPage;
