'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Paperclip, Bot, User, Loader2, Sparkles, Trash2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { CardWithNoPadding } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import EditableImg from '@/@base/EditableImg';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session } from '@/tools/SessionContext';
import type { chat_message, chat_session } from '@/server/entities.type';

// --- المخطط والأنواع ---
const messageSchema = z.object({
  content: z.string().min(1, 'لا يمكن إرسال رسالة فارغة')
});
type MessageFormValues = z.infer<typeof messageSchema>;

interface EnrichedMessage extends chat_message {
  is_local_pending?: boolean;
}

export default function GeminiChatWorkspacePage_ConversationList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionIdParam = searchParams.get('session_id');

  // الحالة (State)
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<chat_session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // المراجع (Refs)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' }
  });

  // --- تأثيرات الجلب (Fetch Effects) ---
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const session = getfrontend_user_session();
        if (!session?.userId) {
          toast.error('يرجى تسجيل الدخول أولاً');
          setLoading(false);
          return;
        }

        if (!sessionIdParam) {
          setMessages([]);
          setCurrentSession(null);
          setLoading(false);
          return;
        }

        const [sessionData, msgs] = await Promise.all([
          entities.chat_session.Get({ id: parseInt(sessionIdParam) }),
          entities.chat_message.GetAll({ chat_session_id: { equals: parseInt(sessionIdParam) } })
        ]);

        if (sessionData) {
          setCurrentSession(sessionData);
          setMessages(msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء تحميل المحادثة');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [sessionIdParam]);

  // التمرير التلقائي (Auto Scroll)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- معالجة الإرسال (Send Handler) ---
  const onSubmit = async (data: MessageFormValues) => {
    const session = getfrontend_user_session();
    if (!session?.userId) return;

    setSending(true);
    const userContent = data.content;
    form.reset(); // مسح الحقل فوراً لتحسين التجربة

    try {
      let activeSessionId = currentSession?.id;

      // 1. إنشاء جلسة جديدة إذا لم تكن موجودة
      if (!activeSessionId) {
        const newSession = await entities.chat_session.Create({
          user_id: parseInt(session.userId),
          title: userContent.substring(0, 40),
          created_at: new Date(),
          updated_at: new Date()
        } as any);
        if (newSession) {
          activeSessionId = newSession.id;
          setCurrentSession(newSession);
          // تحديث الرابط دون إعادة تحميل الصفحة
          window.history.pushState(null, '', `?session_id=${newSession.id}`);
        }
      }

      // 2. تحديث الواجهة تفاؤلياً (Optimistic UI)
      const tempId = Date.now();
      const optimisticMsg: EnrichedMessage = {
        id: tempId,
        chat_session_id: activeSessionId!,
        sender_type: 'user',
        content_text: userContent,
        created_at: new Date(),
        updated_at: new Date(),
        is_local_pending: true
      };
      setMessages(prev => [...prev, optimisticMsg]);

      // 3. حفظ رسالة المستخدم في قاعدة البيانات
      await entities.chat_message.Create({
        chat_session_id: activeSessionId!,
        sender_type: 'user',
        content_text: userContent,
        created_at: new Date(),
        updated_at: new Date()
      } as any);

      // 4. محاكاة رد الذكاء الاصطناعي
      setIsTyping(true);
      setTimeout(async () => {
        const aiResponseText = "أنا نموذج ذكاء اصطناعي تجريبي. يمكنني مساعدتك في صياغة المحتوى، تحليل البيانات، أو الإجابة على استفساراتك البرمجية.";
        const aiMsg = await entities.chat_message.Create({
          chat_session_id: activeSessionId!,
          sender_type: 'ai',
          content_text: aiResponseText,
          created_at: new Date(),
          updated_at: new Date()
        } as any);

        setIsTyping(false);
        if (aiMsg) {
          setMessages(prev => prev.map(m => m.id === tempId ? { ...m, is_local_pending: false } : m).concat(aiMsg));
        }
      }, 1500);

    } catch (error) {
      toast.error('فشل إرسال الرسالة');
      setMessages(prev => prev.filter(m => !m.is_local_pending));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="w-full bg-[#f8fafc] min-h-screen flex items-center justify-center p-2 md:p-6" dir="rtl">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* الهيدر (Header) */}
        <header className="px-6 py-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="md:hidden">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-slate-900 truncate max-w-[200px]">
                {currentSession?.title || 'محادثة جديدة'}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Gemini Pro • نشط الآن</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <Trash2 className="w-4 h-4" />
          </Button>
        </header>

        {/* منطقة الرسائل (Messages Area) */}
        <ScrollArea className="flex-1 bg-slate-50/30 p-4 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-medium">جاري تحميل المحادثة...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
               <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 rotate-12 shadow-inner">
                 <Sparkles className="w-10 h-10" />
               </div>
               <h1 className="text-2xl font-black text-slate-800">كيف يمكنني مساعدتك اليوم؟</h1>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
                 {["اكتب لي كود React لتسجيل الدخول", "لخص لي أهم توجهات الذكاء الاصطناعي", "ساعدني في كتابة بريد إلكتروني رسمي"].map((hint, i) => (
                   <button key={i} onClick={() => form.setValue('content', hint)} className="p-4 bg-white border border-slate-200 rounded-2xl text-right text-sm font-medium hover:border-blue-500 hover:bg-blue-50/50 transition-all shadow-sm">
                     {hint}
                   </button>
                 ))}
               </div>
            </div>
          ) : (
            <div className="space-y-8 pb-10">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'} gap-4 group animate-in fade-in slide-in-from-bottom-2`}>
                  <Avatar className={`w-9 h-9 border-2 ${msg.sender_type === 'user' ? 'border-blue-100' : 'border-slate-100'}`}>
                    <AvatarFallback className={msg.sender_type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}>
                      {msg.sender_type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col space-y-2 max-w-[85%] md:max-w-[70%] ${msg.sender_type === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-[1.5rem] shadow-sm text-sm md:text-base leading-relaxed ${
                      msg.sender_type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.content_text}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold px-2 uppercase tracking-tighter">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4 animate-pulse">
                   <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-400"><Bot className="w-5 h-5" /></div>
                   <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* منطقة الإدخال (Input Area) */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 p-2 md:p-3 rounded-[2rem] border border-slate-200 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all duration-300">
            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
              <Paperclip className="w-5 h-5" />
            </Button>
            <textarea 
              {...form.register('content')} 
              placeholder="بماذا تفكر؟ اسألني أي شيء..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2 text-sm md:text-base text-slate-800 placeholder:text-slate-400 font-medium"
            />
            <Button 
              type="submit" 
              disabled={sending || !form.watch('content')}
              className={`h-10 w-10 rounded-full transition-all ${form.watch('content') ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">قد يخطئ الذكاء الاصطناعي أحياناً، يرجى التحقق من المعلومات المهمة.</p>
        </div>
      </div>
    </section>
  );
}