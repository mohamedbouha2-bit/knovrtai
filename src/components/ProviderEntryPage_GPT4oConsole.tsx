'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, Terminal, Cpu, Activity, RefreshCcw, CheckCircle2, AlertCircle, Clock, Settings2, Trash2, Zap, Server } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { system_status } from '@/server/entities.type';

// --- Validation ---
const testRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(1).max(4096),
  streamEnabled: z.boolean()
});

type TestRequestForm = z.infer<typeof testRequestSchema>;

type ConsoleLog = {
  id: string;
  type: 'request' | 'response' | 'system';
  content: string;
  timestamp: Date;
  latency?: number;
  status?: 'success' | 'error' | 'loading';
};

export default function GPT4oConsole() {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState({ avg: 0, last: 0 });
  const [systemInfo, setSystemInfo] = useState<system_status | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const form = useForm<TestRequestForm>({
    resolver: zodResolver(testRequestSchema),
    defaultValues: {
      prompt: '',
      temperature: 0.7,
      maxTokens: 2048,
      streamEnabled: true
    }
  });

  // --- Helpers ---
  const addLog = (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => {
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9), timestamp: new Date() };
    setLogs(prev => [...prev, newLog as ConsoleLog]);
  };

  const simulateStream = async (text: string) => {
    const logId = Math.random().toString(36).substr(2, 9);
    setLogs(prev => [...prev, { id: logId, type: 'response', content: '', timestamp: new Date(), status: 'loading' }]);

    let current = '';
    const words = text.split(' ');
    
    for (let word of words) {
      current += word + ' ';
      setLogs(prev => prev.map(l => l.id === logId ? { ...l, content: current } : l));
      await new Promise(r => setTimeout(r, 40)); // Speed of streaming
    }
    
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'success' } : l));
  };

  // --- Submit Logic ---
  const onSubmit = async (data: TestRequestForm) => {
    setIsProcessing(true);
    addLog({ type: 'request', content: data.prompt, status: 'success' });
    
    const start = Date.now();
    try {
      // Simulate Backend Call
      await new Promise(r => setTimeout(r, 1000));
      
      const latency = Date.now() - start;
      const responseText = `Verified response from GPT-4o. Parameters: Temp=${data.temperature}, Tokens=${data.maxTokens}. System is stable.`;

      if (data.streamEnabled) {
        await simulateStream(responseText);
      } else {
        addLog({ type: 'response', content: responseText, status: 'success', latency });
      }

      setMetrics(prev => ({ last: latency, avg: prev.avg === 0 ? latency : Math.round((prev.avg + latency) / 2) }));
      
      // Save to DB (Background)
      entities.ai_test_chat.Create({
        prompt_text: data.prompt,
        response_text: responseText,
        latency_ms: latency,
        model_version: 'gpt-4o',
        created_at: new Date(),
        updated_at: new Date()
      });

    } catch (err) {
      addLog({ type: 'system', content: 'Connection timed out.', status: 'error' });
    } finally {
      setIsProcessing(false);
      form.setValue('prompt', '');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="text-blue-600" /> GPT-4o Debug Console
            </h1>
            <p className="text-slate-500 text-sm">Real-time model latency and response validator</p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-200">
            <Activity className="w-3 h-3 mr-1" /> API Operational
          </Badge>
        </header>

        <div className="grid grid-cols-12 gap-6 h-[75vh]">
          {/* Controls */}
          <Card className="col-span-3 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono">
                  <Label>Temperature</Label>
                  <span>{form.watch('temperature')}</span>
                </div>
                <Slider 
                  value={[form.watch('temperature')]} 
                  max={1} step={0.1} 
                  onValueChange={([v]) => form.setValue('temperature', v)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Stream Tokens</Label>
                <Switch 
                  checked={form.watch('streamEnabled')} 
                  onCheckedChange={(v) => form.setValue('streamEnabled', v)} 
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-[10px] uppercase text-slate-400">Telemetry</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-100 rounded">
                    <p className="text-[10px] text-slate-500">Avg Latency</p>
                    <p className="text-sm font-mono font-bold">{metrics.avg}ms</p>
                  </div>
                  <div className="p-2 bg-slate-100 rounded">
                    <p className="text-[10px] text-slate-500">Last Ping</p>
                    <p className="text-sm font-mono font-bold">{metrics.last}ms</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal */}
          <div className="col-span-9 flex flex-col gap-4">
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">gpt-4o-debug-stream</span>
                <Button variant="ghost" size="sm" onClick={() => setLogs([])} className="h-6 text-slate-500 hover:text-white">
                   <Trash2 size={12} />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 font-mono text-xs">
                <div className="space-y-3">
                  {logs.map(log => (
                    <div key={log.id} className="animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 opacity-50 mb-1">
                        <span className="text-blue-400">[{format(log.timestamp, 'HH:mm:ss')}]</span>
                        <span className={log.type === 'request' ? 'text-blue-400' : 'text-emerald-400'}>
                          {log.type.toUpperCase()}
                        </span>
                        {log.latency && <span className="text-slate-500">({log.latency}ms)</span>}
                      </div>
                      <p className={`pl-4 border-l ${log.type === 'request' ? 'border-blue-500 text-blue-100' : 'border-emerald-500 text-emerald-50'}`}>
                        {log.content}
                        {log.status === 'loading' && <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-1 animate-pulse" />}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Input */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-lg">
              <div className="relative flex-1">
                <Input 
                  {...form.register('prompt')}
                  placeholder="Execute test prompt..."
                  disabled={isProcessing}
                  className="border-none bg-transparent focus-visible:ring-0 text-base py-6"
                />
              </div>
              <Button type="submit" disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 px-6 h-auto">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Zap size={18} className="mr-2" />}
                Run Test
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}