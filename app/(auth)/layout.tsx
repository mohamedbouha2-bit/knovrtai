'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Languages } from 'lucide-react';
import { useState, cloneElement, isValidElement } from 'react'; // أضفنا cloneElement و isValidElement

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [lang, setLang] = useState('ar');

  return (
    <>
      <button 
        onClick={() => router.back()} 
        className="fixed top-4 left-4 z-[9999] p-2 rounded-full bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-gray-800" />
      </button>

      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1 px-3 rounded-full shadow-sm border border-gray-100">
        <Languages className="w-4 h-4 text-gray-600" />
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          className="bg-transparent text-sm font-bold text-gray-800 outline-none cursor-pointer p-1"
        >
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {/* التعديل هنا: نمرر متغير lang للأبناء */}
      <main className="min-h-[100vh]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {isValidElement(children) 
          ? cloneElement(children as React.ReactElement<any>, { lang }) 
          : children}
      </main>
    </>
  );
}