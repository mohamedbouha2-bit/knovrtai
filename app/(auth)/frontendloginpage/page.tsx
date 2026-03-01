'use client';
import { useState } from 'react';

// استلام متغير lang الممرر من FrontendLayout
export default function HomePage({ lang = 'ar' }: { lang?: string }) {
  const [input, setInput] = useState('');

  // قاموس النصوص للغات الثلاث
  const content: any = {
    ar: {
      welcome: "مرحباً بك في",
      placeholder: "اسأل Konvrt AI...",
      send: "إرسال",
      alert: "جاري معالجة طلبك",
      cards: [
        { icon: "⚡", title: "تحليل البيانات", desc: "استخراج الأنماط من ملفاتك" },
        { icon: "💻", title: "تطوير الأكواد", desc: "تحليل وتصحيح شيفرات البرمجة" },
        { icon: "✍️", title: "كتابة محتوى", desc: "صياغة رسائل وتقارير احترافية" }
      ]
    },
    en: {
      welcome: "Welcome to",
      placeholder: "Ask Konvrt AI...",
      send: "Send",
      alert: "Processing your request",
      cards: [
        { icon: "⚡", title: "Data Analysis", desc: "Extract patterns from your files" },
        { icon: "💻", title: "Code Development", desc: "Analyze and debug code snippets" },
        { icon: "✍️", title: "Content Writing", desc: "Draft professional reports and emails" }
      ]
    },
    fr: {
      welcome: "Bienvenue sur",
      placeholder: "Demandez à Konvrt AI...",
      send: "Envoyer",
      alert: "Traitement de votre demande",
      cards: [
        { icon: "⚡", title: "Analyse de Données", desc: "Extraire des modèles de vos fichiers" },
        { icon: "💻", title: "Développement", desc: "Analyser et déboguer des extraits de code" },
        { icon: "✍️", title: "Rédaction", desc: "Rédiger des rapports et des e-mails" }
      ]
    }
  };

  const t = content[lang] || content['ar'];

  const handleSend = () => {
    if (!input.trim()) return;
    alert(`Konvrt AI: ${t.alert} (${input})`);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 pb-40">
      {/* الترحيب المركزي */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 inline-block shadow-sm">Konvrt AI v1.0</span>
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white mt-4 tracking-tight">
          {t.welcome} <span className="text-blue-600 italic">Konvrt AI</span>
        </h1>
      </div>

      {/* البطاقات الثلاث */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {t.cards.map((card: any, i: number) => (
          <div key={i} className="group p-8 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform inline-block">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* شريط الإرسال السفلي */}
      <div className="fixed bottom-10 left-0 right-0 max-w-3xl mx-auto px-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[2.5rem] shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder} 
              className="flex-1 py-3 px-6 outline-none bg-transparent dark:text-white text-lg font-medium"
            />
            <button 
              onClick={handleSend}
              className="rounded-full px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg transition-all active:scale-95"
            >
              {t.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}