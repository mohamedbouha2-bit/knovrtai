'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Send, Mic, Paperclip, Bot, User, Sparkles, StopCircle, Image as ImageIcon, FileText, MoreVertical, Plus, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session } from '@/tools/SessionContext';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface chat_message {
  id: number;
  sender_type: 'user' | 'ai';
  content_text: string;
  created_at: Date;
  attachment_file_url?: string;
}

interface MessageBubbleProps {
  message: chat_message;
  isLast: boolean;
}

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
  const isUser = message.sender_type === 'user';
  const bubbleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isLast) {
      gsap.fromTo(bubbleRef.current, 
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isLast]);

  return (
    <div ref={bubbleRef} className={cn("flex w-full mb-6 px-4 md:px-0", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[90%] md:max-w-[75%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        <Avatar className="w-8 h-8 shrink-0 border border-slate-200">
          {isUser ? (
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">YOU</AvatarFallback>
          ) : (
            <>
              <AvatarImage src="/images/ai-avatar.png" />
              <AvatarFallback className="bg-blue-600 text-white"><Bot size={16} /></AvatarFallback>
            </>
          )}
        </Avatar>

        <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
              {isUser ? 'User' : 'Assistant'}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className={cn(
            "relative px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all",
            isUser 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
          )}>
            {message.content_text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function IntelligentWorkspace() {
  const [messages, setMessages] = useState<chat_message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي للأسفل عند وصول رسالة جديدة
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userSession = getfrontend_user_session();
    if (!userSession?.userId) {
      toast.error('Authentication required');
      return;
    }

    const newMessage: chat_message = {
      id: Date.now(),
      sender_type: 'user',
      content_text: inputText,
      created_at: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    // محاكاة استجابة الذكاء الاصطناعي (يمكن استبدالها بطلب API حقيقي)
    setTimeout(() => {
      const aiResponse: chat_message = {
        id: Date.now() + 1,
        sender_type: 'ai',
        content_text: "I'm analyzing your request. How else can I assist you today?",
        created_at: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">AI Intelligence Hub</h1>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GPT-4o Engine Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-500" onClick={() => setMessages([])}>
            <Plus size={20} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="gap-2"><Download size={14}/> Export PDF</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-rose-600"><Trash2 size={14}/> Clear History</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 md:px-0">
        <div className="max-w-3xl mx-auto py-10">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 text-blue-600">
                <Bot size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 max-w-sm">Start a conversation with our most capable model to boost your productivity.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble key={msg.id} message={msg} isLast={idx === messages.length - 1} />
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 px-4 md:px-0 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="h-10 w-24 bg-slate-200 rounded-2xl rounded-tl-none" />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Footer */}
      <footer className="p-4 bg-white border-t shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <div className={cn(
            "bg-slate-50 border rounded-2xl p-2 transition-all duration-300",
            isRecording ? "border-rose-300 ring-4 ring-rose-50" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"
          )}>
            <Textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder={isRecording ? "Listening to your voice..." : "Ask me anything..."}
              className="min-h-[44px] w-full bg-transparent border-0 focus-visible:ring-0 resize-none py-3 px-4 text-slate-800 placeholder:text-slate-400"
            />
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2 px-1">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 rounded-lg">
                  <Paperclip size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn("h-8 w-8 rounded-lg transition-colors", isRecording ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "text-slate-500 hover:text-blue-600")}
                >
                  {isRecording ? <StopCircle size={18} className="animate-pulse" /> : <Mic size={18} />}
                </Button>
              </div>

              <Button 
                onClick={handleSendMessage} 
                disabled={!inputText.trim() || isLoading}
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-100 transition-all disabled:opacity-50"
              >
                <Send size={14} className="mr-2" />
                Send
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3">
            AI-generated content may be inaccurate. Review carefully.
          </p>
        </div>
      </footer>
    </div>
  );
}