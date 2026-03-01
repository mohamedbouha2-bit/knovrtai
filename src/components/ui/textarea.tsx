"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * مكون مساحة النص - تم تحسينه لمدخلات الذكاء الاصطناعي الطويلة
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // التنسيقات الأساسية وحواف التركيز
        "flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base shadow-sm transition-all",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-500",
        // منع التوسع الأفقي المزعج الذي يخرب التصميم
        "resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };