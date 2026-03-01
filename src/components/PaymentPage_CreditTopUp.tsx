'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import { CreditCard, Check, Zap, Loader2, ShieldCheck } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// Types & Entities
import type { credit_package, payment_gateway } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession } from '@/tools/SessionContext';

const PRESET_PACKAGES: Partial<credit_package>[] = [
  { id: 1, credit_amount: 100, price: 10, currency: 'usd', discount_label: null },
  { id: 2, credit_amount: 500, price: 45, currency: 'usd', discount_label: '10% OFF' },
  { id: 3, credit_amount: 1000, price: 80, currency: 'usd', discount_label: '20% OFF' },
  { id: 4, credit_amount: 5000, price: 350, currency: 'usd', discount_label: 'BEST VALUE' }
];

const PaymentPage_CreditTopUp = () => {
  const [packages, setPackages] = useState<Partial<credit_package>[]>(PRESET_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Partial<credit_package>>(PRESET_PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<payment_gateway>('stripe');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const priceRef = useRef<HTMLHeadingElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  // جلب الباقات من قاعدة البيانات
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const dbPackages = await entities.credit_package.GetAll({ is_active: true });
        if (dbPackages && dbPackages.length > 0) {
          const sorted = [...dbPackages].sort((a, b) => (a.price || 0) - (b.price || 0));
          setPackages(sorted);
          setSelectedPackage(sorted[1] || sorted[0]);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        toast.error('فشل تحميل باقات الرصيد');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // أنيميشن GSAP عند تغيير الباقة المختارة
  useEffect(() => {
    if (priceRef.current) {
      gsap.fromTo(priceRef.current, 
        { scale: 1.2, color: '#2563eb' }, 
        { scale: 1, color: '#0f172a', duration: 0.4, ease: 'power2.out' }
      );
    }
    if (creditsRef.current) {
      gsap.fromTo(creditsRef.current, 
        { y: 10, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [selectedPackage]);

  const handleSliderChange = (value: number[]) => {
    const amount = value[0];
    // العثور على أقرب باقة متوفرة للقيمة التي اختارها المستخدم في السلايدر
    const closest = packages.reduce((prev, curr) => {
      return Math.abs((curr.credit_amount || 0) - amount) < Math.abs((prev.credit_amount || 0) - amount) ? curr : prev;
    });
    setSelectedPackage(closest);
  };

  const handleConfirmPayment = async () => {
    const session = getFrontendUserSession();
    if (!session?.userId) {
      toast.error('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. إنشاء الطلب
      const newOrder = await entities.credit_order.Create({
        user_id: parseInt(session.userId),
        credit_package_id: selectedPackage.id!,
        total_amount: selectedPackage.price!,
        currency: selectedPackage.currency || 'usd',
        payment_method: paymentMethod,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      });

      if (!newOrder) throw new Error('Order creation failed');

      // 2. محاكاة انتظار بوابة الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. تحديث حالة الطلب (هذا الجزء يفضل أن يكون في Backend Webhook للأمان القصوى)
      await entities.credit_order.Update({
        where: { id: newOrder.id },
        data: { status: 'success', updated_at: new Date() }
      });

      // 4. تحديث الرصيد
      const wallet = (await entities.user_wallet.GetAll({ user_id: { equals: parseInt(session.userId) } }))[0];
      
      if (wallet) {
        await entities.user_wallet.Update({
          where: { id: wallet.id },
          data: { 
            current_credit_balance: wallet.current_credit_balance + (selectedPackage.credit_amount || 0),
            updated_at: new Date() 
          }
        });
      } else {
        await entities.user_wallet.Create({
          user_id: parseInt(session.userId),
          current_credit_balance: selectedPackage.credit_amount || 0,
          currency_code: 'usd',
          created_at: new Date(),
          updated_at: new Date()
        });
      }

      toast.success(`تمت إضافة ${selectedPackage.credit_amount} رصيد بنجاح!`);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء معالجة الدفع');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9fafb] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">شحن الرصيد</Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">اختر الباقة المناسبة لك</h1>
          <p className="text-slate-500 max-w-xl mx-auto">ادفع مقابل ما تستخدمه فقط. لا توجد اشتراكات شهرية إجبارية.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* الجانب الأيسر: اختيار الباقات */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative cursor-pointer rounded-xl p-5 border-2 transition-all ${
                    selectedPackage.id === pkg.id 
                    ? 'border-blue-600 bg-blue-50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  {pkg.discount_label && (
                    <span className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {pkg.discount_label}
                    </span>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-2 rounded-lg ${selectedPackage.id === pkg.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Zap size={20} />
                    </div>
                    {selectedPackage.id === pkg.id && <Check className="text-blue-600" size={20} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{pkg.credit_amount?.toLocaleString()} رصيد</h3>
                  <p className="text-sm text-slate-500">تقريباً {(pkg.credit_amount! / 10).toFixed(0)} مقال ذكاء اصطناعي</p>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تحديد الكمية بدقة</CardTitle>
                <CardDescription>اسحب المؤشر لاختيار الباقة التي تناسب احتياجك</CardDescription>
              </CardHeader>
              <CardContent className="py-8">
                <Slider 
                  value={[selectedPackage.credit_amount || 0]} 
                  min={packages[0]?.credit_amount || 0} 
                  max={packages[packages.length - 1]?.credit_amount || 5000} 
                  step={100}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                  <span>بداية</span>
                  <span>احترافي</span>
                  <span>شركات</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الجانب الأيمن: ملخص الطلب */}
          <div className="lg:col-span-5">
            <Card className="sticky top-8 border-slate-200 shadow-xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">الإجمالي المستحق</span>
                  <h2 ref={priceRef} className="text-5xl font-black text-slate-900">
                    {formatCurrency(selectedPackage.price || 0, selectedPackage.currency)}
                  </h2>
                  <div ref={creditsRef} className="mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    + {selectedPackage.credit_amount?.toLocaleString()} رصيد
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold">طريقة الدفع</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as payment_gateway)} className="grid grid-cols-2 gap-3">
                    <Label htmlFor="stripe" className="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 [&:has([data-state=checked])]:border-blue-600">
                      <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
                      <CreditCard className="mb-2" />
                      <span className="text-xs font-bold">بطاقة بنكية</span>
                    </Label>
                    <Label htmlFor="paypal" className="flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 [&:has([data-state=checked])]:border-blue-600">
                      <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                      <span className="mb-2 font-black text-blue-800 italic">PayPal</span>
                      <span className="text-xs font-bold">بيبال</span>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 bg-slate-50 p-6">
                <Button 
                  className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  إتمام الشراء الآن
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                  <ShieldCheck size={14} />
                  <span>دفع آمن ومشفر بنسبة 100%</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* نافذة التأكيد */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>تأكيد عملية الشراء</DialogTitle>
            <DialogDescription>
              أنت على وشك شراء <b>{selectedPackage.credit_amount} رصيد</b> مقابل <b>{formatCurrency(selectedPackage.price || 0, selectedPackage.currency)}</b>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>إلغاء</Button>
            <Button className="bg-blue-600" onClick={handleConfirmPayment} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="animate-spin mr-2" size={18} /> : 'تأكيد الدفع'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPage_CreditTopUp;