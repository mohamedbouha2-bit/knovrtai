"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * المكون الجذري للأكورديون
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

/**
 * عنصر فردي داخل الأكورديون
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "border-b transition-colors border-slate-200 dark:border-slate-800 last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * زر التفعيل (العنوان)
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all outline-none",
          "hover:text-blue-600 dark:hover:text-blue-400 [&[data-state=open]>svg]:rotate-180",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm",
          className
        )}
        {...props}
      >
        {/* المحتوى النصي */}
        <span className="text-start">{children}</span>
        
        {/* السهم - مع إضافة مسافة جانبية لتناسب الـ RTL/LTR */}
        <ChevronDownIcon className="text-slate-400 size-4 shrink-0 transition-transform duration-300" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * المحتوى الذي يظهر عند الفتح
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm transition-all",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        "text-slate-600 dark:text-slate-400"
      )}
      {...props}
    >
      <div className={cn("pt-0 pb-4 leading-relaxed", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };