'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { 
  FileText, ShieldCheck, CreditCard, Scale, 
  AlertCircle, HelpCircle, ChevronRight, Info 
} from 'lucide-react';

// UI Components
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Types & Tools
import type { legal_document } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------------------------
// Constants & Fallbacks
// ----------------------------------------------------------------------

const SECTIONS = [
  { id: 'intro', label: 'Introduction', icon: <FileText size={18} /> },
  { id: 'account', label: 'Account & Security', icon: <ShieldCheck size={18} /> },
  { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
  { id: 'usage', label: 'Acceptable Use', icon: <Scale size={18} /> },
  { id: 'liability', label: 'Liability', icon: <AlertCircle size={18} /> },
  { id: 'privacy', label: 'Privacy', icon: <Info size={18} /> },
];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const TableOfContents = ({ activeId, scrollToId }: { activeId: string; scrollToId: (id: string) => void }) => (
  <nav className="hidden lg:block sticky top-24 w-72 shrink-0 self-start">
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="pb-4 mb-4 border-b border-slate-100">
        <h4 className="text-lg font-bold text-slate-900 mb-1">Navigation</h4>
        <p className="text-sm text-slate-500">Quickly jump to sections</p>
      </div>
      <ul className="space-y-1.5">
        {SECTIONS.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => scrollToId(link.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group",
                activeId === link.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className={cn(activeId === link.id ? "text-white" : "text-slate-400 group-hover:text-blue-600")}>
                {link.icon}
              </span>
              <span className="font-medium">{link.label}</span>
              {activeId === link.id && <ChevronRight size={14} className="ml-auto animate-pulse" />}
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-900 font-bold mb-2">
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm">Legal Queries?</span>
        </div>
        <p className="text-xs text-blue-700/70 leading-relaxed mb-4">
          Got questions about our terms? Our legal team is here to help.
        </p>
        <button className="w-full py-2 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
          Contact Legal Team
        </button>
      </div>
    </div>
  </nav>
);

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------

export default function TermsOfServicePage_DocumentBody() {
  const router = useRouter();
  const [termsDoc, setTermsDoc] = useState<legal_document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('intro');
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data with dynamic filtering
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const docs = await entities.legal_document.GetAll({
          where: { is_active: true } // Assuming your entity has this flag
        });
        
        // Find the "Terms of Service" document or take the latest
        const terms = docs.find(d => d.title?.toLowerCase().includes('terms')) || docs[0];
        setTermsDoc(terms);
      } catch (error) {
        console.error("Legal document fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // 2. Optimized GSAP Animations & ScrollSpy
  useEffect(() => {
    if (loading || !termsDoc) return;

    const ctx = gsap.context(() => {
      // Entry Animation
      gsap.from(".animate-up", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });

      // ScrollSpy Logic
      SECTIONS.forEach(({ id }) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 120px",
          end: "bottom 120px",
          onToggle: (self) => self.isActive && setActiveSection(id)
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading, termsDoc]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-20 max-w-7xl">
        <div className="space-y-4 mb-20 text-center">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-12 w-64 mx-auto rounded-xl" />
          <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
        </div>
        <div className="flex gap-12">
          <Skeleton className="hidden lg:block w-72 h-[500px] rounded-2xl" />
          <div className="flex-1 space-y-6">
            <Skeleton className="h-[800px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const lastUpdated = termsDoc?.last_updated_at 
    ? format(new Date(termsDoc.last_updated_at), 'MMMM dd, yyyy') 
    : 'Recently';

  return (
    <section className="w-full bg-[#FAFBFC] min-h-screen pb-24" ref={containerRef}>
      {/* Decorative Gradient Header */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 pt-16 relative z-10 max-w-7xl">
        
        {/* Hero Header */}
        <header className="max-w-3xl mx-auto mb-20 text-center animate-up">
          <Badge className="mb-6 bg-blue-100 hover:bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full font-bold">
            LEGAL HUB
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Everything you need to know about your rights and responsibilities when using Konvrt.ai.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Effective Date: <strong>{lastUpdated}</strong>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Version: <strong>{termsDoc?.version_identifier || '1.0.0'}</strong>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          <TableOfContents activeId={activeSection} scrollToId={scrollToId} />

          <main className="flex-1 w-full animate-up">
            <Card className="border-slate-200 shadow-2xl shadow-slate-200/40 bg-white rounded-[2.5rem] overflow-hidden p-8 md:p-14">
              
              {/* Introduction Section */}
              <article id="intro" className="scroll-mt-24 mb-16">
                <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-blue-600">
                  <div 
                    dangerouslySetInnerHTML={{ __html: termsDoc?.content_html || '' }} 
                    className="document-body"
                  />
                </div>
              </article>

              <Separator className="mb-16 opacity-50" />

              {/* Dynamic Sections (Interpreted from standard SaaS needs) */}
              <div id="account" className="scroll-mt-24 mb-16 space-y-6">
                <h2 className="text-3xl font-black text-slate-900">2. Account & Security</h2>
                <div className="text-lg text-slate-600 leading-relaxed space-y-4">
                  <p>Access to our platform requires a valid account. You are solely responsible for:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {['Password security', 'Unauthorized access', 'Profile accuracy', 'Contact updates'].map((item) => (
                      <li key={item} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div id="subscription" className="scroll-mt-24 mb-16 bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50">
                <h2 className="text-3xl font-black text-slate-900 mb-6">3. Subscription & Payments</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Konvrt.ai offers tiered subscription plans. By subscribing, you agree to our automated billing cycle and pricing structure.
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                    <Info size={18} /> Refund Policy Note
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Refunds are processed according to our internal policy and local consumer laws. Generally, digital subscriptions are non-refundable after credits are used.
                  </p>
                </div>
              </div>

              {/* Acceptable Use */}
              <div id="usage" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-6">4. Acceptable Use Policy</h2>
                <div className="space-y-4 p-8 bg-amber-50/50 border border-amber-100 rounded-3xl">
                  <p className="text-amber-900 font-medium">Prohibited Activities Include:</p>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex gap-2">❌ Generating deepfake content without consent.</li>
                    <li className="flex gap-2">❌ Automated scraping of our proprietary AI models.</li>
                    <li className="flex gap-2">❌ Using the platform for deceptive marketing practices.</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Footer */}
              <div id="privacy" className="scroll-mt-24 p-10 bg-slate-900 rounded-[2rem] text-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="max-w-md">
                    <h3 className="text-2xl font-bold mb-3">Your Privacy Matters</h3>
                    <p className="text-slate-400">
                      Our Terms of Service work hand-in-hand with our Privacy Policy to ensure your data stays protected.
                    </p>
                  </div>
                  <Link 
                    href="/privacypolicypage"
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 whitespace-nowrap shadow-xl shadow-blue-500/20"
                  >
                    Read Privacy Policy
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </Card>

            {/* Bottom Support Callout */}
            <div className="mt-12 text-center text-slate-500 animate-up">
              <p className="text-sm">
                Need a PDF version? <button className="text-blue-600 font-bold hover:underline">Download Terms (PDF)</button>
              </p>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}