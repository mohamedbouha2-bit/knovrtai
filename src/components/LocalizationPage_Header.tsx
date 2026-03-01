'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Languages, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface LocalizationPageHeaderProps {
  className?: string;
  onSave?: () => void;      // أضفنا هذا لاستدعاء دالة الحفظ من الصفحة الأب
  isSaving?: boolean;       // أضفنا هذا لإظهار حالة التحميل
}

// ----------------------------------------------------------------------
// Component Implementation
// ----------------------------------------------------------------------

const LocalizationPage_Header = ({
  className,
  onSave,
  isSaving = false
}: LocalizationPageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <section className={cn("w-full bg-white border-b border-[#e5e7eb]", className)}>
      <div className="container mx-auto px-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          
          {/* Left Content: Back Button + Titles */}
          <div className="flex flex-col gap-6 max-w-3xl">
            
            {/* Navigation & Breadcrumbs Area */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack} 
                className="group -ml-3 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition-colors duration-200"
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span>العودة</span>
              </Button>
              
              <div className="h-4 w-[1px] bg-[#e5e7eb] mx-1" />
              
              <div className="flex items-center gap-2 text-sm font-medium text-[#64748b]">
                <Globe className="w-3.5 h-3.5" />
                <span>الإعدادات العامة</span>
              </div>
            </div>

            {/* Main Title & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#dbeafe] rounded-lg">
                  <Languages className="w-6 h-6 text-[#2563eb]" />
                </div>
                <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                  التوطين والثقافة
                </h1>
              </div>
              
              <p className="text-base text-[#64748b] leading-relaxed max-w-2xl">
                إدارة تفضيلات اللغة والتكيف الإقليمي لمنصتك. قم بتكوين نماذج الترجمة المدعومة بالذكاء الاصطناعي لضمان صدى المحتوى ثقافياً مع جمهورك العالمي.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#64748b]">
                <Sparkles className="w-3 h-3 mr-1.5 text-[#8b5cf6]" />
                ذكاء اصطناعي سياقي
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#64748b]">
                <Globe className="w-3 h-3 mr-1.5 text-[#2563eb]" />
                أكثر من 50 لغة
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#64748b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5" />
                التعرف التلقائي نشط
              </div>
            </div>
          </div>

          {/* Right Content: Primary Actions */}
          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={isSaving}
              className="bg-white text-[#0f172a] border-[#e5e7eb] hover:bg-[#f3f4f6]"
            >
              إلغاء
            </Button>
            <Button 
              onClick={onSave} // ربط زر الحفظ بالدالة الممرة
              disabled={isSaving}
              className="bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalizationPage_Header;