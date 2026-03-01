'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CardWithNoPadding } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EditableImg from '@/@base/EditableImg';
import { entities } from '@/tools/entities-proxy';
import type { public_showcase_asset } from '@/server/entities.type';
import { getfrontend_user_session } from '@/tools/SessionContext';
import { toast } from 'sonner';
import { PlayCircle, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';

// ----------------------------------------------------------------------
// Component: AssetCard (تم تحسين الأداء باستخدام React.memo)
// ----------------------------------------------------------------------

const AssetCard = React.memo(({ asset, onClick }: { asset: public_showcase_asset; onClick: () => void }) => {
  const isVideo = asset.asset_type === 'video';
  const providerColor = asset.provider_source.toLowerCase() === 'pexels' 
    ? 'bg-[#05a081]' 
    : 'bg-[#02be6e]';

  return (
    <div 
      className="asset-card group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1" 
      onClick={onClick}
    >
      <CardWithNoPadding className="h-full w-full overflow-hidden border-0 bg-transparent">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <EditableImg 
            propKey={`asset-cover-${asset.id}`} 
            keywords={asset.cover_image_url || `${asset.title}`} 
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
              {isVideo ? <PlayCircle size={28} /> : <ImageIcon size={24} />}
            </div>
          </div>

          <div className="absolute left-3 top-3">
            <Badge className={`${providerColor} text-white border-0 text-[10px] uppercase font-bold`}>
              {asset.provider_source}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-blue-200 transition-colors">
              {asset.title}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>View Details</span> <ExternalLink size={10} />
            </div>
          </div>
        </div>
      </CardWithNoPadding>
    </div>
  );
});

AssetCard.displayName = 'AssetCard';

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function SEOLandingPage_AssetGallery() {
  const router = useRouter();
  const [assets, setAssets] = useState<public_showcase_asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all');
  
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch Data
  useEffect(() => {
    let isMounted = true;
    const fetchAssets = async () => {
      try {
        const result = await entities.public_showcase_asset.GetAll({ is_active: true });
        if (isMounted) {
          const sorted = (result || []).sort((a, b) => a.display_order - b.display_order);
          setAssets(sorted);
        }
      } catch (error) {
        toast.error('Failed to load gallery');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAssets();
    return () => { isMounted = false; };
  }, []);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return activeTab === 'all' ? assets : assets.filter(a => a.asset_type === activeTab);
  }, [assets, activeTab]);

  // GSAP Animation with Cleanup (Context)
  useEffect(() => {
    if (!isLoading && gridRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(".asset-card", 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4, 
            stagger: 0.04, 
            ease: 'power2.out',
            clearProps: 'all'
          }
        );
      }, gridRef);

      return () => ctx.revert(); // تنظيف الحركة لمنع الـ Memory Leaks
    }
  }, [isLoading, activeTab]);

  const handleAssetClick = () => {
    const session = getfrontend_user_session();