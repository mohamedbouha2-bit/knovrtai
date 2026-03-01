'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Plus, Edit3, Trash2, Eye, Filter, ChevronLeft, 
  ChevronRight, ShieldAlert, CheckCircle2, XCircle, Loader2, 
  Mail, Calendar, CreditCard, User as UserIcon, RefreshCw 
} from 'lucide-react';
import { z } from 'zod';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import EditableImg from '@/@base/EditableImg';

// Types & Proxy
import type { user, user_role, user_status, filtered_user } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Configuration & Schemas ---

const userFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().optional(),
  role: z.enum(['user', 'admin', 'affiliate']),
  status: z.enum(['active', 'inactive', 'banned', 'suspended']),
  password: z.string().transform(v => v === "" ? undefined : v).pipe(z.string().min(6).optional()),
  usage_credits_remaining: z.coerce.number().min(0).default(50),
  is_ai_access_enabled: z.boolean().default(true)
});

type UserFormValues = z.infer<typeof userFormSchema>;

const STATUS_CONFIG: Record<user_status, { color: string; icon: any }> = {
  active: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  inactive: { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: XCircle },
  banned: { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: ShieldAlert },
  suspended: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: RefreshCw }
};

// --- Main Component ---

export default function UserManagementPage_MainTable() {
  const [data, setData] = useState<user[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<user_role | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<user_status | 'all'>('all');

  // Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<user | null>(null);
  const [viewingUser, setViewingUser] = useState<user | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema) as Resolver<UserFormValues>,
    defaultValues: {
      email: '', full_name: '', username: '', role: 'user',
      status: 'active', password: '', usage_credits_remaining: 50, is_ai_access_enabled: true
    }
  });

  // 1. Optimized Data Fetching (Callback and Debounce Logic)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const session = getBackendAdminSession();
      if (!session?.token) {
        toast.error('Unauthorized access');
        return;
      }

      const queryArgs: filtered_user = {};
      if (searchTerm) queryArgs.OR = [
        { email: { contains: searchTerm } },
        { full_name: { contains: searchTerm } }
      ];
      if (roleFilter !== 'all') queryArgs.role = { equals: roleFilter };
      if (statusFilter !== 'all') queryArgs.status = { equals: statusFilter };

      const [users, count] = await Promise.all([
        entities.user.GetPage(page, pageSize, queryArgs),
        entities.user.Count(queryArgs)
      ]);

      setData(users);
      setTotalCount(count);
    } catch (err) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 400); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  // 2. Action Handlers
  const handleOpenDrawer = (user?: user) => {
    if (user) {
      setEditingUser(user);
      form.reset({
        email: user.email,
        full_name: user.full_name || '',
        username: user.username || '',
        role: user.role,
        status: user.status,
        password: '',
        usage_credits_remaining: user.usage_credits_remaining,
        is_ai_access_enabled: user.is_ai_access_enabled ?? true
      });
    } else {
      setEditingUser(null);
      form.reset({
        email: '', full_name: '', username: '', role: 'user',
        status: 'active', password: '', usage_credits_remaining: 50, is_ai_access_enabled: true
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const passwordHash = values.password ? CryptoJS.SHA256(values.password).toString() : undefined;

      if (editingUser) {
        await entities.user.Update({
          where: { id: editingUser.id },
          data: { ...values, password: passwordHash, updated_at: new Date() }
        });
        toast.success('User updated');
      } else {
        if (!passwordHash) throw new Error("Password required");
        await entities.user.Create({
          ...values,
          password: passwordHash,
          referral_code: `USR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          created_at: new Date(),
          updated_at: new Date()
        });
        toast.success('User created');
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    toast.promise(entities.user.Delete({ id }), {
      loading: 'Deleting...',
      success: () => { fetchData(); return 'User deleted'; },
      error: 'Delete failed'
    });
  };

  // 3. UI Helpers
  const StatusBadge = ({ status }: { status: user_status }) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1 font-semibold px-2.5 py-1 capitalize`}>
        <Icon size={12} /> {status}
      </Badge>
    );
  };

  return (
    <section className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Directory</h1>
            <p className="text-slate-500">Manage account permissions, credits and platform access.</p>
          </div>
          <Button onClick={() => handleOpenDrawer()} className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b pb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="pl-10 bg-slate-50 border-slate-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                  <SelectTrigger className="w-[140px]"><Filter size={14} className="mr-2"/> Role</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="w-[140px]"><RefreshCw size={14} className="mr-2"/> Status</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.keys(STATUS_CONFIG).map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          {/* Table */}
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow>
                <TableHead className="w-[300px]">Profile</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Access</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-64 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-40 text-center text-slate-400">No users found.</TableCell></TableRow>
              ) : data.map((user) => (
                <TableRow key={user.id} className="group transition-colors hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <EditableImg propKey={`av-${user.id}`} keywords="face, professional" className="object-cover" />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{user.full_name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 capitalize font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell>
                    {user.is_ai_access_enabled ? 
                      <Badge className="bg-emerald-50 text-emerald-600 border-none shadow-none">Active</Badge> : 
                      <Badge variant="outline" className="text-slate-400 border-slate-200">Revoked</Badge>
                    }
                  </TableCell>
                  <TableCell className="font-mono font-medium">{user.usage_credits_remaining.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => { setViewingUser(user); setIsViewModalOpen(true); }}><Eye size={16}/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDrawer(user)}><Edit3 size={16}/></Button>
                      <Popover>
                        <PopoverTrigger asChild><Button variant="ghost" size="icon" className="text-rose-500"><Trash2 size={16}/></Button></PopoverTrigger>
                        <PopoverContent className="w-56 p-4 border-rose-100 shadow-xl">
                          <p className="text-xs font-medium mb-3 text-slate-600">Permanently delete this user?</p>
                          <Button size="sm" variant="destructive" className="w-full" onClick={() => handleDelete(user.id)}>Confirm Delete</Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t">
            <span className="text-xs font-medium text-slate-500">Page {page} • Total {totalCount} users</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16}/></Button>
              <Button variant="outline" size="sm" disabled={data.length < pageSize} onClick={() => setPage(p => p + 1)}><ChevronRight size={16}/></Button>
            </div>
          </div>
        </Card>

        {/* Edit/Add Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{editingUser ? 'Edit User' : 'New User'}</SheetTitle>
              <SheetDescription>Set user access level and starting credits.</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-6">
                <FormField control={form.control} name="full_name" render={({field}) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({field}) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="role" render={({field}) => (
                    <FormItem><FormLabel>Role</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="affiliate">Affiliate</SelectItem></SelectContent></Select></FormItem>
                  )}/>
                  <FormField control={form.control} name="status" render={({field}) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="banned">Banned</SelectItem></SelectContent></Select></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="usage_credits_remaining" render={({field}) => (
                  <FormItem><FormLabel>Credits</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="is_ai_access_enabled" render={({field}) => (
                  <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5"><FormLabel>AI Access</FormLabel><FormDescription className="text-[10px]">Enable AI tool suite</FormDescription></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="password" render={({field}) => (
                  <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder={editingUser ? "••••••" : "Required"} {...field}/></FormControl><FormDescription className="text-[10px]">Min. 6 chars</FormDescription></FormItem>
                )}/>
                <div className="flex gap-3 pt-4 border-t">
                  <SheetClose asChild><Button variant="secondary" className="flex-1">Cancel</Button></SheetClose>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600">
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : 'Confirm'}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>

        {/* Quick View Dialog */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-lg p-0 border-none">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg" />
            <div className="px-6 pb-6 relative">
              <Avatar className="h-20 w-20 border-4 border-white -mt-10 mb-4 shadow-sm">
                <EditableImg propKey={`view-av-${viewingUser?.id}`} keywords="face" className="object-cover" />
              </Avatar>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{viewingUser?.full_name}</h2>
                    <p className="text-slate-500 text-sm">{viewingUser?.email}</p>
                  </div>
                  {viewingUser && <StatusBadge status={viewingUser.status} />}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><CreditCard size={10}/> Available Credits</p>
                    <p className="text-lg font-bold text-blue-600">{viewingUser?.usage_credits_remaining.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={10}/> Join Date</p>
                    <p className="text-lg font-bold text-slate-700">{viewingUser?.created_at ? format(new Date(viewingUser.created_at), 'MMM yyyy') : 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-xs font-semibold text-slate-500">Usage Progress</p>
                   <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min(100, (viewingUser?.total_credits_used || 0) / (viewingUser?.usage_limit_total || 1000) * 100)}%` }} />
                   </div>
                   <div className="flex justify-between text-[10px] font-medium text-slate-400">
                     <span>Used: {viewingUser?.total_credits_used}</span>
                     <span>Limit: {viewingUser?.usage_limit_total}</span>
                   </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}