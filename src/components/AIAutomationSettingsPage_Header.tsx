'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings2, Sparkles, Command, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * Component: AIAutomationSettingsPage_Header
 * Description: Top section of the settings page providing context and navigation back to the dashboard.
 */
export default function AIAutomationSettingsPage_Header() {
  const router = useRouter();

  const handleGoBack = () => {
    // يمكنك استخدام router.back() للعودة لآخر صفحة كان فيها المستخدم
    // أو router.push('/') للعودة للرئيسية كما فعلت
    router.push('/');
  };

  return (
    <section className="w-full bg-white border-b border-gray-200" aria-label="Page Header">
      <div className="container mx-auto px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6">
          
          {/* صف التنقل العلوي - Navigation Row */}
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack} 
              className="group -ml-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Workbench</span>
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-gray-200 px-3 py-1 text-xs font-medium rounded-md select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 inline-block animate-pulse"></span>
                System Operational
              </Badge>
            </div>
          </div>

          {/* صف المحتوى الرئيسي - Main Content Row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-2xl md:text-3xl text-slate-900 font-bold tracking-tight">
                  AI Automation Configuration
                </h1>
              </div>
              <p className="text-base text-slate-500 leading-relaxed md:pl-14">
                Manage your content generation pipelines, model behavior preferences, and integration keys. 
                Configure how the AI interacts with your publishing workflows.
              </p>
            </div>

            {/* الإجراءات السريعة - Quick Actions */}
            <div className="flex items-center gap-4 self-start md:self-center md:pl-0 lg:pl-0">
              <div className="hidden lg:flex items-center gap-4 text-sm text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span className="font-mono">V 2.4.0</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure Mode</span>
                </div>
              </div>
              
              <Button 
                onClick={handleGoBack} 
                variant="outline"
                className="bg-white text-slate-900 border-gray-200 hover:bg-slate-50 shadow-sm hover:shadow transition-all active:scale-95"
              >
                <Command className="w-4 h-4 mr-2 text-slate-400" />
                Close Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}