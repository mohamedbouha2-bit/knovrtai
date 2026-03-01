'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun, Monitor, Globe, Check, Loader2, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

// مكونات UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// أدوات النظام
import { getFrontendUserSession } from '@/tools/SessionContext';
import { entities } from '@/tools/entities-proxy';
import type { user } from '@/server/entities.type';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Types & Constants
// ----------------------------------------------------------------------

type ThemeOption = 'light' | 'dark' | 'system';
type LanguageOption = 'en-US' | 'ar-AR' | 'fr-FR';

interface I18nResource {
  title: string;
  description: string;
  theme_title: string;
  theme_desc: string;
  theme_light: string;
  theme_dark: string;
  theme_system: string;
  lang_title: string;
  lang_desc: string;
  save_success: string;
  save_error: string;
  loading: string;
}

const THEME_OPTIONS: { value: ThemeOption; icon: React.ElementType; color: string }[] = [
  { value: 'light', icon: Sun, color: 'text-orange-500' },
  { value: 'dark', icon: Moon, color: 'text-indigo-400' },
  { value: 'system', icon: Monitor, color: 'text-slate-500' }
];

const LANGUAGE_OPTIONS: { value: LanguageOption; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸', dir: 'ltr' },
  { value: 'fr-FR', label: 'Français (FR)', flag: '🇫🇷', dir: 'ltr' },
  { value: 'ar-AR', label: 'العربية (المغرب)', flag: '🇲🇦', dir: 'rtl' }
];

const I18N_DATA: Record<LanguageOption, I18nResource> = {
  'en-US': {
    title: 'System Preferences',
    description: 'Customize your interface appearance and language settings.',
    theme_title: 'Interface Theme',
    theme_desc: 'Select your preferred visual theme for the dashboard.',
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    theme_system: 'Follow System',
    lang_title: 'Language & Region',
    lang_desc: 'Set the primary language for your account interface.',
    save_success: 'Preferences synced successfully',
    save_error: 'Failed to sync preferences',
    loading: 'Fetching your settings...'
  },
  'fr-FR': {
    title: 'Préférences Système',
    description: "Personnalisez l'apparence et la langue de votre interface.",
    theme_title: "Thème de l'interface",
    theme_desc: "Choisissez le thème visuel de votre tableau de bord.",
    theme_light: 'Mode Clair',
    theme_dark: 'Mode Sombre',
    theme_system: 'Système',
    lang_title: 'Langue et Région',
    lang_desc: 'Définissez la langue principale de votre interface.',
    save_success: 'Préférences mises à jour',
    save_error: 'Échec de la mise à jour',
    loading: 'Chargement...'
  },
  'ar-AR': {
    title: 'تفضيلات النظام',
    description: 'تحكم في مظهر المنصة وإعدادات اللغة الخاصة بك.',
    theme_title: 'مظهر الواجهة',
    theme_desc: 'اختر المظهر المرئي المفضل لواجهة النظام.',
    theme_light: 'الوضع الفاتح',
    theme_dark: 'الوضع الداكن',
    theme_system: 'حسب النظام',
    lang_title: 'اللغة والمنطقة',
    lang_desc: 'حدد اللغة الأساسية لعرض واجهة المستخدم.',
    save_success: 'تم مزامنة التفضيلات بنجاح',
    save_error: 'حدث خطأ أثناء تحديث التفضيلات',
    loading: 'جاري جلب الإعدادات...'
  }
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function SettingsPage_SystemPreferences() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');
  const [currentLang, setCurrentLang] = useState<LanguageOption>('en-US');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const t = useMemo(() => I18N_DATA[currentLang] || I18N_DATA['en-US'], [currentLang]);
  const isRTL = currentLang === 'ar-AR';

  // معالجة الثيم على مستوى الـ DOM
  const applyTheme = useCallback((theme: ThemeOption) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    async function init() {
      try {
        const session = getFrontendUserSession();
        if (!session?.userId) return;

        const userRecord = await entities.user.Get({ id: parseInt(session.userId, 10) });
        if (userRecord) {
          setCurrentUser(userRecord);
          const theme = (userRecord.theme_preference as ThemeOption) || 'system';
          const lang = (userRecord.language_code as LanguageOption) || 'en-US';
          
          setCurrentTheme(theme);
          setCurrentLang(lang);
          applyTheme(theme);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [applyTheme]);

  const handleUpdate = async (type: 'theme' | 'lang', value: string) => {
    if (!currentUser) return;
    setIsUpdating(type);

    try {
      const updateData = type === 'theme' 
        ? { theme_preference: value as ThemeOption } 
        : { language_code: value as LanguageOption };

      if (type === 'theme') {
        setCurrentTheme(value as ThemeOption);
        applyTheme(value as ThemeOption);
      } else {
        setCurrentLang(value as LanguageOption);
      }

      await entities.user.Update({
        where: { id: currentUser.id },
        data: { ...currentUser, ...updateData }
      });

      toast.success(t.save_success);
    } catch (err) {
      toast.error(t.save_error);
      // إعادة الحالة القديمة في حال الفشل (Rollback)
      if (type === 'theme') applyTheme(currentTheme);
    } finally {
      setIsUpdating(null);
    }
  };

  // حماية ضد Hydration Mismatch
  if (!mounted) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-20 space-y-8">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <section 
      className={cn(
        "w-full min-h-screen transition-colors duration-500 pb-20",
        isRTL ? "font-arabic" : "font-sans"
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 py-12">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0 transform hover:rotate-6 transition-transform">
            <Settings2 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {t.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.description}
            </p>
          </div>
        </div>

        <div className="grid gap-10">
          
          {/* Theme Switcher */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900/50 bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                <div>
                  <CardTitle className="text-2xl font-bold dark:text-white">{t.theme_title}</CardTitle>
                  <CardDescription className="text-md mt-1 italic">{t.theme_desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {THEME_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = currentTheme === opt.value;
                  const loadingThis = isUpdating === 'theme';

                  return (
                    <button
                      key={opt.value}
                      disabled={loadingThis}
                      onClick={() => handleUpdate('theme', opt.value)}
                      className={cn(
                        "relative flex flex-col items-center gap-5 p-8 rounded-[2rem] border-2 transition-all duration-300 group overflow-hidden",
                        active 
                          ? "border-blue-600 bg-blue-50/40 dark:bg-blue-900/20 shadow-xl" 
                          : "border-slate-100 dark:border-slate-800 bg-slate-50/30 hover:border-blue-300 hover:bg-white dark:hover:bg-slate-800"
                      )}
                    >
                      {active && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-2xl shadow-md animate-in slide-in-from-top-full">
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </div>
                      )}
                      
                      <div className={cn(
                        "p-5 rounded-2xl transition-all duration-500 shadow-sm",
                        active ? "bg-blue-600 text-white scale-110" : "bg-white dark:bg-slate-800 text-slate-400 group-hover:scale-110"
                      )}>
                        <Icon size={32} className={active ? "text-white" : opt.color} />
                      </div>

                      <span className={cn(
                        "font-bold tracking-wide transition-colors",
                        active ? "text-blue-700 dark:text-blue-400" : "text-slate-500"
                      )}>
                        {t[`theme_${opt.value}` as keyof I18nResource]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Language Selector */}
          <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none dark:bg-slate-900/50 bg-white/80 backdrop-blur-md rounded-[2.5rem]">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="flex items-center gap-5 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2rem] w-full lg:w-1/3 border border-indigo-100/50 dark:border-indigo-800/50">
                   <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
                      <Globe className="text-indigo-600 animate-pulse" size={32} />
                   </div>
                   <div>
                      <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg leading-none">{t.lang_title}</h3>
                      <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-2 font-bold uppercase tracking-tighter">Localization Active</p>
                   </div>
                </div>
                
                <div className="flex-1 w-full space-y-4">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-2 italic">{t.lang_desc}</p>
                  <Select 
                    value={currentLang} 
                    onValueChange={(v) => handleUpdate('lang', v)}
                    disabled={isUpdating === 'lang'}
                  >
                    <SelectTrigger className="h-16 rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 text-xl font-bold shadow-sm focus:ring-blue-500/20 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-700 shadow-2xl p-2 bg-white dark:bg-slate-900">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="h-14 focus:bg-blue-50 dark:focus:bg-blue-900/30 rounded-xl mb-1 cursor-pointer">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl drop-shadow-sm">{lang.flag}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex justify-center">
           <div className="bg-slate-100 dark:bg-slate-800/50 px-6 py-2 rounded-full flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Cloud Sync Enabled
              </span>
           </div>
        </div>
      </div>
    </section>
  );
}