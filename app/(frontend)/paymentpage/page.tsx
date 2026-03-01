'use client';

import React from 'react';
import PaymentPage_WalletSummary from '@/components/PaymentPage_WalletSummary';
import PaymentPage_SubscriptionSelector from '@/components/PaymentPage_SubscriptionSelector';
import PaymentPage_CreditTopUp from '@/components/PaymentPage_CreditTopUp';
import PaymentPage_ManualTransferForm from '@/components/PaymentPage_ManualTransferForm';
export default function PaymentPage(): React.ReactElement {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative bg-[#f9fafb]">
        <PaymentPage_WalletSummary />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <PaymentPage_SubscriptionSelector />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <PaymentPage_CreditTopUp />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <PaymentPage_ManualTransferForm />
      </section>
    </main>;
}
