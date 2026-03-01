'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Check, X, Search, Filter, Loader2, ArrowUpRight, MoreHorizontal, RefreshCcw, AlertCircle, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- Types ---
import type { payout_request, user, payout_status } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';
import EditableImg from '@/@base/EditableImg';

type ExtendedPayout = payout_request & {
  affiliate?: user | null;
};

// مخططات التحقق (Schemas)
const approveSchema = z.object({
  cover_image_url: z.string().url("يرجى إدخال رابط صالح للصورة").min(1, "رابط إثبات الدفع مطلوب")
});

const rejectSchema = z.object({
  rejection_reason: z.string().min(5, "يجب أن يكون السبب 5 أحرف على الأقل")
});

// --- Components ---

export default function PaymentsAdminPage_AffiliatePayouts() {
  const router = useRouter();
  const [payouts, setPayouts] = useState<ExtendedPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  // --- جلب البيانات ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        toast.error('غير مصرح لك بالوصول');
        return;
      }

      const requests = await entities.payout_request.GetAll({});
      
      // جلب المستخدمين المرتبطين (Optimization)
      const userIds = Array.from(new Set(requests.map(r => r.user_id).filter(id => id !== undefined)));
      let usersMap: Record<number, user> = {};

      if (userIds.length > 0) {
        const users = await entities.user.GetAll({
          id: { in: userIds }
        });
        usersMap = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
      }

      const mergedData = requests.map(req => ({
        ...req,
        affiliate: req.user_id ? usersMap[req.user_id] : null
      }));

      setPayouts(mergedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('فشل في تحميل طلبات الدفع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- المعالجات (Handlers) ---
  const handleApproveSubmit = async (data: z.infer<typeof approveSchema>) => {
    if (!approvingId) return;
    try {
      await entities.payout_request.Update({
        where: { id: approvingId },
        data: {
          status: 'approved' as payout_status,
          cover_image_url: data.cover_image_url,
          approved_at: new Date(),
          updated_at: new Date()
        }
      });
      toast.success('تمت الموافقة بنجاح');
      setApprovingId(null);
      fetchData();
    } catch (err) {
      toast.error('فشل في تحديث الحالة');
    }
  };

  const handleRejectSubmit = async (data: z.infer<typeof rejectSchema>) => {
    if (!rejectingId) return;
    try {
      await entities.payout_request.Update({
        where: { id: rejectingId },
        data: {
          status: 'rejected' as payout_status,
          rejection_reason: data.rejection_reason,
          updated_at: new Date()
        }
      });
      toast.success('تم رفض الطلب');
      setRejectingId(null);
      fetchData();
    } catch (err) {
      toast.error('فشل في معالجة الرفض');
    }
  };

  // --- Filtering ---
  const filteredPayouts = useMemo(() => {
    return payouts.filter(p => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = 
        p.affiliate?.full_name?.toLowerCase().includes(searchStr) || 
        p.affiliate?.email.toLowerCase().includes(searchStr) || 
        String(p.id).includes(searchStr);
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payouts, searchTerm, statusFilter]);

  // --- الألوان والحالات ---
  const getStatusBadge = (status: payout_status) => {
    const configs: Record<string, string> = {
      approved: "bg-emerald-500 text-white",
      pending: "bg-amber-500 text-white",
      rejected: "bg-rose-500 text-white",
      completed: "bg-blue-500 text-white"
    };
    return <Badge className={`${configs[status] || "bg-gray-400"} border-none capitalize`}>{status}</Badge>;
  };

  return (
    <div className="w-full bg-[#f9fafb] min-h-screen pb-10">
      <div className="container mx-auto px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">مدفوعات التسويق بالعمولة</h1>
            <p className="text-sm text-[#64748b]">مراجعة طلبات العمولات وإدارة التحويلات المالية.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchData} size="sm"><RefreshCcw className="w-4 h-4 mr-2" /> تحديث</Button>
            <Button size="sm" className="bg-blue-600"><Download className="w-4 h-4 mr-2" /> تصدير التقرير</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="طلبات معلقة" value={payouts.filter(p => p.status === 'pending').length} color="text-amber-500" />
          <StatCard title="تمت الموافقة (هذا الشهر)" value={payouts.filter(p => p.status === 'approved').length} color="text-emerald-500" />
          <StatCard 
            title="إجمالي المدفوعات" 
            value={`$${payouts.filter(p => p.status === 'approved').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}`} 
            color="text-slate-900" 
          />
        </div>

        {/* Table Card */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-white">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="البحث بالاسم، البريد أو المعرف..." 
                className="pl-9" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">مقبول</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">المعرف</TableHead>
                <TableHead>المسوق</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الوسيلة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
              ) : filteredPayouts.map(payout => (
                <TableRow key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-xs">#{payout.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={payout.affiliate?.avatar_url || ''} />
                        <AvatarFallback>{payout.affiliate?.full_name?.[0] || 'A'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{payout.affiliate?.full_name || 'مستخدم غير معروف'}</span>
                        <span className="text-[10px] text-slate-500">{payout.affiliate?.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${payout.amount}</TableCell>
                  <TableCell className="text-xs capitalize text-slate-600">{payout.payment_method}</TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell className="text-right">
                    {payout.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <ApproveDialog payoutId={payout.id} onSubmit={handleApproveSubmit} />
                        <RejectPopover payoutId={payout.id} onSubmit={handleRejectSubmit} />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">{format(new Date(payout.updated_at), 'dd/MM/yyyy')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

// --- مساعدة (StatCard) ---
function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <Card className="p-4 border-slate-200">
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}

// --- المكونات الفرعية (Dialogs) ---

function ApproveDialog({ payoutId, onSubmit }: { payoutId: number, onSubmit: (data: z.infer<typeof approveSchema>) => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof approveSchema>>({
    resolver: zodResolver(approveSchema)
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3"><Check className="w-4 h-4 mr-1" /> قبول</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>الموافقة على الدفع #{payoutId}</DialogTitle>
          <DialogDescription>يرجى إرفاق رابط صورة إيصال التحويل البنكي لإتمام العملية.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((d) => { onSubmit(d); setOpen(false); })} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>رابط إثبات التحويل</Label>
            <Input {...register('cover_image_url')} placeholder="https://..." />
            {errors.cover_image_url && <p className="text-xs text-red-500">{errors.cover_image_url.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-emerald-600 w-full">تأكيد الإرسال</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RejectPopover({ payoutId, onSubmit }: { payoutId: number, onSubmit: (data: z.infer<typeof rejectSchema>) => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof rejectSchema>>({
    resolver: zodResolver(rejectSchema)
  });

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if(!v) reset(); }}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 h-8 px-3"><X className="w-4 h-4 mr-1" /> رفض</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit((d) => { onSubmit(d); setOpen(false); })} className="space-y-3">
          <p className="font-medium text-sm">سبب الرفض للطلب #{payoutId}</p>
          <Textarea {...register('rejection_reason')} placeholder="مثال: معلومات الحساب البنكي غير صحيحة" className="h-20" />
          {errors.rejection_reason && <p className="text-xs text-red-500">{errors.rejection_reason.message}</p>}
          <Button type="submit" size="sm" className="bg-rose-600 w-full">تأكيد الرفض</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}