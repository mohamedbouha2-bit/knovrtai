'use client';

import React from 'react';
import LocalizationAdminPage_AnalyticsOverview from '@/components/LocalizationAdminPage_AnalyticsOverview';
import LocalizationAdminPage_LanguageManager from '@/components/LocalizationAdminPage_LanguageManager';
import LocalizationAdminPage_CulturalPresets from '@/components/LocalizationAdminPage_CulturalPresets';
const LocalizationAdminPage: React.FC = () => {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative bg-[#f9fafb]">
        <LocalizationAdminPage_AnalyticsOverview />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <LocalizationAdminPage_LanguageManager />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <LocalizationAdminPage_CulturalPresets />
      </section>
    </main>;
};
export default LocalizationAdminPage;
