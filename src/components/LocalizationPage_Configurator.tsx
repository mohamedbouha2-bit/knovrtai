'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Search, Globe, Sparkles, ArrowRight, Loader2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import EditableImg from '@/@base/EditableImg';
import type { language, user_settings } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession } from '@/tools/SessionContext';

// --- Typography Styles ---
const TYPOGRAPHY_STYLES = `
  .text-h1 { font-size: 2.25rem; font-weight: 600; color: #0f172a; }
  .text-h3 { font-size: 1.25rem; font-weight: 600; }
  .text-caption { font-size: 0.875rem; color: #64748b; }
`;

// بيانات المعاينة (Preview Data)
const PREVIEW_DATA: Record<string, { basic: string; adapted: string; adaptedNote: string; }> = {
  'es-ES': {
    basic: "Hola, bienvenido a nuestra plataforma. Aquí puedes crear contenido.",
    adapted: "¡Hola! Te damos la bienvenida a nuestra plataforma. Aquí podrás crear contenido increíble.",
    adaptedNote: "تمت إضافة لمسة ترحيبية وعلامات تعجب تتناسب مع أسلوب التسويق الإسباني."
  },
  'fr-FR': {
    basic: "Bonjour, bienvenue sur notre plateforme. Vous pouvez créer du contenu ici.",
    adapted: "Bonjour et bienvenue sur votre espace de création. Laissez libre cours à votre imagination.",
    adaptedNote: "تم التحول إلى أسلوب أكثر رسمية وإلهاماً باستخدام مصطلح 'مساحتك الخاصة'."
  }
};

const DEFAULT_PREVIEW = {
  basic: "Hello, welcome to our platform. You can create content here.",
  adapted: "Hello! Welcome to our AI-powered platform. You're all set to create amazing content.",
  adaptedNote: "تعديل إنجليزي قياسي لزيادة التفاعل والوضوح."
};

export default function LocalizationPageConfigurator() {
  const router = useRouter();

  // --- State ---
  const [languages, setLanguages] = useState<language[]>([]);
  const [currentSettings, setCurrentSettings] = useState<user_settings | null>(null);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('en-US');
  const [culturalEnabled, setCulturalEnabled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch Data ---
  const initData = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = getFrontendUserSession();
      if (!session?.userId) {
        setIsLoading(false);
        return;
      }

      const userIdInt = parseInt(session.userId);
      if (isNaN(userIdInt)) return;

      // 1. Fetch User Settings
      const settingsRes = await entities.user_settings.GetAll({
        user_id: { equals: userIdInt }
      });
      
      if (settingsRes && settingsRes.length > 0) {
        const userSet = settingsRes[0];
        setCurrentSettings(userSet);
        setSelectedLangCode(userSet.preferred_language_code);
        setCulturalEnabled(userSet.cultural_intelligence_enabled);
      }

      // 2. Fetch Active Languages
      const langsRes = await entities.language.GetAll({ is_active: true });
      setLanguages(langsRes || []);
    } catch (error) {
      console.error("Failed to load settings", error);
      toast.error("فشل في تحميل الإعدادات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  // --- Memoized Values ---
  const filteredLanguages = useMemo(() => {
    return languages.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.iso_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [languages, searchQuery]);

  const selectedLanguage = useMemo(() => 
    languages.find(l => l.iso_code === selectedLangCode), 
  [languages, selectedLangCode]);

  const previewContent = useMemo(() => {
    return PREVIEW_DATA[selectedLangCode] || {
      basic: `[${selectedLangCode}] Hello, welcome...`,
      adapted: `[${selectedLangCode}] (Culturally Adapted) Greetings!`,
      adaptedNote: `Applied cultural optimization for ${selectedLangCode}.`
    };
  }, [selectedLangCode]);

  // --- Save Handler ---
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const session = getFrontendUserSession();
      const userIdInt = parseInt(session?.userId || "");

      if (isNaN(userIdInt)) {
        toast.error("جلسة العمل منتهية");
        return;
      }

      const payload = {
        user_id: userIdInt,
        preferred_language_code: selectedLangCode,
        cultural_intelligence_enabled: culturalEnabled,
        updated_at: new Date(),
      };

      if (currentSettings) {
        await entities.user_settings.Update({
          where: { id: currentSettings.id },
          data: { ...payload, created_at: currentSettings.created_at }
        });
      } else {
        await entities.user_settings.Create({
          ...payload,
          created_at: new Date()
        });
      }

      toast.success("تم حفظ إعدادات التوطين بنجاح");
      router.refresh(); // لتحديث البيانات في كامل الموقع
      setTimeout(() => router.push('/'), 1000);
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f9fafb] min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: TYPOGRAPHY_STYLES }} />
      
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* العمود الأيسر: الإعدادات */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="text-h1">إعدادات التوطين</h1>
              <p className="text-caption text-lg">خصص تجربة توليد المحتوى لغتلك المفضلة.</p>
            </div>

            <Card className="shadow-sm border-slate-200">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h3 className="text-h3">التكيف الثقافي الذكي</h3>
                    </div>
                    <p className="text-caption">ضبط النبرة والمصطلحات آلياً حسب المنطقة.</p>
                  </div>
                  <Switch 
                    checked={culturalEnabled} 
                    onCheckedChange={setCulturalEnabled} 
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="ابحث عن لغة..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Card className="h-[400px] flex flex-col shadow-sm">
                <CardHeader className="py-4 border-b">
                  <CardTitle className="text-h3">اللغة المستهدفة</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLangCode(lang.iso_code)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedLangCode === lang.iso_code ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-4 bg-slate-200 rounded-sm overflow-hidden">
                            <EditableImg 
                                propKey={`flag_${lang.iso_code}`} 
                                keywords={lang.name} 
                                className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{lang.name}</p>
                            <p className="text-xs text-slate-500">{lang.iso_code}</p>
                          </div>
                        </div>
                        {selectedLangCode === lang.iso_code && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>

          {/* العمود الأيمن: المعاينة المباشرة */}
          <div className="lg:col-span-7">
            <div className="sticky top-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3">معاينة مباشرة</h3>
                <Badge variant="secondary" className="gap-1">
                  <RefreshCw className="w-3 h-3" /> تحديث فوري
                </Badge>
              </div>

              <Card className="border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-50 p-3 border-b flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <div className="w-3 h-3 rounded-full bg-yellow-300" />
                  <div className="w-3 h-3 rounded-full bg-green-300" />
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2 opacity-50">
                    <p className="text-xs font-bold text-slate-500 uppercase">المصدر (English)</p>
                    <div className="p-4 bg-slate-100 rounded-lg italic text-slate-600">
                      "{DEFAULT_PREVIEW.basic}"
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="text-slate-300" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-blue-600 uppercase">
                        الناتج لغة: {selectedLanguage?.name || 'Target'}
                      </p>
                    </div>
                    <div className={`p-6 rounded-xl border-2 transition-all ${
                      culturalEnabled ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-inner' : 'bg-white border-slate-100'
                    }`}>
                      <p className="text-lg">
                        "{culturalEnabled ? previewContent.adapted : previewContent.basic}"
                      </p>
                    </div>

                    {culturalEnabled && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
                        <p className="text-sm text-purple-800">
                          <span className="font-bold">رؤية الذكاء الاصطناعي:</span> {previewContent.adaptedNote}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 p-4 border-t justify-end gap-3">
                  <Button variant="ghost" onClick={() => { setSelectedLangCode('en-US'); setCulturalEnabled(false); }}>
                    إعادة تعيين
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    حفظ الإعدادات
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}