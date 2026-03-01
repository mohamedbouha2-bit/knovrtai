'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Settings2, Image as ImageIcon, Type, Video, Cpu, Globe, 
  CheckCircle2, RefreshCw, Sparkles, Zap, Languages, Save 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import EditableImg from '@/@base/EditableImg';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session } from '@/tools/SessionContext';

// --- Zod Schema Definition ---
const configSchema = z.object({
  selected_category_tab: z.string().default('text'),
  core_engine_model: z.string().min(1, { message: 'Engine model is required' }),
  text_creativity_level: z.number().min(0).max(100),
  image_generation_style: z.string().optional(),
  video_script_format: z.string().optional(),
  is_cultural_intelligence_enabled: z.boolean(),
  target_language_code: z.string().optional()
});

type ConfigFormValues = z.infer<typeof configSchema>;

const PREVIEW_DATA = {
  text: {
    content: (creativity: number, lang: string) => 
      `Generating content with ${creativity}% creativity in ${lang || 'English'}. The AI is analyzing context for cultural nuances.`
  },
  video: {
    steps: ['Hook: 0-5s', 'Value Prop: 5-15s', 'Feature Demo: 15-45s', 'Call to Action: 45-60s']
  },
  engine: {
    stats: [
      { label: 'Latency', value: '12ms' },
      { label: 'Throughput', value: '450 t/s' },
      { label: 'Reliability', value: '99.9%' }
    ]
  }
};

const AIAutomationSettingsPage_ConfigurationPanel = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, watch, setValue, reset } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      selected_category_tab: 'text',
      core_engine_model: 'gpt-4-turbo',
      text_creativity_level: 50,
      image_generation_style: 'photorealistic',
      video_script_format: 'educational',
      is_cultural_intelligence_enabled: true,
      target_language_code: 'en-US'
    }
  });

  const watchedValues = watch();
  const activeTab = watchedValues.selected_category_tab;

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = getfrontend_user_session();
        if (!session?.userId) return;

        const userId = parseInt(session.userId);
        const prefs = await entities.user_ai_preference.GetAll({
          user_id: { equals: userId }
        });

        if (prefs?.length > 0) {
          reset({
            ...prefs[0],
            selected_category_tab: prefs[0].selected_category_tab || 'text'
          });
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // --- GSAP Animation ---
  useEffect(() => {
    if (previewRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(previewRef.current, 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }, previewRef);
      return () => ctx.revert();
    }
  }, [activeTab]);

  // --- Save Handler ---
  const onSubmit = async (data: ConfigFormValues) => {
    setIsSaving(true);
    try {
      const session = getfrontend_user_session();
      if (!session?.userId) throw new Error('No session');
      
      const userId = parseInt(session.userId);
      const existing = await entities.user_ai_preference.GetAll({
        user_id: { equals: userId }
      });

      if (existing?.length > 0) {
        await entities.user_ai_preference.Update({
          where: { id: existing[0].id },
          data: { ...data, updated_at: new Date() }
        });
      } else {
        await entities.user_ai_preference.Create({
          ...data,
          user_id: userId,
          created_at: new Date()
        });
      }
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <section className="w-full bg-[#f9fafb] min-h-screen py-10">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">AI Configuration Studio</h1>
          <p className="text-slate-500">Fine-tune your AI parameters for optimal generation.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-blue-600" />
                    Parameters
                  </CardTitle>
                  <Controller
                    name="is_cultural_intelligence_enabled"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <Label className="text-xs cursor-pointer">Cultural Mode</Label>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={(v) => setValue('selected_category_tab', v)}>
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="text"><Type className="w-4 h-4 mr-2" /> Text</TabsTrigger>
                    <TabsTrigger value="image"><ImageIcon className="w-4 h-4 mr-2" /> Image</TabsTrigger>
                    <TabsTrigger value="video"><Video className="w-4 h-4 mr-2" /> Video</TabsTrigger>
                    <TabsTrigger value="engine"><Cpu className="w-4 h-4 mr-2" /> Engine</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-6">
                    <div className="space-y-4">
                      <Label>Creativity Level ({watchedValues.text_creativity_level}%)</Label>
                      <Controller
                        name="text_creativity_level"
                        control={control}
                        render={({ field }) => (
                          <Slider 
                            value={[field.value]} 
                            max={100} 
                            step={1} 
                            onValueChange={(vals) => field.onChange(vals[0])} 
                          />
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <Controller
                            name="target_language_code"
                            control={control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en-US">English (US)</SelectItem>
                                  <SelectItem value="ar-SA">Arabic (SA)</SelectItem>
                                  <SelectItem value="fr-FR">French (FR)</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <Label>Generation Style</Label>
                    <Controller
                      name="image_generation_style"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-3">
                          {['photorealistic', 'cyberpunk', 'watercolor', '3d-render'].map((style) => (
                            <div
                              key={style}
                              onClick={() => field.onChange(style)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                                field.value === style ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-white'
                              }`}
                            >
                              <span className="capitalize text-sm">{style.replace('-', ' ')}</span>
                              {field.value === style && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </TabsContent>
                  
                  {/* ... Additional TabsContent for video/engine similarly ... */}

                </Tabs>

                <div className="mt-8 pt-6 border-t flex justify-end">
                  <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-5">
            <Card className="sticky top-8 overflow-hidden border-none shadow-md min-h-[450px]">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
                  <Sparkles className="w-4 h-4 text-purple-500" /> LIVE PREVIEW
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" ref={previewRef}>
                <AnimatePresence mode="wait">
                  {activeTab === 'text' && (
                    <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm leading-relaxed text-slate-600">
                          {PREVIEW_DATA.text.content(watchedValues.text_creativity_level, watchedValues.target_language_code || 'en-US')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'image' && (
                    <motion.div key="image" className="space-y-4">
                      <div className="aspect-video rounded-lg bg-slate-200 animate-pulse flex items-center justify-center">
                         <span className="text-xs text-slate-400 capitalize">{watchedValues.image_generation_style} Preview</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto p-10 space-y-4">
    <Skeleton className="h-12 w-1/3" />
    <div className="grid grid-cols-12 gap-8">
      <Skeleton className="col-span-7 h-[500px]" />
      <Skeleton className="col-span-5 h-[500px]" />
    </div>
  </div>
);

export default AIAutomationSettingsPage_ConfigurationPanel;