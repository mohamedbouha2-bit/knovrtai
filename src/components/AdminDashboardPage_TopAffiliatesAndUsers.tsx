'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trophy, Zap, User as UserIcon, Mail, TrendingUp, 
  ArrowRight, Ban, CheckCircle2, Loader2, ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';

// UI Components from your library
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Tools & Types
import { entities } from '@/tools/entities-proxy';
import { getBackendAdminSession } from '@/tools/SessionContext';

// --- Types ---

type DisplayUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  metricLabel: string;
  rank: number;
};

// --- Sub-components ---

const RankIndicator = ({ rank }: { rank: number }) => {
  const configs = {
    1: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Trophy className="h-3 w-3" /> },
    2: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: null },
    3: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: null },
  };

  const config = configs[rank as keyof typeof configs] || { bg: 'bg-transparent', text: 'text-slate-400', border: 'border-transparent', icon: null };

  return (
    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${config.bg} ${config.text} ${config.border}`}>
      {config.icon || rank}
    </div>
  );
};

const UserRow = ({ 
  user, 
  isAffiliate, 
  onStatusChange 
}: { 
  user: DisplayUser; 
  isAffiliate: boolean; 
  onStatusChange: (id: number, status: string) => void 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleStatus = async () => {
    try {
      setIsUpdating(true);
      const targetStatus = user.status === 'suspended' ? 'active' : 'suspended';
      
      await entities.user.Update({
        where: { id: user.id },
        data: { status: targetStatus } as any
      });

      onStatusChange(user.id, targetStatus);
      toast.success(`User status updated to ${targetStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 rounded-xl transition-all hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <RankIndicator rank={user.rank} />
        
        <Avatar className="h-10 w-10 border border-white shadow-sm">
          <AvatarImage src={user.avatarUrl || ''} />
          <AvatarFallback className="bg-slate-100 text-slate-400">
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-sm font-semibold text-slate-900 hover:text-blue-600 hover:underline text-left transition-all">
                {user.name}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 shadow-xl border-slate-200" align="start">
              <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={user.avatarUrl || ''} />
                  <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <Badge className={user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </div>
                <Button 
                  variant={user.status === 'suspended' ? 'outline' : 'destructive'} 
                  size="sm" 
                  className="w-full h-8 text-xs" 
                  onClick={toggleStatus}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : (user.status === 'suspended' ? 'Activate' : 'Suspend Account')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-[11px] text-slate-400 font-medium tracking-tight truncate max-w-[140px]">
            {user.email}
          </span>
        </div>
      </div>

      <div className="text-right">
        <div className={`text-sm font-bold ${isAffiliate ? 'text-emerald-600' : 'text-blue-600'}`}>
          {user.metricLabel}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {isAffiliate ? 'Earnings' : 'Credits'}
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

const AdminDashboardPage_TopAffiliatesAndUsers = () => {
  const router = useRouter();
  const [data, setData] = React.useState<{ affiliates: DisplayUser[], powerUsers: DisplayUser[] }>({ affiliates: [], powerUsers: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setIsLoading(true);
        const session = getBackendAdminSession();
        if (!session?.adminId) return;

        const [summaries, users] = await Promise.all([
          entities.affiliate_summary.GetAll({}),
          entities.user.GetAll({})
        ]);

        // Process Affiliates
        const topAffiliates = summaries
          .sort((a, b) => b.total_lifetime_earnings - a.total_lifetime_earnings)
          .slice(0, 5)
          .map((s, i) => {
            const u = users.find(x => x.id === s.user_id);
            return {
              id: s.user_id,
              name: u?.full_name || 'Partner',
              email: u?.email || '',
              avatarUrl: u?.avatar_url || null,
              status: u?.status || 'active',
              metricLabel: `$${s.total_lifetime_earnings.toLocaleString()}`,
              rank: i + 1
            };
          });

        // Process Power Users
        const topUsers = users
          .filter(u => u.role === 'user')
          .sort((a, b) => b.total_credits_used - a.total_credits_used)
          .slice(0, 5)
          .map((u, i) => ({
            id: u.id,
            name: u.full_name || 'User',
            email: u.email,
            avatarUrl: u.avatar_url || null,
            status: u.status,
            metricLabel: `${u.total_credits_used.toLocaleString()} ⚡`,
            rank: i + 1
          }));

        setData({ affiliates: topAffiliates, powerUsers: topUsers });
      } catch (err) {
        toast.error('Sync failed');
      } finally {
        setIsLoading(false);
      }
    };
    loadRankings();
  }, []);

  const updateLocalStatus = (userId: number, status: string) => {
    setData(prev => ({
      affiliates: prev.affiliates.map(u => u.id === userId ? { ...u, status } : u),
      powerUsers: prev.powerUsers.map(u => u.id === userId ? { ...u, status } : u)
    }));
  };

  return (
    <div className="w-full bg-slate-50/30 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Performance Leaderboard
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              High-value partners and power users monitoring.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/usermanagementpage')} 
            variant="default" 
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            User Directory <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card: Top Affiliates */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 font-bold">
                  <Trophy className="h-6 w-6 text-amber-500" /> Top Affiliates
                </CardTitle>
                <CardDescription>Lifetime commission earnings</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-100">Partners</Badge>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
              ) : data.affiliates.length > 0 ? (
                <div className="space-y-1">
                  {data.affiliates.map(aff => (
                    <UserRow key={aff.id} user={aff} isAffiliate={true} onStatusChange={updateLocalStatus} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 font-medium">No affiliate data found.</div>
              )}
            </CardContent>
          </Card>

          {/* Card: Power Users */}
          <Card className="border-none shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 font-bold">
                  <Zap className="h-6 w-6 text-indigo-500" /> Power Users
                </CardTitle>
                <CardDescription>Credit consumption metrics</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">Active</Badge>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
              ) : data.powerUsers.length > 0 ? (
                <div className="space-y-1">
                  {data.powerUsers.map(u => (
                    <UserRow key={u.id} user={u} isAffiliate={false} onStatusChange={updateLocalStatus} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 font-medium">No usage data found.</div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage_TopAffiliatesAndUsers;