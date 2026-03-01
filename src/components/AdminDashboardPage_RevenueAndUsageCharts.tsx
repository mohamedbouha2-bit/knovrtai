'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, ResponsiveContainer as Container 
} from 'recharts';
import { 
  Calendar as CalendarIcon, TrendingUp, BarChart3, 
  Loader2, AlertCircle, Download, CreditCard, Zap 
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'sonner';

// استيراد الأدوات والأنواع
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import type { subscription_order, ai_job, credit_order } from '@/server/entities.type';

// --- مكونات واجهة المستخدم (UI Components) ---
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm overflow-hidden ${className || ''}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 border-b border-slate-50 ${className || ''}`}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-lg font-bold leading-none tracking-tight text-slate-900 ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={`text-sm text-slate-500 mt-1 ${className || ''}`}>{children}</p>
);

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 ${className || ''}`}>{children}</div>
);

const Button = ({ className, variant = 'primary', size = 'default', children, onClick, disabled }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none disabled:opacity-50 active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs",
  };
  const sizes = { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-xs" };
  return (
    <button className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className || ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// --- الأنواع ---
type DateRangeOption = '7' | '30' | '90';
type RevenueDataPoint = { date: string; revenue: number; subscriptions: number; credits: number };
type UsageDataPoint = { feature: string; count: number; successRate: number };

export default function AdminDashboardPage_RevenueAndUsageCharts() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [usageData, setUsageData] = useState<UsageDataPoint[]>([]);

  // 1. جلب البيانات
  const fetchData = async () => {
    const session = getBackendAdminSession();
    if (!session?.token) {
      setError('Unauthorized access. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const days = parseInt(dateRange);
      const endDate = endOfDay(new Date());
      const startDate = startOfDay(subDays(new Date(), days));

      // Fetch data concurrently
      const [subs, credits, jobs] = await Promise.all([
        entities.subscription_order.GetAll({ created_at: { gte: startDate, lte: endDate }, status: { equals: 'success' } }),
        entities.credit_order.GetAll({ created_at: { gte: startDate, lte: endDate }, status: { equals: 'success' } }),
        entities.ai_job.GetAll({ created_at: { gte: startDate, lte: endDate } })
      ]);

      // Processing
      processRevenueData(subs, credits, days, endDate);
      processUsageData(jobs);
    } catch (err) {
      console.error(err);
      setError('Failed to sync dashboard data.');
      toast.error('Data retrieval error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  // 2. معالجة بيانات الإيرادات
  const processRevenueData = (subs: subscription_order[], credits: credit_order[], days: number, endDate: Date) => {
    const dailyMap = new Map<string, RevenueDataPoint>();

    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(endDate, i);
      const dateStr = format(d, 'MMM dd');
      dailyMap.set(dateStr, { date: dateStr, revenue: 0, subscriptions: 0, credits: 0 });
    }

    subs.forEach(s => {
      const d = format(new Date(s.created_at), 'MMM dd');
      if (dailyMap.has(d)) {
        const item = dailyMap.get(d)!;
        item.revenue += Number(s.amount || 0);
        item.subscriptions += Number(s.amount || 0);
      }
    });

    credits.forEach(c => {
      const d = format(new Date(c.created_at), 'MMM dd');
      if (dailyMap.has(d)) {
        const item = dailyMap.get(d)!;
        item.revenue += Number(c.total_amount || 0);
        item.credits += Number(c.total_amount || 0);
      }
    });

    setRevenueData(Array.from(dailyMap.values()));
  };

  // 3. معالجة بيانات الاستخدام
  const processUsageData = (jobs: ai_job[]) => {
    const featureMap = new Map<string, { total: number; success: number }>();
    
    jobs.forEach(job => {
      const f = job.feature_type?.replace(/_/g, ' ').toUpperCase() || 'GENERAL';
      const stats = featureMap.get(f) || { total: 0, success: 0 };
      stats.total++;
      if (job.status === 'completed') stats.success++;
      featureMap.set(f, stats);
    });

    const processed = Array.from(featureMap.entries())
      .map(([feature, s]) => ({
        feature,
        count: s.total,
        successRate: Math.round((s.success / s.total) * 100) || 0
      }))
      .sort((a, b) => b.count - a.count);

    setUsageData(processed);
  };

  const totalRevenue = useMemo(() => revenueData.reduce((a, b) => a + b.revenue, 0), [revenueData]);
  const totalJobs = useMemo(() => usageData.reduce((a, b) => a + b.count, 0), [usageData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white border rounded-xl shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold">Data Fetching Failed</h2>
        <p className="text-slate-500 max-w-sm mt-2">{error}</p>
        <Button onClick={fetchData} variant="outline" className="mt-6">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-2">Real-time breakdown of financial and operational health.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <select 
              value={dateRange} 
              onChange={e => setDateRange(e.target.value as DateRangeOption)}
              className="text-sm font-semibold outline-none bg-transparent cursor-pointer"
            >
              <option value="7">Past Week</option>
              <option value="30">Past Month</option>
              <option value="90">Past Quarter</option>
            </select>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="flex flex-col shadow-md border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Revenue Flow
              </CardTitle>
              <CardDescription>
                Earnings: <span className="text-emerald-600 font-bold">${totalRevenue.toLocaleString()}</span>
              </CardDescription>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} tickFormatter={v => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Usage Chart */}
        <Card className="flex flex-col shadow-md border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> System Utilization
              </CardTitle>
              <CardDescription>
                Volume: <span className="text-slate-900 font-bold">{totalJobs.toLocaleString()} jobs</span>
              </CardDescription>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg"><BarChart3 className="w-5 h-5 text-amber-600" /></div>
          </CardHeader>
          <CardContent className="h-[350px] w-full mt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-600" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} fontSize={11} width={100} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0].payload as UsageDataPoint;
                        return (
                          <div className="bg-white p-4 rounded-xl border shadow-xl">
                            <p className="font-bold text-slate-900 mb-2">{d.feature}</p>
                            <div className="text-sm space-y-1">
                              <p className="flex justify-between gap-4 text-slate-500">Jobs: <span className="text-slate-900 font-medium">{d.count}</span></p>
                              <p className="flex justify-between gap-4 text-slate-500">Success: <span className="text-emerald-600 font-medium">{d.successRate}%</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}