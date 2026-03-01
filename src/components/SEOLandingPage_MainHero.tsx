'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Bot, Zap, Globe, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableImg from '@/@base/EditableImg';

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700 w-fit shadow-sm">
    {icon}
    <span>{text}</span>
  </div>
);

// ----------------------------------------------------------------------
// Main Component: SEOLandingPage_MainHero
// ----------------------------------------------------------------------

export default function SEOLandingPage_MainHero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const visualContentRef = useRef<HTMLDivElement>(null);

  // أنيميشن باستخدام الخطاف الرسمي لـ GSAP مع React
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out', duration: 1 }
    });

    // تحريك العناصر النصية بتسلسل (Stagger)
    tl.fromTo(
      ".animate-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, delay: 0.2 }
    );

    // تحريك الصورة والعناصر العائمة
    tl.fromTo(
      visualContentRef.current,
      { scale: 0.9, opacity: 0, x: 50 },
      { scale: 1, opacity: 1, x: 0, duration: 1.2 },
      "-=0.8"
    );

    // إضافة حركة "نبض" خفيفة للعناصر العائمة
    gsap.to(".floating-card", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full overflow-hidden bg-white pt-20 pb-24 lg:pt-32 lg:pb-40"
    >
      {/* الخلفية المزخرفة */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* العمود الأيسر: المحتوى النصي */}
          <div ref={textContentRef} className="lg:col-span-6 flex flex-col gap-8 text-center lg:text-left">
            
            <div className="animate-text flex flex-wrap gap-3 justify-center lg:justify-start">
              <FeatureBadge icon={<Bot className="w-3.5 h-3.5" />} text="Multi-Model AI" />
              <FeatureBadge icon={<Globe className="w-3.5 h-3.5" />} text="Global Localization" />
            </div>

            <h1 className="animate-text text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Automate Content with <br />
              <span className="text-blue-600 bg-clip-text">Hybrid Intelligence</span>
            </h1>

            <p className="animate-text text-xl text-slate-500 max-w-2xl leading-relaxed">
              Experience the future of workflow. Deploy GPT-4o, Claude 3.5, and Llama 3 models 
              in one unified workspace to create, translate, and scale instantly.
            </p>

            <div className="animate-text flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
              <Button 
                onClick={() => router.push('/frontendregisterpage')} 
                className="w-full sm:w-auto h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/25 transition-transform active:scale-95"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">Already using it?</span>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/frontendloginpage')} 
                  className="text-blue-600 hover:bg-blue-50 font-bold text-lg"
                >
                  Login
                </Button>
              </div>
            </div>

            {/* إثبات الثقة (Social Proof) */}
            <div className="animate-text pt-10 border-t border-slate-100 mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-70">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Enterprise Grade</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Instant Setup</span>
              </div>
            </div>
          </div>

          {/* العمود الأيمن: العرض البصري */}
          <div ref={visualContentRef} className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 group">
              
              <EditableImg 
                propKey="hero-main-visual" 
                keywords="futuristic ai interface 3d visualization" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />

              {/* بطاقة عائمة 1: اختيار النموذج */}
              <div className="floating-card absolute top-10 right-10 z-20 bg-white/80 backdrop-blur-xl border border-white/50 p-5 rounded-3xl shadow-2xl w-52 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Model</p>
                    <p className="text-sm font-bold text-slate-800">Claude 3.5</p>
                  </div>
                </div>
              </div>

              {/* بطاقة عائمة 2: حالة المعالجة */}
              <div className="floating-card absolute bottom-10 left-10 z-20 bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl w-64 hidden md:block">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-white">Processing...</span>
                  <span className="text-xs font-black text-blue-400">92%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
              </div>

            </div>
            
            {/* هالة خلفية تحت الصورة */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-600/5 blur-[80px] rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
}