'use client';

import { usePathname, useRouter } from 'next/navigation';
import { getBackendAdminSession, removeBackendAdminSession } from '@/tools/SessionContext';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Cpu, 
  Languages, 
  Database, 
  Settings, 
  LogOut, 
  LogIn,
  Moon,
  Sun,
  Globe
} from 'lucide-react'; // استخدام Lucide للأيقونات المتناسقة

// ... (Translations object remains the same as in your snippet)

const navigationLinks = [
  { labelKey: 'dashboard', target_url: '/admindashboardpage', icon: LayoutDashboard, requiresSuperAdmin: true },
  { labelKey: 'userManagement', target_url: '/usermanagementpage', icon: Users },
  { labelKey: 'paymentsCredits', target_url: '/paymentsadminpage', icon: CreditCard },
  { labelKey: 'aiAutomation', target_url: '/aiautomationadminpage', icon: Cpu },
  { labelKey: 'localization', target_url: '/localizationadminpage', icon: Languages },
  { labelKey: 'providerEntry', target_url: '/providerentrypage', icon: Database },
  { labelKey: 'settings', target_url: '/settingspage', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ name: string; role: string; } | null>(null);
  const [locale, setLocale] = useState<'en' | 'ar' | 'fr'>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // تحسين الترجمة باستخدام useMemo
  const t = useMemo(() => translations[locale], [locale]);
  const isRTL = locale === 'ar';

  useEffect(() => {
    const savedLocale = localStorage.getItem('admin_locale') as 'en' | 'ar' | 'fr' || 'en';
    setLocale(savedLocale);
    updateDOM(savedLocale, localStorage.getItem('admin_dark_mode') === 'true');

    const handleSync = () => {
        const session = getBackendAdminSession();
        if (session?.token) {
          setIsLoggedIn(true);
          const name = session.adminName || 'Admin';
          const role = session.role || 'Administrator';
          setAdminInfo({ name, role });
          setIsSuperAdmin(role === 'super_admin' && (name.includes('Mohamed Bouha') || name.includes('محمد بوها')));
        } else {
          setIsLoggedIn(false);
          setAdminInfo(null);
        }
    };

    handleSync();
  }, [pathname]);

  const updateDOM = (l: string, dark: boolean) => {
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
    document.documentElement.classList.toggle('dark', dark);
  };

  const toggleLocale = () => {
    const next = { en: 'ar', ar: 'fr', fr: 'en' }[locale] as 'en' | 'ar' | 'fr';
    setLocale(next);
    localStorage.setItem('admin_locale', next);
    updateDOM(next, darkMode);
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale: next } }));
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('admin_dark_mode', String(next));
    updateDOM(locale, next);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { darkMode: next } }));
  };

  return (
    <aside 
      className={`w-[260px] h-screen flex flex-col transition-all duration-300 border-e
        ${darkMode ? 'bg-[#0f172a] border-[#1e293b] text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Section */}
      <div className="p-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            {t.appTitle}
          </h1>
          <p className="text-[11px] uppercase tracking-widest opacity-60 font-medium">{t.adminPanel}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={toggleLocale} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Globe className="w-4 h-4 text-blue-500" />
          </button>
          <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navigationLinks.filter(l => !l.requiresSuperAdmin || isSuperAdmin).map((link) => {
          const active = pathname.startsWith(link.target_url);
          const Icon = link.icon;
          return (
            <button
              key={link.target_url}
              onClick={() => router.push(link.target_url)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group
                ${active 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-70 hover:opacity-100'}`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-500'}`} />
              <span className={isRTL ? 'font-bold' : 'font-medium'}>{t[link.labelKey as keyof typeof t]}</span>
              {link.labelKey === 'providerEntry' && (
                <span className="ms-auto text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full ring-2 ring-emerald-500/20">
                  {t.seeds}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-2">
          {['privacyPolicy', 'termsOfService', 'upgrades'].map((k) => (
            <button key={k} onClick={() => router.push(`/${k}page`)} className="text-[11px] opacity-50 hover:opacity-100 hover:text-blue-500 transition-all">
              {t[k as keyof typeof t]}
            </button>
          ))}
        </div>

        {isLoggedIn && adminInfo ? (
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {adminInfo.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs opacity-50">{t.loggedInAs}</p>
                <p className="text-sm font-bold truncate">{adminInfo.name}</p>
              </div>
            </div>
            <Button 
              onClick={() => { removeBackendAdminSession(); router.push('/backendloginpage'); }}
              variant="destructive" 
              className="w-full h-10 rounded-xl gap-2 shadow-sm"
            >
              <LogOut className="w-4 h-4" /> {t.logout}
            </Button>
          </div>
        ) : (
          <Button onClick={() => router.push('/backendloginpage')} className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl gap-2">
            <LogIn className="w-4 h-4" /> {t.login}
          </Button>
        )}
      </div>
    </aside>
  );
}