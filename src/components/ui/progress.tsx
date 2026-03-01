"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 bg-blue-600 transition-all duration-500 ease-in-out dark:bg-blue-500",
          // إضافة تأثير نبضي بسيط إذا كانت القيمة أقل من 100 ليعطي شعوراً بالعمل المستمر
          value && value < 100 && "animate-pulse"
        )}
        style={{
          // التعديل هنا ليدعم الاتجاهين (LTR/RTL) بشكل أفضل عبر التحويل
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };