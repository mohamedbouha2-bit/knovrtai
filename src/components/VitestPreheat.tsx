'use client';

import React, { useMemo } from 'react';
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { Layers3, Rocket, Sparkles, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// بيانات النشاط مع استخدام useMemo لضمان استقرار المرجع أثناء الاختبارات
const ACTIVITY_DATA = [
  { key: "Mon", value: 21 }, { key: "Tue", value: 42 },
  { key: "Wed", value: 58 }, { key: "Thu", value: 63 },
  { key: "Fri", value: 70 }, { key: "Sat", value: 75 },
  { key: "Sun", value: 78 }
];

const FEATURE_BADGES = [
  { name: "shadcn/ui", variant: "default" as const },
  { name: "Framer Motion", variant: "secondary" as const },
  { name: "Lucide icons", variant: "outline" as const },
  { name: "Recharts", variant: "secondary" as const }
];

export default function VitestPrewarmPanel() {
  const timestamp = useMemo(() => dayjs().format("YYYY-MM-DD HH:mm:ss"), []);

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-2 bg-slate-50/50 min-h-screen">
      {/* القسم الأول: لوحة التحكم والرسوم البيانية */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-dashed h-full shadow-sm hover:border-primary/50 transition-colors">
          <CardHeader className="gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="text-primary" size={20} />
                </div>
                <div>
                  <CardTitle className="text-xl">Vitest 预热面板 (Prewarm)</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <RefreshCw size={12} className="animate-spin-slow" />
                    最后预编译：{timestamp}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Ready
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              يعمل هذا المكون على استدعاء مكتبات الثقيلة (UI Primitives) 
              مسبقاً. من خلال تفعيل عملية الرندر هذه، نقوم بإجبار Vitest على 
              ترجمة التبعيات في مرحلة البداية، مما يقلل وقت الـ Smoke Tests اللاحقة.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="h-48 w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACTIVITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="key" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "hsl(var(--primary))" }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {FEATURE_BADGES.map((item) => (
                <Badge key={item.name} variant={item.variant} className="px-3 py-1">
                  {item.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="justify-between border-t bg-slate-50/50 pt-4">
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <CheckCircle2 size={16} />
              <span>Dependencies Cached</span>
            </div>
            <Button size="sm" className="gap-2 shadow-sm transition-transform active:scale-95">
              <Rocket size={16} />
              Re-warm Engine
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* القسم الثاني: حالة الصحة والتبويبات */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="h-full shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-amber-500 fill-amber-500" />
              <CardTitle>Cache Health Score</CardTitle>
            </div>
            <CardDescription>مراقبة حالة تسخين التبعيات في الوقت الفعلي</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="space-y-4 rounded-xl border bg-slate-50/30 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Hit Rate (命中率)</span>
                <Badge variant="outline" className="font-mono bg-white">92.4%</Badge>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-muted-foreground text-xs italic">
                * كلما زادت نسبة الاصابة، قل الوقت المستغرق في طلبات Vitest اللاحقة.
              </p>
            </div>

            <Tabs defaultValue="recharts" className="w-full">
              <TabsList className="grid grid-cols-3 w-full p-1 bg-slate-100 rounded-lg">
                <TabsTrigger value="recharts">Recharts</TabsTrigger>
                <TabsTrigger value="motion">Motion</TabsTrigger>
                <TabsTrigger value="icons">Lucide</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="recharts">
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="pt-4 text-sm text-slate-600 leading-relaxed"
                  >
                    يتم تنفيذ حسابات الرسوم البيانية مسبقاً لضمان عدم حدوث 
                    Double Compilation عند تشغيل الاختبارات الفعلية.
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="motion">
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="pt-4 text-sm text-slate-600 leading-relaxed"
                  >
                    تجهيز الـ Keyframes الخاصة بـ Framer Motion لتجنب 
                    تذبذب الذاكرة (GC Jitter) أثناء مرحلة التسخين.
                  </motion.div>
                </TabsContent>

                <TabsContent value="icons">
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="pt-4 text-sm text-slate-600 leading-relaxed"
                  >
                    تحميل حزمة أيقونات Lucide بشكل كامل لضمان سلاسة التنقل 
                    بين الصفحات في بيئة الاختبار.
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}