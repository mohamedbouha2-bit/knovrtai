'use client';

import React from 'react';
import PrivacyPolicyPage_Header from '@/components/PrivacyPolicyPage_Header';
import PrivacyPolicyPage_ContentBody from '@/components/PrivacyPolicyPage_ContentBody';
export default function PrivacyPolicyPage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <PrivacyPolicyPage_Header />
      </section>
      <section className="w-full relative">
        <PrivacyPolicyPage_ContentBody />
      </section>
    </main>;
}
