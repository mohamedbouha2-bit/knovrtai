'use client';

import React from 'react';
import UserManagementPage_MetricsOverview from '@/components/UserManagementPage_MetricsOverview';
import UserManagementPage_MainTable from '@/components/UserManagementPage_MainTable';
const UserManagementPage: React.FC = () => {
  return <main className="min-h-screen bg-[#ffffff]">
      <section className="w-full relative bg-[#f9fafb]">
        <UserManagementPage_MetricsOverview />
      </section>
      <section className="w-full relative bg-[#ffffff]">
        <UserManagementPage_MainTable />
      </section>
    </main>;
};
export default UserManagementPage;
