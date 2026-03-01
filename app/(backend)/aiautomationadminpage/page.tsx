'use client';

import React from 'react';
import AIAutomationAdminPage_SystemHealthMonitor from '@/components/AIAutomationAdminPage_SystemHealthMonitor';
import AIAutomationAdminPage_ProviderConfiguration from '@/components/AIAutomationAdminPage_ProviderConfiguration';
import AIAutomationAdminPage_FeatureControlPanel from '@/components/AIAutomationAdminPage_FeatureControlPanel';
export default function AIAutomationAdminPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative bg-[#f9fafb]">
        <AIAutomationAdminPage_SystemHealthMonitor />
      </section>
      
      <section className="w-full relative bg-[#ffffff]">
        <AIAutomationAdminPage_ProviderConfiguration />
      </section>
      
      <section className="w-full relative bg-[#f9fafb]">
        <AIAutomationAdminPage_FeatureControlPanel />
      </section>
    </main>;
}
