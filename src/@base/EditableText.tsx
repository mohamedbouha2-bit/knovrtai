'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

interface EditableTextProps {
    className?: string;
    propKey?: string;
    children?: string | string[]; // دعم المصفوفات كما في كودك الأصلي
}

// دمج الخصائص مع div HTML لضمان مرونة التصميم
const EditableText: React.FC<EditableTextProps & React.HTMLAttributes<HTMLDivElement>> = ({
    propKey,
    className,
    children = "",
    ...rest
}) => {
    const [text, setText] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const navigate = useNavigate();

    // معالجة النص والروابط عند تغير محتوى children
    useEffect(() => {
        // حماية النوع: تحويل children إلى نص بسيط إذا كان مصفوفة
        const rawContent = Array.isArray(children) ? children[0] : children;
        const tempText = String(rawContent || "");

        // فحص ما إذا كان النص يحتوي على صيغة رابط (Query String)
        if (tempText.includes("&") || tempText.includes("text=")) {
            try {
                // استخدام URLSearchParams لمعالجة النصوص بصيغة "text=hello&link=/home"
                const params = new URLSearchParams(tempText);
                const textParam = params.get('text');
                const linkParam = params.get('link');

                setText(textParam || tempText.split("&")[0]);
                setLink(linkParam || "");
            } catch (e) {
                setText(tempText);
                setLink("");
            }
        } else {
            setText(tempText);
            setLink("");
        }
    }, [children]);

    // إذا كانت حالة التعديل مفعلة (مثلاً عند استخدامه في لوحة التحكم)
    if (isEditing) {
        return (
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                autoFocus
                className={`border-b border-blue-500 focus:outline-none bg-transparent ${className}`}
            />
        );
    }

    return (
        <div
            key={propKey}
            onClick={(e) => {
                // منع التفاعل إذا كان المستخدم يقوم بعمليات أخرى
                if (link) {
                    e.preventDefault();
                    navigate(link);
                }
            }}
            className={`${className} ${link ? "hover:underline transition-all" : ""}`}
            style={{ 
                cursor: link ? "pointer" : "inherit",
                display: 'inline-block' 
            }}
            {...rest}
        >
            {text || "انقر لإضافة نص"} 
        </div>
    );
};

export default EditableText;