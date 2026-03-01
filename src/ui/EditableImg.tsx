"use client";

import React, { CSSProperties, useState, useEffect, useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import get_image_url from '../../src/tools/tools';
import { cn } from '@/lib/utils'; // استخدام أداة الدمج التي بنيناها

interface EditableImgProps {
    src?: string;
    alt?: string;
    className?: string;
    propKey: string;
    style?: CSSProperties;
    keywords?: string;
    orientation?: 'landscape' | 'portrait' | 'square';
}

const defaultStyle: CSSProperties = {
    objectFit: 'cover',
};

/**
 * دالة استخراج معرف المشروع من الرابط (URL)
 */
const extractProjectId = (): string => {
    if (typeof window === 'undefined') return '';
    try {
        const url = new URL(window.location.href);
        const qId = url.searchParams.get('PROJECTID') || 
                   url.searchParams.get('project_id') || 
                   url.searchParams.get('projectId');
        
        if (qId) return decodeURIComponent(qId);
        
        const pathMatch = url.pathname.match(/PROJ_[0-9a-zA-Z]+/);
        return pathMatch ? pathMatch[0] : '';
    } catch { return ''; }
};

const isValidUrl = (string: string): boolean => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch { return false; }
};

/**
 * مكون صورة ذكي: يدعم التحميل التلقائي بناءً على الكلمات المفتاحية
 * ويوفر حالة تحميل (Loading State) احترافية.
 */
const EditableImg = ({ 
    src, 
    alt = '', 
    className, 
    propKey, 
    style,
    keywords,
    orientation = 'landscape'
}: EditableImgProps) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(src);
    const [loading, setLoading] = useState<boolean>(false);
    
    // حفظ معرف المشروع لضمان عدم إعادة الحساب في كل رندر
    const projectId = useMemo(() => extractProjectId(), []);

    // تحديث الصورة عند تغيير الرابط المباشر
    useEffect(() => {
        if (src) setImageSrc(src);
    }, [src]);

    // منطق جلب الصورة ذكياً
    useEffect(() => {
        // إذا كان هناك كلمات مفتاحية ولا يوجد رابط مباشر (src)
        if (!src && keywords) {
            if (isValidUrl(keywords)) {
                setImageSrc(keywords);
            } else {
                setLoading(true);
                get_image_url(keywords, orientation, propKey, projectId)
                    .then(url => {
                        setImageSrc(url);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
            }
        }
    }, [keywords, src, orientation, propKey, projectId]);

    const mergedStyle: CSSProperties = {
        width: className ? undefined : '100%',
        height: className ? undefined : '100%',
        ...defaultStyle,
        ...style,
    };

    if (loading) {
        return (
            <div 
                style={{ ...mergedStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                className={cn("bg-slate-100 text-slate-400 animate-pulse", className)}
            >
                <LoadingOutlined style={{ fontSize: 24 }} />
            </div>
        );
    }

    return (
        <img
            style={mergedStyle}
            key={propKey}
            src={imageSrc || 'https://via.placeholder.com/800x600?text=GemAI+Image'}
            alt={alt}
            className={cn("transition-opacity duration-500", !imageSrc ? "opacity-0" : "opacity-100", className)}
        />
    );
};

export default EditableImg;