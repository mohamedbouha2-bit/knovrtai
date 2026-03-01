'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useForm, useFieldArray, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle, RefreshCw, ServerCog, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Zod Schemas ---

const featureItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_enabled: z.boolean(),
  max_requests_per_user_daily: z.preprocess(
    (val) => (val === '' || val === undefined ? null : Number(val)),
    z.number().min(0).nullable()
  ),
  required_subscription_tier: z.enum(['lite', 'standard', 'pro']).nullable().optional()
});

const formSchema = z.object({
  features: z.array(featureItemSchema)
});

type FormValues = z.infer<typeof formSchema>;

export default function AIAutomationAdminPage_FeatureControlPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: { features: [] }
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'features'
  });

  // --- Data Fetching ---

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const session = getBackendAdminSession();
        if (!session?.token) {
          setFetchError('Unauthorized: Please log in as an administrator.');
          return;
        }

        const response = await entities.ai_feature_toggle.GetAll();
        
        if (response) {
          // استخدام replace لتحديث قائمة الحقول في useFieldArray
          replace(response.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            is_enabled: item.is_enabled,
            max_requests_per_user_daily: item.max_requests_per_user_daily ?? null,
            required_subscription_tier: (item.required_subscription_tier as any) ?? 'lite'
          })));
        }
      } catch (err) {
        setFetchError('System Error: Unable to retrieve configuration.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [replace]);

  // --- Actions ---

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      try {
        const session = getBackendAdminSession();
        if (!session?.token) {
          toast.error('Session expired.');
          return;
        }

        // تحديث كل ميزة تم تعديلها
        const updatePromises = data.features.map((feature) => {
          return entities.ai_feature_toggle.Update({
            where: { id: feature.id },
            data: {
              name: feature.name,
              description: feature.description,
              is_enabled: feature.is_enabled,
              max_requests_per_user_daily: feature.max_requests_per_user_daily,
              required_subscription_tier: feature.required_subscription_tier,
              updated_at: new Date(),
            }
          });
        });

        await Promise.all(updatePromises);
        toast.success('Configuration saved successfully.');
        
        // إعادة تعيين حالة النموذج ليعرف أن البيانات لم تعد "Dirty"
        form.reset(data);
      } catch (error) {
        toast.error('Failed to save changes.');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-8">
      <div className="container mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <ServerCog className="h-8 w-8 text-blue-600" />
                  AI Control Panel
                </h1>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()} 
                  disabled={!form.formState.isDirty || isSaving}
                >
                  Reset
                </Button>
                <Button 
                  type="submit" 
                  disabled={!form.formState.isDirty || isSaving}
                  className="bg-blue-600"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>

            <Card className="bg-white">
              <CardHeader className="border-b bg-slate-50/50">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase">
                  <div className="col-span-5">Feature</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-3">Daily Limit</div>
                  <div className="col-span-2">Tier</div>
                </div>
              </CardHeader>
              
              <div className="divide-y">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-6 p-6 items-center">
                    {/* Feature Info */}
                    <div className="col-span-5">
                      <p className="font-semibold text-sm">{field.name}</p>
                      <p className="text-xs text-slate-500">{field.description}</p>
                    </div>

                    {/* Toggle Status */}
                    <div className="col-span-2 flex justify-center">
                      <FormField
                        control={form.control}
                        name={`features.${index}.is_enabled`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormControl>
                              <Switch 
                                checked={f.value} 
                                onCheckedChange={f.onChange} 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Rate Limit */}
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name={`features.${index}.max_requests_per_user_daily`}
                        render={({ field: f }) => (
                          <FormItem>
                            <div className="relative">
                              <Input 
                                type="number" 
                                value={f.value ?? ''} 
                                onChange={(e) => f.onChange(e.target.value)}
                                className="pr-16"
                              />
                              <span className="absolute right-3 top-2 text-xs text-slate-400">req/day</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Tier Select */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`features.${index}.required_subscription_tier`}
                        render={({ field: f }) => (
                          <FormItem>
                            <Select onValueChange={f.onChange} value={f.value ?? 'lite'}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lite">Lite</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}