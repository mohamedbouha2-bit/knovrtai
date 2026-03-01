'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Calendar, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Download, 
  ExternalLink,
  Loader2
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Animation & Tools
import { gsap } from 'gsap';
import { entities } from '@/tools/entities-proxy';
import type { legal_document } from '@/server/entities.type';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function TermsOfServicePage_Header() {
  const router = useRouter();
  const [documentMeta, setDocumentMeta] = useState<legal_document | null>(null);
  const [loading, setLoading] = useState(true);

  // Refs for precise GSAP control
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // 1. Fetching Metadata with Optimized Sorting
  useEffect(() => {
    let isMounted = true;
    const fetchDocMetadata = async () => {
      try {
        setLoading(true);
        // نستخدم فلتر أكثر دقة لجلب وثيقة شروط الخدمة
        const docs = await entities.legal_document.GetAll({
          title: { contains: 'Terms' }
        });

        if (docs && docs.length > 0 && isMounted) {
          // جلب أحدث نسخة بناءً على تاريخ التحديث
          const latestDoc = [...docs].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
          setDocumentMeta(latestDoc);
        }
      } catch (error) {
        console.error('Legal Header Fetch Error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDocMetadata();
    return () => { isMounted = false; };
  }, []);

  // 2. Advanced GSAP Animation Sequence
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out', duration: 1.2 }
      });

      tl.fromTo(".animate-item", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, stagger: 0.1, clearProps: "all" }
      )
      .fromTo(actionsRef.current, 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.8 }, 
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  // 3. Optimized Utilities
  const effectiveDate = useMemo(() => {
    const date = documentMeta?.last_updated_at ? new Date(documentMeta.last_updated_at) : new Date();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }, [documentMeta]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  // 4. Render Loading State (Skeleton)
  if (loading) {
    return (
      <header className="w-full bg-[#f9fafb] border-b border-[#e5e7eb] py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-16 w-full max-w-xl rounded-xl" />
            <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <section 
      className="relative w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden" 
      ref={containerRef}
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          
          {/* Content Block */}
          <div className="flex flex-col gap-8 max-w-4xl" ref={contentRef}>
            
            {/* Breadcrumbs & Version Badge */}
            <div className="animate-item flex items-center gap-3 text-sm font-medium">
              <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-900 dark:text-white font-bold">Legal Documents</span>
              </nav>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-3 py-1">
                Version {documentMeta?.version_identifier || '1.0.1'}
              </Badge>
            </div>

            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="animate-item text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                Terms of <span className="text-blue-600">Service</span>
              </h1>
              
              <p className="animate-item text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                By using our AI platform, you agree to the following guidelines. We've designed our terms to be 
                <span className="text-slate-900 dark:text-white font-semibold"> transparent, fair, and legally robust </span> 
                to protect both you and our community.
              </p>
            </div>

            {/* Quick Meta Stats */}
            <div className="animate-item flex flex-wrap items-center gap-5 pt-4">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Last Updated</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{effectiveDate}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">GDPR & Compliance Verified</span>
              </div>
            </div>
          </div>

          {/* Actions Block */}
          <div className="flex flex-row lg:flex-col gap-4 shrink-0" ref={actionsRef}>
             <Button 
                variant="outline" 
                onClick={handlePrint} 
                className="flex-1 lg:w-48 h-14 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-3 font-bold transition-all hover:scale-[1.02]"
              >
                <Printer className="w-5 h-5 text-slate-500" />
                Print Terms
              </Button>

              <Button 
                className="flex-1 lg:w-48 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 gap-3 font-bold transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-5 h-5" />
                Save as PDF
              </Button>

              <Link href="/contact" className="hidden lg:flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium">
                <ExternalLink size={14} />
                Need legal clarification?
              </Link>
          </div>
        </div>
      </div>

      {/* Subtle Progress Bar (Optional but cool) */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-blue-600 w-full origin-left transform transition-transform duration-500" style={{ transform: 'scaleX(1)' }} />
    </section>
  );
}