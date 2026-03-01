'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users, UserCheck, UserPlus, UserX, TrendingUp, TrendingDown } from "lucide-react";
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  newRegistrationsToday: number;
  bannedUsers: number;
  activePercentage: number; // حقل إضافي محسوب
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorScheme: string;
}

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  loading = false,
  trend,
  colorScheme
}) => {
  return (
    <Card className="relative overflow-hidden shadow-sm border-border bg-card transition-all hover:shadow-md">
      {/* خط ملون علوي لتمييز الكارت */}
      <div className={`absolute top-0 left-0 w-full h-1 ${colorScheme}`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-md bg-slate-100/50">
          {icon}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold tracking-tight text-[#0f172a]">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            
            <div className="flex items-center gap-2">
              {trend && (
                <div className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {trend.value}%
                </div>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function UserManagementPage_MetricsOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newRegistrationsToday: 0,
    bannedUsers: 0,
    activePercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = getBackendAdminSession();
      if (!session?.token) return;

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const [totalCount, activeCount, newTodayCount, bannedCount] = await Promise.all([
        entities.user.Count({}),
        entities.user.Count({ status: { equals: 'active' } }),
        entities.user.Count({ created_at: { gte: startOfToday, lte: endOfToday } }),
        entities.user.Count({ status: { in: ['banned', 'suspended'] } })
      ]);

      // حساب نسبة المستخدمين النشطين
      const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

      setMetrics({
        totalUsers: totalCount,
        activeUsers: activeCount,
        newRegistrationsToday: newTodayCount,
        bannedUsers: bannedCount,
        activePercentage: activePct
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to sync real-time metrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    // اختياري: تحديث البيانات كل 5 دقائق
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <section className="w-full bg-[#f9fafb]">
      <div className="container mx-auto px-4 sm:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">
            System Health
          </h2>
          <p className="text-sm text-muted-foreground">Real-time user base analytics.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Total Accounts" 
            value={metrics.totalUsers} 
            icon={<Users className="h-4 w-4 text-blue-600" />} 
            description="Lifetime growth" 
            loading={isLoading}
            colorScheme="bg-blue-500"
          />

          <MetricCard 
            title="Retention Rate" 
            value={`${metrics.activePercentage}%`} 
            icon={<UserCheck className="h-4 w-4 text-emerald-600" />} 
            description="Of users are active" 
            loading={isLoading}
            trend={{ value: 12, isPositive: true }} // مثال لبيانات ثابتة أو يمكن حسابها
            colorScheme="bg-emerald-500"
          />

          <MetricCard 
            title="Daily Velocity" 
            value={metrics.newRegistrationsToday} 
            icon={<UserPlus className="h-4 w-4 text-amber-600" />} 
            description="New signups today" 
            loading={isLoading}
            colorScheme="bg-amber-500"
          />

          <MetricCard 
            title="Risk Profile" 
            value={metrics.bannedUsers} 
            icon={<UserX className="h-4 w-4 text-rose-600" />} 
            description="Restricted accounts" 
            loading={isLoading}
            colorScheme="bg-rose-500"
          />
        </div>
      </div>
    </section>
  );
}