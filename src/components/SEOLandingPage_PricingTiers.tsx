'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session, type FrontendUserSession } from '@/tools/SessionContext';

// --- الثوابت الافتراضية خارج المكون لتحسين الأداء ---
const DEFAULT_TIERS: PricingTier[] = [
  {
    id: 'lite',
    name: 'Lite',
    price: 0,
    description: 'Perfect for individuals exploring AI content creation.',
    features: ['Access to standard AI models', 'Basic content generation', '5 credits per month'],
    limitations: ['No API access', 'Watermarked exports'],
    ctaText: 'Get Started',
    tierType: 'lite'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 60,
    description: 'For professionals requiring advanced automation tools.',
    features: ['GPT-4o & Claude 3.5', 'Full API access', '100 credits per month', 'Priority support'],
    limitations: [],
    ctaText: 'Upgrade Now',
    popular: true,
    tierType: 'standard'
  },
  {
    id: 'business',
    name: 'Business',
    price: 120,
    description: 'Ultimate power for teams and high-volume creators.',
    features: ['Everything in Pro', 'Unlimited API access', '500 credits per month', 'Dedicated manager'],
    limitations: [],
    ctaText: 'Contact Sales',
    tierType: 'pro'
  }
];

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations: string[];
  ctaText: string;
  popular?: boolean;
  tierType: 'lite' | 'standard' | 'pro';
  dbPlanId?: number;
}

const SEOLandingPage_PricingTiers = () => {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PricingTier[]>(DEFAULT_TIERS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // جلب البيانات من قاعدة البيانات
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const dbPlans = await entities.subscription_plan.GetAll({ is_active: true });
        
        if (dbPlans && dbPlans.length > 0) {
          const mapped = DEFAULT_TIERS.map(def => {
            const match = dbPlans.find(p => p.tier === def.tierType);
            return match ? {
              ...def,
              name: match.name,
              price: match.price,
              dbPlanId: match.id,
              features: match.features_list ? match.features_list.split('\n') : def.features
            } : def;
          });
          setPlans(mapped);
        }
      } catch (error) {
        toast.error('Using standard rates (offline mode)');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // أنيميشن الظهور
  const containerRef = React.useRef(null);
  useGSAP(() => {
    if (loading) return;
    gsap.fromTo('.pricing-card', 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }
    );
  }, [loading]);

  const handleChoosePlan = async (plan: PricingTier) => {
    setProcessingId(plan.id);
    const session = getfrontend_user_session();

    // نمط التحقق قبل التوجيه
    const query = new URLSearchParams({
      planId: plan.id,
      billing: isAnnual ? 'annual' : 'monthly',
      price: calculatePrice(plan.price).toString()
    });

    // التوجيه الموحد لصفحة التسجيل/الدفع
    router.push(`/frontendregisterpage?${query.toString()}`);
  };

  const calculatePrice = (price: number) => isAnnual ? Math.floor(price * 0.8 * 12) : price;

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <section ref={containerRef} className="w-full bg-slate-50 py-24 relative overflow-hidden">
      {/* عناصر خلفية جمالية */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">Pricing Plans</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ready to scale your <span className="text-blue-600">AI workflow?</span>
          </h2>
          
          {/* محول الدفع الشهري/السنوي */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <span className={cn("text-sm font-bold transition-colors", !isAnnual ? "text-slate-900" : "text-slate-400")}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} className="data-[state=checked]:bg-blue-600" />
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold transition-colors", isAnnual ? "text-slate-900" : "text-slate-400")}>Yearly</span>
              <Badge className="bg-emerald-500 text-white border-none text-[10px]">Save 20%</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "pricing-card relative border-2 transition-all duration-500 hover:shadow-2xl flex flex-col",
              plan.popular ? "border-blue-600 shadow-xl bg-white scale-105 z-20" : "border-slate-200 bg-white/50 backdrop-blur-sm"
            )}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" /> Recommended
                </div>
              )}

              <CardHeader className="p-8 text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="pt-2">{plan.description}</CardDescription>
                <div className="pt-6">
                  <span className="text-5xl font-black text-slate-900">${calculatePrice(plan.price)}</span>
                  <span className="text-slate-500 text-sm ml-2">/{isAnnual ? 'year' : 'mo'}</span>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 flex-grow">
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-emerald-100 p-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" strokeWidth={4} />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limit, i) => (
                    <div key={i} className="flex items-start gap-3 opacity-40 grayscale">
                      <div className="mt-1 bg-slate-100 p-0.5 rounded-full">
                        <X className="w-3 h-3 text-slate-400" strokeWidth={4} />
                      </div>
                      <span className="text-sm text-slate-500 line-through">{limit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={() => handleChoosePlan(plan)}
                  disabled={!!processingId}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold transition-all active:scale-95",
                    plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 shadow-lg" : "bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {processingId === plan.id ? <Loader2 className="animate-spin" /> : plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* تذييل الأمان */}
        <div className="mt-20 flex flex-col items-center gap-4 opacity-60">
          <div className="flex gap-6 grayscale contrast-125">
             <span className="text-xs font-bold uppercase tracking-widest">Stripe Secure</span>
             <span className="text-xs font-bold uppercase tracking-widest">PayPal Verified</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <AlertCircle className="w-4 h-4" />
            30-day money-back guarantee. No questions asked.
          </div>
        </div>
      </div>
    </section>
  );
};