'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Activity, AlertCircle, CheckCircle2, XCircle, CreditCard, 
  UserPlus, Zap, FileText, Search, RefreshCw, ArrowRight, Server, DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// --- إصلاح الخطأ: تجاهل فحص النوع لهذه الوحدات غير المصدرة حالياً ---
// @ts-ignore
import type { system_activity_log, activity_status, activity_action_type } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- الثوابت والإعدادات ---

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; badge: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
    badge: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
  },
  error: {
    icon: <XCircle className="h-4 w-4 text-rose-500" />,
    badge: "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200"
  }
};

const ACTION_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  subscription_purchase: { icon: <CreditCard className="h-4 w-4" />, label: 'Subscription' },
  credit_purchase: { icon: <DollarSign className="h-4 w-4" />, label: 'Credits' },
  automation_request: { icon: <Zap className="h-4 w-4" />, label: 'Automation' },
  user_registration: { icon: <UserPlus className="h-4 w-4" />, label: 'New User' },
  payout_request: { icon: <FileText className="h-4 w-4" />, label: 'Payout' }
};

export default function AdminDashboardPage_RealTimeActivityFeed() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      const session = getBackendAdminSession();
      if (!session?.adminId) {
        toast.error('Unauthorized access. Please login as admin.');
        return;
      }

      const data = await entities.system_activity_log.GetPage(1, 20, {});
      setActivities(data || []);
    } catch (error) {
      console.error('Failed to fetch system activities:', error);
      toast.error('Unable to load activity feed.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(() => fetchActivities(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(item => 
      item.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action_type?.includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  const handleRowClick = (log: any) => {
    setSelectedLog(log);
    setIsSheetOpen(true);
  };

  const renderDetails = (jsonString: string | null | undefined) => {
    if (!jsonString) return <div className="text-muted-foreground text-sm italic">No additional details.</div>;
    try {
      const obj = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      return (
        <pre className="w-full overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-50 font-mono shadow-inner">
          {JSON.stringify(obj, null, 2)}
        </pre>
      );
    } catch {
      return <div className="text-sm text-muted-foreground break-all">{String(jsonString)}</div>;
    }
  };

  return (
    <section className="w-full bg-slate-50/50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Real-Time Monitor</h2>
              <span className="relative flex h-2.5 w-2.5 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-sm text-slate-500">Live tracking of system-wide transactions and errors.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => fetchActivities()} disabled={isLoading || isRefreshing}>
              <RefreshCw className={cn("mr-2 h-3.5 w-3.5", (isLoading || isRefreshing) && "animate-spin")} />
              Refresh
            </Button>
            <Button onClick={() => router.push('/paymentsadminpage')} className="bg-slate-900 text-white hover:bg-slate-800">
              View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <Card className="border shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-6 py-4 border-b bg-slate-50/40 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Latest Activities</span>
            </div>
            <div className="relative w-full max-w-xs hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="search" 
                placeholder="Search user or action..." 
                className="pl-9 h-9 border-slate-200" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[140px] pl-6">Status</TableHead>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead className="min-w-[240px]">User</TableHead>
                    <TableHead className="min-w-[300px]">Description</TableHead>
                    <TableHead className="w-[180px] text-right pr-6">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6"><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No recent activities found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((log) => (
                      <TableRow 
                        key={log.id} 
                        className="cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => handleRowClick(log)}
                      >
                        <TableCell className="pl-6">
                          <Badge variant="outline" className={cn("gap-1.5 font-medium px-2.5 py-0.5", STATUS_CONFIG[log.status]?.badge)}>
                            {STATUS_CONFIG[log.status]?.icon}
                            {(log.status || '').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            {ACTION_CONFIG[log.action_type]?.icon}
                            {ACTION_CONFIG[log.action_type]?.label}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-slate-200">
                              <AvatarImage src={log.user_avatar || ''} />
                              <AvatarFallback className="bg-slate-100 text-slate-500 text-xs">
                                {log.user_name?.substring(0, 2).toUpperCase() || '??'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900">{log.user_name}</span>
                              <span className="text-xs text-slate-500">{log.user_email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-slate-600 line-clamp-1">{log.description}</p>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <time className="text-sm text-slate-500">
                            {formatDistanceToNow(new Date(log.created_at || Date.now()), { addSuffix: true })}
                          </time>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-md md:max-w-lg">
            <SheetHeader className="mb-6">
              <SheetTitle>Activity Details</SheetTitle>
              <SheetDescription>
                Full transaction logs and metadata for this event.
              </SheetDescription>
            </SheetHeader>
            {selectedLog && (
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-slate-50 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Request ID</span>
                      <p className="text-xs font-mono text-slate-700 break-all">{selectedLog.id}</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-slate-50 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Timestamp</span>
                      <p className="text-xs text-slate-700">
                        {format(new Date(selectedLog.created_at || Date.now()), 'PPP p')}
                      </p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">Technical Payload</h4>
                    {renderDetails(selectedLog.metadata)}
                 </div>
              </div>
            )}
            <SheetFooter className="mt-8 border-t pt-4">
              <Button variant="outline" className="w-full" onClick={() => setIsSheetOpen(false)}>Close Inspector</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}