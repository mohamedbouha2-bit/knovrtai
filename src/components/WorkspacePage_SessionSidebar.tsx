'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, Settings, Zap, MessageSquare, MoreHorizontal, 
  Search, LogOut, Loader2, Gem, User, Trash2, Edit2, ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Data & Types
import type { chat_session, user } from '@/server/entities.type';
import { entities } from '@/tools/entities-proxy';
import { getfrontend_user_session, removefrontend_user_session } from '@/tools/SessionContext';

// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface SessionGroup {
  label: string;
  sessions: chat_session[];
}

export default function WorkspacePage_Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [currentUser, setCurrentUser] = useState<user | null>(null);
  const [sessions, setSessions] = useState<chat_session[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSessionId = useMemo(() => {
    const idParam = searchParams.get('session_id');
    return idParam ? parseInt(idParam, 10) : null;
  }, [searchParams]);

  // ----------------------------------------------------------------------
  // Data Fetching
  // ----------------------------------------------------------------------

  const refreshData = useCallback(async () => {
    try {
      const session = getfrontend_user_session();
      if (!session?.userId) return;

      const userId = parseInt(session.userId, 10);
      const [userData, sessionsData] = await Promise.all([
        entities.user.Get({ id: userId }),
        entities.chat_session.GetAll({ user_id: { equals: userId } })
      ]);

      if (userData) setCurrentUser(userData);
      if (sessionsData) {
        setSessions([...sessionsData].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ));
      }
    } catch (error) {
      toast.error('Failed to sync sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------

  const handleCreateNewGem = async () => {
    const session = getfrontend_user_session();
    if (!session?.userId) return toast.error('Please login first');
    
    setCreatingSession(true);
    try {
      const newSession = await entities.chat_session.Create({
        user_id: parseInt(session.userId, 10),
        title: 'New Creative Gem',
        create_timestamp: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
      if (newSession) {
        await refreshData();
        router.push(`/?session_id=${newSession.id}`);
        toast.success('Gem initialized');
      }
    } catch (err) {
      toast.error('Creation failed');
    } finally {
      setCreatingSession(false);
    }
  };

  const handleDeleteSession = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await entities.chat_session.Delete({ id });
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSessionId === id) router.push('/');
      toast.success('Session deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const usagePercentage = useMemo(() => {
    if (!currentUser?.usage_limit_total) return 0;
    return Math.min(100, ((currentUser.total_credits_used || 0) / currentUser.usage_limit_total) * 100);
  }, [currentUser]);

  const groupedSessions = useMemo(() => {
    const filtered = sessions.filter(s => 
      (s.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: SessionGroup[] = [
      { label: 'Today', sessions: [] },
      { label: 'Yesterday', sessions: [] },
      { label: 'Older', sessions: [] }
    ];

    const now = new Date();
    filtered.forEach(s => {
      const d = new Date(s.updated_at);
      if (d.toDateString() === now.toDateString()) groups[0].sessions.push(s);
      else if (d.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) groups[1].sessions.push(s);
      else groups[2].sessions.push(s);
    });
    return groups.filter(g => g.sessions.length > 0);
  }, [sessions, searchQuery]);

  return (
    <aside className="flex flex-col h-full w-[280px] bg-white border-r border-slate-200">
      
      {/* Brand & Action */}
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Gem size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">GemAI</h1>
          </div>
          <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-600 border-blue-100 bg-blue-50/50">Pro</Badge>
        </div>

        <Button 
          onClick={handleCreateNewGem} 
          disabled={creatingSession} 
          className="w-full justify-start gap-2 h-11 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
        >
          {creatingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={18} />}
          <span className="font-semibold">Start New Chat</span>
        </Button>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Find sessions..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-slate-50 border-transparent focus:bg-white focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-3">
        {loading ? (
          <div className="space-y-4 p-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
          </div>
        ) : groupedSessions.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-6 pb-6 mt-2">
            {groupedSessions.map((group) => (
              <div key={group.label}>
                <h4 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.sessions.map((session) => {
                    const isActive = activeSessionId === session.id;
                    return (
                      <Link 
                        key={session.id} 
                        href={`/?session_id=${session.id}`} 
                        className={cn(
                          "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all relative",
                          isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <MessageSquare size={16} className={cn(isActive ? "text-blue-600" : "text-slate-400")} />
                          <span className="truncate text-sm font-medium">{session.title || 'Draft Gem'}</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="gap-2"><Edit2 size={14}/> Rename</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className="gap-2 text-rose-600 focus:text-rose-600"
                            >
                              <Trash2 size={14}/> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer Area */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-4">
        {/* Usage Card */}
        <div onClick={() => router.push('/paymentpage')} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 cursor-pointer transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Zap size={12} className="text-amber-500 fill-amber-500" /> Usage
            </span>
            <ChevronRight size={12} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
          </div>
          <Progress value={usagePercentage} className="h-1.5 bg-slate-100" />
          <div className="flex justify-between mt-2 text-[10px] font-medium">
            <span className="text-slate-500">{currentUser?.usage_credits_remaining} credits left</span>
            <span className="text-blue-600">Upgrade</span>
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div role="button" className="flex items-center gap-3 p-1.5 hover:bg-white hover:shadow-sm rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-100 group">
              <Avatar className="w-9 h-9 ring-2 ring-white shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage src={currentUser?.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate leading-none mb-1">
                  {currentUser?.full_name || currentUser?.username}
                </p>
                <p className="text-[10px] text-slate-400 truncate tracking-tight uppercase font-semibold">Free Member</p>
              </div>
              <Settings size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 mb-2 p-1.5">
            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Management</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push('/frontendaccountsettingspage')} className="rounded-lg gap-2 cursor-pointer py-2">
              <User size={16} /> Account Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/paymentpage')} className="rounded-lg gap-2 cursor-pointer py-2 text-blue-600">
              <Zap size={16} /> Subscriptions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="rounded-lg gap-2 cursor-pointer py-2 text-rose-600 focus:bg-rose-50">
              <LogOut size={16} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}