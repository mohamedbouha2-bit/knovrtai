'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Server, AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { system_status, global_config } from '@/server/entities.type';

// --- Types ---
type DashboardData = {
  systemStatus: system_status | null;
  globalConfig: global_config | null;
};

export default function ProviderEntryPage_GlobalConfigHeader() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    systemStatus: null,
    globalConfig: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMaintenanceToggleOpen, setIsMaintenanceToggleOpen] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Data Fetching (Wrapped in useCallback to prevent re-renders) ---
  const fetchData = useCallback(async (isManual = false) => {
    try {
      const session = getBackendAdminSession();
      if (!session?.token) return;

      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      // Fetching concurrently for better performance
      const [statusList, configList] = await Promise.all([
        entities.system_status.GetAll({}),
        entities.global_config.GetAll({})
      ]);

      setData({
        systemStatus: statusList?.[0] || null,
        globalConfig: configList?.[0] || null
      });

      if (isManual) toast.success('System status updated');
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to sync system status');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleMaintenanceToggle = (checked: boolean) => {
    setPendingMaintenanceState(checked);
    setIsMaintenanceToggleOpen(true);
  };

  const confirmMaintenanceChange = async () => {
    if (!data.globalConfig?.id) return;

    const toastId = toast.loading('Updating system mode...');
    try {
      setIsUpdating(true);
      const updatedConfig = await entities.global_config.Update({
        where: { id: data.globalConfig.id },
        data: {
          ...data.globalConfig,
          is_maintenance_mode: pendingMaintenanceState,
          updated_at: new Date()
        }
      });

      if (updatedConfig) {
        setData(prev => ({ ...prev, globalConfig: updatedConfig }));
        toast.success(pendingMaintenanceState ? 'Maintenance Mode Active' : 'System is Live', { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to change mode', { id: toastId });
    } finally {
      setIsUpdating(false);
      setIsMaintenanceToggleOpen(false);
    }
  };

  // --- Render Helpers ---
  const getHealthTheme = (score: number = 0) => {
    if (score >= 90) return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'bg-emerald-500' };
    if (score >= 70) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'bg-amber-500' };
    return { color: 'text-red-600', bg: 'bg-red-50', border: 'bg-red-500' };
  };

  const theme = getHealthTheme(data.systemStatus?.health_score || 0);

  return (
    <section className="w-full bg-slate-50/50 border-b border-slate-200">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Control Center</h1>
            <p className="text-slate-500 text-sm">Monitor core infrastructure and global traffic gates.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchData(true)} 
            disabled={loading || isRefreshing}
            className="shadow-sm bg-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Status
          </Button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: System Health */}
          <Card className="relative overflow-hidden border-slate-200 shadow-sm">
            <div className={`absolute top-0 left-0 w-1 h-full ${theme.border}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Overall Health</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              {loading ? <HealthSkeleton /> : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-black ${theme.color}`}>{data.systemStatus?.health_score}%</span>
                    <span className="text-xs font-medium text-slate-400 uppercase">Healthy</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={`${theme.bg} ${theme.color} border-none`}>
                      v{data.systemStatus?.current_version || '1.0.0'}
                    </Badge>
                    <Badge variant="outline" className="text-slate-500 bg-slate-100 border-none">
                      {data.systemStatus?.environment_mode || 'Production'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: API Gateway */}
          <Card className="relative overflow-hidden border-slate-200 shadow-sm">
            <div className={`absolute top-0 left-0 w-1 h-full ${data.systemStatus?.api_connection_active ? 'bg-blue-500' : 'bg-red-500'}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">API Gateway</CardTitle>
              <Server className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              {loading ? <HealthSkeleton /> : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-3 w-3">
                      <span className={`animate-ping absolute h-3 w-3 rounded-full opacity-75 ${data.systemStatus?.api_connection_active ? 'bg-blue-400' : 'bg-red-400'}`} />
                      <span className={`relative rounded-full h-3 w-3 ${data.systemStatus?.api_connection_active ? 'bg-blue-600' : 'bg-red-600'}`} />
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                      {data.systemStatus?.api_connection_active ? 'Responsive' : 'Gateway Down'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {data.systemStatus?.api_connection_active 
                      ? 'Global AI providers are connected and processing requests.' 
                      : 'Connection timeout detected. Verify API credentials immediately.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Maintenance Guard */}
          <Card className={`relative overflow-hidden transition-all duration-500 border-slate-200 shadow-sm ${data.globalConfig?.is_maintenance_mode ? 'bg-amber-50/50 ring-1 ring-amber-200' : 'bg-white'}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${data.globalConfig?.is_maintenance_mode ? 'bg-amber-500' : 'bg-slate-200'}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Access Guard</CardTitle>
              {data.globalConfig?.is_maintenance_mode ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : <Zap className="h-4 w-4 text-slate-400" />}
            </CardHeader>
            <CardContent>
              {loading ? <HealthSkeleton /> : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${data.globalConfig?.is_maintenance_mode ? 'text-amber-700' : 'text-slate-900'}`}>
                      {data.globalConfig?.is_maintenance_mode ? 'Maintenance' : 'Public Access'}
                    </span>
                    <Popover open={isMaintenanceToggleOpen} onOpenChange={setIsMaintenanceToggleOpen}>
                      <PopoverTrigger asChild>
                        <div>
                          <Switch 
                            checked={data.globalConfig?.is_maintenance_mode || false} 
                            onCheckedChange={handleMaintenanceToggle} 
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-full h-fit ${pendingMaintenanceState ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {pendingMaintenanceState ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{pendingMaintenanceState ? 'Enable Maintenance Mode?' : 'Restore Access?'}</p>
                              <p className="text-xs text-slate-500 mt-1">This will affect all current user sessions across the platform.</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsMaintenanceToggleOpen(false)}>Cancel</Button>
                            <Button size="sm" onClick={confirmMaintenanceChange} disabled={isUpdating} className={pendingMaintenanceState ? "bg-amber-600" : "bg-emerald-600"}>
                              Confirm change
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs text-slate-500">
                    Mode: <span className="font-semibold">{data.globalConfig?.is_maintenance_mode ? 'Restricted' : 'Live'}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}

function HealthSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}