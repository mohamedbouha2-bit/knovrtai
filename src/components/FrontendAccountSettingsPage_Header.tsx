'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCog, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FrontendAccountSettingsPage_Header = () => {
  const router = useRouter();
  const scope = useRef<HTMLDivElement>(null); // استخدام scope واحد للتحكم بكل العناصر بالداخل

  useEffect(() => {
    // استخدام gsap.context لضمان تنظيف مثالي للأنيميشن
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.6 }
      });

      tl.from(".animate-header", { opacity: 0, y: -20 })
        .from(".animate-back", { opacity: 0, scale: 0.8 }, "-=0.4")
        .from(".animate-text", { opacity: 0, x: -20, stagger: 0.1 }, "-=0.4")
        .from(".animate-right", { opacity: 0, x: 20 }, "-=0.5");
    }, scope);

    return () => ctx.revert(); // تنظيف تلقائي
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <section 
      ref={scope} 
      className="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="container mx-auto px-6 py-10 lg:px-8">
        <div className="animate-header flex flex-col md:flex-row md:items-start justify-between gap-8">
          
          {/* الجانب الأيسر: العنوان والوصف */}
          <div className="flex items-start gap-5">
            <Button 
              onClick={handleBack}
              variant="outline" 
              size="icon" 
              className="animate-back mt-1 h-11 w-11 shrink-0 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95" 
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="space-y-3">
              <div className="flex items-center gap-3 animate-text">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                   <UserCog className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Account Settings
                </h1>
              </div>
              <p className="animate-text text-slate-500 dark:text-slate-400 text-base max-w-2xl leading-relaxed md:pl-1">
                Manage your profile, security preferences, and subscription plan. Keep your personal information up to date for a seamless content creation experience.
              </p>
            </div>
          </div>

          {/* الجانب الأيمن: معلومات الحالة/الإجراءات */}
          <div className="animate-right flex items-center gap-4 self-start md:pt-2">
             <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-xl border-none font-medium">
                Personal Workspace
             </Badge>
             <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Account</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FrontendAccountSettingsPage_Header;