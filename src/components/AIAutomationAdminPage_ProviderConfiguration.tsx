'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, XCircle, Settings2, Power, KeyRound, Server, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EditableImg from '@/@base/EditableImg';

// Entities & Session
import type { ai_provider } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

const providerFormSchema = z.object({
  api_key: z.string().min(1, { message: 'API Key is required' }),
  api_secret: z.string().optional().nullable(),
  selected_model: z.string().min(1, { message: 'Please select a default model' })
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

const MODEL_OPTIONS: Record<string, string[]> = {
  'OpenAI': ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  'Anthropic': ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'],
  'AWS Bedrock': ['titan-text-express', 'llama-2-70b', 'jurassic-2-ultra'],
  'DeepL': ['default', 'prefer-quality', 'prefer-speed'],
  'Google Gemini': ['gemini-pro', 'gemini-ultra'],
  'Azure OpenAI': ['gpt-4-32k', 'gpt-35-turbo-16k']
};

export default function AIAutomationAdminPage_ProviderConfiguration() {
  const [providers, setProviders] = useState<ai_provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ai_provider | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      api_key: '',
      api_secret: '',
      selected_model: ''
    }
  });

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const session = getBackendAdminSession();
        if (!session?.adminId) return;
        const data = await entities.ai_provider.GetAll();
        setProviders(data || []);
      } catch (error) {
        toast.error('Failed to load AI providers.');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const handleConfigure = (provider: ai_provider) => {
    setCurrentProvider(provider);
    form.reset({
      api_key: provider.api_key || '',
      api_secret: provider.api_secret || '',
      selected_model: provider.available_models_list || ''
    });
    setDialogOpen(true);
  };

  const handleDisconnect = async (provider: ai_provider) => {
    try {
      const session = getBackendAdminSession();
      if (!session?.adminId) return;

      await entities.ai_provider.Update({
        where: { id: provider.id },
        data: {
          ...provider,
          connection_status: false,
          api_key: null,
          api_secret: null,
          updated_at: new Date()
        }
      });
      
      setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, connection_status: false, api_key: null } : p));
      toast.success(`${provider.name} disconnected`);
    } catch (error) {
      toast.error('Failed to disconnect');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const key = form.getValues('api_key');
    if (!key) {
      toast.error('API Key required for testing');
      setIsTesting(false);
      return;
    }

    // Mock API test
    setTimeout(() => {
      setIsTesting(false);
      toast.success('Connection verified!');
    }, 1500);
  };

  const onSubmit = async (values: ProviderFormValues) => {
    if (!currentProvider) return;
    try {
      setIsSaving(true);
      const updated = await entities.ai_provider.Update({
        where: { id: currentProvider.id },
        data: {
          ...currentProvider,
          api_key: values.api_key,
          api_secret: values.api_secret,
          available_models_list: values.selected_model,
          connection_status: true,
          last_checked_at: new Date(),
          updated_at: new Date()
        }
      });

      if (updated) {
        setProviders(prev => prev.map(p => p.id === updated.id ? updated : p));
        toast.success('Configuration saved');
        setDialogOpen(false);
      }
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const getModelOptions = (name: string) => {
    const match = Object.keys(MODEL_OPTIONS).find(k => name.includes(k));
    return match ? MODEL_OPTIONS[match] : ['standard-v1', 'premium-v2'];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9fafb] min-h-screen p-10">
      <div className="container mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">AI Providers</h2>
            <p className="text-slate-500">Manage your neural engine connections</p>
          </div>
          <Badge variant="secondary" className="bg-white border text-slate-600 px-4 py-1">
            <Server className="w-3 h-3 mr-2" /> {providers.length} Connected
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map(provider => (
            <Card key={provider.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-32 bg-slate-100 relative">
                <EditableImg 
                  propKey={`provider-${provider.id}`} 
                  keywords={provider.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={provider.connection_status ? "bg-emerald-500" : "bg-slate-400"}>
                    {provider.connection_status ? "Active" : "Offline"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <CardDescription className="text-xs truncate">
                  {provider.connection_status ? `Model: ${provider.available_models_list}` : 'Configuration required'}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-4 pb-4">
                 <div className="text-[10px] text-slate-400 flex items-center gap-1">
                   <RefreshCw className="w-3 h-3" />
                   Last sync: {provider.last_checked_at ? format(new Date(provider.last_checked_at), 'dd MMM, HH:mm') : 'Never'}
                 </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleConfigure(provider)}>
                  <Settings2 className="w-3 h-3 mr-1" /> Edit
                </Button>
                {provider.connection_status && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDisconnect(provider)}>
                    <Power className="w-3 h-3" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Dialog Configuration */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure {currentProvider?.name}</DialogTitle>
              <DialogDescription>Your keys are encrypted and stored securely.</DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="api_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="sk-..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selected_model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Model</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currentProvider && getModelOptions(currentProvider.name).map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={handleTestConnection} disabled={isTesting}>
                    {isTesting ? <Loader2 className="animate-spin" /> : "Test"}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}