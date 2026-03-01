'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Globe2, Loader2 } from 'lucide-react';
import { entities } from '@/tools/entities-proxy';
import type { subscription_plan } from '@/server/entities.type';
import { toast } from 'sonner';

// ----------------------------------------------------------------------
// Types & Static Data
// ----------------------------------------------------------------------

interface FeatureItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

const FEATURES: FeatureItem[] = [
  { id: 'f1', text: 'AI-Powered Automation', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
  { id: 'f2', text: 'Global Language Support', icon: <Globe2 className="w-5 h-5 text-blue-500" /> },
  { id: 'f3', text: 'Enterprise Security', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> }
];

const PLAN_FEATURES = [
  "Everything in Lite",
  "Advanced AI Models (GPT-4o)",
  "Unlimited Translations",
  "Priority Support",
  "Full API Access"
];

// ----------------------------------------------------------------------
// Component: SEOLandingPage_FinalCTA
// ----------------------------------------------------------------------

export default function SEOLandingPage_FinalCTA({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<subscription_plan | null>(null);

  // جلب بيانات الخطة المميزة
  useEffect(() => {
    let isMounted = true;
    const fetchPlan = async () => {
      try {
        const plans = await entities.subscription_plan.GetAll({
          tier: { equals: 'pro' },
          is_active: true
        });
        if (isMounted && plans?.length) {
          setActivePlan(plans[0]);
        }
      } catch (error) {
        console.error('Plan fetch error:', error);
      }
    };
    fetchPlan();
    return () => { isMounted = false; };
  }, []);

  const handleJoinNow = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة معالجة بسيطة قبل التوجيه
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // التوجيه لصفحة التسجيل مع تمرير البريد الإلكتروني كـ Query Param
      const searchParams = new URLSearchParams({ email });
      router.push(`/frontendregisterpage?${searchParams.toString()}`);
      
      toast.success('Ready to set up your account!');
    } catch (error) {
      toast.error('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={cn("w-full bg-slate-50 border-t border-slate-200 overflow-hidden", className)}>
      <div className="container mx-auto px-6 py-20 lg:py-32">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Limited Time Opportunity
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Start Monetizing Your <br />
                <span className="text-blue-600">Global Audience</span> Today
              </h2>
              
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Unlock AI-driven content creation at scale. Multilingual automation, 
                hybrid AI models, and instant monetization tools for modern creators.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="p-2 bg-slate-50 rounded-xl">{feature.icon}</div>
                  <span className="font-semibold text-slate-800 text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleJoinNow} className="flex flex-col sm:flex-row items-stretch gap-4 pt-6">
              <div className="relative flex-grow max-w-md">
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="h-14 pl-6 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500/20 rounded-2xl shadow-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit"
                disabled={isLoading} 
                className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Get Started Free'}
                {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
            
            <p className="text-xs text-slate-400 italic">
              * No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Right Column: Pricing Preview */}
          <div className="lg:col-span-5 relative">
            {/* Decorative element */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 blur-3xl rounded-[3rem] -z-10" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative"
            >
              <div className="bg-slate-900 text-white px-8 py-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-xl">Pro Tier</h3>
                    <p className="text-slate-400 text-sm">Scale your influence</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-blue-400">
                      {activePlan ? `$${activePlan.price}` : '$59'}
                    </span>
                    <span className="text-slate-400 text-sm block">/month</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  {PLAN_FEATURES.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-slate-500 text-sm font-medium italic">Availability</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 py-1 font-bold">
                    <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open for Registration
                  </Badge>
                </div>

                <Button onClick={() => handleJoinNow()} className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg">
                  Start My Free Trial
                </Button>
              </div>
            </motion.div>

            {/* Stats Floating Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4"
            >
              <div className="bg-blue-50 p-3 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">System Reliability</p>
                <p className="text-sm font-black text-slate-900">99.99% Uptime SLA</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}