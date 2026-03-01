'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import GRoud404SVG from '@/assets/GRoud404SVG.svg';

export default function RootNotFound() {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    // جلب اللغة الحالية
    const currentLang = localStorage.getItem('lang') || 'ar';
    setLang(currentLang);
  }, []);

  const content: any = {
    ar: { title: "404", msg: "الصفحة التي تبحث عنها غير موجودة", btn: "العودة للرئيسية", dir: "rtl" },
    en: { title: "404", msg: "The page you're looking for doesn't exist", btn: "Back to Homepage", dir: "ltr" },
    fr: { title: "404", msg: "La page que vous recherchez n'existe pas", btn: "Retour à l'accueil", dir: "ltr" }
  };

  const t = content[lang];

  const handleTargetHome = () => {
    router.replace('/');
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center relative bg-background dark:bg-slate-900 transition-colors duration-300' dir={t.dir}>
      <div className="flex flex-col gap-2 items-center justify-center w-full px-4 rootNotFound transition-opacity duration-700 opacity-0 font-sans">
        <div className="relative w-full max-w-[500px] aspect-square md:aspect-video">
          <Image 
            src={GRoud404SVG} 
            alt="404 illustration" 
            fill 
            className="object-contain dark:brightness-90" 
            onLoad={(e) => {
              (e.currentTarget.parentElement?.parentElement as HTMLElement).style.opacity = '1';
              timer.current = setTimeout(handleTargetHome, 5000);
            }} 
          />
        </div>
        <h1 className="text-[64px] font-black text-slate-800 dark:text-white leading-none">{t.title}</h1>
        <p className="text-[16px] text-slate-500 dark:text-slate-400 mb-6">{t.msg}</p>
        <Button 
          className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all active:scale-95" 
          onClick={handleTargetHome}
        >
          {t.btn}
        </Button>
      </div>
    </div>
  );
}