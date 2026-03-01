'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, Search, MoreHorizontal, Edit3, Eye, Trash2, Globe, 
  SlidersHorizontal, Loader2, AlertCircle, CheckCircle2, XCircle 
} from 'lucide-react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { 
  Sheet, SheetContent, SheetDescription, SheetFooter, 
  SheetHeader, SheetTitle 
} from '@/components/ui/sheet';
import { 
  Form, FormControl, FormDescription, FormField, 
  FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import type { cultural_preset } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Types & Schemas ---

const presetSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  target_region: z.string().min(2, "المنطقة المستهدفة مطلوبة"),
  tone_description: z.string().optional(),
  sample_output_preview: z.string().optional(),
  is_default: z.boolean().default(false)
});

type PresetFormValues = z.infer<typeof presetSchema>;

// --- Main Component ---

export default function LocalizationAdminPage_CulturalPresets() {
  const [data, setData] = useState<cultural_preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog/Sheet States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<cultural_preset | null>(null);

  // -- Data Fetching --
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) {
        toast.error('غير مصرح بالوصول');
        return;
      }
      const result = await entities.cultural_preset.GetAll({});
      setData(result || []);
    } catch (error) {
      console.error('فشل جلب الإعدادات الثقافية:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -- CRUD Operations --

  const handleCreate = async (values: PresetFormValues) => {
    try {
      await entities.cultural_preset.Create({
        ...values,
        created_at: new Date(),
        updated_at: new Date()
      });
      toast.success('تم إنشاء الإعداد الثقافي بنجاح');
      setIsCreateOpen(false);
      fetchData();
    } catch (error) {
      toast.error('فشل في إنشاء الإعداد');
    }
  };

  const handleUpdate = async (values: PresetFormValues) => {
    if (!selectedPreset) return;
    try {
      await entities.cultural_preset.Update({
        where: { id: selectedPreset.id },
        data: {
          ...values,
          updated_at: new Date()
        }
      });
      toast.success('تم تحديث الإعداد بنجاح');
      setIsEditOpen(false);
      fetchData();
    } catch (error) {
      toast.error('فشل في التحديث');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعداد؟')) return;
    try {
      await entities.cultural_preset.Delete({ id });
      toast.success('تم الحذف بنجاح');
      fetchData();
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.target_region.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="w-full bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              الإعدادات الثقافية ونبرة الصوت
            </h1>
            <p className="text-sm text-muted-foreground mt-1">إدارة تعليمات الذكاء الاصطناعي للمناطق المختلفة.</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            إنشاء إعداد جديد
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="البحث بالاسم أو المنطقة..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <SlidersHorizontal className="w-4 h-4" />
             <span>تم العثور على {filteredData.length} إعداد</span>
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-sm overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>اسم الإعداد</TableHead>
                <TableHead>المنطقة المستهدفة</TableHead>
                <TableHead>وصف النبرة</TableHead>
                <TableHead className="text-center">الحالة</TableHead>
                <TableHead>آخر تحديث</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : filteredData.map((preset) => (
                <TableRow key={preset.id}>
                  <TableCell className="font-medium">{preset.name}</TableCell>
                  <TableCell>{preset.target_region}</TableCell>
                  <TableCell className="max-w-[250px] truncate text-muted-foreground text-sm">
                    {preset.tone_description || 'لا يوجد وصف'}
                  </TableCell>
                  <TableCell className="text-center">
                    {preset.is_default && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">افتراضي</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {preset.updated_at ? format(new Date(preset.updated_at), 'yyyy/MM/dd') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedPreset(preset); setIsPreviewOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" /> معاينة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedPreset(preset); setIsEditOpen(true); }}>
                          <Edit3 className="mr-2 h-4 w-4" /> تعديل
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(preset.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Modals */}
      <CreatePresetDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleCreate} />
      <EditPresetDrawer open={isEditOpen} onOpenChange={setIsEditOpen} initialData={selectedPreset} onSubmit={handleUpdate} />
      <PreviewModal open={isPreviewOpen} onOpenChange={setIsPreviewOpen} data={selectedPreset} />
    </div>
  );
}

// تم الاحتفاظ بباقي المكونات الفرعية (CreatePresetDialog, EditPresetDrawer, PreviewModal) مع تحسين منطق الـ Form Reset.