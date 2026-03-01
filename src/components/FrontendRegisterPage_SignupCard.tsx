'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import { Loader2, CheckCircle2, Globe, User, Mail, Lock } from 'lucide-react';
import CryptoJS from 'crypto-js';
import Link from 'next/link';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardWithNoPadding, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Entities & Tools
import { entities } from '@/tools/entities-proxy';
import { setfrontend_user_session, FrontendUserSession } from '@/tools/SessionContext';

const translations: any = {
  ar: {
    title: "إنشاء حساب",
    subtitle: "انضم إلى آلاف المبدعين الذين يؤتمتون محتواهم.",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirm: "تأكيد كلمة المرور",
    submit: "ابدأ مجاناً",
    welcome: "مرحباً بك معنا!",
    successMsg: "تم إنشاء حسابك بنجاح. جاري تحويلك الآن.",
    errorEmail: "البريد الإلكتروني مسجل بالفعل",
    errorGeneric: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
    haveAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    langName: "English",
    vName: "الاسم قصير جداً",
    vEmail: "بريد غير صحيح",
    vPass: "6 أحرف على الأقل",
    vMatch: "كلمات المرور غير متطابقة"
  },
  en: {
    title: "Create Account",
    subtitle: "Join thousands of creators automating their content.",
    username: "Username",
    email: "Email",
    password: "Password",
    confirm: "Confirm Password",
    submit: "Get Started Free",
    welcome: "Welcome Aboard!",
    successMsg: "Your account has been successfully created.",
    errorEmail: "Email already registered",
    errorGeneric: "Registration failed.",
    haveAccount: "Already have an account?",
    login: "Login",
    langName: "العربية",
    vName: "Name too short",
    vEmail: "Invalid email",
    vPass: "Min 6 characters",
    vMatch: "Passwords do not match"
  }
};

export default function FrontendRegisterPage_SignupCard({ lang: initialLang = 'ar' }: { lang?: string }) {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const t = translations[currentLang];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // استخدام useMemo لإعادة بناء السكيما فقط عند تغيير اللغة
  const signupSchema = useMemo(() => z.object({
    username: z.string().min(3, t.vName),
    email: z.string().email(t.vEmail),
    password: z.string().min(6, t.vPass),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: t.vMatch
  }), [currentLang, t]);

  type SignupFormValues = z.infer<typeof signupSchema>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' }
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }
  }, []);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. التحقق من وجود البريد مسبقاً
      const existingUsers = await entities.user.GetAll({
        where: { email: { equals: data.email } }
      });
      
      if (existingUsers && existingUsers.length > 0) {
        toast.error(t.errorEmail);
        setIsLoading(false);
        return;
      }

      // 2. تشفير كلمة المرور
      const hashedPassword = CryptoJS.SHA256(data.password).toString();
      
      // 3. إنشاء المستخدم
      const createdUser = await entities.user.Create({
        email: data.email,
        username: data.username,
        password: hashedPassword,
        role: 'user',
        status: 'active',
        created_at: new Date(),
      } as any);

      if (!createdUser) throw new Error("Creation failed");

      // 4. إعداد الجلسة
      const sessionData = new FrontendUserSession();
      sessionData.userId = String(createdUser.id);
      sessionData.username = createdUser.username || 'User';
      sessionData.email = createdUser.email;
      setfrontend_user_session(sessionData);

      setIsSuccess(true);
      toast.success(t.welcome);
      setTimeout(() => { router.push('/'); }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLang = () => setCurrentLang(prev => prev === 'ar' ? 'en' : 'ar');

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* زر اللغة */}
      <div className="absolute top-6 right-6 lg:right-12 z-20">
        <Button variant="ghost" onClick={toggleLang} className="gap-2 rounded-full hover:bg-white shadow-sm border bg-white/50 backdrop-blur-sm transition-all">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="font-bold">{t.langName}</span>
        </Button>
      </div>

      <div ref={containerRef} className="w-full max-w-[480px] relative">
        {/* تأثير خلفية جمالي */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <CardWithNoPadding className="bg-white/80 backdrop-blur-md border-slate-200 shadow-2xl shadow-blue-100 overflow-hidden rounded-[2.5rem] relative z-10">
          <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] py-10 px-8 text-center text-white relative">
            <h1 className="text-3xl font-black mb-3 tracking-tight">{t.title}</h1>
            <p className="opacity-90 text-sm font-medium leading-relaxed">{t.subtitle}</p>
          </div>

          <CardContent className="p-8 lg:p-10">
            {isSuccess ? (
              <div className="flex flex-col items-center py-10 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">{t.welcome}</h3>
                  <p className="text-slate-500 font-medium">{t.successMsg}</p>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.username}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input className={`bg-slate-50/50 border-slate-200 rounded-xl h-11 ${currentLang === 'ar' ? 'pr-3 pl-10' : 'pl-10'}`} placeholder="john_doe" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.email}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input className={`bg-slate-50/50 border-slate-200 rounded-xl h-11 ${currentLang === 'ar' ? 'pr-3 pl-10' : 'pl-10'}`} type="email" placeholder="name@company.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.password}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input className={`bg-slate-50/50 border-slate-200 rounded-xl h-11 ${currentLang === 'ar' ? 'pr-3 pl-10' : 'pl-10'}`} type="password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.confirm}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input className={`bg-slate-50/50 border-slate-200 rounded-xl h-11 ${currentLang === 'ar' ? 'pr-3 pl-10' : 'pl-10'}`} type="password" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                  </div>

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : t.submit}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-6 justify-center">
             <p className="text-sm text-slate-500 font-medium">
               {t.haveAccount} <Link href="/frontendloginpage" className="font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-4">{t.login}</Link>
             </p>
          </CardFooter>
        </CardWithNoPadding>
      </div>
    </div>
  );
}