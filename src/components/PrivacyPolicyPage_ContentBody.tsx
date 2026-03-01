'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { entities } from '@/tools/entities-proxy';
import type { legal_document } from '@/server/entities.type';
import gsap from 'gsap';
import { cn } from "@/lib/utils";
import { FileText, Printer, Download, Mail } from 'lucide-react'; // إضافة أيقونات لتحسين الواجهة

// ... (DEFAULT_POLICY_CONTENT يبقى كما هو)

export default function PrivacyPolicyPage_ContentBody() {
  const [document, setDocument] = useState<legal_document | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const docs = await entities.legal_document.GetAll({
          title: { contains: 'Privacy' }
        });
        
        if (docs?.length > 0) {
          const sortedDocs = docs.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          setDocument(sortedDocs[0]);
        }
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }
      );
    }
  }, [loading]);

  const displayTitle = document?.title || "Privacy Policy";
  const displayDate = document?.updated_at ? new Date(document.updated_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : "Recent Update";
  const displayHtml = document?.content_body_html || document?.content_html || DEFAULT_POLICY_CONTENT;

  return (
    <section className="w-full bg-slate-50/30 relative py-12 md:py-24 border-b border-slate-200">
      <div className="container mx-auto px-6 lg:px-8">
        
        {loading ? (
          <PrivacySkeleton />
        ) : (
          <div ref={contentRef} className="max-w-4xl mx-auto space-y-10">
            
            {/* Header Section */}
            <header className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium mb-2">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active Version {document?.version_number || '1.0.0'}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                {displayTitle}
              </h1>
              <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2">
                <FileText size={16} />
                Effective Date: <span className="font-medium">{displayDate}</span>
              </p>
            </header>

            {/* Document Card */}
            <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
              <div className="p-8 md:p-16">
                <article 
                  className={cn(
                    "prose prose-slate max-w-none",
                    "prose-headings:text-slate-900 prose-headings:font-bold",
                    "prose-h2:text-2xl prose-h2:border-b prose-h2:pb-4 prose-h2:mt-12",
                    "prose-p:text-slate-600 prose-p:leading-relaxed",
                    "prose-strong:text-slate-900 prose-strong:font-semibold",
                    "prose-li:text-slate-600",
                    "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                  )} 
                  dangerouslySetInnerHTML={{ __html: displayHtml }} 
                />
              </div>

              {/* Enhanced Footer Actions */}
              <footer className="bg-slate-50/80 px-8 py-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span>Questions? <a href="mailto:legal@konvrt.ai" className="text-blue-600 font-medium hover:underline">legal@konvrt.ai</a></span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                    <Printer size={16} /> Print
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm transition-all">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </footer>
            </Card>

            <p className="text-center text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Konvrt.ai values transparency. This policy is reviewed annually to ensure compliance with global data protection standards (GDPR, CCPA).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// مكون الهيكل العظمي منفصل لترتيب الكود
function PrivacySkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-12 w-3/4 max-w-lg" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Card className="p-12 space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </Card>
    </div>
  );
}