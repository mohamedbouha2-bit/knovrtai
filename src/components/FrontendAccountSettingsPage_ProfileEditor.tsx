'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Briefcase, FileText, Globe, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EditableImg from '@/@base/EditableImg';

// Entities and Session
import { entities } from '@/tools/entities-proxy';
import { getFrontendUserSession, setFrontendUserSession, FrontendUserSession } from '@/tools/SessionContext';

// --- Zod Schema ---
const profileFormSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters.').max(30).optional(),
  email: z.string().min(1, 'Email is required.').email('Invalid email address.'),
  full_name: z.string().max(100).optional().nullable(),
  job_title: z.string().max(100).optional().nullable(),
  bio_text: z.string().max(500, 'Bio is too long.').optional().nullable(),
  avatar_url: z.string().url().optional().or(z.literal('')).nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function FrontendAccountSettingsPage_ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<FrontendUserSession | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      email: '',
      full_name: '',
      job_title: '',
      bio_text: '',
      avatar_url: ''
    }
  });

  // 1. Fetch Data - Wrapped in useCallback to prevent infinite loops
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const session = getFrontendUserSession();
      if (!session?.userId) {
        setLoading(false);
        return;
      }
      setCurrentUser(session);

      const userRecord = await entities.user.Get({ id: parseInt(session.userId) });
      
      if (userRecord) {
        form.reset({
          username: userRecord.username ?? '',
          email: userRecord.email ?? '',
          full_name: userRecord.full_name ?? '',
          job_title: userRecord.job_title ?? '',
          bio_text: userRecord.bio_text ?? '',
          avatar_url: userRecord.avatar_url ?? ''
        });
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // 2. GSAP Animations
  useEffect(() => {
    if (!loading && headerRef.current && formRef.current) {
      gsap.fromTo([headerRef.current, formRef.current], 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' }
      );
    }
  }, [loading]);

  // 3. Handle Submit
  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser?.userId) return;
    setSaving(true);
    
    try {
      const userIdNum = parseInt(currentUser.userId);
      
      // Fetch fresh data before update to satisfy the "user_without_PKs" full object requirement
      const currentDbRecord = await entities.user.Get({ id: userIdNum });
      
      if (!currentDbRecord) throw new Error("User not found in database");

      const updatedUser = await entities.user.Update({
        where: { id: userIdNum },
        data: {
          ...currentDbRecord, // Ensure all required DB fields are preserved
          email: data.email,
          username: data.username || null,
          full_name: data.full_name || null,
          job_title: data.job_title || null,
          bio_text: data.bio_text || null,
          avatar_url: data.avatar_url || null,
          updated_at: new Date()
        }
      });

      if (updatedUser) {
        // Update Session context correctly
        const newSession = {
          ...currentUser,
          email: updatedUser.email,
          username: updatedUser.username ?? '',
          displayName: updatedUser.full_name ?? updatedUser.username ?? ''
        };
        
        setFrontendUserSession(newSession as FrontendUserSession);
        setCurrentUser(newSession as FrontendUserSession);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-[#f9fafb]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="w-full flex items-center justify-center py-20 bg-[#f9fafb]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#0f172a]">Access Restricted</h2>
          <p className="text-[#64748b] mt-2">Please log in to edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f9fafb] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12 max-w-5xl">
        
        {/* Header Section */}
        <div ref={headerRef} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">Public Profile</h1>
            <p className="text-[#64748b] mt-1">Manage your public information.</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-[#64748b] bg-white border border-[#e5e7eb] px-3 py-1 rounded-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                Account Active
             </span>
          </div>
        </div>

        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-[#e5e7eb] shadow-sm bg-white overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[#2563eb]/10 to-[#8b5cf6]/10 w-full relative">
                <EditableImg propKey="profile-noise" keywords="abstract" className="absolute inset-0 opacity-20 w-full h-full object-cover" />
              </div>
              <CardContent className="pt-0 relative px-6 pb-6">
                 <div className="flex justify-center -mt-12 mb-4">
                    <div className="relative group cursor-pointer" onClick={() => toast.info('Upload triggered')}>
                       <Avatar className="h-24 w-24 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                         <AvatarImage src={form.watch('avatar_url') || ''} className="object-cover" />
                         <AvatarFallback className="bg-[#f1f5f9] text-[#64748b]">
                            {form.watch('full_name')?.[0] || currentUser.username?.[0] || 'U'}
                         </AvatarFallback>
                       </Avatar>
                       <div className="absolute bottom-0 right-0 bg-[#2563eb] text-white p-1.5 rounded-full border-2 border-white">
                          <Camera className="w-4 h-4" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-1 mb-6">
                    <h3 className="font-semibold text-[#0f172a]">
                        {form.watch('full_name') || currentUser.username}
                    </h3>
                    <p className="text-sm text-[#64748b]">{form.watch('email')}</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-[#64748b] p-3 bg-[#f9fafb] rounded-lg">
                       <Briefcase className="w-4 h-4" />
                       <span className="truncate">{form.watch('job_title') || 'No job title'}</span>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-8">
            <Card className="border-[#e5e7eb] shadow-sm bg-white">
              <CardHeader className="border-b border-[#f1f5f9]">
                <CardTitle>Edit Details</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField 
                        control={form.control} 
                        name="username" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-[#94a3b8]" />
                                <Input className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      <FormField 
                        control={form.control} 
                        name="full_name" 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-[#94a3b8]" />
                                <Input className="pl-9" {...field} value={field.value || ''} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    </div>

                    <FormField 
                      control={form.control} 
                      name="bio_text" 
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea className="min-h-[100px]" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />

                    <div className="flex justify-end gap-4 border-t pt-6">
                      <Button type="button" variant="outline" onClick={() => form.reset()} disabled={saving}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving} className="bg-[#2563eb]">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}