import React, { CSSProperties, useState, useEffect, useMemo } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';
import get_image_url from '../../src/tools/tools';

interface EditableImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    propKey: string;
    keywords?: string;
    description?: string;
    needLargeImage?: boolean;
    orientation?: 'landscape' | 'portrait' | 'square';
}

const defaultStyle: CSSProperties = {
    objectFit: 'cover',
};

// تحسين استخراج معرف المشروع مع إضافة قيم افتراضية
const extractProjectId = (): string => {
    if (typeof window === 'undefined') return '';
    try {
        const params = new URLSearchParams(window.location.search);
        const queryId = params.get('PROJECTID') || params.get('project_id') || params.get('projectId');
        if (queryId) return decodeURIComponent(queryId);
        
        const pathMatch = window.location.pathname.match(/PROJ_[0-9a-zA-Z]+/);
        return pathMatch ? pathMatch[0] : '';
    } catch {
        return '';
    }
};

const isValidUrl = (string: string): boolean => {
    try {
        const url = new URL(string);
        return ['http:', 'https:', 'blob:'].includes(url.protocol);
    } catch {
        return false;
    }
};

const EditableImg = ({ 
    src, 
    alt = '', 
    className, 
    propKey, 
    style,
    keywords,
    description,
    needLargeImage = false,
    orientation = 'landscape',
    ...imgProps
}: EditableImgProps) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>(src);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false); // حالة معالجة الخطأ
    const [isFromKeywordSearch, setIsFromKeywordSearch] = useState<boolean>(false);
    
    const projectId = useMemo(() => extractProjectId(), []);

    // تحديث الصورة عند تغير src الخارجي
    useEffect(() => {
        if (src) {
            setImageSrc(src);
            setIsFromKeywordSearch(false);
            setError(false);
        }
    }, [src]);

    // محرك البحث عن الصور بالكلمات المفتاحية
    useEffect(() => {
        let isMounted = true; // لمنع تحديث الحالة بعد إلغاء المكون

        const fetchImage = async () => {
            if (!src && keywords) {
                if (isValidUrl(keywords)) {
                    setImageSrc(keywords);
                    return;
                }

                setLoading(true);
                setError(false);
                try {
                    const url = await get_image_url(
                        keywords, 
                        orientation, 
                        propKey, 
                        projectId, 
                        description || '', 
                        needLargeImage
                    );
                    
                    if (isMounted) {
                        setImageSrc(url);
                        setIsFromKeywordSearch(true);
                    }
                } catch (err) {
                    if (isMounted) setError(true);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
        };

        fetchImage();
        return () => { isMounted = false; }; // Cleanup
    }, [keywords, src, orientation, propKey, projectId, description, needLargeImage]);

    const mergedStyle: CSSProperties = {
        width: className ? undefined : '100%',
        height: className ? undefined : '100%',
        ...defaultStyle,
        ...style,
    };

    // حالة التحميل
    if (loading) {
        return (
            <div 
                style={{ ...mergedStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }} 
                className={className}
            >
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

    // حالة فشل جلب الصورة
    if (error && !imageSrc) {
        return (
            <div 
                style={{ ...mergedStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fecaca' }} 
                className={className}
            >
                <ImageIcon className="text-red-400" />
            </div>
        );
    }

    return (
        <img
            {...imgProps}
            style={mergedStyle}
            src={imageSrc}
            alt={alt}
            className={className}
            key={propKey}
            data-api-exclude-tracking={isFromKeywordSearch ? "true" : undefined}
            onError={() => setError(true)} // إذا فشل رابط الصورة في التحميل
        />
    );
};

export default EditableImg;