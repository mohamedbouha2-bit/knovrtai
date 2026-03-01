'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Copy, DollarSign, TrendingUp, CreditCard, ArrowUpRight, 
  Wallet, CheckCircle2, AlertCircle, Share2, Download, ExternalLink 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getfrontend_user_session } from '@/tools/SessionContext';
import { entities } from '@/tools/entities-proxy';
import type { affiliate_summary, user } from '@/server/entities.type';
import gsap from 'gsap';

// ----------------------------------------------------------------------
// Configuration & Data Mocking
// ----------------------------------------------------------------------

const chartConfig = {
  earnings: {
    label: 'Earnings',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

const generateChartData = () => {
  const months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return months.map(day => ({
    date: day,
    earnings: Math.floor(Math.random() * 400) + 150
  }));
};

// ----------------------------------------------------------------------
// Component logic
// ----------------------------------------------------------------------

export default function AffiliateDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ summary: affiliate_summary | null, user: user | null, chartData: any[] }>({
    summary: null,
    user: null,
    chartData: []
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = getfrontend_user_session();
        if (!session?.userId) return setLoading(false);
        
        const userId = parseInt(session.userId);
        const [userResult, summaries] = await Promise.all([
          entities.user.Get({ id: userId }),
          entities.affiliate_summary.GetAll({ user_id: { equals: userId } })
        ]);

        setData({
          user: userResult,
          summary: summaries?.[0] || null,
          chartData: generateChartData()
        });
      } catch (error) {
        toast.error('Network sync error. Refreshing might help.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.anim-card', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [loading]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${key} copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 anim-card">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Affiliate Portal</h1>
            <p className="text-slate-500 font-medium">Overview of your referral performance and earnings.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/paymentpage')} className="bg-white">
              <CreditCard className="w-4 h-4 mr-2" /> Payout Settings
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100" onClick={() => router.push('/paymentpage')}>
              <Download className="w-4 h-4 mr-2" /> Withdraw
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats Overview */}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Earnings" 
                value={data.summary?.total_lifetime_earnings || 0} 
                icon={<DollarSign className="w-4 h-4 text-blue-600" />}
                trend="+12.5%"
              />
              <StatCard 
                title="Available Balance" 
                value={data.summary?.current_balance || 0} 
                icon={<Wallet className="w-4 h-4 text-emerald-600" />}
                subtext="Ready to withdraw"
              />
              <StatCard 
                title="Pending" 
                value={data.summary?.pending_payout || 0} 
                icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
                subtext="Next cycle"
              />
            </div>

            {/* Performance Chart */}
            <Card className="border-slate-200 shadow-sm anim-card bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Performance Chart</CardTitle>
                  <CardDescription>Daily commission breakdown</CardDescription>
                </div>
                <div className="flex items-center text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  Last 7 Days
                </div>
              </CardHeader>
              <CardContent className="h-[320px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm anim-card bg-white h-full flex flex-col">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <Share2 className="w-6 h-6" />
                </div>
                <CardTitle>Referral Tools</CardTitle>
                <CardDescription>Use these tools to invite your audience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Referral Link</label>
                  <div className="flex gap-2">
                    <Input readOnly value={data.user?.referral_link_url || ''} className="bg-slate-50 border-slate-200" />
                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(data.user?.referral_link_url || '', 'Link')}>
                      {copiedKey === 'Link' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-xs font-semibold text-slate-400 mb-1 uppercase">Your Unique Code</p>
                  <span className="text-2xl font-mono font-bold text-slate-900 tracking-tighter">
                    {data.user?.referral_code || 'N/A'}
                  </span>
                  <Button variant="link" className="block mx-auto text-blue-600 font-bold" onClick={() => copyToClipboard(data.user?.referral_code || '', 'Code')}>
                    Copy Code
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4">
                <Button variant="ghost" className="w-full justify-between text-slate-600 hover:text-slate-900 group">
                  Detailed History <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

function StatCard({ title, value, icon, trend, subtext }: { title: string, value: number, icon: React.ReactNode, trend?: string, subtext?: string }) {
  return (
    <Card className="border-slate-200 shadow-sm anim-card bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">${value.toLocaleString()}</div>
        {trend && (
          <div className="flex items-center text-emerald-500 text-xs font-bold mt-1">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend} <span className="text-slate-400 font-normal ml-1">vs last month</span>
          </div>
        )}
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2"><Skeleton className="h-10 w-64" /><Skeleton className="h-4 w-96" /></div>
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="col-span-8 h-[400px]" />
        <Skeleton className="col-span-4 h-[400px]" />
      </div>
    </div>
  );
}