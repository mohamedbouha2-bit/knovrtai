'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CreditCard, Calendar, Zap, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { gsap } from 'gsap';

// الاستيرادات الخاصة بالكيانات والجلسة
import type { user_subscription, user_wallet, subscription_plan } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session } from '@/tools/SessionContext';

// --- Types ---
interface DashboardData {
  subscription: user_subscription | null;
  wallet: user_wallet | null;
  plan: subscription_plan | null;
}

// --- Helpers ---
const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'لا يوجد فوترة نشطة';
  return new Intl.DateTimeFormat('ar-SA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

export default function PaymentPage_WalletSummary() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null); // مرجع للأنيميشن
  const [data, setData] = useState<DashboardData>({
    subscription: null,
    wallet: null,
    plan: null
  });

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = getfrontend_user_session();
        
        if (!session?.userId) {
          setLoading(false);
          return;
        }

        const userId = parseInt(session.userId);

        // جلب المحفظة والاشتراكات بالتوازي لسرعة الأداء
        const [subs, wallets] = await Promise.all([
          entities.user_subscription.GetAll({
            user_id: { equals: userId },
            status: { in: ['active', 'trial', 'cancelled'] }
          }),
          entities.user_wallet.GetAll({
            user_id: { equals: userId }
          })
        ]);

        const currentSub = subs.find(s => s.status === 'active' || s.status === 'trial') || subs[0] || null;
        const currentWallet = wallets[0] || null;

        let currentPlan: subscription_plan | null = null;
        if (currentSub?.subscription_plan_id) {
          currentPlan = await entities.subscription_plan.Get({
            id: currentSub.subscription_plan_id
          });
        }

        setData({
          subscription: currentSub,
          wallet: currentWallet,
          plan: currentPlan
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('فشل تحميل ملخص الحساب');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- التحريك (GSAP) ---
  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        // أنيميشن دخول الكروت
        gsap.from('.dashboard-card', {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out'
        });

        // أنيميشن عداد الرصيد
        const creditValue = data.wallet?.current_credit_balance || 0;
        gsap.fromTo('#credit-balance-value', 
          { innerText: 0 },
          { 
            innerText: creditValue,
            duration: 1.5,
            snap: { innerText: 1 },
            ease: 'power3.out'
          }
        );
      }, containerRef);

      return () => ctx.revert(); // تنظيف الأنيميشن عند مغادرة الصفحة
    }
  }, [loading, data.wallet]);

  if (loading) return <LoadingState />;

  const { subscription, wallet, plan } = data;
  const isPro = plan?.tier === 'pro';
  const tierColor = isPro ? 'bg-purple-600' : 'bg-blue-600';
  const credits = wallet?.current_credit_balance ?? 0;
  
  // حساب نسبة الاستخدام (تجريبياً)
  const usagePercentage = subscription?.status === 'active' ? 75 : 0;

  return (
    <section className="w-full bg-[#f9fafb] border-b border-[#e5e7eb]" ref={containerRef}>
      <div className="container mx-auto px-8 py-10">
        
        {/* Header */}
        <div className="mb-8 dashboard-card">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">النظرة العامة المالية</h1>
          <p className="text-[#64748b]">إدارة اشتراكك، رصيدك، ودورة الفوترة الخاصة بك بكفاءة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Wallet */}
          <Card className="dashboard-card border border-[#e5e7eb] shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> رصيد النقاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-[#0f172a]" id="credit-balance-value">
                  {credits}
                </span>
                <span className="text-sm text-[#64748b]">نقطة متاحة</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#64748b]">الاستخدام الشهري</span>
                  <span className="text-[#0f172a]">{usagePercentage}%</span>
                </div>
                <Progress value={usagePercentage} className="h-1.5" />
                <p className="text-[11px] text-[#94a3b8]">
                  لديك نقاط كافية لعمل حوالي {Math.floor(credits / 10)} عمليات توليد إضافية.
                </p>
              </div>
              <Button className="w-full mt-6 bg-[#2563eb] hover:bg-[#1d4ed8]">شحن الرصيد</Button>
            </CardContent>
          </Card>

          {/* Card 2: Subscription */}
          <Card className="dashboard-card border border-[#e5e7eb] shadow-sm bg-white relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${tierColor} opacity-5 rounded-full blur-2xl -mr-10 -mt-10`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> الخطة الحالية
                </CardTitle>
                <Badge className={subscription?.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700'}>
                  {subscription?.status || 'غير نشط'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[#0f172a]">{plan?.name || 'الباقة المجانية'}</h3>
                <p className="text-xs text-[#64748b] mt-1">
                  {plan ? `$${plan.price}/شهرياً - دورة ${plan.billing_cycle}` : 'لا توجد خطة نشطة'}
                </p>
              </div>
              <div className="space-y-2 mt-4 text-sm text-[#475569]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>دعم {isPro ? 'فني أولوية' : 'قياسي'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{plan?.credits_included || 0} نقطة شهرية</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6 border-slate-200">إدارة الخطة</Button>
            </CardContent>
          </Card>

          {/* Card 3: Billing */}
          <Card className="dashboard-card border border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#64748b] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" /> دورة الفوترة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-xs text-[#64748b] block mb-1">تاريخ الفاتورة القادمة</span>
                <span className="text-lg font-bold text-[#0f172a]">{formatDate(subscription?.next_billing_date)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-[#0f172a]">Visa **** 4242</p>
                    <p className="text-[10px] text-[#64748b]">تنتهي في 12/2025</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-100 text-[10px] text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <p>سيتم تجديد الاشتراك تلقائياً في تاريخ الاستحقاق.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-8 py-10 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}