'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Users, Activity, AlertCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import { toast } from 'sonner';

// ... (أنواع البيانات والوظائف المساعدة تبقى كما هي)

export default function PaymentsAdminPage_FinancialOverview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    mrr: 0,
    activeSubscriptions: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = getBackendAdminSession();
        if (!session?.token) return;

        // تنفيذ الطلبات بالتوازي لسرعة الاستجابة
        const [allOrders, activeSubsCount, pendingPayoutRequests] = await Promise.all([
          entities.subscription_order.GetAll({ status: { equals: 'success' } }),
          entities.user_subscription.Count({ status: { equals: 'active' } }),
          entities.payout_request.GetAll({ status: { equals: 'pending' } })
        ]);

        // 1. حساب إجمالي الإيرادات
        const totalRevenue = allOrders.reduce((acc, order) => acc + (Number(order.amount) || 0), 0);

        // 2. حساب MRR (إيرادات آخر 30 يوم)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const mrr = allOrders
          .filter(order => new Date(order.created_at) >= thirtyDaysAgo)
          .reduce((acc, order) => acc + (Number(order.amount) || 0), 0);

        // 3. حجم الطلبات المعلقة
        const pendingPayouts = pendingPayoutRequests.reduce((acc, req) => acc + (Number(req.amount) || 0), 0);

        setMetrics({
          totalRevenue,
          mrr,
          activeSubscriptions: activeSubsCount,
          pendingPayouts
        });
      } catch (err) {
        console.error('Financial metrics error:', err);
        toast.error('فشل في تحميل البيانات المالية');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="w-full bg-slate-50/50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">نظرة عامة مالية</h2>
          <p className="text-sm text-slate-500 mt-1">ملخص مؤشرات الأداء المالي وصحة النظام.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="إجمالي الإيرادات" 
            value={metrics.totalRevenue} 
            icon={<DollarSign className="text-emerald-600" />} 
            description="Lifetime earnings" 
            loading={loading}
            trend={<TrendingUp className="h-3 w-3 mr-1" />}
          />
          
          <MetricCard 
            title="الإيرادات الشهرية (MRR)" 
            value={metrics.mrr} 
            icon={<Activity className="text-blue-600" />} 
            description="آخر 30 يوم" 
            loading={loading}
          />

          <MetricCard 
            title="الاشتراكات النشطة" 
            value={metrics.activeSubscriptions} 
            icon={<Users className="text-violet-600" />} 
            description="Current active users" 
            loading={loading}
            isCurrency={false}
          />

          <MetricCard 
            title="مدفوعات معلقة" 
            value={metrics.pendingPayouts} 
            icon={<AlertCircle className="text-amber-600" />} 
            description="تتطلب موافقة الإدارة" 
            loading={loading}
            variant="warning"
          />
        </div>
      </div>
    </section>
  );
}

// مكون فرعي للبطاقات لتقليل تكرار الكود
function MetricCard({ title, value, icon, description, loading, isCurrency = true, variant = 'default', trend }: any) {
  return (
    <Card className={`border-slate-200 shadow-sm ${variant === 'warning' ? 'bg-amber-50/30' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
          {React.cloneElement(icon, { size: 16 })}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold text-slate-900">
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </div>
        )}
        <p className={`text-xs mt-1 flex items-center ${variant === 'warning' ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
          {trend}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}