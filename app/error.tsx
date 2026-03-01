'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GRoud404SVG from '@/assets/GRoud404SVG.svg';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [lang, setLang] = useState('ar');

  // محاولة معرفة اللغة المفضلة للمستخدم من المتصفح أو الـ LocalStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'ar';
    setLang(savedLang);
  }, []);

  const content: any = {
    ar: {
      oops: "عذراً!",
      msg: "حدث خطأ غير متوقع في النظام",
      retry: "إعادة المحاولة",
      backHome: "العودة للرئيسية",
      dir: "rtl"
    },
    en: {
      oops: "Oops!",
      msg: "Something went wrong unexpectedly",
      retry: "Try Again",
      backHome: "Back Home",
      dir: "ltr"
    },
    fr: {
      oops: "Oups !",
      msg: "Une erreur inattendue s'est produite",
      retry: "Réessayer",
      backHome: "Retour à l'accueil",
      dir: "ltr"
    }
  };

  const t = content[lang] || content['en'];

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-300" 
      dir={t.dir}
    >
      <div className="flex flex-col gap-4 items-center justify-center px-6 text-center">
        
        {/* الصورة التوضيحية */}
        <div className="relative w-full max-w-[500px] aspect-[4/3] opacity-90 dark:brightness-90">
          <Image 
            src={GRoud404SVG} 
            alt="Error illustration" 
            fill 
            className="object-contain" 
            priority
          />
        </div>

        {/* النصوص المترجمة */}
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white transition-colors">
          {t.oops}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
          {t.msg}
        </p>

        {/* الأزرار التفاعلية */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
          <Button
            className="w-full sm:w-[160px] h-12 text-white bg-red-500 hover:bg-red-600 rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95"
            onClick={() => reset()}
          >
            {t.retry}
          </Button>
          
          <Button
            className="w-full sm:w-[160px] h-12 text-white bg-slate-900 dark:bg-blue-600 hover:opacity-90 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
            onClick={() => router.replace('/')}
          >
            {t.backHome}
          </Button>
        </div>

        {/* كود الخطأ التقني (للمطورين) */}
        {error.digest && (
          <p className="mt-8 text-[10px] font-mono text-gray-400 opacity-50">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}