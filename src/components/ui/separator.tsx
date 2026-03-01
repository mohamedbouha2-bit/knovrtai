"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

/**
 * الفاصل البصري - تم تحسين الألوان لضمان الهدوء البصري
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-slate-800",
        // إذا كان أفقياً: الارتفاع 1px والعرض كامل
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        // إذا كان رأسياً: العرض 1px والارتفاع كامل
        "data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full md:data-[orientation=vertical]:h-full md:data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };