'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// مخطط التحقق (Validation Schema) مع رسائل مخصصة
const formSchema = z.object({
  username: z.string()
    .min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" })
    .max(20, { message: "اسم المستخدم طويل جداً" }),
  email: z.string()
    .email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string()
    .min(8, { message: "كلمة المرور يجب أن لا تقل عن 8 خانات" })
    .regex(/[A-Z]/, { message: "يجب أن تحتوي على حرف كبير واحد على الأقل" })
    .regex(/[0-9]/, { message: "يجب أن تحتوي على رقم واحد على الأقل" }),
});

export default function BackendRegisterPage_RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    // محاكاة الاتصال بالسيرفر
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Registration Data:", values);
      toast.success("تم إنشاء حساب المسؤول بنجاح");
      form.reset();
    } catch (error) {
      toast.error("حدث خطأ أثناء التسجيل، حاول مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 transition-all">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تسجيل مسؤول جديد</h2>
          <p className="text-slate-500 text-sm font-medium">قم بإدخال البيانات لإنشاء صلاحية وصول لوحة التحكم</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* حقل اسم المستخدم */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin_dev" 
                      className="rounded-xl border-slate-200 focus:ring-blue-500/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* حقل البريد الإلكتروني */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="admin@konvrt.ai" 
                      className="rounded-xl border-slate-200 focus:ring-blue-500/20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* حقل كلمة المرور */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">كلمة المرور</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        className="rounded-xl border-slate-200 focus:ring-blue-500/20 pr-10"
                        {...field} 
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                "إنشاء الحساب"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}