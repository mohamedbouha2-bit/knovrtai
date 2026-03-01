'use client';

import React from 'react';
import SEOLandingPage_MainHero from '@/components/SEOLandingPage_MainHero';
import SEOLandingPage_FeatureHighlights from '@/components/SEOLandingPage_FeatureHighlights';
import SEOLandingPage_AssetGallery from '@/components/SEOLandingPage_AssetGallery';
import SEOLandingPage_PricingTiers from '@/components/SEOLandingPage_PricingTiers';
import SEOLandingPage_SEOContentBlock from '@/components/SEOLandingPage_SEOContentBlock';
import SEOLandingPage_FinalCTA from '@/components/SEOLandingPage_FinalCTA';
const SEOLandingPage: React.FC = () => {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative">
        <SEOLandingPage_MainHero />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <SEOLandingPage_FeatureHighlights />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <SEOLandingPage_AssetGallery />
      </section>
      <section className="w-full relative bg-[#f9fafb]">
        <SEOLandingPage_PricingTiers />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <SEOLandingPage_SEOContentBlock />
      </section>
      <section className="w-full relative bg-[#2563eb]">
        <SEOLandingPage_FinalCTA />
      </section>
    </main>;
};
export default SEOLandingPage;
