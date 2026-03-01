"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * مكون الإشعارات (Toaster) - تم تحسينه ليدعم الثيمات والخطوط العربية
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // إعدادات افتراضية مريحة للمستخدم
      position="top-center" // الموقع المثالي لإشعارات الذكاء الاصطناعي
      dir="auto" // يدعم العربية والإنجليزية تلقائياً
      toastOptions={{
        className: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800",
        descriptionClassName: "group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400",
        actionButtonClassName: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
        cancelButtonClassName: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-900",
      }}
      // ربط متغيرات الـ CSS الخاصة بـ Sonner بمتغيرات مشروعك
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  );
};

export { Toaster };