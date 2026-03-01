"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * تعريف المتغيرات البصرية للتنبيه
 */
const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start transition-all duration-200 [&>svg]:size-5 [&>svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800",
        destructive: "border-red-500/50 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 [&>svg]:text-red-600",
        success: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 [&>svg]:text-emerald-600",
        info: "border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 [&>svg]:text-blue-600",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

/**
 * حاوية التنبيه الأساسية
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * عنوان التنبيه
 */
function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 font-bold tracking-tight", className)}
      {...props}
    />
  );
}

/**
 * وصف التنبيه
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-sm opacity-90 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };