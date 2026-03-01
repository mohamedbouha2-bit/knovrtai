"use client";

import { cn } from "@/lib/utils";

/**
 * مكون الهيكل العظمي - يستخدم لإظهار حالة التحميل بشكل أنيق
 */
function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        // لون الخلفية مع أنميشن النبض السلس
        "bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };