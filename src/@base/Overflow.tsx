import React, { useMemo, useEffect } from "react";

interface OverflowProps<T> {
    data: T[]; 
    style?: React.CSSProperties; 
    className?: string; 
    renderItem: (item: T, index: number) => React.ReactNode; 
    maxCount: number; 
    renderRest?: (restItems: T[]) => React.ReactNode; 
    onUpdate?: (visibleItems: T[], restItems: T[]) => void; 
}

const Overflow = <T,>({
    data = [],
    style,
    className = "",
    renderItem,
    maxCount,
    renderRest,
    onUpdate,
}: OverflowProps<T>) => {

    // تحسين الأداء: استخدام useMemo بدلاً من useState + useEffect
    // هذا يمنع عمليات إعادة الريندر (Re-renders) غير الضرورية
    const { visibleItems, restItems } = useMemo(() => {
        const visible = data.slice(0, maxCount);
        const rest = data.slice(maxCount);
        return { visibleItems: visible, restItems: rest };
    }, [data, maxCount]);

    // تنفيذ التنبيه بالتحديث عند تغير البيانات فقط
    useEffect(() => {
        if (onUpdate) {
            onUpdate(visibleItems, restItems);
        }
    }, [visibleItems, restItems, onUpdate]);

    return (
        <div className={`overflow-wrapper ${className}`} style={style}>
            <div className="overflow-container flex items-center flex-wrap gap-2">
                {/* ريندر العناصر المرئية */}
                {visibleItems.map((item, index) => (
                    <div key={index} className="overflow-item">
                        {renderItem(item, index)}
                    </div>
                ))}

                {/* ريندر العناصر المتبقية */}
                {restItems.length > 0 && (
                    <div className="overflow-rest">
                        {renderRest ? (
                            renderRest(restItems)
                        ) : (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                +{restItems.length}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overflow;