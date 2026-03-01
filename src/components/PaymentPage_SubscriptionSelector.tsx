'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import { Check, Loader2, Zap, Shield, Crown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import type { subscription_plan, subscription_plan_tier } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession } from '@/tools/SessionContext';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface EnrichedPlan extends subscription_plan {
  featuresParsed: PlanFeature[];
  isCurrent?: boolean;
}

export default function PaymentPage_SubscriptionSelector() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [plans, setPlans] = useState<EnrichedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const session = getFrontendUserSession();
        const userTier = session?.tier || 'free';

        const response = await entities.subscription_plan.GetAll({ is_active: true });

        const processedPlans = (response || [])
          .map((plan) => ({
            ...plan,
            featuresParsed: parseFeatures(plan.features_list),
            isCurrent: plan.tier === userTier
          }))
          .sort((a, b) => a.price - b.price);

        setPlans(processedPlans);
      } catch (err) {
        toast.error('فشل تحميل خطط الاشتراك. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // تحسين أنيميشن الدخول
  useEffect(() => {
    if (!loading && plans.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from('.plan-card', {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, plans]);

  const parseFeatures = (featuresStr: string): PlanFeature[] => {
    if (!featuresStr) return [];
    return featuresStr.split(/[,\n]/).map(f => ({
      text: f.trim(),
      included: true
    })).filter(f => f.text);
  };

  const handleSubscribe = async (plan: EnrichedPlan) => {
    const session = getFrontendUserSession();
    if (!session?.userId) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    if (plan.isCurrent) return;

    setProcessingId(plan.id);
    try {
      // محاكاة إنشاء طلب في قاعدة البيانات
      const newOrder = await entities.subscription_order.Create({
        user_id: parseInt(session.userId),
        subscription_plan_id: plan.id,
        payment_gateway_provider: 'stripe',
        amount: billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price,
        currency: 'usd',
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      });

      if (!newOrder) throw new Error();

      await new Promise(resolve => setTimeout(resolve, 1200)); // محاكاة بوابة الدفع
      toast.success(`تم الترقية إلى باقة ${plan.name} بنجاح!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error('حدث خطأ أثناء معالجة الدفع.');
    } finally {
      setProcessingId(null);
    }
  };

  const getTierIcon = (tier: subscription_plan_tier) => {
    const icons = {
      lite: <Zap className="w-6 h-6 text-blue-500" />,
      standard: <Shield className="w-6 h-6 text-purple-500" />,
      pro: <Crown className="w-6 h-6 text-amber-500" />
    };
    return icons[tier] || <Zap className="w-6 h-6 text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 animate-pulse">جاري تحميل أفضل الخطط لك...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 py-20" ref={containerRef}>
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50">الأسعار</Badge>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">باقات تناسب نمو أعمالك</h2>
          <p className="text-lg text-slate-600">اختر الخطة المناسبة وابدأ في استخدام أدوات الذكاء الاصطناعي اليوم.</p>
          
          {/* Toggle السنوي/الشهري */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={cn("text-sm font-semibold", billingCycle === 'monthly' ? "text-slate-900" : "text-slate-400")}>شهرياً</span>
            <Switch 
              checked={billingCycle === 'yearly'} 
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')} 
            />
            <span className={cn("text-sm font-semibold", billingCycle === 'yearly' ? "text-slate-900" : "text-slate-400")}>
              سنوياً <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full ml-1">وفر 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isPro = plan.tier === 'pro';
            const price = billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price;

            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "plan-card relative border-2 transition-all duration-300",
                  plan.isCurrent ? "border-blue-600 shadow-xl scale-105 z-10" : "border-slate-100 hover:border-slate-300"
                )}
              >
                {plan.isCurrent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    خطتك الحالية
                  </div>
                )}

                <CardHeader>
                  <div className="mb-4">{getTierIcon(plan.tier)}</div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-slate-500 text-sm">/{billingCycle === 'monthly' ? 'شهرياً' : 'سنوياً'}</span>
                  </div>
                  <CardDescription className="min-h-[40px] mt-2">{plan.description || 'احصل على مميزات حصرية مع هذه الباقة'}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-sm font-bold text-slate-800 uppercase tracking-tighter">المميزات:</div>
                  <ul className="space-y-3">
                    {plan.featuresParsed.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!plan.isCurrent || processingId === plan.id}
                    className={cn(
                      "w-full h-12 rounded-xl font-bold text-base transition-all",
                      plan.isCurrent 
                        ? "bg-slate-100 text-slate-400 border border-slate-200" 
                        : isPro ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    {processingId === plan.id ? <Loader2 className="animate-spin" /> : plan.isCurrent ? 'نشط حالياً' : 'اشترك الآن'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-20 flex flex-col items-center justify-center space-y-4 border-t border-slate-200 pt-10">
          <div className="flex items-center gap-6 opacity-40 grayscale">
            <span className="font-bold text-xl tracking-tighter">STRIPE</span>
            <span className="font-bold text-xl tracking-tighter">PAYPAL</span>
            <span className="font-bold text-xl tracking-tighter">VISA</span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> تشفير آمن لجميع المعاملات المالية (SSL)
          </p>
        </div>
      </div>
    </div>
  );
}