'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Cpu, Globe, Zap, BarChart3, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { CardWithNoPadding } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditableImg from "@/@base/EditableImg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SEOLandingPage_SEOContentBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // استخدام gsap.context يضمن تنظيف الذاكرة تلقائياً
    const ctx = gsap.context(() => {
      
      // تحريك مقالات الـ SEO عند التمرير
      const articles = gsap.utils.toArray<HTMLElement>('.seo-article-block');
      articles.forEach((article) => {
        gsap.fromTo(article, {
          opacity: 0,
          y: 50,
        }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: article,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        });
      });

      // تحريك الـ Sidebar عند الظهور الأول
      gsap.fromTo(sidebarRef.current, {
        opacity: 0,
        x: -30
      }, {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: "power3.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const localizationFeatures = [
    "Full UI mirroring for Arabic and Hebrew languages.",
    "Context-aware translation for AI tool names and descriptions.",
    "Localized currency formatting and symbol placement.",
    "Cultural intelligence toggle in user AI preferences."
  ];

  const pricingSummary = [
    { title: "Standard", price: "$25", features: "Essential AI Tools", color: "blue" },
    { title: "Pro", price: "$60", features: "Advanced Models", color: "purple" },
    { title: "Business", price: "$120", features: "API & Priority", color: "orange" }
  ];

  return (
    <section ref={containerRef} className="w-full bg-white text-slate-900 relative overflow-hidden">
      {/* شبكة خلفية زخرفية ناعمة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        
        {/* رأس القسم */}
        <div className="max-w-4xl mx-auto text-center mb-20 lg:mb-32">
          <Badge className="mb-6 bg-blue-50 text-blue-600 border-blue-100 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            Architecture & Tech Stack
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Scaling AI Excellence with <br />
            <span className="text-blue-600">Enterprise Infrastructure</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
            Discover how our hybrid neural routing and global localization engines power the next generation of automated content workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* الجانب الأيسر - القائمة الثابتة */}
          <aside ref={sidebarRef} className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
            <CardWithNoPadding className="bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" /> Core Modules
                </h3>
                <nav className="space-y-2">
                  {[
                    { icon: Cpu, label: "Hybrid Routing" },
                    { icon: Globe, label: "RTL Engine" },
                    { icon: Zap, label: "Fast Automation" },
                    { icon: ShieldCheck, label: "Secure Monetization" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </nav>
              </div>
              
              <div className="bg-blue-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md font-bold text-sm">
                    100%
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">API Performance</p>
                    <p className="text-lg font-black italic tracking-tight uppercase">Operational</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-slate-100 font-bold rounded-xl h-12">
                  Live System Health
                </Button>
              </div>
            </CardWithNoPadding>

            <div className="relative group overflow-hidden rounded-3xl shadow-lg">
               <EditableImg 
                 propKey="seo-sidebar-feature" 
                 keywords="server infrastructure data technology" 
                 className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
               <p className="absolute bottom-6 left-6 text-white font-bold text-sm">Edge Computing Nodes</p>
            </div>
          </aside>

          {/* الجانب الأيمن - المحتوى التقني */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* المقال 1: Hybrid AI */}
            <article className="seo-article-block">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                   Multi-Model Hybrid <br /> AI Routing Architecture
                 </h2>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                <p>
                  Our proprietary <strong>hybrid routing system</strong> dynamically orchestrates requests across a cluster of LLMs including <strong>GPT-4o</strong>, <strong>Claude 3.5</strong>, and <strong>Llama 3</strong>. This ensuring that every prompt is handled by the model best suited for its specific complexity and token constraints.
                </p>

                

                <div className="grid md:grid-cols-2 gap-6 my-10">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                     <Zap className="w-8 h-8 text-amber-500 mb-4" />
                     <h4 className="text-xl font-bold text-slate-900 mb-2">Turbo Latency</h4>
                     <p className="text-sm leading-relaxed">Sub-100ms response times for conversational UI via Groq hardware acceleration.</p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                     <BarChart3 className="w-8 h-8 text-purple-600 mb-4" />
                     <h4 className="text-xl font-bold text-slate-900 mb-2">Deep Reasoning</h4>
                     <p className="text-sm leading-relaxed">Complex logical deductions and long-form creative writing delegated to Claude 3.5 Sonnet.</p>
                  </div>
                </div>

                <CardWithNoPadding className="rounded-3xl overflow-hidden mb-10 shadow-2xl border-none ring-1 ring-slate-200">
                  <EditableImg propKey="hybrid-ai-diagram" keywords="neural network abstract" className="w-full h-[400px] object-cover" />
                  <div className="bg-slate-900 px-8 py-4 text-xs text-slate-400 flex justify-between items-center">
                    <span>Fig 1.1: Request Lifecycle Orchestration</span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 font-mono">v4.2.0-stable</Badge>
                  </div>
                </CardWithNoPadding>
              </div>
            </article>

            {/* المقال 2: Localization */}
            <article className="seo-article-block">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                   Global RTL Localization & <br /> Cultural Adaptation
                 </h2>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
                <p>
                  Built with a "Local-First" philosophy, our engine provides native support for <strong>Arabic (AR)</strong> and other RTL languages. We don't just translate text; we mirror the entire user experience.
                </p>

                

                <ul className="grid gap-4 mt-8 list-none p-0">
                  {localizationFeatures.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                      <div className="bg-emerald-500 rounded-full p-1 shadow-md">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                      <span className="text-slate-700 font-bold text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* المقال 3: Monetization */}
            <article className="seo-article-block">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                   Advanced Monetization & <br /> Reward Ecosystem
                 </h2>
              </div>
              <div className="space-y-8">
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                   A comprehensive billing engine designed for high-volume transactions, supporting credit-based and subscription-based revenue models.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingSummary.map((plan, index) => (
                    <div key={index} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:translate-y-[-5px] transition-transform">
                      <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{plan.title}</h5>
                      <div className="text-3xl font-black text-slate-900 mb-4">{plan.price}</div>
                      <p className="text-xs font-bold text-blue-600 bg-blue-50 py-1 px-3 rounded-full w-fit">{plan.features}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-colors" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-xl">
                      <ShieldCheck className="w-12 h-12 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="text-xl font-bold mb-2 tracking-tight">SHA-256 Encryption Standards</h5>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        All financial transactions and API keys are protected using military-grade encryption, ensuring total compliance with global data protection regulations (GDPR).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
}