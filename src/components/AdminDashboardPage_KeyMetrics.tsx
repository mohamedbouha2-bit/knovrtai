"use client";

import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Zap, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// ... (نفس الـ Interfaces والـ StatCard التي قدمتها ممتازة جداً)

export default function AdminDashboardPage_KeyMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalAiJobsProcessed: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const session = getBackendAdminSession();
        
        // فحص صلاحيات الأدمن قبل طلب البيانات
        if (!session?.token) {
          toast.error("جلسة العمل انتهت، يرجى تسجيل الدخول كمسؤول.");
          return;
        }

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // جلب البيانات بشكل متوازي لتقليل وقت الانتظار
        const [revenueOrders, activeSubsCount, completedJobsCount, newUsersCount] = await Promise.all([
          entities.subscription_order.GetAll({
            status: { equals: 'success' }
          }),
          entities.user_subscription.Count({
            status: { equals: 'active' }
          }),
          entities.ai_job.Count({
            status: { equals: 'completed' }
          }),
          entities.user.Count({
            created_at: { gte: startOfToday }
          })
        ]);

        // حساب الإيرادات مع التأكد من وجود قيم عددية
        const calculatedRevenue = revenueOrders.reduce((acc, order) => 
          acc + (Number(order.amount) || 0), 0
        );

        setMetrics({
          totalRevenue: calculatedRevenue,
          activeSubscriptions: activeSubsCount,
          totalAiJobsProcessed: completedJobsCount,
          newUsersToday: newUsersCount
        });

      } catch (error) {
        console.error('Dashboard Error:', error);
        toast.error('حدث خطأ أثناء تحديث البيانات الإحصائية.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
    // إمكانية إضافة تحديث تلقائي كل 5 دقائق
    const interval = setInterval(fetchDashboardMetrics, 300000);
    return () => clearInterval(interval);
  }, [mounted]);

  // دالة تنسيق احترافية (مثال: 10,500$ تصبح 11K$)
  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  if (!mounted) return null;

  return (
    <section className="w-full bg-slate-50/50 dark:bg-transparent border-b">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">نظرة عامة</h2>
            <p className="text-muted-foreground">أداء النظام ونمو المستخدمين في الوقت الفعلي.</p>
          </div>
          {loading && <Loader2 className="animate-spin text-blue-600" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="إجمالي الإيرادات" 
            value={`$${formatCompact(metrics.totalRevenue)}`}
            icon={<DollarSign size={18} />}
            trend="up"
            trendValue="+5.2%"
            loading={loading}
            iconColorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20"
          />
          {/* ... باقي البطاقات تستخدم نفس النمط */}
        </div>
      </div>
    </section>
  );
}