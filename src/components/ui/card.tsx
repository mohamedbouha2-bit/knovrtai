"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * الحاوية الأساسية للبطاقة مع ظل ناعم وحواف دائرية عصرية
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all",
        className
      )}
      {...props}
    />
  );
}

/**
 * بطاقة بدون حواف داخلية (Padding) - مثالية لعرض الصور أو الجداول
 */
function CardWithNoPadding({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-no-padding"
      className={cn(
        "bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

/**
 * رأس البطاقة - يستخدم Container Queries للتكيف الداخلي
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid grid-cols-[1fr_auto] items-start gap-4 p-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-lg font-bold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-slate-500 dark:text-slate-400 text-sm mt-1.5", className)}
      {...props}
    />
  );
}

/**
 * منطقة الإجراءات (مثل أزرار الإعدادات أو الحذف) في زاوية البطاقة
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("flex items-center justify-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0 border-t border-slate-100 dark:border-slate-800/50 mt-4", className)}
      {...props}
    />
  );
}

export { 
  Card, 
  CardWithNoPadding, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardAction, 
  CardDescription, 
  CardContent 
};