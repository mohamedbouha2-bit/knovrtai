'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, Plus, MoreHorizontal, Globe, Settings2, RefreshCw, XCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Custom Components & Tools
import EditableImg from "@/@base/EditableImg";
import type { language } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- التحقق من البيانات (Zod) ---
const languageSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  iso_code: z.string().min(2, 'كود ISO مطلوب').max(10),
  flag_image_url: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  percentage_translated: z.number().min(0).max(100).default(0)
});

type LanguageFormValues = z.infer<typeof languageSchema>;

export default function LocalizationAdminPage_LanguageManager() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<language[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);

  // --- إعداد النماذج (Forms) ---
  const createForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { name: '', iso_code: '', flag_image_url: '', is_active: true, percentage_translated: 0 }
  });

  const editForm = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: { name: '', iso_code: '', flag_image_url: '', is_active: false, percentage_translated: 0 }
  });

  // --- جلب البيانات (Data Fetching) ---
  const performFetch = useCallback(async (query: string, status: string) => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.token) return;

      const filters: any = {};
      if (query) filters.name = { contains: query };
      if (status !== 'all') filters.is_active = status === 'active';

      const response = await entities.language.GetAll(filters);
      setData(response || []);
    } catch (err) {
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => performFetch(searchQuery, statusFilter), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, performFetch]);

  // --- معالجة العمليات (Handlers) ---
  const handleCreate = async (values: LanguageFormValues) => {
    try {
      const result = await entities.language.Create({
        ...values,
        created_at: new Date(),
        updated_at: new Date()
      } as any);

      if (result) {
        toast.success('تمت إضافة اللغة بنجاح');
        setIsCreateOpen(false);
        createForm.reset();
        performFetch(searchQuery, statusFilter);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الإنشاء');
    }
  };

  const handleUpdate = async (values: LanguageFormValues) => {
    if (!currentEditingId) return;
    try {
      const result = await entities.language.Update({
        where: { id: currentEditingId },
        data: { ...values, updated_at: new Date() } as any
      });
      if (result) {
        toast.success('تم تحديث الإعدادات');
        setIsEditOpen(false);
        performFetch(searchQuery, statusFilter);
      }
    } catch (error) {
      toast.error('فشل التحديث');
    }
  };

  const handleToggleStatus = async (lang: language, newStatus: boolean) => {
    const previousData = [...data];
    // Optimistic Update
    setData(prev => prev.map(item => item.id === lang.id ? { ...item, is_active: newStatus } : item));

    try {
      await entities.language.Update({
        where: { id: lang.id },
        data: { is_active: newStatus, updated_at: new Date() } as any
      });
      toast.success(newStatus ? 'تم التفعيل' : 'تم التعطيل');
    } catch (error) {
      setData(previousData);
      toast.error('حدث خطأ');
    }
  };

  const openEditDrawer = (lang: language) => {
    setCurrentEditingId(lang.id);
    editForm.reset({
      name: lang.name,
      iso_code: lang.iso_code,
      flag_image_url: lang.flag_image_url || '',
      is_active: lang.is_active,
      percentage_translated: lang.percentage_translated
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      await entities.language.Delete({ id });
      toast.success('تم الحذف بنجاح');
      performFetch(searchQuery, statusFilter);
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="container mx-auto px-8 py-10 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">إدارة اللغات</h2>
            <p className="text-slate-500 mt-1">إعداد اللغات المدعومة، تقدم الترجمة، والإعدادات الإقليمية.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> إضافة لغة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة لغة جديدة</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={createForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم اللغة</FormLabel>
                        <FormControl><Input placeholder="مثال: الفرنسية" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="iso_code" render={({ field }) => (
                      <FormItem>
                        <FormLabel>كود ISO</FormLabel>
                        <FormControl><Input placeholder="fr-FR" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full">حفظ اللغة</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Toolbar */}
        <Card className="p-4 mb-6 bg-white shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="ابحث بالاسم أو الكود..." 
              className="pl-9" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="الحالة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => performFetch(searchQuery, statusFilter)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-20 text-center">العلم</TableHead>
                <TableHead>اللغة</TableHead>
                <TableHead>ISO</TableHead>
                <TableHead>تقدم الترجمة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500">لا توجد لغات حالياً</TableCell></TableRow>
              ) : data.map((lang) => (
                <TableRow key={lang.id}>
                  <TableCell className="text-center">
                    <div className="w-8 h-8 mx-auto rounded-full overflow-hidden border">
                      <EditableImg 
                        propKey={`flag-${lang.id}`} 
                        keywords={lang.iso_code} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{lang.name}</TableCell>
                  <TableCell><Badge variant="outline">{lang.iso_code}</Badge></TableCell>
                  <TableCell className="w-64">
                    <div className="flex items-center gap-2">
                      <Progress value={lang.percentage_translated} className="h-2" />
                      <span className="text-xs text-slate-500">{lang.percentage_translated}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={lang.is_active} 
                      onCheckedChange={checked => handleToggleStatus(lang, checked)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDrawer(lang)}>
                          <Settings2 className="w-4 h-4 mr-2" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(lang.id)} className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Drawer */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>تعديل إعدادات اللغة</SheetTitle>
          </SheetHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-6 mt-6">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم المعروض</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="percentage_translated" render={({ field }) => (
                <FormItem>
                  <FormLabel>نسبة الترجمة (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <SheetFooter>
                <Button type="submit" className="w-full">حفظ التعديلات</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}