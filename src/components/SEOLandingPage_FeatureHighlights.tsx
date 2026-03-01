'use client';

import React, { useLayoutEffect, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Globe2, Wallet2, Zap, ShieldCheck, Rocket, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// --- Types ---
interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  colorClass: string;
}

const SEOLandingPage_FeatureHighlights = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const features = useMemo<FeatureItem[]>(() => [
    {
      id: 'ai-routing',
      title: 'Hybrid AI Routing',
      description: 'Smartly orchestrates tasks between GPT-4o, Claude 3.5 Sonnet, and Llama 3 for optimal speed.',
      icon: <BrainCircuit className="h-6 w-6" />,
      badge: 'New Engine',
      colorClass: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'localization',
      title: 'Global Localization',
      description: 'Full Arabic RTL support and 50+ languages ensuring your content resonates worldwide.',
      icon: <Globe2 className="h-6 w-6" />,
      badge: 'RTL Ready',
      colorClass: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'monetization',
      title: 'Monetization Suite',
      description: 'Integrated Stripe, PayPal, and AdMob support with Watch-to-Earn mechanics.',
      icon: <Wallet2 className="h-6 w-6" />,
      colorClass: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'automation',
      title: 'Workflow Automation',
      description: 'Connect global media APIs for automated asset generation and content scheduling.',
      icon: <Zap className="h-6 w-6" />,
      colorClass: 'bg-amber-50 text-amber-600'
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-grade authentication and role-based access control for secure deployment.',
      icon: <ShieldCheck className="h-6 w-6" />,
      colorClass: 'bg-slate-50 text-slate-600'
    },
    {
      id: 'deployment',
      title: 'One-Click Deploy',
      description: 'Ready-to-launch structure for SEO landing pages with optimized indexing.',
      icon: <Rocket className="h-6 w-6" />,
      badge: 'SEO Optimized',
      colorClass: 'bg-purple-50 text-purple-600'
    }
  ], []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 90%',
        }
      });

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          opacity: 0,
          y: 40,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="w-full bg-[#f9fafb] border-y border-slate-200 overflow-hidden"
    >
      <div className="container mx-auto px-6 py-20 lg:py-32">
        
        {/* Header Section */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <Badge variant="outline" className="mb-6 bg-white border-blue-200 text-blue-600 px-4 py-1.5 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            Infrastructure for Tomorrow
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Advanced AI Infrastructure <br />
            <span className="text-blue-600">Built for Infinite Scale</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Experience the next evolution of content creation with our multi-model hybrid engine. 
            Smart routing ensures cost-efficiency without compromising quality.
          </p>
        </div>

        {/* Features Grid - تم إصلاح الإغلاق هنا */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
              <CardHeader className="pb-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110", feature.colorClass)}>
                  {feature.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-slate-500 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full w-0 group-hover:w-full transition-all duration-700 ease-in-out", feature.colorClass.replace('bg-', 'bg-').split(' ')[0])} 
                       style={{backgroundColor: 'currentColor'}} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SEOLandingPage_FeatureHighlights;