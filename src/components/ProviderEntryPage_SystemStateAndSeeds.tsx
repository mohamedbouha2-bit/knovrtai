'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Server, Database, RotateCcw, AlertTriangle, CheckCircle2, 
  ArrowLeft, Activity, ShieldAlert, Terminal, Loader2, CalendarClock 
} from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Types & Logic
import type { system_status } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

type ActionType = 'seed' | 'reset' | null;

interface SystemState {
  data: system_status | null;
  loading: boolean;
  error: string | null;
}

export default function ProviderEntryPage_SystemStateAndSeeds() {
  const router = useRouter();

  // --- State ---
  const [systemState, setSystemState] = useState<SystemState>({
    data: null,
    loading: true,
    error: null
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Fetch Data Logic ---
  const fetchSystemStatus = useCallback(async () => {
    try {
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        setSystemState(prev => ({ ...prev, loading: false, error: "Unauthorized" }));
        return;
      }

      const statusList = await entities.system_status.GetAll();
      const currentStatus = statusList?.[0] || null;

      setSystemState({
        data: currentStatus,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error("Fetch Error:", err);
      setSystemState(prev => ({ ...prev, loading: false, error: "Load Failed" }));
      toast.error("Failed to retrieve system status.");
    }
  }, []);

  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  // --- Handlers ---
  const handleActionClick = (type: ActionType) => {
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionType) return;
    setIsProcessing(true);

    try {
      const session = getBackendAdminSession();
      if (!session) throw new Error("Session expired");

      if (actionType === 'seed') {
        if (systemState.data?.id) {
          // تحديث الحالة الموجودة
          await entities.system_status.Update({
            where: { id: systemState.data.id },
            data: {
              is_initialized: true,
              last_seed_date: new Date(),
              updated_at: new Date(),
            }
          });
        } else {
          // إنشاء حالة جديدة تماماً
          await entities.system_status.Create({
            is_initialized: true,
            current_version: '1.0.0',
            last_seed_date: new Date(),
            environment_mode: 'production',
            created_at: new Date(),
            updated_at: new Date()
          });
        }
        toast.success("System bootstrapped successfully.");
      } 
      
      else if (actionType === 'reset') {
        if (!systemState.data?.id) throw new Error("No data to reset");
        
        await entities.system_status.Update({
          where: { id: systemState.data.id },
          data: {
            is_initialized: false,
            last_seed_date: null,
            updated_at: new Date()
          }
        });
        toast.success("System reset performed.");
      }

      await fetchSystemStatus(); // تحديث الواجهة بالبيانات الجديدة
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setIsProcessing(false);
      setDialogOpen(false);
      setActionType(null);
    }
  };

  // --- UI Helpers ---
  const renderStatusBadge = () => {
    const isInit = systemState.data?.is_initialized;
    return (
      <Badge className={`${isInit ? "bg-emerald-500" : "bg-amber-500"} text-white border-none gap-2 px-3 py-1`}>
        {isInit ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {isInit ? "System Active" : "Requires Setup"}
      </Badge>
    );
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Control Panel</h1>
            <p className="text-slate-500 text-sm">Manage database initialization and core application state.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admindashboardpage')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Monitor */}
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <CardTitle>System Monitor</CardTitle>
              </div>
              {!systemState.loading && renderStatusBadge()}
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {systemState.loading ? (
                <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100/50 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Software Version</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Terminal className="h-4 w-4 text-slate-400" />
                      <span className="text-lg font-bold">{systemState.data?.current_version || '0.0.0'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-100/50 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Environment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Server className="h-4 w-4 text-slate-400" />
                      <span className="text-lg font-bold capitalize">{systemState.data?.environment_mode || 'development'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-100/50 rounded-xl border border-slate-200/60 md:col-span-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Sync / Seed</span>
                    <div className="flex items-center gap-2 mt-1 text-slate-700">
                      <CalendarClock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {systemState.data?.last_seed_date ? new Date(systemState.data.last_seed_date).toLocaleString() : 'No record found'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-sm border-slate-200 flex flex-col justify-between">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-500" /> Critical Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Button 
                onClick={() => handleActionClick('seed')} 
                disabled={isProcessing} 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Initialize Seeds
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleActionClick('reset')} 
                disabled={isProcessing} 
                className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50"
              >
                <ShieldAlert className="mr-2 h-4 w-4" /> Reset Application
              </Button>
            </CardContent>
            <CardFooter className="py-3 bg-slate-50/50">
              <p className="text-[10px] text-slate-400 text-center w-full uppercase tracking-tighter">Authorized Admin Personnel Only</p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center text-center p-2">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${actionType === 'reset' ? 'bg-red-100' : 'bg-blue-100'}`}>
              {actionType === 'reset' ? <ShieldAlert className="h-7 w-7 text-red-600" /> : <Database className="h-7 w-7 text-blue-600" />}
            </div>
            <DialogTitle className="text-xl">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="mt-2">
              {actionType === 'reset' 
                ? "This will wipe the initialization flag. You will need to re-seed the system to restore functionality."
                : "This will populate the database with essential default records. Existing configurations may be overwritten."}
            </DialogDescription>
          </div>
          <DialogFooter className="flex gap-2 sm:flex-row mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="flex-1">Cancel</Button>
            <Button 
              onClick={handleConfirmAction} 
              disabled={isProcessing}
              className={`flex-1 ${actionType === 'reset' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}