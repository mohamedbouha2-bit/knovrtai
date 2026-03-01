'use client';

import React from 'react';
import AdminDashboardPage_KeyMetrics from '@/components/AdminDashboardPage_KeyMetrics';
import AdminDashboardPage_RevenueAndUsageCharts from '@/components/AdminDashboardPage_RevenueAndUsageCharts';
import AdminDashboardPage_RealTimeActivityFeed from '@/components/AdminDashboardPage_RealTimeActivityFeed';
import AdminDashboardPage_TopAffiliatesAndUsers from '@/components/AdminDashboardPage_TopAffiliatesAndUsers';
export default function AdminDashboardPage() {
  return <main className="min-h-screen bg-[#f9fafb]">
      <section className="w-full relative bg-[#ffffff]">
        <AdminDashboardPage_KeyMetrics />
      </section>
      
      <section className="w-full relative bg-[#f9fafb]">
        <AdminDashboardPage_RevenueAndUsageCharts />
      </section>
      
      <section className="w-full relative bg-[#ffffff]">
        <AdminDashboardPage_RealTimeActivityFeed />
      </section>
      
      <section className="w-full relative bg-[#f9fafb]">
        <AdminDashboardPage_TopAffiliatesAndUsers />
      </section>
    </main>;
}
