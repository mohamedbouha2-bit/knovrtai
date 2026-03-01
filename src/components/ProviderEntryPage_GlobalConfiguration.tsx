'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Server, Globe, ShieldAlert, Key, Activity, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { global_config, global_config_without_PKs } from '@/server/entities.type';

// ----------------------------------------------------------------------
// Types & Schema
// ----------------------------------------------------------------------

const configFormSchema = z.object({
  default_language: z.string().min(2, {
    message: 'Language code is required (e.g., en-US)'
  }),
  openai_api_key: z.string().optional().or(z.literal('')),
  stripe_public_key: z.string().optional().or(z.literal('')),
  stripe_secret_key: z.string().optional().or(z.literal('')),
  is_maintenance_mode: z.boolean(),
  enable_affiliate_system: z.boolean(),
  max_login_attempts: z.coerce.number().min(1).max(10),
  session_timeout_minutes: z.coerce.number().min(5).max(1440)
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function ProviderEntryPage_GlobalConfiguration() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [configId, setConfigId] = useState<number | null>(null);

  const [keyStatus, setKeyStatus] = useState({
    openai: false,
    stripePublic: false,
    stripeSecret: false
  });

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      default_language: 'en-US',
      is_maintenance_mode: false,
      enable_affiliate_system: true,
      max_login_attempts: 5,
      session_timeout_minutes: 60,
      openai_api_key: '',
      stripe_public_key: '',
      stripe_secret_key: ''
    }
  });

  // 1. Fetch Configuration on Mount
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const session = getBackendAdminSession();
        if (!session || !session.adminId) {
          toast.error('Unauthorized access.');
          return;
        }

        const configs = await entities.global_config.GetAll();
        let targetConfig: global_config | null = null;

        if (configs && configs.length > 0) {
          targetConfig = configs[0];
        } else {
          // إنشاء إعدادات افتراضية إذا لم تكن موجودة
          targetConfig = await entities.global_config.Create({
            default_language: 'en-US',
            is_maintenance_mode: false,
            enable_affiliate_system: true,
            max_login_attempts: 5,
            session_timeout_minutes: 60,
            openai_api_key: null,
            stripe_public_key: null,
            stripe_secret_key: null,
            currency_code: 'usd',
            max_token_limit: 4096,
            allow_new_registrations: true,
            created_at: new Date(),
            updated_at: new Date()
          });
        }

        if (targetConfig) {
          setConfigId(targetConfig.id);
          form.reset({
            default_language: targetConfig.default_language,
            is_maintenance_mode: targetConfig.is_maintenance_mode,
            enable_affiliate_system: targetConfig.enable_affiliate_system,
            max_login_attempts: targetConfig.max_login_attempts || 5,
            session_timeout_minutes: targetConfig.session_timeout_minutes || 60,
            openai_api_key: '', // نتركها فارغة للعرض
            stripe_public_key: '',
            stripe_secret_key: ''
          });

          setKeyStatus({
            openai: !!targetConfig.openai_api_key,
            stripePublic: !!targetConfig.stripe_public_key,
            stripeSecret: !!targetConfig.stripe_secret_key
          });
        }
      } catch (error) {
        console.error('Failed to load global configuration:', error);
        toast.error('Failed to load configuration.');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [form]);

  // 2. Handle Submit
  const onSubmit = async (values: ConfigFormValues) => {
    if (!configId) return;
    try {
      setSubmitting(true);

      // تحضير البيانات للتحديث الجزئي
      const updateData: Partial<global_config_without_PKs> = {
        default_language: values.default_language,
        is_maintenance_mode: values.is_maintenance_mode,
        enable_affiliate_system: values.enable_affiliate_system,
        max_login_attempts: values.max_login_attempts,
        session_timeout_minutes: values.session_timeout_minutes,
        updated_at: new Date()
      };

      // إضافة المفاتيح فقط إذا تم إدخال قيم جديدة
      if (values.openai_api_key?.trim()) updateData.openai_api_key = values.openai_api_key;
      if (values.stripe_public_key?.trim()) updateData.stripe_public_key = values.stripe_public_key;
      if (values.stripe_secret_key?.trim()) updateData.stripe_secret_key = values.stripe_secret_key;

      const result = await entities.global_config.Update({
        where: { id: configId },
        data: updateData as global_config_without_PKs 
      });

      if (result) {
        toast.success('System configuration updated successfully.');
        
        // تحديث حالة المفاتيح في الواجهة
        setKeyStatus(prev => ({
          openai: values.openai_api_key ? true : prev.openai,
          stripePublic: values.stripe_public_key ? true : prev.stripePublic,
          stripeSecret: values.stripe_secret_key ? true : prev.stripeSecret
        }));

        // تفريغ حقول المفاتيح بعد الحفظ
        form.setValue('openai_api_key', '');
        form.setValue('stripe_public_key', '');
        form.setValue('stripe_secret_key', '');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to save configuration.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="w-full bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-8 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-8 w-8 text-primary" />
              Global Configuration
            </h1>
            <p className="text-base text-slate-500 mt-1">
              Manage system-wide runtime parameters and API credentials.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {form.watch('is_maintenance_mode') && (
              <Badge variant="destructive" className="animate-pulse px-3 py-1">
                <ShieldAlert className="w-3 h-3 mr-1" />
                Maintenance Mode Active
              </Badge>
            )}
            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
              <Activity className="w-3 h-3 mr-1 text-emerald-500" />
              System Online
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Key className="w-5 h-5 text-indigo-500" />
                      API Key Management
                    </CardTitle>
                    <CardDescription>
                      Sensitive keys are encrypted at rest.
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <FormField
                      control={form.control}
                      name="openai_api_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <span>OpenAI API Key</span>
                            <KeyBadge active={keyStatus.openai} />
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={keyStatus.openai ? '••••••••' : 'sk-...'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stripe_public_key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between">
                            <span>Stripe Public Key</span>
                            <KeyBadge active={keyStatus.stripePublic} isOptional />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={keyStatus.stripePublic ? 'pk_live_••••' : 'pk_live_...'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stripe_secret_key"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex justify-between">
                            <span>Stripe Secret Key</span>
                            <KeyBadge active={keyStatus.stripeSecret} isOptional />
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={keyStatus.stripeSecret ? 'sk_live_••••' : 'sk_live_...'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      Localization & Policies
                    </CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <FormField
                      control={form.control}
                      name="default_language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="en-US">English (US)</SelectItem>
                              <SelectItem value="es-ES">Spanish</SelectItem>
                              <SelectItem value="fr-FR">French</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="max_login_attempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Login Attempts</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card className="border-l-4 border-l-amber-400 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Operations Mode</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="is_maintenance_mode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-white">
                          <div className="space-y-0.5">
                            <FormLabel>Maintenance Mode</FormLabel>
                            <FormDescription>Lock system access</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enable_affiliate_system"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-white">
                          <div className="space-y-0.5">
                            <FormLabel>Affiliates</FormLabel>
                            <FormDescription>Enable referrals</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12" disabled={submitting}>
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Configuration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}

// مكون فرعي صغير لتقليل تكرار الكود في العناوين
function KeyBadge({ active, isOptional }: { active: boolean; isOptional?: boolean }) {
  if (active) return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">Configured</span>;
  if (isOptional) return <span className="text-[10px] text-slate-400 uppercase">Optional</span>;
  return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase">Missing</span>;
}