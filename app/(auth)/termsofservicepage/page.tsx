'use client';

import React from 'react';
import TermsOfServicePage_Header from '@/components/TermsOfServicePage_Header';
import TermsOfServicePage_DocumentBody from '@/components/TermsOfServicePage_DocumentBody';
export default function TermsOfServicePage() {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <TermsOfServicePage_Header />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <TermsOfServicePage_DocumentBody />
      </section>
    </main>;
}
