'use client';
import { useTheme } from "next-themes";
import { useState, useEffect, cloneElement, isValidElement } from "react"; // أضفنا cloneElement و isValidElement
import { cn } from "@/lib/utils";

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const dict: any = {
    ar: { dir: "rtl", new: "+ محادثة جديدة", plan: "الاشتراكات", logout: "خروج", profile: "الملف", fr: "الفرنسية" },
    en: { dir: "ltr", new: "New Chat +", plan: "Plans", logout: "Logout", profile: "Profile", fr: "French" },
    fr: { dir: "ltr", new: "Nouveau Chat +", plan: "Abonnements", logout: "Déconnexion", profile: "Profil", fr: "Français" } // إضافة الفرنسية
  };
  const t = dict[lang];

  return (
    <div className={cn("flex h-screen overflow-hidden", theme === 'dark' ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900")} dir={t.dir}>
      
      {/* Sidebar - القائمة الجانبية */}
      <aside className="w-72 bg-white dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 flex flex-col shadow-xl">
        <div className="p-8 text-2xl font-black text-blue-600 italic">Konvrt AI</div>
        <nav className="flex-1 px-4 space-y-4">
          <button className="w-full p-4 bg-blue-600 text-white rounded-2xl font-bold transition-all active:scale-95">{t.new}</button>
          
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-lg outline-none cursor-pointer"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option> {/* الخيار الثالث */}
          </select>
        </nav>
        
        <div className="p-6 border-t dark:border-slate-700">
          <button onClick={() => window.location.href = '/login'} className="text-red-500 font-bold hover:underline">
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b dark:border-slate-700">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-2xl hover:scale-110 transition-transform">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          {/* هذا السطر هو السر: نرسل اللغة المختارة إلى الصفحة الوسطى */}
          {isValidElement(children) ? cloneElement(children as React.ReactElement<any>, { lang }) : children}
        </div>
      </main>
    </div>
  );
}