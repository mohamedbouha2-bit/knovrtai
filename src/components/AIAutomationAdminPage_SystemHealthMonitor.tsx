'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Server, Zap, Clock, CheckCircle2, AlertTriangle, RefreshCcw, Coins, BarChart3, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { entities as Entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Types ---

interface HealthMetrics {
  totalJobs: number;
  activeJobs: number;
  successRate: number;
  avgResponseTime: number;
  totalCredits: number;
  errorRate: number;
  status: 'operational' | 'degraded' | 'maintenance';
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  loading: boolean;
  onRefresh?: () => void;
  className?: string;
  statusColor?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

// --- Helper Components ---

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  icon,
  loading,
  onRefresh,
  className,
  statusColor = 'default'
}) => {
  return (
    <Card className={cn("relative overflow-hidden transition-all duration-200 hover:shadow-md border-slate-200 bg-white group", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          statusColor === 'default' && "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
          statusColor === 'success' && "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200",
          statusColor === 'warning' && "bg-amber-100 text-amber-600 group-hover:bg-amber-200",
          statusColor === 'error' && "bg-rose-100 text-rose-600 group-hover:bg-rose-200",
          statusColor === 'info' && "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
            {subValue && <p className="text-xs text-slate-500 font-medium">{subValue}</p>}
          </div>
        )}
        
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-blue-600" 
            onClick={(e) => { e.stopPropagation(); onRefresh(); }} 
            disabled={loading}
          >
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        )}
      </CardContent>
      <div className={cn(
        "absolute bottom-0 left-0 w-full h-1",
        statusColor === 'success' && "bg-emerald-500",
        statusColor === 'warning' && "bg-amber-500",
        statusColor === 'error' && "bg-rose-500",
        statusColor === 'info' && "bg-blue-500",
        statusColor === 'default' && "bg-slate-300"
      )} />
    </Card>
  );
};

// --- Main Component ---

export default function AIAutomationAdminPage_SystemHealthMonitor() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        toast.error('Unauthorized access');
        return;
      }

      const allJobs = await Entities.ai_job.GetAll({});
      
      if (!allJobs || allJobs.length === 0) {
        setMetrics({
          totalJobs: 0, activeJobs: 0, successRate: 0, 
          avgResponseTime: 0, totalCredits: 0, errorRate: 0, status: 'maintenance'
        });
        return;
      }

      // تحسين الأداء: حساب كل شيء في دورة واحدة فقط
      const stats = allJobs.reduce((acc, job) => {
        acc.total++;
        if (job.status === 'pending' || job.status === 'running') acc.active++;
        if (job.status === 'completed') {
          acc.success++;
          acc.totalTime += (job.response_time_ms || 0);
        }
        if (job.status === 'failed') acc.failed++;
        acc.credits += (job.cost_credits || 0);
        return acc;
      }, { total: 0, active: 0, success: 0, failed: 0, totalTime: 0, credits: 0 });

      const successRate = (stats.success / stats.total) * 100;
      const errorRate = (stats.failed / stats.total) * 100;
      const avgResponseTime = stats.success > 0 ? stats.totalTime / stats.success : 0;

      let systemStatus: HealthMetrics['status'] = 'operational';
      if (errorRate > 10) systemStatus = 'degraded';
      if (errorRate > 50) systemStatus = 'maintenance';

      setMetrics({
        totalJobs: stats.total,
        activeJobs: stats.active,
        successRate,
        avgResponseTime,
        totalCredits: stats.credits,
        errorRate,
        status: systemStatus
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Metrics error:", error);
      toast.error('Failed to update system metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return (
    <section className="w-full bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-6 py-10 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-6 w-6 text-blue-600" />
              مراقب صحة النظام
            </h2>
            <p className="text-slate-500 mt-1">مقاييس الأداء الفعلي لخدمات الذكاء الاصطناعي.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-slate-400 hidden sm:inline-block">
               آخر تحديث: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
             </span>
             <Button onClick={fetchMetrics} disabled={isLoading} variant="outline" className="bg-white">
               <RefreshCcw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
               تحديث البيانات
             </Button>
          </div>
        </div>

        {/* Alerts */}
        {metrics && metrics.status !== 'operational' && (
          <div className={cn(
            "mb-8 p-4 rounded-lg border flex items-center gap-3",
            metrics.status === 'degraded' ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-rose-50 border-rose-200 text-rose-800"
          )}>
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">
              تنبيه: {metrics.status === 'degraded' ? 'يوجد بطء أو زيادة في الأخطاء.' : 'فشل حرج في النظام، يتطلب تدخل فوري.'}
            </span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="حالة النظام" 
            value={metrics?.status === 'operational' ? 'يعمل بكفاءة' : 'متراجع'} 
            icon={<Activity className="h-5 w-5" />} 
            loading={isLoading} 
            statusColor={metrics?.status === 'operational' ? 'success' : 'error'} 
          />
          <MetricCard 
            title="المهام النشطة" 
            value={metrics?.activeJobs ?? 0} 
            icon={<Cpu className="h-5 w-5" />} 
            loading={isLoading} 
            statusColor="info" 
          />
          <MetricCard 
            title="معدل النجاح" 
            value={`${metrics?.successRate.toFixed(1) ?? 0}%`} 
            icon={<CheckCircle2 className="h-5 w-5" />} 
            loading={isLoading} 
            statusColor={(metrics?.successRate ?? 0) > 90 ? 'success' : 'warning'} 
          />
          <MetricCard 
            title="الرصيد المستهلك" 
            value={(metrics?.totalCredits ?? 0).toLocaleString()} 
            icon={<Coins className="h-5 w-5" />} 
            loading={isLoading} 
            statusColor="default" 
          />
        </div>
      </div>
    </section>
  );
}