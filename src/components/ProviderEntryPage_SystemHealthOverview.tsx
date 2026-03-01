'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Cpu, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Data & Logic Imports
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Types ---

interface HealthMetric {
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  lastUpdated: Date | null;
}

// --- Helper Components ---

const StatusIndicator = ({ status }: { status: HealthMetric['status'] }) => {
  const colors = {
    healthy: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    warning: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    critical: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    unknown: 'bg-slate-300'
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${colors[status]}`} />
      <span className="text-xs font-medium capitalize text-slate-600">
        {status === 'healthy' ? 'Operational' : status}
      </span>
    </div>
  );
};

const MetricCard = ({ metric, loading }: { metric: HealthMetric; loading: boolean }) => {
  if (loading) {
    return (
      <Card className="border-slate-200 bg-white/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-100 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
          {metric.label}
        </CardTitle>
        <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
          {metric.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
            <StatusIndicator status={metric.status} />
          </div>
          <div className="flex items-center justify-between mt-2">
             <p className="text-xs text-slate-500 flex items-center gap-1">{metric.subValue}</p>
             {metric.lastUpdated && (
                <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                  {new Date(metric.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Component ---

export default function ProviderEntryPage_SystemHealthOverview() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = useCallback(async (isManual = false) => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        console.warn('No admin session found');
      }

      // 1. Fetch data in parallel
      const [healthRecords, aiProviders] = await Promise.all([
        entities.system_health.GetAll(),
        entities.ai_provider.GetAll({ name: { contains: 'GPT-4o' } })
      ]);

      // 2. Sort and get latest health record
      const latestHealth = healthRecords?.length > 0 
        ? [...healthRecords].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] 
        : null;

      const gpt4Provider = aiProviders?.length > 0 ? aiProviders[0] : null;

      // 3. Construct Metrics
      const newMetrics: HealthMetric[] = [
        {
          label: 'Primary Database',
          status: latestHealth?.database_status === 'connected' ? 'healthy' : 'critical',
          value: latestHealth?.database_status === 'connected' ? 'Connected' : 'Disconnected',
          subValue: 'PostgreSQL Cluster (Primary)',
          icon: <Database className="h-4 w-4" />,
          lastUpdated: latestHealth?.created_at ? new Date(latestHealth.created_at) : new Date()
        },
        {
          label: 'AI Service (GPT-4o)',
          status: gpt4Provider?.connection_status ? 'healthy' : 'warning',
          value: gpt4Provider?.connection_status ? 'Active' : 'Unavailable',
          subValue: latestHealth?.ai_service_latency ? `${latestHealth.ai_service_latency}ms Latency` : 'Latency Unknown',
          icon: <Cpu className="h-4 w-4" />,
          lastUpdated: gpt4Provider?.last_checked_at ? new Date(gpt4Provider.last_checked_at) : new Date()
        },
        {
          label: 'Cache Layer (Redis)',
          status: latestHealth?.redis_status === 'active' ? 'healthy' : 'warning',
          value: latestHealth?.redis_status === 'active' ? 'Running' : 'Degraded',
          subValue: 'Memory Usage: Normal',
          icon: <Zap className="h-4 w-4" />,
          lastUpdated: latestHealth?.created_at ? new Date(latestHealth.created_at) : new Date()
        }
      ];

      setMetrics(newMetrics);
      setLastRefreshed(new Date());
      
      if (isManual) {
        toast.success('System health status updated');
      }
    } catch (err) {
      console.error('Failed to fetch system health:', err);
      toast.error('Could not retrieve system health status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full bg-slate-50/50 border-b border-slate-200">
      <div className="container mx-auto px-8 py-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Infrastructure Health</h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Real-time monitoring of core services including Database, AI Inference Engine, and Caching layers.
            </p>
          </div>
          <div className="flex items-center gap-3">
             {lastRefreshed && (
               <span className="text-xs text-slate-400 hidden md:inline-block">
                 Last checked: {lastRefreshed.toLocaleTimeString()}
               </span>
             )}
            <Button onClick={() => fetchData(true)} disabled={loading} variant="outline" className="bg-white">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading && metrics.length === 0 ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
          ) : (
            metrics.map((metric, idx) => (
              <MetricCard key={idx} loading={loading} metric={metric} />
            ))
          )}
        </div>

        {/* Dynamic Alerts */}
        {!loading && (
          <div className="mt-6">
            {metrics.some(m => m.status === 'critical' || m.status === 'warning') ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900">System Attention Required</h4>
                  <p className="text-xs text-amber-800 mt-1">Infrastructure components are reporting degraded performance.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">All Systems Operational</h4>
                  <p className="text-xs text-emerald-800 mt-1">Ready for provider initialization and feature seeding.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}