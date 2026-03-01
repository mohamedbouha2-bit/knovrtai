'use client';
import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

interface Props {
  lang?: 'ar' | 'en' | 'fr';
}

interface TranslationContent {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  button: string;
  forgot: string;
  placeholderEmail: string;
  placeholderPass: string;
}

export default function BackendLoginPage_AuthPanel({ lang = 'ar' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dict: Record<'ar' | 'en' | 'fr', TranslationContent> = {
    ar: {
      title: "دخول المسؤولين",
      subtitle: "مرحباً بك مجدداً في لوحة تحكم Konvrt AI",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      button: "تسجيل الدخول",
      forgot: "نسيت كلمة المرور؟",
      placeholderEmail: "admin@konvrt.ai",
      placeholderPass: "••••••••"
    },
    en: {
      title: "Admin Login",
      subtitle: "Welcome back to Konvrt AI Dashboard",
      email: "Email Address",
      password: "Password",
      button: "Sign In",
      forgot: "Forgot Password?",
      placeholderEmail: "admin@konvrt.ai",
      placeholderPass: "••••••••"
    },
    fr: {
      title: "Connexion Admin",
      subtitle: "Bienvenue sur le tableau de bord Konvrt AI",
      email: "Adresse E-mail",
      password: "Mot de passe",
      button: "Se connecter",
      forgot: "Mot de passe oublié ?",
      placeholderEmail: "admin@konvrt.ai",
      placeholderPass: "••••••••"
    }
  };

  const t = dict[lang] || dict['ar'];
  const isRtl = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
    // هنا يتم استدعاء وظيفة تسجيل الدخول الفعلية
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[80vh] px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-700 p-10 transform transition-all hover:scale-[1.01]">
        
        {/* أيقونة الحماية العلوية */}
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{t.title}</h2>
          <p className="text-gray-400 text-sm">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* حقل البريد الإلكتروني */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">{t.email}</label>
            <div className="relative group">
              <div className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`}>
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholderEmail}
                className={`w-full py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all dark:text-white`}
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.password}</label>
              <a href="#" className="text-[10px] text-blue-600 hover:underline">{t.forgot}</a>
            </div>
            <div className="relative group">
              <div className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`}>
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.placeholderPass}
                className={`w-full py-4 ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all dark:text-white`}
              />
            </div>
          </div>

          {/* زر تسجيل الدخول */}
          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
          >
            <LogIn className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            {t.button}
          </button>
        </form>
      </div>
    </div>
  );
}