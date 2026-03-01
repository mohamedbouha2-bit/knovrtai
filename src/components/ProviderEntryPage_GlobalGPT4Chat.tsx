'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Trash2, Bot, User, Loader2, Sparkles, Terminal, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { chat_message, chat_session } from '@/server/entities.type';

// --- Validation Schema ---
const chatInputSchema = z.object({
  prompt: z.string().min(1, 'Please enter a message.')
});
type ChatInputFormValues = z.infer<typeof chatInputSchema>;

const MODEL_NAME = 'gpt-4o-global-debug';
const SYSTEM_TITLE = 'Global GPT-4o Debug Session';

export default function ProviderEntryPage_GlobalGPT4Chat() {
  const [sessionData, setSessionData] = useState<chat_session | null>(null);
  const [messages, setMessages] = useState<chat_message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<ChatInputFormValues>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: { prompt: '' }
  });

  // --- Auto Scroll Logic ---
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- Initialization ---
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsInitializing(true);
        const adminSession = getBackendAdminSession();
        if (!adminSession?.token) {
          toast.error('Unauthorized: Please log in as admin.');
          return;
        }

        const userId = parseInt(adminSession.adminId) || 1;

        const existingSessions = await entities.chat_session.GetAll({
          user_id: { equals: userId },
          title: { equals: SYSTEM_TITLE }
        });

        let currentSession: chat_session | null = null;
        if (existingSessions?.length > 0) {
          currentSession = existingSessions.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
        } else {
          currentSession = await entities.chat_session.Create({
            user_id: userId,
            title: SYSTEM_TITLE,
            create_timestamp: new Date(),
            current_model_version: 'gpt-4o',
            temperature: 0.7,
            max_tokens: 4096,
            provider_id: 1,
            created_at: new Date(),
            updated_at: new Date()
          });
        }

        if (currentSession) {
          setSessionData(currentSession);
          const msgs = await entities.chat_message.GetAll({
            chat_session_id: { equals: currentSession.id }
          });
          if (msgs) {
            setMessages(msgs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
          }
        }
      } catch (error) {
        toast.error('Failed to initialize debug session.');
      } finally {
        setIsInitializing(false);
      }
    };
    initChat();
  }, []);

  // --- Actions ---
  const onSubmit = async (values: ChatInputFormValues) => {
    if (!sessionData || isLoading) return;
    
    const userPrompt = values.prompt.trim();
    setIsLoading(true);
    form.reset();

    try {
      // 1. Create User Message
      const userMsg = await entities.chat_message.Create({
        chat_session_id: sessionData.id,
        sender_type: 'user',
        role: 'user',
        content_text: userPrompt,
        content: userPrompt,
        created_at: new Date(),
        updated_at: new Date()
      });

      if (userMsg) setMessages(prev => [...prev, userMsg]);

      // 2. Track AI Job
      await entities.ai_job.Create({
        user_id: sessionData.user_id,
        feature_type: 'chat_completion',
        status: 'completed',
        model_name: MODEL_NAME,
        input_prompt: userPrompt,
        cost_credits: 0,
        created_at: new Date(),
        updated_at: new Date()
      });

      // 3. Simulate Response
      await new Promise(r => setTimeout(r, 1200));
      const aiResponseText = `System Debug Response:\nReceived prompt: "${userPrompt}"\nStatus: Operational\nNode: Global-Admin-Bypass`;
      
      const aiMsg = await entities.chat_message.Create({
        chat_session_id: sessionData.id,
        sender_type: 'assistant',
        role: 'assistant',
        content_text: aiResponseText,
        content: aiResponseText,
        created_at: new Date(),
        updated_at: new Date()
      });

      if (aiMsg) setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      toast.error('Connection interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-4rem)] flex justify-center py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
          
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6 hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Terminal size={18} /> Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Model</span>
                  <Badge variant="secondary">GPT-4o</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Mode</span>
                  <span className="text-emerald-600 font-medium">Bypass Active</span>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full text-red-500 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset Interface
            </Button>
          </aside>

          {/* Chat Main */}
          <main className="lg:col-span-9 flex flex-col bg-white rounded-2xl border shadow-sm overflow-hidden">
            <header className="p-4 border-b flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Sparkles size={20} />
                </div>
                <h2 className="font-bold text-slate-800">Admin Global Debugger</h2>
              </div>
              <Badge variant={isLoading ? "default" : "outline"} className={isLoading ? "animate-pulse" : ""}>
                {isLoading ? 'Processing...' : 'Ready'}
              </Badge>
            </header>

            <ScrollArea className="flex-1 p-6 bg-slate-50/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border rounded-tl-none text-slate-800'}`}>
                      {msg.content_text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
                    <Bot size={14} className="text-slate-400" />
                  </div>
                  <div className="bg-white border p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </ScrollArea>

            <footer className="p-4 border-t bg-white">
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-end gap-3 max-w-4xl mx-auto"
              >
                <Textarea 
                  {...form.register('prompt')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  placeholder="Ask the system anything..."
                  className="min-h-[50px] max-h-[200px] bg-slate-50 border-none focus-visible:ring-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !form.watch('prompt')}
                  className="h-[50px] w-[50px] rounded-full shrink-0 shadow-lg"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                </Button>
              </form>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}