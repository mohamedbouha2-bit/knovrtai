'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, RefreshCw, MoreHorizontal, CheckCircle2, AlertCircle, Clock, Server, Terminal, FileJson, Braces } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { entities } from '@/tools/entities-proxy';
import type { feature_seeds } from '@/server/entities.type';
import { getBackendAdminSession } from '@/tools/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import EditableImg from '@/@base/EditableImg';

// --- Zod Schema ---
const seedFormSchema = z.object({
  seed_key: z.string().min(3, 'Seed Key must be at least 3 characters.'),
  version: z.string().min(1, 'Version is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  configuration_json: z.string().refine(val => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, 'Invalid JSON format.'),
  prompt_template: z.string().optional()
});

type SeedFormValues = z.infer<typeof seedFormSchema>;

export default function ProviderEntryPage_FeatureSeedManager() {
  const [seeds, setSeeds] = useState<feature_seeds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<feature_seeds | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SeedFormValues>({
    resolver: zodResolver(seedFormSchema),
    defaultValues: {
      seed_key: '',
      version: '1.0.0',
      description: '',
      configuration_json: JSON.stringify({ enabled: true, settings: {} }, null, 2),
      prompt_template: ''
    }
  });

  // --- Fetch Data ---
  const fetchSeeds = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = getBackendAdminSession();
      if (!session?.adminId) return;

      const data = await entities.feature_seeds.GetAll();
      const sortedData = [...data].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setSeeds(sortedData);
    } catch (error) {
      toast.error('Failed to load feature seeds.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSeeds(); }, [fetchSeeds]);

  // --- Helpers ---
  const formatCurrentJson = () => {
    try {
      const val = form.getValues('configuration_json');
      form.setValue('configuration_json', JSON.stringify(JSON.parse(val), null, 2));
      toast.success('JSON Formatted');
    } catch {
      toast.error('Invalid JSON structure');
    }
  };

  // --- Handlers ---
  const handleCreateSeed = async (values: SeedFormValues) => {
    try {
      setIsSubmitting(true);
      await entities.feature_seeds.Create({
        ...values,
        status: 'Initialized',
        last_run_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
      toast.success('Seed initialized successfully.');
      setIsSheetOpen(false);
      form.reset();
      fetchSeeds();
    } catch (error) {
      toast.error('Initialization failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReRun = async () => {
    if (!selectedSeed) return;
    const toastId = toast.loading(`Running ${selectedSeed.seed_key}...`);
    try {
      setIsSubmitting(true);
      // Update to Running state
      await entities.feature_seeds.Update({
        where: { id: selectedSeed.id },
        data: { status: 'Running', updated_at: new Date(), last_run_at: new Date() }
      });
      
      await fetchSeeds();

      // Simulate logic completion
      setTimeout(async () => {
        await entities.feature_seeds.Update({
          where: { id: selectedSeed.id },
          data: { status: 'Initialized', updated_at: new Date() }
        });
        fetchSeeds();
        toast.success(`Seed ${selectedSeed.seed_key} completed.`, { id: toastId });
      }, 1500);

      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Sync failed.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string | null | undefined) => {
    const s = status?.toLowerCase() || 'unknown';
    if (s.includes('init') || s.includes('active')) {
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Initialized</Badge>;
    }
    if (s.includes('run')) {
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running</Badge>;
    }
    return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="container mx-auto px-8 py-10">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Server className="w-6 h-6 text-blue-600" /> Feature Seed Manager
            </h2>
            <p className="text-slate-500">Manage system vectors and core capability datasets.</p>
          </div>
          <Button onClick={() => setIsSheetOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Initialize New Seed
          </Button>
        </div>

        {/* Registry Table */}
        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">Registry</CardTitle>
              <Badge variant="secondary" className="font-mono">{seeds.length} Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="animate-spin w-8 h-8" />
                <p>Loading database...</p>
              </div>
            ) : seeds.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-32 h-32 mx-auto"><EditableImg propKey="empty" keywords="empty database" /></div>
                <p className="text-slate-500">No seeds found in current registry.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="pl-6">Seed Identity</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seeds.map((seed) => (
                    <TableRow key={seed.id} className="group transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{seed.seed_key}</span>
                          <span className="text-xs text-slate-500 line-clamp-1">{seed.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">v{seed.version}</code>
                      </TableCell>
                      <TableCell>{getStatusBadge(seed.status)}</TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {seed.last_run_at ? format(new Date(seed.last_run_at), 'MMM dd, HH:mm') : '---'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedSeed(seed); setIsDialogOpen(true); }}>
                              <RefreshCw className="w-4 h-4 mr-2" /> Re-run
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(seed.configuration_json);
                              toast.success('Config copied');
                            }}>
                              <Terminal className="w-4 h-4 mr-2" /> Copy JSON
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Seed Drawer */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-xl flex flex-col bg-white">
            <SheetHeader className="border-b pb-6">
              <SheetTitle>Initialize Seed</SheetTitle>
              <SheetDescription>Set up a new initialization vector for the system.</SheetDescription>
            </SheetHeader>
            
            <form id="seed-form" onSubmit={form.handleSubmit(handleCreateSeed)} className="flex-1 overflow-y-auto py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Seed Key</Label>
                  <Input {...form.register('seed_key')} placeholder="system_core" />
                  {form.formState.errors.seed_key && <p className="text-xs text-red-500">{form.formState.errors.seed_key.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input {...form.register('version')} placeholder="1.0.0" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register('description')} className="h-20" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Configuration JSON</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={formatCurrentJson} className="h-7 text-xs text-blue-600 hover:text-blue-700">
                    <Braces className="w-3 h-3 mr-1" /> Format JSON
                  </Button>
                </div>
                <Textarea {...form.register('configuration_json')} className="font-mono text-xs h-64 bg-slate-900 text-emerald-400 border-slate-700" />
              </div>
            </form>

            <SheetFooter className="border-t pt-4">
              <Button type="submit" form="seed-form" disabled={isSubmitting} className="w-full bg-blue-600">
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : 'Create Seed Entry'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Confirmation */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Re-run Sequence?</DialogTitle>
              <DialogDescription>
                This will re-initialize the data for <strong>{selectedSeed?.seed_key}</strong>. 
                Any runtime modifications might be overwritten.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abort</Button>
              <Button onClick={confirmReRun} disabled={isSubmitting} className="bg-blue-600">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}