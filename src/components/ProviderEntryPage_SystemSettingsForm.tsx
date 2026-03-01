'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Save, Loader2, Globe, Shield, DollarSign, AlertTriangle, Server, Lock, CreditCard } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

// Logic & Types
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Zod Schema ---
const settingsFormSchema = z.object({
  default_language: z.string().min(2, "Language code is required."),
  currency_code: z.enum(['usd', 'eur', 'gbp', 'cny']),
  enable_affiliate_system: z.boolean().default(false),
  stripe_public_key: z.string().nullable().optional().or(z.literal('')),
  stripe_secret_key: z.string().nullable().optional().or(z.literal('')),
  is_maintenance_mode: z.boolean().default(false),
  max_login_attempts: z.coerce.number().min(1).max(100),
  session_timeout_minutes: z.coerce.number().min(5).max(1440),
  openai_api_key: z.string().nullable().optional().or(z.literal(''))
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function ProviderEntryPage_SystemSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      default_language: 'en-US',
      currency_code: 'usd',
      enable_affiliate_system: false,
      is_maintenance_mode: false,
      max_login_attempts: 5,
      session_timeout_minutes: 60,
      stripe_public_key: '',
      stripe_secret_key: '',
      openai_api_key: ''
    }
  });

  // --- Fetch Data ---
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) return;

      const configs = await entities.global_config.GetAll();
      
      if (configs && configs.length > 0) {
        const data = configs[0];
        setConfigId(data.id);
        
        // Reset form with fetched data, handling nulls to empty strings
        form.reset({
          default_language: data.default_language || 'en-US',
          currency_code: (data.currency_code as any) || 'usd',
          enable_affiliate_system: !!data.enable_affiliate_system,
          is_maintenance_mode: !!data.is_maintenance_mode,
          max_login_attempts: data.max_login_attempts || 5,
          session_timeout_minutes: data.session_timeout_minutes || 60,
          stripe_public_key: data.stripe_public_key || '',
          stripe_secret_key: data.stripe_secret_key || '',
          openai_api_key: data.openai_api_key || ''
        });
      }
    } catch (error) {
      toast.error("Error loading system configuration");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // --- Submit Handler ---
  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        toast.error("Session expired. Please login.");
        return;
      }

      const payload = {
        ...values,
        updated_at: new Date(),
      };

      if (configId) {
        await entities.global_config.Update({
          where: { id: configId },
          data: payload
        });
        toast.success("Settings updated successfully");
      } else {
        const created = await entities.global_config.Create({
          ...payload,
          created_at: new Date()
        });
        if (created) setConfigId(created.id);
        toast.success("Settings initialized successfully");
      }
    } catch (error) {
      toast.error("Failed to save changes");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">System Configuration</h1>
              <p className="text-slate-500 mt-2">Manage global settings, security, and monetization.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Localization */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Globe className="h-5 w-5" />
                    <CardTitle className="text-lg">General</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            <SelectItem value="ar-SA">Arabic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openai_api_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                              type="password" 
                              className="pl-9" 
                              placeholder="sk-..." 
                              {...field} 
                              value={field.value || ''} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card 2: Security */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <Shield className="h-5 w-5" />
                    <CardTitle className="text-lg">Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="is_maintenance_mode"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 bg-slate-50/50">
                        <div className="space-y-0.5">
                          <FormLabel>Maintenance</FormLabel>
                          <FormDescription className="text-xs">Lock platform access</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
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

              {/* Card 3: Payments */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <DollarSign className="h-5 w-5" />
                    <CardTitle className="text-lg">Monetization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="stripe_public_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Stripe Public Key</FormLabel>
                        <Input className="text-xs font-mono" {...field} value={field.value || ''} />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSaving}
                className="rounded-full px-8 shadow-2xl hover:scale-105 transition-transform"
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Configuration
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}