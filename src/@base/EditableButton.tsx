import React from "react";
import { Link } from 'react-router-dom';

interface EditableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    propKey?: string;
    href?: string;
    target?: string; // أضفت دعم لفتح الروابط في علامة تبويب جديدة
}

export default function EditableButton({
    children,
    className = "",
    style,
    propKey,
    href,
    target,
    ...rest
}: EditableButtonProps) {

    // تنسيق مشترك لضمان ظهور الرابط بشكل الزر
    const commonStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        ...style,
    };

    // 1. إذا كان رابطاً داخلياً (مثلاً للتنقل بين الصفحات في مشروعك)
    if (href && !href.startsWith('#') && !href.startsWith('http')) {
        return (
            <Link to={href} className={className} style={commonStyles} key={propKey}>
                {children}
            </Link>
        );
    }

    // 2. إذا كان رابطاً خارجياً أو مرساة (Anchor #)
    if (href) {
        return (
            <a 
                href={href} 
                className={className} 
                style={commonStyles} 
                key={propKey} 
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            >
                {children}
            </a>
        );
    }

    // 3. إذا كان مجرد زر عادي (لتنفيذ دالة onClick مثلاً)
    return (
        <button
            className={className}
            style={style}
            key={propKey}
            {...rest}
        >
            {children}
        </button>
    );
}