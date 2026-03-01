'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip, Send, X, FileText, Image as ImageIcon, Loader2, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession } from '@/tools/SessionContext';
import type { user, chat_message } from '@/server/entities.type';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface StagedAttachment {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'file';
}

interface InputComposerProps {
  className?: string;
  chatSessionId?: number;
  onMessageSent?: (message: chat_message) => void;
}

// ----------------------------------------------------------------------
// Sub-component: Attachment Preview
// ----------------------------------------------------------------------

const AttachmentPreview = ({
  attachment,
  onRemove
}: {
  attachment: StagedAttachment;
  onRemove: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  return (
    <div ref={ref} className="relative group flex items-center justify-center w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mr-3 shrink-0">
      {attachment.type === 'image' ? (
        <img src={attachment.previewUrl} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <FileText className="w-8 h-8 text-slate-400" />
      )}
      
      <button 
        onClick={() => onRemove(attachment.id)} 
        className="absolute top-0.5 right-0.5 p-0.5 bg-slate-900/50 hover:bg-slate-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
        type="button"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function GeminiChatWorkspacePage_InputComposer({
  className,
  chatSessionId = 1,
  onMessageSent
}: InputComposerProps) {
  const router = useRouter();

  // -- State --
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [stagedAttachments, setStagedAttachments] = useState<StagedAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // -- Refs --
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch User Data
  useEffect(() => {
    const initUser = async () => {
      try {
        setIsLoadingUser(true);
        const session = getFrontendUserSession();
        if (!session?.userId) return;

        const userEntity = await entities.user.Get({ id: parseInt(session.userId, 10) });
        if (userEntity) setCurrentUser(userEntity);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    initUser();
  }, []);

  // 2. تنظيف الروابط المؤقتة (Memory Leak Cleanup)
  useEffect(() => {
    return () => {
      stagedAttachments.forEach(att => URL.revokeObjectURL(att.previewUrl));
    };
  }, [stagedAttachments]);

  // 3. Auto-resize Textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  // -- Handlers --

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: StagedAttachment[] = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file'
      }));
      setStagedAttachments(prev => [...prev, ...newAttachments]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setStagedAttachments(prev => {
      const filtered = prev.filter(att => att.id === id);
      filtered.forEach(att => URL.revokeObjectURL(att.previewUrl)); // تنظيف الرابط عند الحذف
      return prev.filter(att => att.id !== id);
    });
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && stagedAttachments.length === 0) || isSending || isLoadingUser) return;
    if (!currentUser) {
      toast.error('يرجى تسجيل الدخول مجدداً.');
      return;
    }

    const MESSAGE_COST = 1;
    if (currentUser.usage_credits_remaining < MESSAGE_COST) {
      toast.error('رصيدك غير كافٍ.');
      setTimeout(() => router.push('/paymentpage'), 1000);
      return;
    }

    setIsSending(true);
    try {
      // تحديث الرصيد أولاً
      const updatedUser = await entities.user.Update({
        where: { id: currentUser.id },
        data: {
          usage_credits_remaining: currentUser.usage_credits_remaining - MESSAGE_COST,
          total_credits_used: currentUser.total_credits_used + MESSAGE_COST
        } as any
      });
      if (!updatedUser) throw new Error('Credit update failed');
      setCurrentUser(updatedUser);

      // إنشاء الرسالة
      const newMessage = await entities.chat_message.Create({
        chat_session_id: chatSessionId,
        sender_type: 'user',
        content_text: inputValue.trim(),
        created_at: new Date(),
        updated_at: new Date()
      } as any);

      if (!newMessage) throw new Error('Message creation failed');

      // معالجة المرفقات
      if (stagedAttachments.length > 0) {
        await Promise.all(stagedAttachments.map(att => 
          entities.message_attachment.Create({
            chat_message_id: newMessage.id,
            file_name: att.file.name,
            file_size: att.file.size,
            mime_type: att.file.type,
            file_url: `https://storage.mock/${att.id}`, // استبدله برابط الرفع الحقيقي
            created_at: new Date(),
            updated_at: new Date()
          } as any)
        ));
      }

      toast.success('تم الإرسال');
      setInputValue('');
      setStagedAttachments([]);
      if (onMessageSent) onMessageSent(newMessage);
    } catch (error) {
      toast.error('فشل الإرسال');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className={cn("fixed bottom-0 left-0 w-full z-40 bg-gradient-to-t from-white via-white to-white/0 pt-10 pb-6", className)}>
      <div className="container mx-auto max-w-4xl px-4">
        
        {/* Credits Status */}
        {currentUser && (
          <div className="flex justify-end mb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    onClick={() => currentUser.usage_credits_remaining < 5 && router.push('/paymentpage')}
                    className={cn(
                      "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all",
                      currentUser.usage_credits_remaining > 5 ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700 animate-pulse"
                    )}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{currentUser.usage_credits_remaining} رصيد متبقي</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>كل رسالة تكلف 1 رصيد. انقر للترقية.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Input Box */}
        <div className="relative flex flex-col gap-2 p-2 bg-white border border-slate-200 rounded-2xl shadow-lg focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          
          {stagedAttachments.length > 0 && (
            <div className="flex px-3 pt-3 pb-1 overflow-x-auto">
              {stagedAttachments.map(att => (
                <AttachmentPreview key={att.id} attachment={att} onRemove={removeAttachment} />
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="اسأل أي شيء..."
            disabled={isSending}
            className="w-full resize-none bg-transparent px-4 py-3 min-h-[52px] focus:outline-none text-slate-900"
          />

          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center gap-1">
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5 text-slate-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-5 h-5 text-slate-500" />
              </Button>
              <div className="h-4 w-px bg-slate-200 mx-2" />
              <Button variant="ghost" size="sm" className="text-slate-500 gap-2 px-3 text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Enhanced</span>
              </Button>
            </div>

            <Button 
              onClick={handleSendMessage} 
              disabled={(!inputValue && stagedAttachments.length === 0) || isSending}
              className={cn(
                "h-10 w-10 p-0 rounded-xl transition-all",
                !inputValue && stagedAttachments.length === 0 ? "bg-slate-100 text-slate-300" : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              )}
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}