"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * الحاوية الرئيسية لمجموعة أزرار الراديو
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/**
 * عنصر الراديو الفردي - تم تحسين الاستجابة البصرية وحواف التركيز
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // التنسيق الأساسي والألوان
        "aspect-square size-4 shrink-0 rounded-full border border-slate-300 bg-white text-blue-600 shadow-sm transition-all",
        "dark:border-slate-700 dark:bg-slate-950 dark:text-blue-500",
        // حالة التركيز (Focus)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600",
        // حالات التعطيل والخطأ
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <CircleIcon className="size-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };