import React, { useMemo } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faBrandsIcons from "@fortawesome/free-brands-svg-icons";
import * as faSolidIcons from "@fortawesome/free-solid-svg-icons";
import * as faRegularIcons from "@fortawesome/free-regular-svg-icons";

/**
 * تحويل اسم الأيقونة من fa-twitter إلى faTwitter
 */
const formatIconName = (iconName: string) => {
    return iconName
        .split('-')
        .map((part, index) =>
            index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join('');
};

/**
 * محرك استيراد أيقونات FontAwesome ديناميكياً
 */
const getFontAwesomeIcon = (iconClassName: string) => {
    const parts = iconClassName.split(" ");
    if (parts.length < 2) return null;

    const [iconType, iconName] = parts;

    const libraries: Record<string, any> = {
        "fab": faBrandsIcons,      // اختصار شائع لـ brands
        "fa-brands": faBrandsIcons,
        "fas": faSolidIcons,       // اختصار شائع لـ solid
        "fa-solid": faSolidIcons,
        "far": faRegularIcons,     // اختصار شائع لـ regular
        "fa-regular": faRegularIcons,
    };

    const library = libraries[iconType];
    if (!library) return null;

    const iconKey = formatIconName(iconName);
    const icon = library[iconKey];

    return icon || null;
};

interface EditableIconProps {
    propKey?: string;
    icon?: string;
    className?: string;
    iconLibrary?: "FontAwesome" | "Lucide";
    style?: React.CSSProperties;
    size?: number | string; // إضافة خاصية الحجم لتوحيد التحكم
}

const EditableIcon: React.FC<EditableIconProps> = ({
    propKey,
    icon,
    className,
    iconLibrary = "Lucide",
    style,
    size = 20,
}) => {
    if (!icon) return null;

    // استخدام useMemo لتحسين الأداء وتجنب إعادة الحساب عند كل ريندر
    const faIcon = useMemo(() => {
        if (iconLibrary === "FontAwesome") {
            return getFontAwesomeIcon(icon);
        }
        return null;
    }, [icon, iconLibrary]);

    // معالجة مكتبة FontAwesome
    if (iconLibrary === "FontAwesome" && faIcon) {
        return (
            <FontAwesomeIcon
                key={propKey}
                icon={faIcon}
                className={className}
                style={{ fontSize: size, ...style }}
            />
        );
    }

    // معالجة مكتبة Lucide (الافتراضية)
    return (
        <div 
            className={`inline-flex items-center justify-center ${className}`} 
            key={propKey} 
            style={style}
        >
            <DynamicIcon name={icon as any} size={size as number} />
        </div>
    );
};

export default EditableIcon;