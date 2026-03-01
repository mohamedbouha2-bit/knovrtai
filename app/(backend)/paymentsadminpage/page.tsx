'use client';

import React from 'react';
import PaymentsAdminPage_FinancialOverview from '@/components/PaymentsAdminPage_FinancialOverview';
import PaymentsAdminPage_TransactionManager from '@/components/PaymentsAdminPage_TransactionManager';
import PaymentsAdminPage_AffiliatePayouts from '@/components/PaymentsAdminPage_AffiliatePayouts';
const PaymentsAdminPage: React.FC = () => {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <PaymentsAdminPage_FinancialOverview />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <PaymentsAdminPage_TransactionManager />
      </section>
      <section className="w-full relative">
        <PaymentsAdminPage_AffiliatePayouts />
      </section>
    </main>;
};
export default PaymentsAdminPage;
