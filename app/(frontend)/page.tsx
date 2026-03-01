import { Button } from "@/components/ui/button"

// قمنا بإضافة { lang } كمستقبل (Prop) من الـ Layout
export default function HomePage({ lang = 'ar' }: { lang?: string }) {
  
  // قاموس النصوص الخاص بالواجهة الوسطى
  const content: any = {
    ar: {
      title: "بماذا يمكنني",
      titleBlue: "مساعدتك اليوم؟",
      inputPlaceholder: "اسأل Konvrt AI...",
      buttonSend: "إرسال ➤",
      footer: "قد يخطئ الذكاء الاصطناعي، يرجى التحقق من المعلومات الهامة.",
      suggest: [
        { icon: "✍️", title: "كتابة محتوى", desc: "ساعدني في صياغة بريد إلكتروني" },
        { icon: "💻", title: "تحليل كود", desc: "اشرح لي كود JavaScript التالي" },
        { icon: "💡", title: "أفكار ذكية", desc: "أعطني أفكاراً لمشروع تخرج" }
      ]
    },
    en: {
      title: "How can I",
      titleBlue: "help you today?",
      inputPlaceholder: "Ask Konvrt AI...",
      buttonSend: "Send ➤",
      footer: "AI may make mistakes, please check important info.",
      suggest: [
        { icon: "✍️", title: "Content Writing", desc: "Help me draft an email" },
        { icon: "💻", title: "Code Analysis", desc: "Explain this JavaScript code" },
        { icon: "💡", title: "Smart Ideas", desc: "Give me ideas for a graduation project" }
      ]
    },
    fr: {
      title: "Comment puis-je",
      titleBlue: "vous aider aujourd'hui ?",
      inputPlaceholder: "Demandez à Konvrt AI...",
      buttonSend: "Envoyer ➤",
      footer: "L'IA peut faire des erreurs, veuillez vérifier les infos importantes.",
      suggest: [
        { icon: "✍️", title: "Rédaction", desc: "Aidez-moi à rédiger un e-mail" },
        { icon: "💻", title: "Analyse de Code", desc: "Expliquez-moi ce code JavaScript" },
        { icon: "💡", title: "Idées Intelligentes", desc: "Donnez-moi des idées de projet" }
      ]
    }
  };

  const t = content[lang] || content['ar'];

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 pb-32">
      <h1 className="text-4xl font-semibold mb-12 text-center text-gray-800 dark:text-white">
        {t.title} <span className="text-blue-600">{t.titleBlue}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {t.suggest.map((item: any, i: number) => (
          <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer text-center md:text-right">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-0 right-0 max-w-3xl mx-auto px-4 z-20">
        <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-xl">
          <input 
            type="text" 
            placeholder={t.inputPlaceholder} 
            className="flex-1 py-3 px-6 outline-none bg-transparent text-gray-700 dark:text-white"
          />
          <Button className="rounded-full px-6 py-6 bg-blue-600">{t.buttonSend}</Button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">{t.footer}</p>
      </div>
    </div>
  )
}