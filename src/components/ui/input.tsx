"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // التنسيقات الأساسية
          "flex h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all",
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          // تنسيق النصوص والـ Placeholder
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500",
          "selection:bg-blue-100 selection:text-blue-900",
          // حالة التركيز (Focus)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600",
          // حالات التعطيل والخطأ
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };