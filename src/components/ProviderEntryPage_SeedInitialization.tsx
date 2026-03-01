'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Globe, Cpu, RefreshCw, CheckCircle2, AlertCircle, Play, Trash2, Server } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { global_config, system_status } from '@/server/entities.type';

// --- Interfaces ---

interface SeedModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isInitialized: boolean;
  lastRun?: Date | null;
  itemCount?: number;
  actionType: 'create' | 'reset';
}

export default function ProviderEntryPage_SeedInitialization() {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [modules, setModules] = useState<SeedModule[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<SeedModule | null>(null);

  // Data State
  const [globalConfig, setGlobalConfig] = useState<global_config | null>(null);
  const [aiSeedsCount, setAiSeedsCount] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<system_status | null>(null);

  // --- Data Fetching ---

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session || !session.adminId) return;

      // تنفيذ الطلبات بالتوازي لتحسين السرعة
      const [configs, seedsCount, statuses] = await Promise.all([
        entities.global_config.GetAll({ default_language: { equals: 'en-US' } }),
        entities.ai_feature_seed.Count({}),
        entities.system_status.GetAll({})
      ]);

      setGlobalConfig(configs.length > 0 ? configs[0] : null);
      setAiSeedsCount(seedsCount);
      setSystemStatus(statuses.length > 0 ? statuses[0] : null);
    } catch (error) {
      console.error('Failed to fetch initialization data:', error);
      toast.error('Failed to load system status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Logic: Map Data to Modules ---

  useEffect(() => {
    if (loading) return;
    
    const newModules: SeedModule[] = [
      {
        id: 'global_config',
        title: 'Global Configuration',
        description: 'Initialize default system settings like language, currency, and maintenance flags.',
        icon: Globe,
        isInitialized: !!globalConfig,
        lastRun: globalConfig?.updated_at,
        actionType: !!globalConfig ? 'reset' : 'create'
      },
      {
        id: 'ai_seeds',
        title: 'AI Feature Seeds',
        description: 'Pre-populate the database with essential AI prompts and system messages.',
        icon: Cpu,
        isInitialized: aiSeedsCount > 0,
        itemCount: aiSeedsCount,
        actionType: aiSeedsCount > 0 ? 'reset' : 'create'
      },
      {
        id: 'system_status',
        title: 'System Health Registry',
        description: 'Establish the baseline system record to track versioning and API health.',
        icon: Server,
        isInitialized: !!systemStatus,
        lastRun: systemStatus?.last_seed_date,
        actionType: !!systemStatus ? 'reset' : 'create'
      }
    ];
    setModules(newModules);
  }, [loading, globalConfig, aiSeedsCount, systemStatus]);

  // --- Handlers ---

  const handleActionClick = (module: SeedModule) => {
    setSelectedModule(module);
    setDialogOpen(true);
  };

  const executeAction = async () => {
    if (!selectedModule) return;
    setProcessing(selectedModule.id);
    setDialogOpen(false);

    try {
      const session = getBackendAdminSession();
      if (!session) throw new Error('Unauthorized');

      const now = new Date();

      // 1. Global Config Logic
      if (selectedModule.id === 'global_config') {
        if (selectedModule.actionType === 'create') {
          await entities.global_config.Create({
            default_language: 'en-US',
            currency_code: 'usd',
            is_maintenance_mode: false,
            enable_affiliate_system: true,
            max_login_attempts: 5,
            session_timeout_minutes: 120,
            max_token_limit: 4000,
            allow_new_registrations: true,
            created_at: now,
            updated_at: now
          });
          toast.success('Configuration initialized.');
        } else if (globalConfig) {
          await entities.global_config.Delete({ id: globalConfig.id });
          toast.success('Configuration reset.');
        }
      }

      // 2. AI Seeds Logic
      if (selectedModule.id === 'ai_seeds') {
        if (selectedModule.actionType === 'create') {
          const providers = await entities.ai_provider.GetAll({ name: { contains: 'OpenAI' } });
          const providerId = providers.length > 0 ? providers[0].id : 1;

          await Promise.all([
            entities.ai_feature_seed.Create({
              feature_code: 'CHAT_GPT4o',
              provider_id: providerId,
              model_name: 'gpt-4o',
              name: 'Standard Chat',
              slug: 'standard-chat-gpt4o',
              system_prompt: 'You are a helpful AI assistant.',
              welcome_message: 'How can I help you today?',
              is_active: true,
              created_at: now,
              updated_at: now
            }),
            entities.ai_feature_seed.Create({
              feature_code: 'CONTENT_WRITER',
              provider_id: providerId,
              model_name: 'gpt-4o',
              name: 'Pro Content Writer',
              slug: 'pro-content-writer',
              system_prompt: 'You are an expert content writer.',
              welcome_message: 'What shall we write?',
              is_active: true,
              created_at: now,
              updated_at: now
            })
          ]);
          toast.success('AI Seeds populated.');
        } else {
          const allSeeds = await entities.ai_feature_seed.GetAll({});
          await Promise.all(allSeeds.map(seed => entities.ai_feature_seed.Delete({ id: seed.id })));
          toast.success('AI Seeds cleared.');
        }
      }

      // 3. System Status Logic
      if (selectedModule.id === 'system_status') {
        if (selectedModule.actionType === 'create') {
          await entities.system_status.Create({
            is_initialized: true,
            current_version: '1.0.0',
            environment_mode: 'production',
            health_score: 100,
            api_connection_active: true,
            last_seed_date: now,
            created_at: now,
            updated_at: now
          });
          toast.success('System registry initialized.');
        } else if (systemStatus) {
          await entities.system_status.Delete({ id: systemStatus.id });
          toast.success('System registry cleared.');
        }
      }

      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed.');
    } finally {
      setProcessing(null);
      setSelectedModule(null);
    }
  };

  // --- UI Helpers ---

  if (loading && modules.length === 0) {
    return (
      <div className="w-full bg-slate-50 py-12">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[240px] w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-slate-50/50 min-h-[600px] border-t border-slate-100">
      <div className="container mx-auto px-8 py-16">
        
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">System Initialization</h2>
          </div>
          <p className="text-slate-600">
            Manage the cold-start data for the platform. These modules establish the foundation for system stability.
          </p>
        </div>

        {!globalConfig && !loading && (
          <Alert variant="destructive" className="mb-8 bg-amber-50 border-amber-200 text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="font-semibold">System Uninitialized</AlertTitle>
            <AlertDescription>
              Global configuration is missing. Please initialize it first.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card key={module.id} className="border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex justify-between mb-2">
                  <div className={`p-2 rounded-lg ${module.isInitialized ? 'bg-green-100' : 'bg-slate-100'}`}>
                    <module.icon className={`w-5 h-5 ${module.isInitialized ? 'text-green-600' : 'text-slate-500'}`} />
                  </div>
                  <Badge variant={module.isInitialized ? 'default' : 'secondary'}>
                    {module.isInitialized ? 'Active' : 'Pending'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium">{module.isInitialized ? 'Ready' : 'Not Set'}</span>
                </div>
                {module.itemCount !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Records</span>
                    <span className="font-semibold">{module.itemCount}</span>
                  </div>
                )}
              </CardContent>

              <Separator />

              <CardFooter className="pt-4">
                <Button 
                  className="w-full" 
                  variant={module.actionType === 'reset' ? 'outline' : 'default'}
                  onClick={() => handleActionClick(module)}
                  disabled={!!processing}
                >
                  {processing === module.id ? <RefreshCw className="animate-spin mr-2" /> : null}
                  {module.actionType === 'reset' ? 'Reset Data' : 'Initialize'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedModule?.actionType} data for {selectedModule?.title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={selectedModule?.actionType === 'reset' ? 'destructive' : 'default'} 
              onClick={executeAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}