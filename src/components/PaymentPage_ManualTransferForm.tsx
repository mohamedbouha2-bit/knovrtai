'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import { Upload, Check, Copy, FileText, AlertCircle, Building2, ArrowRight, Loader2 } from 'lucide-react';

// Entity & Session Imports
import type { manual_payment_request_without_PKs, currency_code } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession } from '@/tools/SessionContext';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardWithNoPadding } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// --- Zod Schema ---
const manualTransferSchema = z.object({
  sender_name: z.string().min(2, 'اسم المرسل مطلوب'),
  transaction_reference_id: z.string().min(4, 'رقم المرجع البنكي مطلوب'),
  transfer_amount: z.coerce.number().positive('يجب أن يكون المبلغ أكبر من 0'),
  currency: z.enum(['usd', 'eur', 'gbp', 'cny'] as const)
});

type FormData = z.infer<typeof manualTransferSchema>;

export default function PaymentPage_ManualTransferForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const bankCardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(manualTransferSchema),
    defaultValues: {
      currency: 'usd'
    }
  });

  const currentCurrency = watch('currency');

  // --- Animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.fromTo(bankCardRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0 })
        .fromTo(formContentRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, '-=0.6');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // --- Handlers ---
  const handleFileSelection = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الملف يتجاوز 5 ميجابايت.');
      return;
    }
    setSelectedFile(file);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 1.5,
      ease: "none",
      onUpdate: () => {
        const p = Math.floor(obj.val);
        setUploadProgress(p);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${p}%`;
        }
      },
      onComplete: () => {
        setIsUploading(false);
        toast.success('تم رفع الإيصال بنجاح');
      }
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} تم نسخه إلى الحافظة`);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedFile) {
      toast.error('يرجى رفع إيصال الدفع');
      return;
    }

    const session = getFrontendUserSession();
    if (!session?.userId) {
      toast.error('يجب تسجيل الدخول لإرسال الطلب');
      return;
    }

    setIsSubmitting(true);
    try {
      // محاكاة رابط الملف المرفوع
      const mockReceiptUrl = `https://storage.platform.com/receipts/${Date.now()}_${selectedFile.name}`;
      
      const payload: manual_payment_request_without_PKs = {
        user_id: Number(session.userId),
        transaction_reference_id: data.transaction_reference_id,
        sender_name: data.sender_name,
        transfer_amount: data.transfer_amount,
        currency: data.currency,
        receipt_image_url: mockReceiptUrl,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = await entities.manual_payment_request.Create(payload);
      if (result) {
        toast.success('تم إرسال الطلب بنجاح. سنقوم بمراجعته قريباً.');
        reset();
        setSelectedFile(null);
        setUploadProgress(0);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال البيانات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f9fafb] relative min-h-screen py-12 px-4" ref={sectionRef}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* الجانب الأيسر: معلومات البنك */}
          <div className="lg:col-span-5 space-y-8" ref={bankCardRef}>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">التحويل البنكي</h1>
              <p className="text-slate-500 text-lg leading-relaxed">
                أرسل الدفعة مباشرة إلى حسابنا البنكي الرسمي، ثم قم برفع الإيصال لتفعيل رصيدك.
              </p>
            </div>

            {/* بطاقة البنك المصممة */}
            <div className="relative overflow-hidden rounded-3xl bg-blue-600 text-white p-8 shadow-2xl group transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8" />
                    <span className="text-xl font-bold italic">Global AI Bank</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">حساب رسمي</Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-[10px] uppercase opacity-60 tracking-widest">اسم المستفيد</Label>
                    <div className="flex items-center justify-between group/row">
                      <p className="text-lg font-mono">AI CONTENT PLATFORM INC.</p>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard('AI CONTENT PLATFORM INC.', 'اسم المستفيد')} className="opacity-0 group-hover/row:opacity-100 hover:bg-white/10 text-white">
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] uppercase opacity-60 tracking-widest">رقم الآيبان (IBAN)</Label>
                    <div className="flex items-center justify-between group/row">
                      <p className="text-xl font-mono tracking-tighter">US89 3704 0044 0532 0130 00</p>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard('US89 3704 0044 0532 0130 00', 'IBAN')} className="opacity-0 group-hover/row:opacity-100 hover:bg-white/10 text-white">
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium">
                هام: يرجى كتابة "كود المرجع" في وصف التحويل لضمان سرعة معالجة الرصيد خلال أقل من 24 ساعة.
              </p>
            </div>
          </div>

          {/* الجانب الأيمن: نموذج الإرسال */}
          <div className="lg:col-span-7" ref={formContentRef}>
            <CardWithNoPadding className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>اسم المرسل</Label>
                    <Input {...register('sender_name')} placeholder="الاسم كما يظهر في التحويل" className="h-12 bg-slate-50 border-slate-200" />
                    {errors.sender_name && <p className="text-xs text-red-500">{errors.sender_name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>رقم العملية (Transaction ID)</Label>
                    <Input {...register('transaction_reference_id')} placeholder="TR-000000" className="h-12 bg-slate-50 border-slate-200" />
                    {errors.transaction_reference_id && <p className="text-xs text-red-500">{errors.transaction_reference_id.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>المبلغ المحول</Label>
                    <div className="relative">
                      <Input type="number" step="0.01" {...register('transfer_amount')} className="h-12 bg-slate-50 pl-16" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currentCurrency.toUpperCase()}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <Select onValueChange={val => setValue('currency', val as currency_code)} defaultValue="usd">
                      <SelectTrigger className="h-12 bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - دولار أمريكي</SelectItem>
                        <SelectItem value="eur">EUR - يورو</SelectItem>
                        <SelectItem value="gbp">GBP - جنيه إسترليني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* منطقة الرفع */}
                <div className="space-y-4">
                  <Label>إيصال الدفع (صورة أو PDF)</Label>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center transition-all ${
                      isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                      disabled={isUploading}
                    />
                    
                    {selectedFile ? (
                      <div className="w-full flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <FileText className="text-blue-600" size={32} />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold truncate">{selectedFile.name}</p>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                        {uploadProgress === 100 && <Check className="text-green-500" />}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto mb-4 text-slate-400" size={40} />
                        <p className="text-sm font-bold">اسحب الملف هنا أو انقر للرفع</p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF (الحد الأقصى 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !selectedFile}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg rounded-2xl shadow-xl shadow-blue-200"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
                  إرسال الطلب للمراجعة
                </Button>
              </form>
            </CardWithNoPadding>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, className, variant }: any) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold ${className}`}>
    {children}
  </span>
);