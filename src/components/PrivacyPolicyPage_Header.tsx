'use client';

import React, { useEffect, useState } from 'react';
import { entities } from '@/tools/entities-proxy';
import type { legal_document } from '@/server/entities.type';
import { Calendar, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface PrivacyHeaderData {
  title: string;
  lastUpdated: Date;
  effectiveDate?: Date;
  version?: string;
}

export default function PrivacyPolicyPage_Header() {
  const [data, setData] = useState<PrivacyHeaderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        // البحث عن الوثيقة الأكثر حداثة
        const documents = await entities.legal_document.GetAll({
          title: { contains: 'Privacy' }
        });

        if (documents && documents.length > 0) {
          // ترتيب الوثائق حسب تاريخ التحديث الأحدث لضمان دقة العرض
          const latestDoc = documents.sort((a, b) => 
            new Date(b.last_updated_at).getTime() - new Date(a.last_updated_at).getTime()
          )[0];

          setData({
            title: latestDoc.title,
            lastUpdated: new Date(latestDoc.last_updated_at),
            version: latestDoc.version_identifier || '1.0.0',
            effectiveDate: new Date(latestDoc.created_at)
          });
        } else {
          throw new Error('No policy found');
        }
      } catch (error) {
        setData({
          title: 'Privacy Policy',
          lastUpdated: new Date(),
          version: '1.0.0',
          effectiveDate: new Date()
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  };

  if (loading) return <HeaderSkeleton />;

  return (
    <section className="w-full bg-slate-50/50 border-b border-slate-200 relative overflow-hidden transition-all duration-500">
      {/* Background Decorative Shield */}
      <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
        <ShieldCheck className="w-80 h-80 text-blue-600" />
      </div>
      
      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm group hover:border-emerald-200 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Version {data?.version} • Active
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {data?.title}
          </h1>

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Last Revision</span>
                <span className="text-sm font-semibold text-slate-900">{formatDate(data!.lastUpdated)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Effective From</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatDate(data?.effectiveDate || data!.lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-light">
            Your trust is our most important asset. We believe in being transparent about how we handle your data to empower you with control over your digital footprint.
          </p>
        </div>
      </div>
    </section>
  );
}

// Separate Skeleton for Cleaner Logic
function HeaderSkeleton() {
  return (
    <section className="w-full bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-8 max-w-4xl space-y-8">
        <div className="h-6 w-40 bg-slate-200 rounded-full animate-pulse" />
        <div className="h-16 w-3/4 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}