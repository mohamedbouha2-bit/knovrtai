'use client';

import React from 'react';
import AffiliateFrontendPage_PerformanceDashboard from '@/components/AffiliateFrontendPage_PerformanceDashboard';
import AffiliateFrontendPage_TransactionHistory from '@/components/AffiliateFrontendPage_TransactionHistory';
export default function AffiliateFrontendPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative bg-[#f9fafb]">
        <AffiliateFrontendPage_PerformanceDashboard />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <AffiliateFrontendPage_TransactionHistory />
      </section>
    </main>;
}
