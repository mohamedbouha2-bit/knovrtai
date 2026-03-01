'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Globe, Activity, CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { language } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface DashboardMetrics {
  totalLanguages: number;
  activeLanguages: number;
  avgTranslationProgress: number;
  lowCoverageCount: number; 
  fullyTranslatedCount: number; 
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

const MetricCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <Card className="border shadow-sm bg-card transition-all duration-200 hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card/50 border-dashed">
    <div className="bg-muted/50 p-4 rounded-full mb-4">
      <Globe className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">لا توجد بيانات متاحة</h3>
    <p className="text-sm text-muted-foreground max-w-sm mt-2">
      ابدأ بإضافة لغة جديدة لرؤية التحليلات هنا.
    </p>
  </div>
);

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function LocalizationAdminPage_AnalyticsOverview() {
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState<language[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLanguages: 0,
    activeLanguages: 0,
    avgTranslationProgress: 0,
    lowCoverageCount: 0,
    fullyTranslatedCount: 0
  });

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        const session = getBackendAdminSession();
        if (!session?.adminId) {
          setLoading(false);
          return;
        }

        const data = await entities.language.GetAll({});
        if (data && data.length > 0) {
          const total = data.length;
          const active = data.filter(l => l.is_active).length;
          const totalPercentage = data.reduce((acc, curr) => acc + (curr.percentage_translated || 0), 0);
          const lowCoverage = data.filter(l => (l.percentage_translated || 0) < 50).length;
          const fullyTranslated = data.filter(l => (l.percentage_translated || 0) === 100).length;

          setLanguages(data);
          setMetrics({
            totalLanguages: total,
            activeLanguages: active,
            avgTranslationProgress: Math.round(totalPercentage / total),
            lowCoverageCount: lowCoverage,
            fullyTranslatedCount: fullyTranslated
          });
        }
      } catch (error) {
        console.error("تحذير: فشل جلب تحليلات اللغات", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const chartData = useMemo(() => {
    return [...languages]
      .sort((a, b) => (b.percentage_translated || 0) - (a.percentage_translated || 0))
      .slice(0, 8)
      .map(lang => ({
        name: lang.name,
        percentage: lang.percentage_translated || 0,
      }));
  }, [languages]);

  const chartConfig = {
    percentage: {
      label: "نسبة الترجمة",
      color: "hsl(var(--primary))"
    }
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-10 space-y-8 animate-pulse">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-xl bg-muted/20" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <div className="col-span-4 h-[400px] rounded-xl bg-muted/20" />
          <div className="col-span-3 h-[400px] rounded-xl bg-muted/20" />
        </div>
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="container mx-auto px-8 py-10">
        <EmptyState />
      </div>
    );
  }

  return (
    <section className="w-full bg-background border-b">
      <div className="container mx-auto px-8 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">نظرة عامة على اللغات</h2>
          <p className="text-muted-foreground mt-1">مراقبة صحة الترجمة وتغطية النظام بمختلف اللغات.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="اللغات النشطة" value={metrics.activeLanguages} icon={Globe} description={`${metrics.totalLanguages} لغة إجمالية`} trend="neutral" />
          <MetricCard title="متوسط التغطية" value={`${metrics.avgTranslationProgress}%`} icon={Activity} description="معدل المحتوى المترجم" trend={metrics.avgTranslationProgress > 80 ? 'up' : 'down'} />
          <MetricCard title="لغات مكتملة" value={metrics.fullyTranslatedCount} icon={CheckCircle2} description="لغات بنسبة ترجمة 100%" trend="up" />
          <MetricCard title="تحتاج اهتمام" value={metrics.lowCoverageCount} icon={AlertCircle} description="لغات تحت نسبة تغطية 50%" trend={metrics.lowCoverageCount > 0 ? 'down' : 'neutral'} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart Container */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>نسبة الترجمة حسب اللغة</CardTitle>
              <CardDescription>أفضل اللغات أداءً من حيث اكتمال الترجمة.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.4} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={12} width={80} />
                    <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.percentage === 100 ? '#10b981' : entry.percentage < 50 ? '#f59e0b' : '#2563eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Health List */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>الحالة الصحية للغات</CardTitle>
              <CardDescription>اللغات التي تحتاج إلى استكمال المحتوى.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {languages
                .sort((a, b) => (a.percentage_translated || 0) - (b.percentage_translated || 0))
                .slice(0, 6)
                .map(lang => (
                  <div key={lang.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold uppercase">
                        {lang.iso_code.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lang.name}</p>
                        <p className="text-xs text-muted-foreground">{lang.is_active ? 'نشطة' : 'معطلة'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-sm font-bold", (lang.percentage_translated || 0) < 50 ? "text-amber-500" : "text-primary")}>
                        {lang.percentage_translated}%
                      </div>
                      <div className="w-12 h-1 bg-secondary rounded-full mt-1">
                        <div className="h-full bg-current rounded-full" style={{ width: `${lang.percentage_translated}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Tip Banner */}
        <div className="rounded-lg border bg-card p-4 flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Zap className="h-5 w-5" /></div>
          <div>
            <h4 className="text-sm font-semibold">نصيحة التحسين</h4>
            <p className="text-sm text-muted-foreground">اللغات التي تقل تغطيتها عن 50% قد تؤثر سلباً على تجربة المستخدم. نوصي بإعطائها الأولوية.</p>
          </div>
        </div>
      </div>
    </section>
  );
}