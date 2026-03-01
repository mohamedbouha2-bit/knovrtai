'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import { 
  Loader2, User, Mail, Lock, ShieldCheck, 
  Save, AlertCircle, CheckCircle2, Eye, EyeOff 
} from 'lucide-react';

// استيراد الأنواع والأدوات
import type { user, user_without_PKs } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session } from '@/tools/SessionContext';

// مكونات UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------------
// مخطط التحقق (Validation Schema) - مطور لمعالجة النصوص الفارغة
// ----------------------------------------------------------------------
const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal(''))
}).refine(data => {
  // إذا كتب كلمة مرور جديدة، يجب أن يكتب طولها 6 على الأقل
  if (data.newPassword && data.newPassword.length < 6) return false;
  return true;
}, {
  message: "New password must be at least 6 characters.",
  path: ["newPassword"]
}).refine(data => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, {
  message: "Current password is required to set a new password.",
  path: ["currentPassword"]
}).refine(data => {
  if (data.newPassword !== data.confirmPassword) return false;
  return true;
}, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage_AccountProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPass, setShowPass] = useState(false); // ميزة إظهار كلمة المرور
  const [currentUser, setCurrentUser] = useState<user | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // ----------------------------------------------------------------------
  // جلب البيانات (Data Fetching)
  // ----------------------------------------------------------------------
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = getfrontend_user_session();
      
      if (!session?.userId) {
        toast.error("Session not found. Please log in.");
        return;
      }

      const userData = await entities.user.Get({ id: parseInt(session.userId) });
      
      if (userData) {
        setCurrentUser(userData);
        form.reset({
          username: userData.username || '',
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ----------------------------------------------------------------------
  // منطق الحفظ (Submission Logic)
  // ----------------------------------------------------------------------
  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // 1. التحقق من كلمة المرور الحالية (إذا كان المستخدم يحاول تغيير كلمة المرور)
      if (data.newPassword) {
        const hashedInput = CryptoJS.SHA256(data.currentPassword || '').toString();
        if (hashedInput !== currentUser.password) {
          form.setError('currentPassword', { message: 'Incorrect current password.' });
          setIsSaving(false);
          return;
        }
      }

      // 2. تجهيز البيانات للتحديث
      const updatePayload: Partial<user_without_PKs> = {
        username: data.username,
        email: data.email,
        updated_at: new Date()
      };

      if (data.newPassword) {
        updatePayload.password = CryptoJS.SHA256(data.newPassword).toString();
      }

      // 3. التحديث الفعلي
      const result = await entities.user.Update({
        where: { id: currentUser.id },
        data: {
          ...currentUser,
          ...updatePayload
        } as user_without_PKs
      });

      if (result) {
        toast.success("Profile updated successfully", {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
        setCurrentUser(result);
        // تصفير الحقول الحساسة فقط بعد النجاح
        form.reset({
          username: result.username,
          email: result.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error("An error occurred during update.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Syncing profile data...</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-slate-50/50 min-h-screen pb-20">
      <div className="container mx-auto px-4 max-w-2xl pt-10">
        
        {/* Header */}
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500">Update your personal information and security preferences.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Identity Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Basic Information</h2>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-medium">Public Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="username" 
                    {...form.register('username')} 
                    className="pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all h-11"
                  />
                </div>
                {form.formState.errors.username && (
                  <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    {...form.register('email')} 
                    className="pl-10 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-100 h-11"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
                    <AlertCircle size={12} /> {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security Card */}
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="text-amber-600" size={20} /> Password & Security
              </CardTitle>
              <CardDescription>To change your password, provide your current one first.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="currentPassword" 
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register('currentPassword')} 
                    className="pl-10 rounded-xl pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-blue-500"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.currentPassword && (
                  <p className="text-xs text-red-500 font-medium">{form.formState.errors.currentPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    {...form.register('newPassword')} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    {...form.register('confirmPassword')} 
                    className="rounded-xl"
                  />
                </div>
              </div>
              {(form.formState.errors.newPassword || form.formState.errors.confirmPassword) && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.newPassword?.message || form.formState.errors.confirmPassword?.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-xs text-slate-400">
              Last update: {currentUser?.updated_at ? new Date(currentUser.updated_at).toLocaleDateString() : 'Initial'}
            </div>
            <Button 
              type="submit" 
              disabled={isSaving || !form.formState.isDirty} 
              className={cn(
                "min-w-[160px] h-12 rounded-xl font-bold shadow-lg transition-all active:scale-95",
                "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}