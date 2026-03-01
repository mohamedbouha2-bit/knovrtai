"use client";
import { useState } from "react";
import { createContactEntry } from "./actions";
import { signIn } from "next-auth/react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState("ar"); 
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [status, setStatus] = useState<{success?: boolean, message?: string, imageUrl?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const texts: any = {
    ar: { 
      title: "KonvrtAI",
      descTitle: "مستقبل البرمجة مع KonvrtAI",
      f1: "سرعة فائقة 🚀", f2: "ذكاء اصطناعي 🤖", f3: "سحابة آمنة ☁️",
      loginTitle: "تسجيل الدخول", signupTitle: "إنشاء حساب جديد",
      name: "الاسم الكامل", email: "البريد الإلكتروني", 
      loginBtn: "دخول", signupBtn: "إنشاء حساب", google: "المتابعة باستخدام جوجل",
      switchLogin: "لديك حساب؟ سجل دخولك", switchSignup: "ليس لديك حساب؟ انضم إلينا",
      loading: "جاري... ⏳", langBtn: "العربية" 
    },
    en: { 
      title: "KonvrtAI",
      descTitle: "The Future of Coding",
      f1: "Ultra Fast 🚀", f2: "Advanced AI 🤖", f3: "Secure Cloud ☁️",
      loginTitle: "Login", signupTitle: "Create Account",
      name: "Full Name", email: "Email Address", 
      loginBtn: "Login", signupBtn: "Sign Up", google: "Continue with Google",
      switchLogin: "Have an account? Login", switchSignup: "No account? Sign Up",
      loading: "Wait... ⏳", langBtn: "English" 
    }
  };

  const t = texts[lang] || texts["en"];

  return (
    <main className={`min-h-screen transition-all duration-700 ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center border-b border-purple-500/20 backdrop-blur-md">
        <div className="text-2xl font-black text-purple-600">{t.title}</div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="px-4 py-1 rounded-full border border-purple-500 text-sm font-bold">{t.langBtn}</button>
          <button onClick={() => setIsDark(!isDark)} className="p-2 border border-purple-500 rounded-full">{isDark ? "🌙" : "☀️"}</button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center pt-10 pb-20 px-4">
        
        {/* --- زر الوصف والمعلومات (ظاهر الآن بوضوح) --- */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            {t.descTitle}
          </h1>
          <div className="flex flex-wrap justify-center gap-3">
            {[t.f1, t.f2, t.f3].map((f, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 font-bold text-sm">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* بطاقة التسجيل */}
        <div className={`p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-2 ${isDark ? "bg-slate-900 border-purple-500/30" : "bg-slate-50 border-purple-500"}`}>
          <h2 className="text-3xl font-black mb-8 text-center text-purple-600">{isLoginMode ? t.loginTitle : t.signupTitle}</h2>

          <form action={async (formData) => { setIsLoading(true); const res = await createContactEntry(formData); setStatus(res); setIsLoading(false); }} className="space-y-5">
            {!isLoginMode && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-purple-600 px-2">{t.name}</label>
                <input name="name" placeholder="John Doe" className="w-full p-4 rounded-xl bg-transparent border-2 border-purple-500 outline-none focus:ring-4 ring-purple-500/20 text-purple-900 dark:text-white" required />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-purple-600 px-2">{t.email}</label>
              <input name="email" type="email" placeholder="example@mail.com" className="w-full p-4 rounded-xl bg-transparent border-2 border-purple-500 outline-none focus:ring-4 ring-purple-500/20 text-purple-900 dark:text-white" required />
            </div>
            
            <button disabled={isLoading} className="w-full p-4 rounded-xl font-black text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/40 transition-all active:scale-95">
              {isLoading ? t.loading : (isLoginMode ? t.loginBtn : t.signupBtn)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm font-bold text-purple-600 hover:underline">{isLoginMode ? t.switchSignup : t.switchLogin}</button>
          </div>

          <div className="relative my-8 flex items-center justify-center">
            <div className="w-full h-[2px] bg-purple-500/20 absolute"></div>
            <span className={`relative px-4 text-xs font-black ${isDark ? "bg-slate-900" : "bg-slate-50"} text-purple-500`}>OR</span>
          </div>

          <button onClick={() => signIn("google")} className="w-full p-4 rounded-xl border-2 border-purple-500 flex items-center justify-center gap-3 hover:bg-purple-500/5 font-bold transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
            {t.google}
          </button>
        </div>
      </div>
    </main>
  );
}