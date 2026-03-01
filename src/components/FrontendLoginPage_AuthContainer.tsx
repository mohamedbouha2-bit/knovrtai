'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { entities } from '@/tools/entities-proxy';
import { setfrontend_user_session, FrontendUserSession } from '@/tools/SessionContext';

// نصوص الترجمة مع إضافة رسائل التحقق (Validation)
const translations: any = {
  ar: {
    title: "مرحباً بك مجدداً",
    subtitle: "أدخل بياناتك للوصول إلى مساحة العمل الخاصة بك.",
    emailLabel: "البريد الإلكتروني",
    passLabel: "كلمة المرور",
    forgotPass: "نسيت كلمة المرور؟",
    signInBtn: "تسجيل الدخول",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    successMsg: "تم تسجيل الدخول بنجاح.",
    failedTitle: "فشل تسجيل الدخول",
    failedMsg: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    errorGeneric: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.",
    validationEmail: "يرجى إدخال بريد إلكتروني صحيح",
    validationPass: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
  },
  en: {
    title: "Welcome back",
    subtitle: "Enter your credentials to access your workspace.",
    emailLabel: "Email address",
    passLabel: "Password",
    forgotPass: "Forgot password?",
    signInBtn: "Sign in",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    successMsg: "Logged in successfully.",
    failedTitle: "Login failed",
    failedMsg: "Invalid credentials.",
    errorGeneric: "An error occurred, please try again.",
    validationEmail: "Please enter a valid email",
    validationPass: "Password must be at least 6 characters"
  }
};

export default function FrontendLoginPage_AuthContainer({ lang = 'ar' }: { lang?: string }) {
  const t = translations[lang] || translations['ar'];
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // مخطط التحقق (Zod Schema) مع رسائل مترجمة
  const loginSchema = z.object({
    email: z.string().email(t.validationEmail),
    password: z.string().min(6, t.validationPass)
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // أنيميشن الدخول باستخدام GSAP
  useGSAP(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: containerRef });

  const handleManualLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // تشفير كلمة المرور للمقارنة مع قاعدة البيانات
      const hashedPassword = CryptoJS.SHA256(data.password).toString();
      
      const users = await entities.user.GetAll({
        where: {
          email: { equals: data.email },
          password: { equals: hashedPassword },
          status: { equals: 'active' }
        }
      });

      if (users && users.length > 0) {
        const user = users[0];
        const session = new FrontendUserSession();
        session.userId = user.id.toString();
        session.email = user.email;
        session.username = user.username || 'User';
        
        setfrontend_user_session(session);
        toast.success(t.successMsg);
        
        // توجيه المستخدم بعد نجاح الدخول
        setTimeout(() => { router.push('/'); }, 800);
      } else {
        // أنيميشن "الاهتزاز" عند الخطأ
        toast.error(t.failedMsg);
        gsap.to(formRef.current, { 
          x: [-10, 10, -10, 10, 0], 
          duration: 0.4, 
          ease: "power2.inOut" 
        });
      }
    } catch (error) {
      toast.error(t.errorGeneric);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div ref={containerRef} className="w-full max-w-[420px]">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-slate-100 overflow-hidden">
          <div className="px-8 pt-12 pb-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{t.title}</h1>
              <p className="text-slate-500 text-sm leading-relaxed">{t.subtitle}</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit(handleManualLogin)} className="space-y-6">
              {/* حقل البريد الإلكتروني */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">{t.emailLabel}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    {...register('email')} 
                    placeholder="name@company.com"
                    className={`w-full p-4 ${lang === 'ar' ? 'pr-12' : 'pl-12'} rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium`} 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email.message}</p>}
              </div>

              {/* حقل كلمة المرور */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.passLabel}</label>
                  <Link href="/forgot-password">
                    <span className="text-[11px] text-blue-600 font-extrabold hover:underline">{t.forgotPass}</span>
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    {...register('password')} 
                    placeholder="••••••••"
                    className={`w-full p-4 ${lang === 'ar' ? 'pr-12' : 'pl-12'} rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-slate-900 font-medium`} 
                  />
                </div>
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.password.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.signInBtn}
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {t.noAccount}{" "}
              <Link href="/frontendregisterpage" className="text-blue-600 font-black hover:text-blue-700 transition-colors">
                {t.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}